-- Migration: Fix notify-application trigger (v2)
-- Problem: The trigger could not get an auth key from request.headers or
-- current_setting in the trigger context, so the edge function call always failed.
--
-- Solution: Use the project's anon key directly. The anon key is public by design
-- (it's embedded in every client-side JS bundle), so hardcoding it here is safe.

CREATE OR REPLACE FUNCTION public.on_membership_application_created()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://rhoxismvcalqppbnndew.supabase.co';
  -- Anon key (public, same as in the client JS bundle)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_membership_application_created_trigger ON membership_applications;
CREATE TRIGGER on_membership_application_created_trigger
  AFTER INSERT ON membership_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.on_membership_application_created();
