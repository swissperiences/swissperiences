// Supabase Edge Function: Send Approval Email
// Triggered when an application is approved

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApprovalRequest {
  applicationId: string;
  email: string;
  fullName: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { applicationId, email, fullName }: ApprovalRequest = await req.json()

    // Generate a unique token
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    // Store the token
    const { error: tokenError } = await supabaseClient
      .from('approval_tokens')
      .insert({
        application_id: applicationId,
        token: token,
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      throw new Error(`Failed to create token: ${tokenError.message}`)
    }

    // Build the activation URL
    const activationUrl = `https://swissperiences.ch/activate-membership?token=${token}`

    // Send email via Resend (or your preferred provider)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    if (RESEND_API_KEY) {
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

  <p>Welcome to Swissperiences—a private network of curated alpine sanctuaries for those seeking silence in a noisy world.</p>

  <p>You now have access to our full collection, availability calendar, and member-only experiences.</p>

  <p>Create your account to continue:</p>

  <a href="${activationUrl}" class="button">Activate Your Membership</a>

  <p>This link expires in 7 days.</p>

  <p style="margin-top: 40px;">See you in the mountains.</p>

  <p><em>— Caueh</em><br>
  <span style="font-size: 12px; color: #999;">Founder, Swissperiences</span></p>

  <div class="footer">
    <p>Swissperiences · Geneva, Switzerland</p>
    <p>This email was sent to ${email} because you applied for membership.</p>
  </div>
</body>
</html>
          `,
        }),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text()
        console.error('Resend error:', errorData)
        // Don't throw - token is created, email failure shouldn't break the flow
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Approval email sent',
        activationUrl // Return for testing purposes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
