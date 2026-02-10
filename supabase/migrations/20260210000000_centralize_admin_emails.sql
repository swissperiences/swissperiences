-- ============================================================
-- Migration: Centralize admin emails in a dedicated table
-- Date: 2026-02-10
-- Purpose: Remove hardcoded admin email arrays from functions,
--          use a single source of truth (admin_emails table)
-- ============================================================

-- 1. Create admin_emails table
CREATE TABLE IF NOT EXISTS admin_emails (
    email text PRIMARY KEY,
    added_at timestamptz DEFAULT now()
);

-- Enable RLS — only service_role can write, is_admin can read
ALTER TABLE admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_emails FORCE ROW LEVEL SECURITY;

-- Seed the existing admin emails
INSERT INTO admin_emails (email) VALUES
    ('cv@lux-sanctuary.com'),
    ('admin@swissperiences.com'),
    ('cauehvidal@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Rewrite is_admin() to query the table instead of hardcoded array
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM auth.users u
        JOIN admin_emails ae ON ae.email = u.email
        WHERE u.id = auth.uid()
    );
$$;

-- 3. RLS for admin_emails: only admins can read, nobody can write via client
-- (write via migration or service_role only)
CREATE POLICY "Admin can read admin_emails"
    ON admin_emails
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- No INSERT/UPDATE/DELETE policies for authenticated — manage via migrations or dashboard

-- 4. Rewrite admin_get_applications() to use admin_emails table
CREATE OR REPLACE FUNCTION public.admin_get_applications()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_email text;
    v_applications jsonb;
BEGIN
    v_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());

    IF v_user_email IS NULL OR NOT EXISTS (SELECT 1 FROM admin_emails WHERE email = v_user_email) THEN
        RAISE EXCEPTION 'Unauthorized: admin access required';
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', a.id,
            'full_name', a.full_name,
            'email', a.email,
            'city', a.city,
            'country', a.country,
            'reason', a.reason,
            'referral_source', a.referral_source,
            'status', a.status,
            'created_at', a.created_at,
            'reviewed_at', a.reviewed_at
        ) ORDER BY a.created_at DESC
    ), '[]'::jsonb) INTO v_applications
    FROM membership_applications a;

    RETURN v_applications;
END;
$$;

-- 5. Rewrite admin_update_application_status() to use admin_emails table
CREATE OR REPLACE FUNCTION public.admin_update_application_status(
    p_application_id uuid,
    p_new_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_email text;
    v_application record;
    v_auth_user record;
BEGIN
    -- Server-side admin check using admin_emails table
    v_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());

    IF v_user_email IS NULL OR NOT EXISTS (SELECT 1 FROM admin_emails WHERE email = v_user_email) THEN
        RAISE EXCEPTION 'Unauthorized: admin access required';
    END IF;

    -- Validate status
    IF p_new_status NOT IN ('approved', 'rejected', 'waitlist') THEN
        RAISE EXCEPTION 'Invalid status: %', p_new_status;
    END IF;

    -- Get the application
    SELECT * INTO v_application
    FROM membership_applications
    WHERE id = p_application_id;

    IF v_application IS NULL THEN
        RAISE EXCEPTION 'Application not found';
    END IF;

    -- Update application status
    UPDATE membership_applications
    SET status = p_new_status,
        reviewed_by = v_user_email,
        reviewed_at = NOW()
    WHERE id = p_application_id;

    -- If approved, try to create member record
    IF p_new_status = 'approved' THEN
        SELECT id INTO v_auth_user
        FROM auth.users
        WHERE email = v_application.email
        LIMIT 1;

        IF v_auth_user IS NOT NULL THEN
            INSERT INTO members (
                email, full_name, city, country,
                membership_tier, membership_status,
                auth_user_id, application_id
            ) VALUES (
                v_application.email, v_application.full_name,
                v_application.city, v_application.country,
                'founding', 'active',
                v_auth_user.id, v_application.id
            )
            ON CONFLICT (email) DO UPDATE
            SET membership_status = 'active',
                auth_user_id = COALESCE(members.auth_user_id, v_auth_user.id),
                application_id = COALESCE(members.application_id, v_application.id);

            RETURN jsonb_build_object(
                'status', 'approved',
                'member_created', true,
                'email', v_application.email,
                'full_name', v_application.full_name
            );
        ELSE
            RETURN jsonb_build_object(
                'status', 'approved',
                'member_created', false,
                'email', v_application.email,
                'full_name', v_application.full_name
            );
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'status', p_new_status,
        'email', v_application.email,
        'full_name', v_application.full_name
    );
END;
$$;

-- 6. Rewrite the notification trigger to remove hardcoded anon key.
-- Use the service_role_key available via current_setting() in SECURITY DEFINER functions
-- on Supabase hosted projects. The project URL is public (same as in client bundle).
CREATE OR REPLACE FUNCTION public.on_membership_application_created()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://rhoxismvcalqppbnndew.supabase.co';
  service_key text;
BEGIN
  -- Service role key is available in Supabase hosted PG via this setting
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
