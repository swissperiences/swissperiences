
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.14.0'
import { Resend } from 'https://esm.sh/resend@2.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const ALLOWED_ORIGINS = [
  'https://swissperiences.ch',
  'https://www.swissperiences.ch',
]

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || ''
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const RESEND_AUDIENCE_ID = Deno.env.get('RESEND_AUDIENCE_ID')

    if (!STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY')
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase Credentials')
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // Deno compatible version
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    )

    // Verify JWT — reject unauthenticated requests
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const { email, intent, tier, application_id: providedAppId, marketing_opt_in } = await req.json()
    let application_id = providedAppId

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Validate origin for Stripe redirect URLs
    const rawOrigin = req.headers.get('origin') || ''
    const origin = ALLOWED_ORIGINS.includes(rawOrigin) ? rawOrigin : 'https://swissperiences.ch'

    // Auto-resolve application_id if not provided
    if (!application_id) {
      const { data: applicants, error: fetchError } = await supabase
        .from('membership_applications')
        .select('id')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)

      if (fetchError) console.error('Supabase lookup error:', fetchError)

      if (applicants && applicants.length > 0) {
        application_id = applicants[0].id
      } else {
        return new Response(JSON.stringify({ error: 'Unable to process request. Please ensure you have submitted an application.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
    }

    const isGBP = tier?.includes('£') || tier?.toLowerCase().includes('gbp')
    const currency = isGBP ? 'gbp' : 'chf'

    // 1. Create Stripe Checkout Session
    // - client_reference_id: primary link to membership_application (used by webhook)
    // - metadata.application_id: redundant link for dashboard visibility
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: tier ? `Deposit: ${tier}` : 'Retreat Deposit - Spring 2026',
              description: 'Refundable deposit to secure your priority spot.',
            },
            unit_amount: 50000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      client_reference_id: application_id,
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
      cancel_url: `${origin}/?payment=cancelled`,
      customer_email: email,
      metadata: {
        application_id: application_id,
        intent: intent || 'general',
        product_name: tier || 'General Deposit',
        environment: 'production'
      },
    })

    // 2. Update Membership Record
    if (application_id) {
      await supabase
        .from('membership_applications')
        .update({
          stripe_session_id: session.id,
          newsletter_opt_in: !!marketing_opt_in
        })
        .eq('id', application_id)

      // 3. Sync to Resend
      if (marketing_opt_in && RESEND_API_KEY && RESEND_AUDIENCE_ID) {
        const resend = new Resend(RESEND_API_KEY)
        // Non-blocking sync attempt
        try {
          await resend.contacts.create({
            email: email,
            audienceId: RESEND_AUDIENCE_ID,
            unsubscribed: false,
          })
        } catch (e) {
          console.error('Resend Sync Error', e)
        }
      }
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error('[create-checkout] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
