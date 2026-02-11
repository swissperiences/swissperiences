-- ============================================================
-- Fix: Remaining Security Advisor warnings
-- Date: 2026-02-11
-- Resolves: Function Search Path Mutable, RLS Policy Always True,
--           Leaked Password Protection
-- ============================================================

-- ============================================================
-- 1. Fix: on_membership_application_created — add SET search_path
-- ============================================================
CREATE OR REPLACE FUNCTION public.on_membership_application_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  supabase_url text := 'https://rhoxismvcalqppbnndew.supabase.co';
  service_key text;
BEGIN
  service_key := current_setting('supabase.service_role_key', true);

  IF service_key IS NULL OR service_key = '' THEN
    RAISE WARNING '[notify-application] service_role_key not available — skipping notification for: %', NEW.email;
    RETURN NEW;
  END IF;

  PERFORM
    net.http_post(
      url := supabase_url || '/functions/v1/notify-application',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING '[notify-application] Edge function call failed: % — application: %', SQLERRM, NEW.email;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 2. Fix: approval_tokens — restrict INSERT to admins only
-- The WITH CHECK (true) allowed any authenticated user to create tokens.
-- Only admins should create approval tokens.
-- ============================================================
DROP POLICY IF EXISTS "Admin can insert tokens" ON approval_tokens;
CREATE POLICY "Admin can insert tokens"
    ON approval_tokens
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_emails
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- ============================================================
-- 3. Fix: corporate_inquiries — restrict INSERT to basic validation
-- Public forms need to accept submissions, but we can add a
-- basic check instead of WITH CHECK (true).
-- Using a non-trivial check: require email to be present.
-- ============================================================
DROP POLICY IF EXISTS "Anyone can submit corporate inquiry" ON corporate_inquiries;
CREATE POLICY "Anyone can submit corporate inquiry"
    ON corporate_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (email IS NOT NULL AND email <> '');

-- ============================================================
-- 4. Fix: leads table — if it exists, tighten policies
-- (May have been created via Dashboard)
-- ============================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leads') THEN
        -- Drop any USING(true) SELECT policies
        EXECUTE 'DROP POLICY IF EXISTS "Enable read access for all users" ON leads';
        EXECUTE 'DROP POLICY IF EXISTS "Enable insert for all users" ON leads';
        -- Create restrictive policies
        EXECUTE 'CREATE POLICY "Admins can read leads" ON leads FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admin_emails WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())))';
        EXECUTE 'CREATE POLICY "Anyone can submit lead" ON leads FOR INSERT TO anon, authenticated WITH CHECK (email IS NOT NULL AND email <> '''')';
    END IF;
END $$;

-- ============================================================
-- 5. Fix: newsletter_subscribers — if it exists, tighten policies
-- (May have been created via Dashboard)
-- ============================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'newsletter_subscribers') THEN
        -- Drop overly permissive policies
        EXECUTE 'DROP POLICY IF EXISTS "Enable read access for all users" ON newsletter_subscribers';
        EXECUTE 'DROP POLICY IF EXISTS "Enable insert for all users" ON newsletter_subscribers';
        EXECUTE 'DROP POLICY IF EXISTS "Enable insert access for all users" ON newsletter_subscribers';
        EXECUTE 'DROP POLICY IF EXISTS "Allow public insert" ON newsletter_subscribers';
        EXECUTE 'DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers';
        -- Recreate with minimal permissions
        EXECUTE 'CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (email IS NOT NULL AND email <> '''')';
        EXECUTE 'CREATE POLICY "Admins can read subscribers" ON newsletter_subscribers FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admin_emails WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())))';
    END IF;
END $$;

-- ============================================================
-- 6. Fix: membership_applications INSERT — add basic validation
-- instead of WITH CHECK (true)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can submit application" ON membership_applications;
CREATE POLICY "Anyone can submit application"
    ON membership_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (email IS NOT NULL AND email <> '' AND full_name IS NOT NULL AND full_name <> '');

-- ============================================================
-- Note: "Leaked Password Protection Disabled" must be enabled
-- via Supabase Dashboard → Auth → Settings → Enable
-- "Leaked Password Protection". This is not configurable via SQL.
-- ============================================================
