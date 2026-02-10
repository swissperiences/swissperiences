// ============================================================
// Stripe Webhook Edge Function
// Endpoint: POST /functions/v1/stripe-webhook
//
// Handles Stripe webhook events as the source of truth for payments.
// Validates signature, processes checkout.session.completed events,
// and updates membership_applications with payment status.
//
// Required secrets (set via Supabase Dashboard > Edge Functions > Secrets):
//   - STRIPE_SECRET_KEY
//   - STRIPE_WEBHOOK_SECRET
//   - SUPABASE_URL          (auto-injected by Supabase)
//   - SUPABASE_SERVICE_ROLE_KEY (auto-injected by Supabase)
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.14.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

serve(async (req) => {
  // Webhooks are POST only — reject everything else
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // ── 1. Read env vars ──────────────────────────────────────
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error('[stripe-webhook] Missing Stripe secrets')
      return new Response('Server configuration error', { status: 500 })
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[stripe-webhook] Missing Supabase credentials')
      return new Response('Server configuration error', { status: 500 })
    }

    // ── 2. Read the raw body (required for signature verification) ─
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('[stripe-webhook] Missing stripe-signature header')
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    // ── 3. Construct and verify the Stripe event ──────────────
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('[stripe-webhook] Signature verification failed:', err.message)
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    console.log(`[stripe-webhook] Received event: ${event.type} (${event.id})`)

    // ── 4. Handle events ──────────────────────────────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    switch (event.type) {
      // ─── Payment succeeded ───────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Only process paid sessions (ignore setup-mode sessions)
        if (session.payment_status !== 'paid') {
          console.log(`[stripe-webhook] Session ${session.id} payment_status=${session.payment_status} — skipping`)
          break
        }

        // Resolve the application_id from multiple sources for robustness
        const applicationId =
          session.client_reference_id ||
          session.metadata?.application_id ||
          null

        if (!applicationId) {
          // Fallback: try to find by stripe_session_id
          console.warn(`[stripe-webhook] No application_id in session ${session.id} — trying stripe_session_id lookup`)

          const { data: app, error: lookupError } = await supabase
            .from('membership_applications')
            .select('id')
            .eq('stripe_session_id', session.id)
            .single()

          if (lookupError || !app) {
            console.error(`[stripe-webhook] Could not find application for session ${session.id}:`, lookupError)
            // Return 200 so Stripe doesn't retry — we log the error
            return new Response(JSON.stringify({ received: true, warning: 'Application not found' }), {
              headers: { 'Content-Type': 'application/json' },
              status: 200,
            })
          }

          // Update using the found ID
          await updatePaymentStatus(supabase, app.id, session)
          break
        }

        await updatePaymentStatus(supabase, applicationId, session)
        break
      }

      // ─── Payment failed after async confirmation ─────────
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        const applicationId =
          session.client_reference_id ||
          session.metadata?.application_id

        if (applicationId) {
          const { error } = await supabase
            .from('membership_applications')
            .update({ payment_status: 'failed' })
            .eq('id', applicationId)

          if (error) {
            console.error(`[stripe-webhook] Failed to update payment_status=failed for ${applicationId}:`, error)
          } else {
            console.log(`[stripe-webhook] Marked application ${applicationId} as payment failed`)
          }
        }
        break
      }

      // ─── Unhandled events (log and acknowledge) ──────────
      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`)
    }

    // Always return 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('[stripe-webhook] Unexpected error:', error)
    // Return 500 so Stripe retries the webhook
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// ── Helper: Update payment status in the database ───────────
async function updatePaymentStatus(
  supabase: ReturnType<typeof createClient>,
  applicationId: string,
  session: Stripe.Checkout.Session
) {
  // Convert amount from cents/centimes to major currency unit (e.g. 50000 → 500.00)
  const depositAmount = session.amount_total
    ? session.amount_total / 100
    : null

  const { error } = await supabase
    .from('membership_applications')
    .update({
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
      deposit_amount: depositAmount,
      stripe_session_id: session.id, // ensure it's always saved
    })
    .eq('id', applicationId)

  if (error) {
    console.error(`[stripe-webhook] Failed to update application ${applicationId}:`, error)
    throw error // will cause 500 → Stripe retries
  }

  console.log(
    `[stripe-webhook] ✅ Application ${applicationId} marked as paid — ` +
    `${session.currency?.toUpperCase()} ${depositAmount}`
  )
}
