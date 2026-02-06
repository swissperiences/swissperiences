// Supabase Edge Function: Send Approval Email
// Triggered when an application is approved

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApprovalRequest {
  email: string;
  fullName: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, fullName }: ApprovalRequest = await req.json()

    // Send email via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing')
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY is not set' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Swissperiences <hello@swissperiences.ch>',
        to: [email],
        subject: 'Welcome to Swissperiences',
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; line-height: 1.8; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; letter-spacing: 0.1em; }
    .divider { width: 60px; height: 1px; background: #ddd; margin: 30px auto; }
    h1 { font-size: 28px; font-weight: normal; margin-bottom: 20px; }
    p { margin-bottom: 20px; color: #444; }
    .button { display: inline-block; background: #1a1a1a; color: white; padding: 16px 32px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.15em; font-size: 12px; margin: 30px 0; }
    .footer { margin-top: 60px; padding-top: 30px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SWISSPERIENCES</div>
  </div>

  <div class="divider"></div>

  <h1>${fullName.split(' ')[0]},</h1>

  <p>Your application has been approved.</p>

  <p>Welcome to Swissperiences—a private network of curated alpine sanctuaries.</p>

  <p>You now have full access to our collection and booking calendar.</p>

  <a href="https://swissperiences.ch/members" class="button">Enter The Sanctuary</a>

  <p style="margin-top: 40px;">See you in the mountains.</p>

  <div class="footer">
    <p>Swissperiences · Geneva, Switzerland · <a href="https://swissperiences.ch" style="color: #999;">swissperiences.ch</a></p>
  </div>
</body>
</html>
          `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Resend error:', errorData)
      return new Response(
        JSON.stringify({ error: `Resend failed: ${errorData}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Approval email sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
