-- ============================================================
-- notification_log: bound retries by the provider's idempotency window
--
-- Three gaps left by the lease patch:
--
-- 1. A 409 from Resend was always treated as retryable. Two different errors
--    hide behind that status: concurrent_idempotent_requests (another delivery
--    is in flight — retry later) and invalid_idempotent_request (the same key
--    was reused with a different payload — retrying forever cannot fix it).
--    The second now lands in 'needs_review'.
--
-- 2. A lease of 120s and a cap of 5 attempts do not by themselves keep retries
--    inside Resend's 24h key retention: a 'failed' row with two attempts can
--    sit for two days and then be reclaimed, at which point the key no longer
--    deduplicates and a resend could duplicate a delivered email. The window
--    is now explicit and checked on every reclaim.
--
-- 3. payload_hash records what was actually sent, so an
--    invalid_idempotent_request can be confirmed as a genuine payload change
--    (admin list, subject, template, or an edited application field).
-- ============================================================

ALTER TABLE public.notification_log
    ADD COLUMN IF NOT EXISTS first_claimed_at timestamptz,
    ADD COLUMN IF NOT EXISTS idempotency_expires_at timestamptz,
    ADD COLUMN IF NOT EXISTS payload_hash text;

UPDATE public.notification_log
   SET first_claimed_at = COALESCE(first_claimed_at, sent_at, updated_at),
       idempotency_expires_at = COALESCE(idempotency_expires_at, COALESCE(sent_at, updated_at) + interval '24 hours')
 WHERE first_claimed_at IS NULL OR idempotency_expires_at IS NULL;

ALTER TABLE public.notification_log DROP CONSTRAINT IF EXISTS notification_log_status_check;
ALTER TABLE public.notification_log
    ADD CONSTRAINT notification_log_status_check
    CHECK (status IN ('pending', 'sent', 'failed', 'needs_review'));

COMMENT ON COLUMN public.notification_log.idempotency_expires_at IS
    'When the Resend idempotency key stops deduplicating. After this, an automatic retry could duplicate a delivered email, so no reclaim is allowed.';
COMMENT ON COLUMN public.notification_log.payload_hash IS
    'SHA-256 of the payload last sent under this idempotency key. A mismatch explains an invalid_idempotent_request.';

-- ---------- Claim ----------

DROP FUNCTION IF EXISTS public.claim_notification(uuid, text, integer, integer);

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
      application_id, notification_type, status, attempts,
      claim_token, lease_expires_at, first_claimed_at, idempotency_expires_at
  )
  VALUES (
      p_application_id, p_notification_type, 'pending', 1,
      gen_random_uuid(), now() + make_interval(secs => p_lease_seconds),
      now(), now() + interval '24 hours'
  )
  ON CONFLICT (application_id, notification_type) DO UPDATE
     SET status           = 'pending',
         claim_token      = EXCLUDED.claim_token,
         lease_expires_at = EXCLUDED.lease_expires_at,
         attempts         = public.notification_log.attempts + 1,
         updated_at       = now()
   WHERE public.notification_log.attempts < p_max_attempts
     -- Past the provider's window a retry is no longer deduplicated, so it is
     -- a manual decision rather than an automatic one.
     AND now() < public.notification_log.idempotency_expires_at
     AND (
           public.notification_log.status = 'failed'
        OR (
              public.notification_log.status = 'pending'
          AND public.notification_log.lease_expires_at < now()
           )
         )
  RETURNING public.notification_log.claim_token INTO token;

  -- NULL: already sent, needs review, still leased, out of attempts, or past
  -- the idempotency window.
  RETURN token;
END;
$$;

COMMENT ON FUNCTION public.claim_notification(uuid, text, integer, integer) IS
    'Takes a lease and returns its token, or NULL when the notification is sent, under review, still leased, out of attempts, or past the 24h idempotency window.';

-- ---------- Resolve ----------

DROP FUNCTION IF EXISTS public.resolve_notification(uuid, text, uuid, boolean, text, text);

CREATE OR REPLACE FUNCTION public.resolve_notification(
    p_application_id uuid,
    p_notification_type text,
    p_claim_token uuid,
    p_outcome text,
    p_provider_message_id text DEFAULT NULL,
    p_error text DEFAULT NULL,
    p_payload_hash text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated boolean;
BEGIN
  IF p_outcome NOT IN ('sent', 'failed', 'needs_review') THEN
    RAISE EXCEPTION 'invalid outcome: %', p_outcome;
  END IF;

  UPDATE public.notification_log
     SET status              = p_outcome,
         provider_message_id = COALESCE(p_provider_message_id, provider_message_id),
         payload_hash        = COALESCE(p_payload_hash, payload_hash),
         last_error          = CASE WHEN p_outcome = 'sent' THEN NULL ELSE left(p_error, 500) END,
         sent_at             = CASE WHEN p_outcome = 'sent' THEN now() ELSE sent_at END,
         lease_expires_at    = NULL,
         updated_at          = now()
   WHERE application_id    = p_application_id
     AND notification_type = p_notification_type
     AND status            = 'pending'
     AND claim_token       = p_claim_token
  RETURNING true INTO updated;

  RETURN COALESCE(updated, false);
END;
$$;

COMMENT ON FUNCTION public.resolve_notification(uuid, text, uuid, text, text, text, text) IS
    'Records an outcome (sent | failed | needs_review) only while the caller holds the matching lease token. False means ownership was lost.';

REVOKE ALL ON FUNCTION public.claim_notification(uuid, text, integer, integer) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_notification(uuid, text, uuid, text, text, text, text) FROM anon, authenticated;

-- ---------- Operational view ----------

-- Dropped rather than replaced: CREATE OR REPLACE VIEW cannot add or reorder
-- columns, and this version returns more than the previous one.
DROP VIEW IF EXISTS public.notifications_needing_review;

CREATE VIEW public.notifications_needing_review
WITH (security_invoker = true) AS
SELECT application_id, notification_type, status, attempts, last_error,
       payload_hash, first_claimed_at, idempotency_expires_at, updated_at,
       CASE
         WHEN status = 'needs_review' THEN 'idempotency key reused with a different payload'
         WHEN idempotency_expires_at <= now() THEN 'past the 24h idempotency window — resending may duplicate a delivered email'
         ELSE 'retries exhausted'
       END AS reason
  FROM public.notification_log
 WHERE status <> 'sent'
   AND (
         status = 'needs_review'
      OR idempotency_expires_at <= now()
      OR attempts >= 5
       );

COMMENT ON VIEW public.notifications_needing_review IS
    'Notifications that must not be retried automatically. Anything past its idempotency window may already have been delivered — inspect before resending.';
