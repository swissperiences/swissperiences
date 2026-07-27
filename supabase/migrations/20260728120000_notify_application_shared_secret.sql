-- ============================================================
-- notify-application: authenticate the trigger, stop trusting the payload
--
-- Before this migration the trigger authenticated with the legacy anon JWT,
-- hardcoded in the function body and therefore readable in this public
-- repository. The Edge Function did no authorization of its own, so anyone
-- holding that public key could invoke it, choose the recipient of the
-- applicant email through `record.email`, and replay it without limit.
--
-- Three changes:
--   1. The trigger proves it is the caller with a shared secret read from
--      Vault (`NOTIFY_TRIGGER_SECRET`). The gateway JWT also moves to Vault
--      (`NOTIFY_GATEWAY_JWT`) so rotating it is a data change, not a code
--      change — the old hardcoded key would have broken this trigger the
--      moment the legacy keys were disabled.
--   2. The payload carries only `application_id`. The function re-reads every
--      field from the database, so the request can no longer decide who gets
--      mailed or what the email says.
--   3. `notification_log` makes replay a no-op: one row per
--      (application_id, notification_type).
--
-- Forward-only. The two earlier migrations stay as applied history.
-- The Edge Function keeps `verify_jwt = true`; the shared secret is an extra
-- layer, not a replacement for the gateway.
-- ============================================================

-- ---------- 1. Idempotency ledger ----------

CREATE TABLE IF NOT EXISTS public.notification_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    notification_type text NOT NULL,
    sent_at timestamptz NOT NULL DEFAULT now(),
    provider_message_id text,
    CONSTRAINT notification_log_type_check
        CHECK (notification_type IN ('applicant_ack', 'admin_alert'))
);

-- The uniqueness is the idempotency guarantee: a replayed trigger cannot
-- produce a second send. pg_net is fire-and-forget, so a delivery may well be
-- retried after the provider already accepted it.
CREATE UNIQUE INDEX IF NOT EXISTS notification_log_unique_per_type
    ON public.notification_log (application_id, notification_type);

CREATE INDEX IF NOT EXISTS notification_log_sent_at_idx
    ON public.notification_log (sent_at DESC);

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- No policies on purpose. Only the server-side key (which bypasses RLS)
-- touches this table; anon and authenticated must not read delivery history.
DROP POLICY IF EXISTS "notification_log_no_public_access" ON public.notification_log;

COMMENT ON TABLE public.notification_log IS
    'One row per notification actually accepted by the email provider. Unique on (application_id, notification_type) so a replayed trigger cannot send twice.';

-- ---------- 2. Trigger function ----------

CREATE OR REPLACE FUNCTION public.on_membership_application_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url  text := 'https://rhoxismvcalqppbnndew.supabase.co';
  gateway_jwt   text;
  shared_secret text;
BEGIN
  SELECT decrypted_secret INTO gateway_jwt
    FROM vault.decrypted_secrets WHERE name = 'NOTIFY_GATEWAY_JWT';
  SELECT decrypted_secret INTO shared_secret
    FROM vault.decrypted_secrets WHERE name = 'NOTIFY_TRIGGER_SECRET';

  -- Missing secrets must be loud in the Postgres log but must never block the
  -- application from being created. The row is the source of truth; the email
  -- can be replayed from it later.
  IF gateway_jwt IS NULL OR shared_secret IS NULL THEN
    RAISE WARNING '[notify-application] Vault secret missing (NOTIFY_GATEWAY_JWT and/or NOTIFY_TRIGGER_SECRET) — no notification sent for application %', NEW.id;
    RETURN NEW;
  END IF;

  -- Only the identifier travels. Everything the emails say is read back from
  -- the database by the function.
  PERFORM
    net.http_post(
      url := supabase_url || '/functions/v1/notify-application',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || gateway_jwt,
        'x-notify-secret', shared_secret
      ),
      body := jsonb_build_object('application_id', NEW.id)
    );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[notify-application] Edge function call failed: % — application: %', SQLERRM, NEW.id;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.on_membership_application_created() IS
    'Notifies the notify-application Edge Function. Authenticates with a Vault-stored shared secret and sends only the application id — never applicant-supplied fields.';
