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

        const { sanctuary, dateFrom, dateTo, memberName, memberEmail, guests, specialRequests } = await req.json()

        if (!sanctuary || !dateFrom || !dateTo || !memberEmail) {
            throw new Error('Missing required fields')
        }

        const guestCount = guests || 1

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
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Guests</span><br><span style="color: #F3F4F6;">${guestCount}</span></p>
                ${specialRequests ? `<div style="margin: 15px 0; padding: 12px; background: #000; border-left: 2px solid #D8B58A;"><p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Special Requests</p><p style="margin: 8px 0 0 0; color: #eee; font-size: 13px;">${esc(specialRequests)}</p></div>` : ''}
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>
                `,
            }),
        })

        // 2. Confirm to member (delay to avoid Resend 2 req/sec rate limit)
        await new Promise((r) => setTimeout(r, 1100))

        const guestLine = guestCount > 1 ? ` for <strong>${guestCount} guests</strong>` : ''
        const memberBody = isExperience
            ? `We've received your request for <strong>${safeSanctuary}</strong> on <strong>${fromDate}</strong>${guestLine}.`
            : `We've received your request for <strong>${safeSanctuary}</strong> from <strong>${fromDate}</strong> to <strong>${toDate}</strong> (${nights} night${nights > 1 ? 's' : ''})${guestLine}.`

        const specialRequestsNote = specialRequests
            ? `<p style="margin-top: 10px; padding: 20px; background: #FAFAF8; border-left: 2px solid #1A1D2E; font-size: 14px; color: #666; font-style: italic;">Your requests: ${esc(specialRequests)}</p>`
            : ''

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: [memberEmail],
                subject: `[Swissperiences] We received your request — next steps`,
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
                    h1 { font-family: 'Times New Roman', Times, serif; font-size: 28px; font-weight: 400; font-style: italic; line-height: 1.4; margin-bottom: 40px; color: #1A1D2E; }
                    p { font-size: 16px; line-height: 1.9; margin-bottom: 28px; color: #444; font-weight: 300; }
                    .detail-row { display: block; margin-bottom: 12px; }
                    .detail-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; display: block; margin-bottom: 2px; }
                    .detail-value { font-size: 15px; color: #1A1D2E; }
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

                        <h1>Thank you, ${safeName.split(' ')[0]}.</h1>

                        <p>We've received your booking request and our team is reviewing availability.</p>

                        <!-- Booking Summary -->
                        <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 28px 0; margin: 30px 0;">
                            <span class="detail-row"><span class="detail-label">${typeLabel}</span><span class="detail-value">${safeSanctuary}</span></span>
                            <span class="detail-row"><span class="detail-label">${dateLabel}</span><span class="detail-value">${dateDisplay}</span></span>
                            ${!isExperience ? `<span class="detail-row"><span class="detail-label">Duration</span><span class="detail-value">${nights} night${nights > 1 ? 's' : ''}</span></span>` : ''}
                            <span class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${guestCount}</span></span>
                        </div>

                        ${specialRequestsNote}

                        <!-- What happens next -->
                        <p style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 12px; font-family: Arial, sans-serif;">What happens next</p>
                        <p>Within 24–48 hours you'll receive a follow-up email with confirmed details and payment instructions.</p>

                        <p style="font-size: 14px; color: #888; font-style: italic;">If anything is time-sensitive or you'd like to adjust details, simply reply to this email.</p>

                        <div class="signature">
                            <p class="closing">Talk soon.</p>
                            <p class="host">— Swissperiences</p>
                        </div>

                        <div class="footer">
                            &copy; 2026 Swissperiences &middot; Geneva, Switzerland<br><br>
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
