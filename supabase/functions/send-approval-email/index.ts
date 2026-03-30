// Supabase Edge Function: Send Approval Email
// Triggered when an application is approved

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const ALLOWED_ORIGINS = ['https://swissperiences.ch', 'https://www.swissperiences.ch']

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ''
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

interface ApprovalRequest {
  email: string;
  fullName: string;
}

serve(async (req) => {
  const origin = req.headers.get('origin')

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders(origin) })
  }

  try {
    // Verify the caller is an authenticated admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' }
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user?.email) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' }
      })
    }

    // Check if the caller is an admin
    const { data: adminRow } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', user.email)
      .single()

    if (!adminRow) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' }
      })
    }

    const { email, fullName }: ApprovalRequest = await req.json()

    // Send email via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing')
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
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
        subject: 'Welcome to Swissperiences.',
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

      <h1>${fullName.split(' ')[0]}, you're in.</h1>

      <p>Your membership has been approved. Welcome to Swissperiences — a private collection of curated alpine sanctuaries, experiences and journeys.</p>
      <p>You now have full access to our collection, booking calendar, and everything we keep behind closed doors.</p>

      <div class="cta-box">
        <a href="https://swissperiences.ch/login" class="btn-primary">Enter</a>
      </div>

      <div class="signature">
        <p class="closing">See you in the mountains.</p>
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
      const errorData = await emailResponse.text()
      console.error('Resend error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to send approval email' }),
        { status: 500, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Approval email sent' }),
      { headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    )
  }
})
