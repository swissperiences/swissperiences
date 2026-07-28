-- ============================================================
-- notification_log: lease + ownership on the claim
--
-- The previous claim let any caller reclaim a row that was merely 'pending'.
-- Atomicity of the upsert guaranteed one row, not one claimant: two concurrent
-- runs both passed `status <> 'sent'`, both got true, and both could send. It
-- also incremented `attempts` when nothing had actually failed.
--
-- A claim now takes a lease. While the lease holds, nobody else can claim it.
-- Resolution requires the token issued with the lease, so a slow run that
-- wakes up after losing its lease cannot mark work owned by a newer run.
--
-- Lease windows are deliberately far below Resend's 24h idempotency-key
-- retention: a retry inside that window is deduplicated by the provider. A
-- row left 'pending' for longer than 24h is past that guarantee and must go to
-- manual review — never an automatic resend, which could duplicate a message
-- that was in fact delivered.
-- ============================================================

ALTER TABLE public.notification_log
    ADD COLUMN IF NOT EXISTS claim_token uuid,
    ADD COLUMN IF NOT EXISTS lease_expires_at timestamptz;

COMMENT ON COLUMN public.notification_log.claim_token IS
    'Identifies the run that currently owns this notification. resolve_notification only accepts the matching token.';
COMMENT ON COLUMN public.notification_log.lease_expires_at IS
    'While in the future, no other run may claim this row. Keep well under Resend''s 24h idempotency window.';

CREATE INDEX IF NOT EXISTS notification_log_stale_pending_idx
    ON public.notification_log (lease_expires_at)
    WHERE status = 'pending';

-- ---------- Claim ----------

DROP FUNCTION IF EXISTS public.claim_notification(uuid, text, integer);

CREATE OR REPLACE FUNCTION public.claim_notification(
    p_application_id uuid,
    p_notification_type text,
    p_max_attempts integer DEFAULT 5,
    p_lease_seconds integer DEFAULT 120
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token uuid;
BEGIN
  INSERT INTO public.notification_log (
      application_id, notification_type, status, attempts, claim_token, lease_expires_at
  )
  VALUES (
      p_application_id, p_notification_type, 'pending', 1,
      gen_random_uuid(), now() + make_interval(secs => p_lease_seconds)
  )
  ON CONFLICT (application_id, notification_type) DO UPDATE
     SET status           = 'pending',
         claim_token      = EXCLUDED.claim_token,
         lease_expires_at = EXCLUDED.lease_expires_at,
         attempts         = public.notification_log.attempts + 1,
         updated_at       = now()
   WHERE public.notification_log.attempts < p_max_attempts
     AND (
           public.notification_log.status = 'failed'
        OR (
              public.notification_log.status = 'pending'
          AND public.notification_log.lease_expires_at < now()
           )
         )
  RETURNING public.notification_log.claim_token INTO token;

  -- NULL means: already sent, lease still held by another run, or attempts spent.
  RETURN token;
END;
$$;

COMMENT ON FUNCTION public.claim_notification(uuid, text, integer, integer) IS
    'Takes a lease on one notification and returns its claim token, or NULL when it is already sent, still leased by another run, or out of attempts.';

-- ---------- Resolve ----------

DROP FUNCTION IF EXISTS public.resolve_notification(uuid, text, boolean, text, text);

CREATE OR REPLACE FUNCTION public.resolve_notification(
    p_application_id uuid,
    p_notification_type text,
    p_claim_token uuid,
    p_sent boolean,
    p_provider_message_id text DEFAULT NULL,
    p_error text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated boolean;
BEGIN
  UPDATE public.notification_log
     SET status              = CASE WHEN p_sent THEN 'sent' ELSE 'failed' END,
         provider_message_id = COALESCE(p_provider_message_id, provider_message_id),
         last_error          = CASE WHEN p_sent THEN NULL ELSE left(p_error, 500) END,
         sent_at             = CASE WHEN p_sent THEN now() ELSE sent_at END,
         lease_expires_at    = NULL,
         updated_at          = now()
   WHERE application_id    = p_application_id
     AND notification_type = p_notification_type
     AND status            = 'pending'
     AND claim_token       = p_claim_token
  RETURNING true INTO updated;

  -- false means the lease was lost: a newer run owns this notification and
  -- this one must not report an outcome for it.
  RETURN COALESCE(updated, false);
END;
$$;

COMMENT ON FUNCTION public.resolve_notification(uuid, text, uuid, boolean, text, text) IS
    'Records the outcome only if the caller still owns the lease. Returns false when the claim was taken over by a newer run.';

REVOKE ALL ON FUNCTION public.claim_notification(uuid, text, integer, integer) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_notification(uuid, text, uuid, boolean, text, text) FROM anon, authenticated;

-- ---------- Operational view ----------

CREATE OR REPLACE VIEW public.notifications_needing_review
WITH (security_invoker = true) AS
SELECT application_id, notification_type, status, attempts, last_error, updated_at
  FROM public.notification_log
 WHERE (status = 'pending' AND updated_at < now() - interval '24 hours')
    OR (status = 'failed' AND attempts >= 5);

COMMENT ON VIEW public.notifications_needing_review IS
    'Notifications past the point of safe automatic retry. A pending row older than 24h is outside Resend''s idempotency window, so resending could duplicate a message that was actually delivered — inspect before acting.';
