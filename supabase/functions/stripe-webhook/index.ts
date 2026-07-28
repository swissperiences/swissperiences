// ============================================================
// Stripe Webhook Edge Function
// Endpoint: POST /functions/v1/stripe-webhook
//
// The canonical Stripe webhook for this project. Verifies the signature over
// the raw body, then applies payment outcomes to membership_applications.
//
// verify_jwt is false for this function (see supabase/config.toml): Stripe
// signs with its own scheme and never sends a Supabase JWT, so the gateway
// would reject every delivery. Authorization here is the Stripe signature,
// checked before anything else touches the database.
//
// Required secrets (Supabase Dashboard > Edge Functions > Secrets):
//   - STRIPE_SECRET_KEY
//   - STRIPE_WEBHOOK_SECRET       signing secret of the live endpoint
//   - STRIPE_WEBHOOK_SECRET_TEST  signing secret of the test endpoint (optional)
//   - SUPABASE_URL                (auto-injected)
//   - SUPABASE_SERVICE_ROLE_KEY   (auto-injected)
//
// Both signing secrets are accepted so the test and live endpoints can exist
// side by side. Each secret only validates events from its own mode, so this
// mixes nothing: an event is trusted because its own endpoint's secret signed
// it. Swapping one value in and out to test would have left live unverifiable.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.14.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

type Outcome = 'processed' | 'skipped_unpaid' | 'application_not_found' | 'unhandled_event' | 'payment_failed'

serve(async (req) => {
  // Webhooks are POST only — reject everything else
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // ── 1. Read env vars ──────────────────────────────────────
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const STRIPE_WEBHOOK_SECRET_TEST = Deno.env.get('STRIPE_WEBHOOK_SECRET_TEST')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const signingSecrets = [STRIPE_WEBHOOK_SECRET, STRIPE_WEBHOOK_SECRET_TEST].filter(Boolean) as string[]

    if (!STRIPE_SECRET_KEY || signingSecrets.length === 0) {
      console.error('[stripe-webhook] Missing Stripe secrets')
      return new Response('Server configuration error', { status: 500 })
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[stripe-webhook] Missing Supabase credentials')
      return new Response('Server configuration error', { status: 500 })
    }

    // ── 2. Read the raw body (required for signature verification) ─
    // Must be the untouched bytes: parsing and re-serialising would change
    // them and every signature would fail.
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('[stripe-webhook] Missing stripe-signature header')
      return new Response('Missing stripe-signature header', { status: 400 })
    }

    // ── 3. Construct and verify the Stripe event ──────────────
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover', // matches the configured endpoints
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Nothing below this point runs on an unverified payload.
    let event: Stripe.Event | null = null
    let lastError = ''
    for (const secret of signingSecrets) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, secret)
        break
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err)
      }
    }
    if (!event) {
      console.error('[stripe-webhook] Signature verification failed:', lastError)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    console.log(`[stripe-webhook] Verified event: ${event.type} (${event.id}) livemode=${event.livemode}`)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // ── 4. Idempotency ────────────────────────────────────────
    // Stripe guarantees at-least-once delivery and retries on any non-2xx, so
    // the same event id can arrive repeatedly. The primary key makes the
    // second arrival a no-op.
    const { error: claimError } = await supabase
      .from('stripe_webhook_events')
      .insert({ event_id: event.id, event_type: event.type, livemode: event.livemode })

    if (claimError) {
      // 23505 = unique violation: already seen. Anything else is a real
      // database problem, and returning 500 makes Stripe retry.
      if (claimError.code === '23505') {
        console.log(`[stripe-webhook] Event ${event.id} already processed — acknowledging without reprocessing`)
        return json({ received: true, duplicate: true }, 200)
      }
      console.error('[stripe-webhook] Could not record event:', claimError)
      return json({ error: 'Could not record event' }, 500)
    }

    const finish = async (outcome: Outcome, applicationId: string | null = null) => {
      await supabase
        .from('stripe_webhook_events')
        .update({ processed_at: new Date().toISOString(), outcome, application_id: applicationId })
        .eq('event_id', event!.id)
    }
    // Releasing the claim keeps a failed event retryable. Without this, a
    // crash after claiming would make Stripe's retry look like a duplicate and
    // the payment would never be applied.
    const release = async () => {
      await supabase.from('stripe_webhook_events').delete().eq('event_id', event!.id)
    }

    try {
      // ── 5. Handle events ────────────────────────────────────
      switch (event.type) {
        // ─── Payment succeeded ───────────────────────────────
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session

          // Only process paid sessions (ignore setup-mode sessions)
          if (session.payment_status !== 'paid') {
            console.log(`[stripe-webhook] Session ${session.id} payment_status=${session.payment_status} — skipping`)
            await finish('skipped_unpaid')
            break
          }

          // Resolve the application_id from multiple sources for robustness
          let applicationId =
            session.client_reference_id ||
            session.metadata?.application_id ||
            null

          if (!applicationId) {
            console.warn(`[stripe-webhook] No application_id in session ${session.id} — trying stripe_session_id lookup`)
            const { data: app } = await supabase
              .from('membership_applications')
              .select('id')
              .eq('stripe_session_id', session.id)
              .maybeSingle()

            if (!app) {
              // Acknowledged so Stripe stops retrying something no retry can
              // fix; the ledger row records why.
              console.error(`[stripe-webhook] Could not find application for session ${session.id}`)
              await finish('application_not_found')
              return json({ received: true, warning: 'Application not found' }, 200)
            }
            applicationId = app.id as string
          }

          await updatePaymentStatus(supabase, applicationId, session)
          await finish('processed', applicationId)
          break
        }

        // ─── Payment failed after async confirmation ─────────
        case 'checkout.session.async_payment_failed': {
          const session = event.data.object as Stripe.Checkout.Session
          const applicationId =
            session.client_reference_id ||
            session.metadata?.application_id ||
            null

          if (!applicationId) {
            console.warn(`[stripe-webhook] async_payment_failed without application_id for session ${session.id}`)
            await finish('application_not_found')
            break
          }

          const { error } = await supabase
            .from('membership_applications')
            .update({ payment_status: 'failed' })
            .eq('id', applicationId)

          if (error) {
            console.error(`[stripe-webhook] Failed to update payment_status=failed for ${applicationId}:`, error)
            throw error
          }
          console.log(`[stripe-webhook] Marked application ${applicationId} as payment failed`)
          await finish('payment_failed', applicationId)
          break
        }

        // ─── Unhandled events (log and acknowledge) ──────────
        default:
          console.log(`[stripe-webhook] Unhandled event type: ${event.type}`)
          await finish('unhandled_event')
      }
    } catch (processingError) {
      console.error('[stripe-webhook] Processing failed, releasing the event for retry:', processingError)
      await release()
      return json({ error: 'Processing failed' }, 500)
    }

    return json({ received: true }, 200)
  } catch (error) {
    console.error('[stripe-webhook] Unexpected error:', error)
    // Return 500 so Stripe retries the webhook
    return json({ error: 'Internal server error' }, 500)
  }
})

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  })
}

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
    throw error // released above → Stripe retries
  }

  console.log(
    `[stripe-webhook] ✅ Application ${applicationId} marked as paid — ` +
    `${session.currency?.toUpperCase()} ${depositAmount}`
  )
}
