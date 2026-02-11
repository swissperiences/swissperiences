-- ============================================================
-- Fix: Notification trigger not sending emails
-- Problem: current_setting('supabase.service_role_key', true)
-- may return NULL in some contexts, causing the trigger to skip.
-- Solution: Use the anon key (public, already in frontend bundle)
-- since the notify-application Edge Function doesn't require
-- elevated privileges — it just sends emails via Resend.
-- ============================================================

CREATE OR REPLACE FUNCTION public.on_membership_application_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://rhoxismvcalqppbnndew.supabase.co';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJob3hpc212Y2FscXBwYm5uZGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMzY0NDMsImV4cCI6MjA4MTkxMjQ0M30.deevTxvGsEgx9eihvuj3KaRre9Goa2bOunmOZU2L7v0';
BEGIN
  PERFORM
    net.http_post(
      url := supabase_url || '/functions/v1/notify-application',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[notify-application] Edge function call failed: % — application: %', SQLERRM, NEW.email;
  RETURN NEW;
END;
$$;
