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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type NotificationType = 'applicant_ack' | 'admin_alert'

function json(body: unknown, status: number, headers: Record<string, string>) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...headers, 'Content-Type': 'application/json' },
    })
}

/** Compares in time independent of where the first difference falls, so the
 *  response latency cannot be used to recover the secret byte by byte. */
function timingSafeEqual(a: string, b: string): boolean {
    const enc = new TextEncoder()
    const x = enc.encode(a)
    const y = enc.encode(b)
    // Length alone is not secret; comparing anyway keeps the loop constant.
    let diff = x.length ^ y.length
    const len = Math.max(x.length, y.length)
    for (let i = 0; i < len; i++) {
        diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
    }
    return diff === 0
}


serve(async (req) => {
    const corsHeaders = getCorsHeaders(req)

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    if (req.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405, corsHeaders)
    }

    // The gateway (verify_jwt = true) only proves the caller holds *some* valid
    // key, and the anon key is public. The shared secret is what proves the
    // database trigger is the caller. Checked before the body is read and long
    // before Resend is touched, so an unauthorized caller can neither send mail
    // nor learn whether an application id exists.
    const expectedSecret = Deno.env.get('NOTIFY_TRIGGER_SECRET')
    if (!expectedSecret) {
        console.error('[NOTIFY] NOTIFY_TRIGGER_SECRET is not configured')
        return json({ error: 'Server configuration error' }, 503, corsHeaders)
    }
    if (!timingSafeEqual(req.headers.get('x-notify-secret') ?? '', expectedSecret)) {
        console.warn('[NOTIFY] Rejected call with missing or invalid x-notify-secret')
        return json({ error: 'Unauthorized' }, 401, corsHeaders)
    }

    try {
        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) {
            console.error('[NOTIFY] RESEND_API_KEY is not configured')
            return json({ error: 'Server configuration error' }, 503, corsHeaders)
        }

        // The request carries an identifier and nothing else.
        const body = await req.json().catch(() => null)
        const applicationId = body?.application_id
        if (typeof applicationId !== 'string' || !UUID_RE.test(applicationId)) {
            return json({ error: 'application_id must be a UUID' }, 400, corsHeaders)
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // Every value the emails contain is read back from the database, so the
        // caller cannot choose the recipient or rewrite the content.
        const { data: record, error: fetchError } = await supabase
            .from('membership_applications')
            .select('id, full_name, email, city, country, reason, referral_source, referral_detail')
            .eq('id', applicationId)
            .maybeSingle()

        if (fetchError) {
            console.error('[NOTIFY] Could not read application:', fetchError)
            return json({ error: 'Could not read the application' }, 503, corsHeaders)
        }
        if (!record) {
            return json({ error: 'Application not found' }, 404, corsHeaders)
        }

        const { full_name, email, city, country, reason, referral_source, referral_detail } = record

        console.log(`[NOTIFY] Processing application ${applicationId}`)

        // Fetch admin recipients from DB (single source of truth)
        const { data: adminRows } = await supabase.from('admin_emails').select('email')
        const adminEmails = adminRows?.map((r: { email: string }) => r.email) ?? ['hello@swissperiences.ch']

        // Claim each notification before sending. claim_notification is a single
        // atomic upsert, so two concurrent runs cannot both win the same one.
        // Only a 'sent' row blocks a retry — a run that dies mid-flight leaves
        // the row 'pending', which stays reclaimable.
        const claim = async (type: NotificationType) => {
            const { data, error } = await supabase.rpc('claim_notification', {
                p_application_id: applicationId,
                p_notification_type: type,
            })
            if (error) {
                console.error(`[NOTIFY][ALERT] Could not claim ${type}:`, error)
                return false
            }
            if (!data) console.log(`[NOTIFY] ${type} already sent or out of attempts for ${applicationId} — skipping`)
            return data === true
        }
        const resolve = async (type: NotificationType, sent: boolean, messageId: string | null, error: string | null) => {
            const { error: rpcError } = await supabase.rpc('resolve_notification', {
                p_application_id: applicationId,
                p_notification_type: type,
                p_sent: sent,
                p_provider_message_id: messageId,
                p_error: error,
            })
            // A send that succeeded but could not be recorded must not be resent:
            // the row stays 'pending' and the operator sees this alert.
            if (rpcError) console.error(`[NOTIFY][ALERT] Could not record ${type} outcome (sent=${sent}):`, rpcError)
        }

        /** Sends and records the outcome. A thrown fetch marks the row 'failed'
         *  rather than leaving a phantom claim that would suppress the email
         *  forever. */
        const send = async (type: NotificationType, payload: Record<string, unknown>) => {
            try {
                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify(payload),
                })
                const data = await res.json().catch(() => ({}))
                console.log(`[NOTIFY] ${type} status: ${res.status}`)
                if (res.ok) {
                    await resolve(type, true, data?.id ?? null, null)
                    return true
                }
                console.error(`[NOTIFY][ALERT] ${type} rejected: HTTP ${res.status}`)
                await resolve(type, false, null, `HTTP ${res.status}`)
                return false
            } catch (err) {
                const detail = err instanceof Error ? err.message : String(err)
                console.error(`[NOTIFY][ALERT] ${type} threw: ${detail}`)
                await resolve(type, false, null, `network error: ${detail}`)
                return false
            }
        }

        const sendApplicantAck = await claim('applicant_ack')
        const sendAdminAlert = await claim('admin_alert')
        if (!sendApplicantAck && !sendAdminAlert) {
            return json({ success: true, skipped: 'already notified' }, 200, corsHeaders)
        }

        let applicantOk = !sendApplicantAck
        let adminOk = !sendAdminAlert

        // 1. Send "Thank You" email to the applicant
        if (sendApplicantAck) {
        console.log(`[NOTIFY] Sending Thank You email for application ${applicationId}`)
        applicantOk = await send('applicant_ack', {
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
        })
        }

        // 2. Send "New Lead" notification to Admin (delay to avoid Resend 2 req/sec rate limit)
        if (sendAdminAlert) {
        if (sendApplicantAck) await new Promise((r) => setTimeout(r, 1100))
        console.log(`[NOTIFY] Sending Admin notification for application ${applicationId}`)
        adminOk = await send('admin_alert', {
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
        })
        }

        // A partial failure must not read as success — the released claim means
        // the trigger (or a manual replay) can retry just the missing email.
        if (!applicantOk || !adminOk) {
            return json({ error: 'Notification partially failed', applicantOk, adminOk }, 503, corsHeaders)
        }

        return json({ success: true, applicantOk, adminOk }, 200, corsHeaders)
    } catch (error) {
        console.error('[NOTIFY] Unexpected error:', error)
        return json({ error: 'Internal server error' }, 500, corsHeaders)
    }
})
