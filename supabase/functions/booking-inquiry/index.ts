import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Verify the user has an active membership
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Authentication required')
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Decode the JWT to get the user ID
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)

        if (authError || !user) {
            throw new Error('Invalid authentication')
        }

        // Check active membership
        const { data: member, error: memberError } = await supabase
            .from('members')
            .select('membership_status')
            .eq('auth_user_id', user.id)
            .single()

        if (memberError || !member || member.membership_status !== 'active') {
            throw new Error('Active membership required to make booking inquiries')
        }

        const { sanctuary, dateFrom, dateTo, memberName, memberEmail } = await req.json()

        if (!sanctuary || !dateFrom || !dateTo || !memberEmail) {
            throw new Error('Missing required fields')
        }

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')

        const fromDate = new Date(dateFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        const toDate = new Date(dateTo).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        const nights = Math.ceil((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / (1000 * 60 * 60 * 24))
        const isExperience = sanctuary.startsWith('Experience:') || dateFrom === dateTo

        // Minimum 2 nights only applies to Sanctuary bookings
        if (!isExperience && nights < 2) {
            throw new Error('Minimum stay is 2 nights')
        }

        // Sanitize user-provided strings before embedding in HTML
        const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const safeName = esc(memberName || 'Member')
        const safeEmail = esc(memberEmail)
        const safeSanctuary = esc(sanctuary)

        const dateDisplay = isExperience ? fromDate : `${fromDate} — ${toDate}`
        const subjectDate = isExperience ? fromDate : `${fromDate} to ${toDate}`
        const nightsDisplay = isExperience ? '' : `<tr><td style="padding: 8px 0; color: #666;">Nights</td><td style="padding: 8px 0;">${nights}</td></tr>`
        const dateLabel = isExperience ? 'Preferred Date' : 'Dates'
        const typeLabel = isExperience ? 'Experience' : 'Sanctuary'

        // 1. Notify admin
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: ['hello@swissperiences.ch'],
                subject: `[BOOKING] ${safeName} — ${safeSanctuary} — ${subjectDate}`,
                html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <div style="border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between;">
                    <span style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #fff; font-weight: 700;">New Booking</span>
                </div>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Member</span><br><span style="color: #F3F4F6;">${safeName}</span></p>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Email</span><br><a href="mailto:${safeEmail}" style="color: #D8B58A;">${safeEmail}</a></p>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${typeLabel}</span><br><span style="color: #F3F4F6;">${safeSanctuary}</span></p>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${dateLabel}</span><br><span style="color: #F3F4F6;">${dateDisplay}</span></p>
                ${!isExperience ? `<p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Nights</span><br><span style="color: #F3F4F6;">${nights}</span></p>` : ''}
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>
                `,
            }),
        })

        // 2. Confirm to member (delay to avoid Resend 2 req/sec rate limit)
        await new Promise((r) => setTimeout(r, 1100))

        const memberBody = isExperience
            ? `We've received your request for <strong>${safeSanctuary}</strong> on <strong>${fromDate}</strong>.`
            : `We've received your request for <strong>${safeSanctuary}</strong> from <strong>${fromDate}</strong> to <strong>${toDate}</strong> (${nights} night${nights > 1 ? 's' : ''}).`

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: [memberEmail],
                subject: `Your inquiry — ${safeSanctuary}`,
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
                        <span class="logo">S W I S S P E R I E N C E S</span>

                        <h1>Noted, ${safeName.split(' ')[0]}.</h1>

                        <p>${memberBody}</p>
                        <p>We'll review your request and get back to you within 24 hours.</p>

                        <div class="signature">
                            <p class="closing">Talk soon.</p>
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

        console.log(`[BOOKING] Inquiry sent: ${safeEmail} → ${safeSanctuary} (${subjectDate})`)

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        console.error('[BOOKING] Error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
