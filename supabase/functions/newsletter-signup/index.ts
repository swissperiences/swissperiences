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
        const { email } = await req.json()
        if (!email) throw new Error('Email is required')

        console.log(`[NEWSLETTER] Processing signup: ${email}`)

        const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
        if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')

        const AUDIENCE_ID = Deno.env.get('RESEND_AUDIENCE_ID')
        if (!AUDIENCE_ID) throw new Error('RESEND_AUDIENCE_ID not set')

        // 1. Add contact to Resend Audience
        console.log(`[NEWSLETTER] Adding to audience: ${AUDIENCE_ID}`)
        const contactResponse = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                email,
                unsubscribed: false,
            }),
        })
        const contactData = await contactResponse.json()
        console.log(`[NEWSLETTER] Contact response: ${contactResponse.status}`, contactData)

        // If contact already exists, Resend returns 200 — treat as success
        const alreadySubscribed = contactData?.id === undefined && contactResponse.status === 409

        // 2. Send welcome email (only for new subscribers)
        if (!alreadySubscribed) {
            console.log(`[NEWSLETTER] Sending welcome email to: ${email}`)
            const emailResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'Swissperiences <hello@swissperiences.ch>',
                    to: [email],
                    subject: "You're on the list.",
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
                    .cta-box { margin: 60px 0; padding: 40px 0; border-top: 1px solid #F0EFEA; border-bottom: 1px solid #F0EFEA; text-align: center; }
                    .btn-primary { display: inline-block; background-color: #1A1D2E; color: #ffffff !important; padding: 18px 40px; text-decoration: none; text-transform: uppercase; letter-spacing: 3px; font-size: 10px; font-weight: bold; border-radius: 2px; }
                    .footer { margin-top: 100px; font-size: 9px; color: #CCC; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
                    .footer a { color: #BBB; text-decoration: none; margin: 0 10px; }
                </style>
            </head>
            <body>
                <center class="wrapper">
                    <div class="letter">
                        <p style="font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 70px; text-align: center;">Swissperiences</p>

                        <h1>Consider this your quiet introduction.</h1>

                        <p>You've joined our private list — a small circle that hears from us first. Seasonal intakes, hidden retreats, stories from the Alps. No noise. No spam. Just the essential.</p>
                        <p>When you're ready to go further, membership unlocks the full experience: curated sanctuaries, private dining, guided journeys, and everything in between.</p>

                        <div class="cta-box">
                            <a href="https://swissperiences.ch/request-access" class="btn-primary">Apply for Membership</a>
                        </div>

                        <div class="signature">
                            <p class="closing">Until then, the mountains will be here.</p>
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
            const emailData = await emailResponse.json()
            console.log(`[NEWSLETTER] Welcome email status: ${emailResponse.status}`, emailData)
        }

        // 3. Notify admin (delay only needed if we sent the welcome email above)
        if (!alreadySubscribed) {
            await new Promise((r) => setTimeout(r, 1100))
        }
        console.log(`[NEWSLETTER] Sending admin notification for: ${email}`)
        const adminResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Swissperiences <hello@swissperiences.ch>',
                to: ['hello@swissperiences.ch'],
                subject: `[THE LIST] ${email}`,
                html: `
            <div style="font-family: monospace; padding: 20px; background: #111; color: #eee;">
                <h2 style="color: #D8B58A;">New Newsletter Subscriber</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Already subscribed:</strong> ${alreadySubscribed ? 'Yes' : 'No'}</p>
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>
                `,
            }),
        })
        const adminData = await adminResponse.json()
        console.log(`[NEWSLETTER] Admin notification status: ${adminResponse.status}`, adminData)

        return new Response(
            JSON.stringify({
                success: true,
                already_subscribed: alreadySubscribed,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error(`[NEWSLETTER] Error:`, error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
