import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
                subject: `Your booking has been confirmed! — ${bookingName}`,
                html: `
                    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
                        <p style="font-size: 20px; margin-bottom: 24px;">Hi ${firstName},</p>
                        <p style="font-size: 15px; color: #333; line-height: 1.8; margin-bottom: 24px;">
                            Great news! Your booking has been <strong style="color: #16a34a;">confirmed</strong>.
                        </p>

                        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 24px 0; background: #fafafa; border-radius: 4px;">
                            <tbody style="padding: 16px;">
                                ${detailsHtml}
                                ${specialRequestsHtml}
                            </tbody>
                        </table>

                        <div style="border-left: 3px solid #c8102e; padding-left: 16px; margin: 32px 0;">
                            <p style="font-size: 14px; color: #555; line-height: 1.7; margin: 0;">
                                We'll contact you shortly with payment details and final arrangements.
                            </p>
                        </div>

                        <p style="font-size: 14px; color: #555; line-height: 1.8; margin-top: 24px;">
                            For questions, reply to this email or contact us at
                            <a href="mailto:hello@swissperiences.ch" style="color: #c8102e;">hello@swissperiences.ch</a>.
                        </p>

                        <p style="font-size: 15px; color: #333; margin-top: 32px;">
                            Looking forward to hosting you!
                        </p>
                        <p style="font-size: 14px; color: #666; margin-top: 4px;">
                            — The Swissperiences Team
                        </p>

                        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 2px;">
                            Swissperiences
                        </div>
                    </div>
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
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
