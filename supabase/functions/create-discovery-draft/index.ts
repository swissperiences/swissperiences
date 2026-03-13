import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-agent-secret",
}

interface PackInclude {
  label_pt: string
  label_en: string
  icon_name: string
}

interface CreateDraftRequest {
  title_pt: string
  title_en: string
  season: "spring" | "summer" | "autumn" | "winter"
  price_chf: number
  duration_days: number
  max_guests: number
  cover_image_url?: string
  highlight_event?: string
  event_dates?: { start: string; end: string }
  includes: PackInclude[]
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Auth: validate agent secret
    const AGENT_SECRET = Deno.env.get("AGENT_SECRET")
    if (!AGENT_SECRET) {
      throw new Error("AGENT_SECRET not configured on server")
    }

    const providedSecret = req.headers.get("x-agent-secret")
    if (!providedSecret || providedSecret !== AGENT_SECRET) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid or missing x-agent-secret header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const body: CreateDraftRequest = await req.json()

    // Validate required fields
    const errors: Record<string, string> = {}
    if (!body.title_pt) errors.title_pt = "required"
    if (!body.title_en) errors.title_en = "required"
    if (!body.season || !["spring", "summer", "autumn", "winter"].includes(body.season)) {
      errors.season = "must be one of: spring, summer, autumn, winter"
    }
    if (!body.price_chf || body.price_chf <= 0) errors.price_chf = "must be a positive number"
    if (!body.duration_days || body.duration_days <= 0) errors.duration_days = "must be a positive integer"
    if (!body.max_guests || body.max_guests <= 0) errors.max_guests = "must be a positive integer"
    if (!body.includes || !Array.isArray(body.includes) || body.includes.length === 0) {
      errors.includes = "must be a non-empty array"
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", fields: errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Build event_dates as Postgres daterange
    let eventDatesRange: string | null = null
    if (body.event_dates?.start && body.event_dates?.end) {
      eventDatesRange = `[${body.event_dates.start},${body.event_dates.end}]`
    }

    // Insert pack as draft
    const { data: pack, error: packError } = await supabase
      .from("discovery_packs")
      .insert({
        title_pt: body.title_pt,
        title_en: body.title_en,
        season: body.season,
        price_chf: body.price_chf,
        duration_days: body.duration_days,
        max_guests: body.max_guests,
        status: "draft",
        cover_image_url: body.cover_image_url || null,
        highlight_event: body.highlight_event || null,
        event_dates: eventDatesRange,
      })
      .select("id, slug")
      .single()

    if (packError) {
      throw new Error(`Failed to insert pack: ${packError.message}`)
    }

    // Insert includes
    const includesRows = body.includes.map((item, idx) => ({
      pack_id: pack.id,
      label_pt: item.label_pt,
      label_en: item.label_en,
      icon_name: item.icon_name,
      sort_order: idx + 1,
    }))

    const { error: includesError } = await supabase
      .from("discovery_pack_includes")
      .insert(includesRows)

    if (includesError) {
      throw new Error(`Failed to insert includes: ${includesError.message}`)
    }

    return new Response(
      JSON.stringify({ id: pack.id, slug: pack.slug }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
