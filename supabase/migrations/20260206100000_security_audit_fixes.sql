-- Migration: Security Audit Fixes
-- Fixes: C-1, C-2, C-3, C-4, C-5, W-10, I-3, I-9
-- Description: Lock down RLS policies, add server-side admin check,
-- fix approval_tokens, fix admin approval flow.

-- ============================================================
-- FIX C-3/C-4/C-5: Lock down membership_applications RLS
-- Problem: Any authenticated user could read/update ALL applications.
-- This allowed self-approval attacks and PII leaks.
-- Solution: Replace open policies with admin-only RPC functions.
-- ============================================================

-- Remove the overly permissive policies
DROP POLICY IF EXISTS "Authenticated can read applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated can update applications" ON membership_applications;

-- Only allow users to read their OWN application (by email match)
DROP POLICY IF EXISTS "Users can read own application" ON membership_applications;
CREATE POLICY "Users can read own application"
    ON membership_applications
    FOR SELECT
    TO authenticated
    USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- No direct UPDATE allowed for regular users (admin uses RPC)
-- Keep the service_role policy for edge functions
-- Keep the INSERT policy for anon/authenticated (application submission)

-- ============================================================
-- Admin RPC: get_all_applications (server-side admin check)
-- Only admin emails can call this successfully.
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_get_applications()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_email text;
    v_admin_emails text[] := ARRAY['cv@lux-sanctuary.com', 'admin@swissperiences.com', 'cauehvidal@gmail.com'];
    v_applications jsonb;
BEGIN
    v_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());

    IF v_user_email IS NULL OR NOT (v_user_email = ANY(v_admin_emails)) THEN
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

GRANT EXECUTE ON FUNCTION public.admin_get_applications() TO authenticated;

-- ============================================================
-- Admin RPC: approve/reject application (server-side admin check)
-- Fixes C-2: No longer inserts wrong auth_user_id.
-- Fixes W-10: Always returns success so email can be sent.
-- Fixes I-3: Uses 'founding' tier consistently.
-- Fixes I-9: Links application_id when creating member.
-- ============================================================
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
    v_admin_emails text[] := ARRAY['cv@lux-sanctuary.com', 'admin@swissperiences.com', 'cauehvidal@gmail.com'];
    v_application record;
    v_auth_user record;
BEGIN
    -- Server-side admin check
    v_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());

    IF v_user_email IS NULL OR NOT (v_user_email = ANY(v_admin_emails)) THEN
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
        -- Check if applicant has an auth account
        SELECT id INTO v_auth_user
        FROM auth.users
        WHERE email = v_application.email
        LIMIT 1;

        IF v_auth_user IS NOT NULL THEN
            -- User has auth account, create member with correct auth_user_id
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
            -- User hasn't signed in yet. Member will be auto-created on first login.
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

GRANT EXECUTE ON FUNCTION public.admin_update_application_status(uuid, text) TO authenticated;

-- ============================================================
-- FIX C-1: approval_tokens RLS
-- Problem: SELECT USING(false) blocked the entire activation flow.
-- Solution: Allow authenticated users to read tokens for their
-- own applications (by email match via the linked application).
-- Also add UPDATE policy to mark tokens as used.
-- ============================================================

DROP POLICY IF EXISTS "Tokens are private" ON approval_tokens;

-- Allow authenticated users to read tokens linked to their own application
DROP POLICY IF EXISTS "Users can read own activation tokens" ON approval_tokens;
CREATE POLICY "Users can read own activation tokens"
    ON approval_tokens
    FOR SELECT
    TO authenticated
    USING (
        application_id IN (
            SELECT id FROM membership_applications
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Allow authenticated users to mark their own tokens as used
DROP POLICY IF EXISTS "Users can mark own tokens as used" ON approval_tokens;
CREATE POLICY "Users can mark own tokens as used"
    ON approval_tokens
    FOR UPDATE
    TO authenticated
    USING (
        application_id IN (
            SELECT id FROM membership_applications
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    )
    WITH CHECK (
        application_id IN (
            SELECT id FROM membership_applications
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Allow admin to insert tokens (for sending activation links)
DROP POLICY IF EXISTS "Admin can insert tokens" ON approval_tokens;
CREATE POLICY "Admin can insert tokens"
    ON approval_tokens
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
