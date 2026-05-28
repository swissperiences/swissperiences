import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

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

const esc = (s: string) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')


serve(async (req) => {
    const corsHeaders = getCorsHeaders(req)

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // JWT verification is enforced by the Supabase Edge Functions gateway
    // (verify_jwt = true is the default — the DB trigger passes a valid anon JWT).
    // The previous in-function verifyJWT() check was broken: it required
    // SUPABASE_JWT_SECRET which isn't auto-populated on Edge Functions, so
    // every trigger invocation returned 401 and admin notifications were
    // silently dropped for weeks. Removed.

    try {
        const { record } = await req.json()
        const { full_name, email, city, country, reason, referral_source, referral_detail } = record

        console.log(`[NOTIFY] Processing application for: ${email}`)

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')

        // Fetch admin recipients from DB (single source of truth)
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )
        const { data: adminRows } = await supabase.from('admin_emails').select('email')
        const adminEmails = adminRows?.map((r: { email: string }) => r.email) ?? ['hello@swissperiences.ch']

        // 1. Send "Thank You" email to the applicant
        console.log(`[NOTIFY] Sending Thank You email to: ${email}`)
        const userEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: [email],
                subject: "We've received your application.",
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 0; background-color: #F9F7F2; font-family: 'Times New Roman', Times, serif; color: #1A1D2E; }
                    .wrapper { width: 100%; background-color: #F9F7F2; padding: 80px 0; }
                    .letter { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 540px; padding: 100px 60px; text-align: left; box-shadow: 0 4px 30px rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.03); }
                    .logo { font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 70px; display: block; text-align: center; }
                    h1 { font-family: 'Times New Roman', Times, serif; font-size: 28px; font-weight: 400; font-style: italic; line-height: 1.4; margin-bottom: 40px; color: #1A1D2E; }
                    p { font-size: 16px; line-height: 1.9; margin-bottom: 28px; color: #444; font-weight: 300; }
                    .signature { margin-top: 60px; }
                    .closing { font-style: italic; color: #1A1D2E; margin-bottom: 10px; }
                    .host { font-size: 14px; letter-spacing: 1px; color: #888; text-transform: uppercase; }
                    .footer { margin-top: 100px; font-size: 9px; color: #CCC; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
                    .footer a { color: #BBB; text-decoration: none; margin: 0 10px; }
                </style>
            </head>
            <body>
                <center class="wrapper">
                    <div class="letter">
                        <p style="font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 70px; text-align: center;">Swissperiences</p>

                        <h1>Thank you, ${esc(full_name.split(' ')[0])}.</h1>

                        <p>We've received your application for membership. Every request is reviewed personally — this is how we keep our community intentional.</p>
                        <p>You can expect to hear from us within 48 hours.</p>

                        <div class="signature">
                            <p class="closing">Until then, find a moment of stillness.</p>
                            <p class="host">— Swissperiences</p>
                        </div>

                        <div class="footer">
                            © 2026 Swissperiences • Geneva, Switzerland<br><br>
                            <a href="https://swissperiences.ch">Website</a>
                            <a href="mailto:hello@swissperiences.ch">Contact</a>
                        </div>
                    </div>
                </center>
            </body>
            </html>
        `,
            }),
        })
        const userData = await userEmailResponse.json()
        console.log(`[NOTIFY] Thank You email status: ${userEmailResponse.status}`, userData)

        // 2. Send "New Lead" notification to Admin (delay to avoid Resend 2 req/sec rate limit)
        await new Promise((r) => setTimeout(r, 1100))
        console.log(`[NOTIFY] Sending Admin notification for: ${full_name}`)
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: adminEmails,
                subject: `[APPLICATION] ${esc(full_name)}${city ? ` — ${esc(city)}` : ''}`,
                html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <h2 style="color: #D8B58A; border-bottom: 1px solid #333; padding-bottom: 10px;">New Membership Application</h2>
                <p style="margin: 10px 0;"><strong>Name:</strong> ${esc(full_name)}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${esc(email)}</p>
                <p style="margin: 10px 0;"><strong>Location:</strong> ${esc(city)}, ${esc(country)}</p>
                <p style="margin: 10px 0;"><strong>Source:</strong> ${esc(referral_source)}${referral_detail ? ` (${esc(referral_detail)})` : ''}</p>
                <div style="margin-top: 20px; padding: 15px; background: #000; border-left: 2px solid #D8B58A;">
                    <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Reason for joining</p>
                    <p style="margin: 10px 0 0 0;">${esc(reason)}</p>
                </div>
                <a href="https://swissperiences.ch/admin" style="display: inline-block; margin-top: 25px; color: #D8B58A; text-decoration: none; border: 1px solid #D8B58A; padding: 8px 16px; font-size: 12px;">Open Admin Panel</a>
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>
        `,
            }),
        })
        const adminData = await adminEmailResponse.json()
        console.log(`[NOTIFY] Admin notification status: ${adminEmailResponse.status}`, adminData)

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        console.error('[NOTIFY] Unexpected error:', error)
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
