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
                    <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
                        <h2 style="font-size: 24px; margin-bottom: 24px;">New Booking Inquiry</h2>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td style="padding: 8px 0; color: #666;">Member</td><td style="padding: 8px 0;">${safeName}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
                            <tr><td style="padding: 8px 0; color: #666;">${typeLabel}</td><td style="padding: 8px 0;">${safeSanctuary}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;">${dateLabel}</td><td style="padding: 8px 0;">${dateDisplay}</td></tr>
                            ${nightsDisplay}
                        </table>
                        <p style="margin-top: 24px; font-size: 12px; color: #999;">Reply directly to this email or contact the member at ${safeEmail}.</p>
                    </div>
                `,
            }),
        })

        // 2. Confirm to member
        const memberBody = isExperience
            ? `We've received your request for <strong>${safeSanctuary}</strong> on <strong>${fromDate}</strong>.`
            : `We've received your availability request for <strong>${safeSanctuary}</strong> from <strong>${fromDate}</strong> to <strong>${toDate}</strong> (${nights} night${nights > 1 ? 's' : ''}).`

        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: [memberEmail],
                subject: `Your inquiry for ${safeSanctuary} — ${subjectDate}`,
                html: `
                    <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
                        <p style="font-size: 18px; margin-bottom: 24px;">Thank you, ${esc(safeName.split(' ')[0])}.</p>
                        <p style="font-size: 14px; color: #555; line-height: 1.8;">${memberBody}</p>
                        <p style="font-size: 14px; color: #555; line-height: 1.8; margin-top: 16px;">
                            The Host will review your request and get back to you within 24 hours.
                        </p>
                        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 2px;">
                            Swissperiences
                        </div>
                    </div>
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
