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

const experienceLabels: Record<string, string> = {
    cinematic_memories: "Cinematic Memories",
    road_journey: "Alps Road Journey",
    guided_hike: "Guided Alpine Hike",
    private_chef: "Private Chef Experience",
}

const sanctuaryLabels: Record<string, string> = {
    villars: "The Villars Loft",
}

serve(async (req) => {
    const corsHeaders = getCorsHeaders(req)

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Auth check
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Authentication required')

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Verify caller is admin
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) throw new Error('Invalid authentication')

        const { data: adminCheck } = await supabase
            .from('admin_emails')
            .select('email')
            .eq('email', user.email)
            .single()

        if (!adminCheck) throw new Error('Admin access required')

        // Get booking ID from request
        const { bookingId } = await req.json()
        if (!bookingId) throw new Error('Missing bookingId')

        // Fetch booking with member info
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*, members(full_name, email)')
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) throw new Error('Booking not found')
        if (booking.status !== 'confirmed') throw new Error('Booking is not confirmed')

        const member = (booking as any).members
        if (!member?.email) throw new Error('Member email not found')

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')

        // Determine booking type and format details
        const isExperience = !!booking.experience_type
        const bookingName = isExperience
            ? experienceLabels[booking.experience_type] || booking.experience_type
            : sanctuaryLabels[booking.sanctuary_id] || booking.sanctuary_id

        const formatDate = (d: string) =>
            new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

        const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const safeName = esc(member.full_name || 'Member')
        const safeBookingName = esc(bookingName)
        const firstName = esc((member.full_name || 'Member').split(' ')[0])

        // Build details section
        let detailsHtml = ''
        if (isExperience) {
            detailsHtml = `
                <tr><td style="padding: 8px 0; color: #666; width: 120px;">Experience</td><td style="padding: 8px 0; font-weight: 500;">${safeBookingName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Date</td><td style="padding: 8px 0;">${formatDate(booking.preferred_date)}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Guests</td><td style="padding: 8px 0;">${booking.guests}</td></tr>
            `
        } else {
            const nights = booking.total_nights || Math.ceil(
                (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24)
            )
            detailsHtml = `
                <tr><td style="padding: 8px 0; color: #666; width: 120px;">Sanctuary</td><td style="padding: 8px 0; font-weight: 500;">${safeBookingName}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Check-in</td><td style="padding: 8px 0;">${formatDate(booking.check_in)}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Check-out</td><td style="padding: 8px 0;">${formatDate(booking.check_out)}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Nights</td><td style="padding: 8px 0;">${nights}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Guests</td><td style="padding: 8px 0;">${booking.guests}</td></tr>
            `
        }

        const specialRequestsHtml = booking.special_requests
            ? `<tr><td style="padding: 8px 0; color: #666;">Requests</td><td style="padding: 8px 0; font-style: italic;">${esc(booking.special_requests)}</td></tr>`
            : ''

        // Send confirmation email to member
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: [member.email],
                subject: `Confirmed — ${bookingName}`,
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
                    .details { margin: 40px 0; padding: 30px; background: #FAFAF8; border-left: 2px solid #1A1D2E; }
                    .details table { width: 100%; border-collapse: collapse; font-size: 14px; }
                    .details td { padding: 8px 0; vertical-align: top; }
                    .details td:first-child { color: #999; width: 120px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; padding-top: 10px; }
                    .details td:last-child { color: #1A1D2E; }
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

                        <h1>${firstName}, your booking is confirmed.</h1>

                        <p>Everything is set. Here are your details:</p>

                        <div class="details">
                            <table>
                                ${detailsHtml}
                                ${specialRequestsHtml}
                            </table>
                        </div>

                        <p>We'll be in touch shortly with payment details and final arrangements. For anything at all, reach us at <a href="mailto:hello@swissperiences.ch" style="color: #1A1D2E;">hello@swissperiences.ch</a>.</p>

                        <div class="signature">
                            <p class="closing">Looking forward to hosting you.</p>
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

        if (!emailResponse.ok) {
            const errBody = await emailResponse.text()
            console.error('[BOOKING-CONFIRM] Resend error:', errBody)
            throw new Error('Failed to send email via Resend')
        }

        console.log(`[BOOKING-CONFIRM] Confirmation sent to ${member.email} for ${bookingName}`)

        return new Response(
            JSON.stringify({ success: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        console.error('[BOOKING-CONFIRM] Error:', error.message)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
