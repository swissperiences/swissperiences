import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { record } = await req.json()
        const { full_name, email, city, country, reason, referral_source, referral_detail } = record

        console.log(`[NOTIFY] Processing application for: ${email}`)

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')

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
                subject: "Thank you for your interest in Swissperiences.",
                html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F9F7F2; }
                    .letter { background-color: #ffffff; padding: 60px; border: 1px solid #eee; }
                    .logo { text-align: center; font-size: 14px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 50px; }
                    h1 { font-size: 24px; font-weight: normal; font-style: italic; margin-bottom: 30px; }
                    p { margin-bottom: 20px; color: #444; }
                    .divider { width: 40px; height: 1px; background: #ddd; margin: 30px 0; }
                    .footer { margin-top: 60px; font-size: 10px; color: #999; text-align: center; letter-spacing: 1px; text-transform: uppercase; }
                </style>
            </head>
            <body>
                <div class="letter">
                    <div class="logo">Swissperiences</div>
                    <h1>Thank you for applying.</h1>
                    <p>Dear ${full_name.split(' ')[0]},</p>
                    <p>We have received your application for membership to Swissperiences.</p>
                    <p>Our community is built on discretion and shared values. Your request is being reviewed personally, and you can expect to hear from us within the next 48 hours.</p>
                    <div class="divider"></div>
                    <p>Until then, find a moment of stillness.</p>
                    <p>— The Host,<br>Swissperiences</p>
                    <div class="footer">
                        © 2026 Swissperiences • Geneva, Switzerland
                    </div>
                </div>
            </body>
            </html>
        `,
            }),
        })
        const userData = await userEmailResponse.json()
        console.log(`[NOTIFY] Thank You email status: ${userEmailResponse.status}`, userData)

        // 2. Send "New Lead" notification to Admin
        console.log(`[NOTIFY] Sending Admin notification for: ${full_name}`)
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences Intel <hello@swissperiences.ch>',
                to: ['hello@swissperiences.ch'],
                subject: `[NEW APPLICATION] ${full_name} (${city})`,
                html: `
            <div style="font-family: monospace; padding: 20px; background: #111; color: #eee; line-height: 1.6;">
                <h2 style="color: #D8B58A; border-bottom: 1px solid #333; padding-bottom: 10px;">New Membership Application</h2>
                <p><strong>Name:</strong> ${full_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Location:</strong> ${city}, ${country}</p>
                <p><strong>Source:</strong> ${referral_source} ${referral_detail ? `(${referral_detail})` : ''}</p>
                <div style="margin-top: 20px; padding: 15px; background: #000; border-left: 2px solid #D8B58A;">
                    <p style="margin: 0; font-size: 14px; color: #888;">Reason for joining:</p>
                    <p style="margin: 10px 0 0 0;">${reason}</p>
                </div>
                <p style="margin-top: 40px; font-size: 10px; color: #555;">SWISSPERIENCES INTELLIGENCE UNIT // ${new Date().toISOString()}</p>
                <a href="https://swissperiences.ch/admin" style="display: inline-block; margin-top: 20px; color: #D8B58A; text-decoration: none; border: 1px solid #D8B58A; padding: 8px 16px;">Open Admin Panel</a>
            </div>
        `,
            }),
        })
        const adminData = await adminEmailResponse.json()
        console.log(`[NOTIFY] Admin notification status: ${adminEmailResponse.status}`, adminData)

        return new Response(JSON.stringify({ success: true, userEmail: userData, adminEmail: adminData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
