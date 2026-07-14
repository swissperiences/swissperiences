import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { handleSignup, type SignupDb } from "./handler.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
    return new Response(JSON.stringify(body), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
    })
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const input = await req.json().catch(() => ({}))

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        const AUDIENCE_ID = Deno.env.get('RESEND_AUDIENCE_ID')
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        if (!RESEND_API_KEY || !AUDIENCE_ID || !supabaseUrl || !supabaseServiceKey) {
            console.error('[NEWSLETTER][ALERT] missing required environment configuration')
            return jsonResponse(500, { error: 'Internal server error' })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const db: SignupDb = {
            async getSubscriber(email) {
                const { data, error } = await supabase
                    .from('waitlist')
                    .select('email, welcome_email_status, welcome_email_attempts')
                    .eq('email', email)
                    .maybeSingle()
                if (error) throw new Error(`waitlist select failed: ${error.message}`)
                return data
            },
            async upsertSubscriber(email, firstName) {
                const { error } = await supabase
                    .from('waitlist')
                    .upsert(
                        { email, newsletter_opt_in: true, ...(firstName ? { first_name: firstName } : {}) },
                        { onConflict: 'email' },
                    )
                if (error) throw new Error(`waitlist upsert failed: ${error.message}`)
            },
            async setWelcomeStatus(email, status, errorDetail, attempts) {
                const { error } = await supabase
                    .from('waitlist')
                    .update({
                        welcome_email_status: status,
                        welcome_email_error: errorDetail,
                        welcome_email_attempts: attempts,
                    })
                    .eq('email', email)
                if (error) throw new Error(`waitlist status update failed: ${error.message}`)
            },
        }

        const result = await handleSignup(input, {
            db,
            fetchFn: fetch,
            resendApiKey: RESEND_API_KEY,
            audienceId: AUDIENCE_ID,
            adminEmail: 'hello@swissperiences.ch',
            log: console.log,
            logError: console.error,
            delayMs: (ms) => new Promise((r) => setTimeout(r, ms)),
        })
        return jsonResponse(result.status, result.body)
    } catch (error) {
        console.error(`[NEWSLETTER] Error:`, error)
        return jsonResponse(500, { error: 'Internal server error' })
    }
})
