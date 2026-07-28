-- ============================================================
-- stripe_webhook_events: process each Stripe event exactly once
--
-- The webhook had no idempotency at all. Stripe delivers at least once and
-- retries on any non-2xx, so a redelivered checkout.session.completed re-ran
-- the update and rewrote paid_at with a fresh timestamp. Harmless while the
-- handler only sets a status, and a duplicated fulfillment the moment anyone
-- adds an email, an invoice or provisioning to it.
--
-- Additive only: a new table and nothing else. event_id is Stripe's own id, so
-- the primary key is the deduplication.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
    event_id text PRIMARY KEY,
    event_type text NOT NULL,
    livemode boolean,
    received_at timestamptz NOT NULL DEFAULT now(),
    processed_at timestamptz,
    outcome text,
    application_id uuid
);

CREATE INDEX IF NOT EXISTS stripe_webhook_events_received_at_idx
    ON public.stripe_webhook_events (received_at DESC);

ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- No policies: only the server-side key, which bypasses RLS, touches this.
-- Webhook history must not be readable by anon or authenticated.

COMMENT ON TABLE public.stripe_webhook_events IS
    'One row per Stripe event id seen. The primary key is what makes redelivery a no-op; Stripe guarantees at-least-once, never exactly-once.';
COMMENT ON COLUMN public.stripe_webhook_events.outcome IS
    'processed | skipped_unpaid | application_not_found | unhandled_event — what the handler decided, for auditing without storing the payload.';
COMMENT ON COLUMN public.stripe_webhook_events.livemode IS
    'Stripe event livemode flag. Test and live events share this table and must stay distinguishable.';
