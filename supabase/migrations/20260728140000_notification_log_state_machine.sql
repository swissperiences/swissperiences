-- ============================================================
-- notification_log: pending → sent | failed
--
-- The first version claimed a notification by inserting a row and released the
-- claim only when the provider answered with a non-OK status. If the fetch
-- threw instead — network error, timeout, the runtime being torn down — the
-- claim survived and every later replay was skipped, so the email was lost
-- silently. Exactly the failure mode this table exists to prevent.
--
-- A row now carries an explicit state. Only 'sent' blocks a retry; 'pending'
-- and 'failed' are reclaimable. The claim is a single atomic statement so two
-- concurrent runs cannot both win it.
-- ============================================================

ALTER TABLE public.notification_log
    ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_error text,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.notification_log
    DROP CONSTRAINT IF EXISTS notification_log_status_check;
ALTER TABLE public.notification_log
    ADD CONSTRAINT notification_log_status_check
    CHECK (status IN ('pending', 'sent', 'failed'));

-- Rows written by the previous version only ever existed after a successful
-- send (a failure deleted them), so they are 'sent'.
UPDATE public.notification_log SET status = 'sent' WHERE status = 'pending' AND provider_message_id IS NOT NULL;

COMMENT ON COLUMN public.notification_log.status IS
    'pending = claimed, outcome unknown (a crash mid-send leaves this, and it is retryable); sent = the provider accepted it; failed = the provider rejected it, retryable.';
COMMENT ON COLUMN public.notification_log.provider_message_id IS
    'Set after the provider accepts. NULL on a sent row means the send succeeded but the id could not be persisted — the mail went out, do not resend.';

-- ---------- Atomic claim ----------

CREATE OR REPLACE FUNCTION public.claim_notification(
    p_application_id uuid,
    p_notification_type text,
    p_max_attempts integer DEFAULT 5
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed boolean;
BEGIN
  -- One statement, so concurrent callers serialise on the unique index and
  -- exactly one of them gets a row back.
  INSERT INTO public.notification_log (application_id, notification_type, status, attempts)
  VALUES (p_application_id, p_notification_type, 'pending', 1)
  ON CONFLICT (application_id, notification_type) DO UPDATE
     SET status     = 'pending',
         attempts   = public.notification_log.attempts + 1,
         updated_at = now()
   WHERE public.notification_log.status <> 'sent'
     AND public.notification_log.attempts < p_max_attempts
  RETURNING true INTO claimed;

  RETURN COALESCE(claimed, false);
END;
$$;

COMMENT ON FUNCTION public.claim_notification(uuid, text, integer) IS
    'Claims one notification for sending. Returns false when it was already sent or has exhausted its attempts.';

-- ---------- Outcome ----------

CREATE OR REPLACE FUNCTION public.resolve_notification(
    p_application_id uuid,
    p_notification_type text,
    p_sent boolean,
    p_provider_message_id text DEFAULT NULL,
    p_error text DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.notification_log
     SET status              = CASE WHEN p_sent THEN 'sent' ELSE 'failed' END,
         provider_message_id = COALESCE(p_provider_message_id, provider_message_id),
         last_error          = CASE WHEN p_sent THEN NULL ELSE left(p_error, 500) END,
         sent_at             = CASE WHEN p_sent THEN now() ELSE sent_at END,
         updated_at          = now()
   WHERE application_id = p_application_id
     AND notification_type = p_notification_type;
$$;

COMMENT ON FUNCTION public.resolve_notification(uuid, text, boolean, text, text) IS
    'Records the outcome of a claimed notification. A row left pending means the sender died mid-flight; it stays retryable.';

REVOKE ALL ON FUNCTION public.claim_notification(uuid, text, integer) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.resolve_notification(uuid, text, boolean, text, text) FROM anon, authenticated;
