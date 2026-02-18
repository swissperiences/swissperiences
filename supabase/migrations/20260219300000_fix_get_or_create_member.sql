-- Fix get_or_create_member: use FOUND instead of IS NOT NULL for record checks
--
-- Root cause: In PostgreSQL, `record IS NOT NULL` returns FALSE if ANY column
-- in the record is NULL. membership_applications has nullable columns (e.g.
-- referral_source, motivation), so even when a row IS found, the record variable
-- evaluates as NOT "IS NOT NULL". Using FOUND is the correct way to check if
-- SELECT INTO returned a row.

CREATE OR REPLACE FUNCTION public.get_or_create_member()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_user_email text;
    v_member_record jsonb;
    v_application record;
BEGIN
    -- Get the authenticated user's ID and email
    v_user_id := auth.uid();
    v_user_email := (SELECT email FROM auth.users WHERE id = v_user_id);

    IF v_user_id IS NULL OR v_user_email IS NULL THEN
        RETURN jsonb_build_object('status', 'no_session');
    END IF;

    -- Step 1: Try to find member by auth_user_id
    SELECT jsonb_build_object(
        'membership_status', m.membership_status,
        'auth_user_id', m.auth_user_id,
        'email', m.email,
        'full_name', m.full_name
    ) INTO v_member_record
    FROM members m
    WHERE m.auth_user_id = v_user_id
    LIMIT 1;

    -- Step 2: If not found by auth_user_id, try by email
    IF v_member_record IS NULL THEN
        SELECT jsonb_build_object(
            'membership_status', m.membership_status,
            'auth_user_id', m.auth_user_id,
            'email', m.email,
            'full_name', m.full_name
        ) INTO v_member_record
        FROM members m
        WHERE m.email = v_user_email
        LIMIT 1;

        -- If found by email but auth_user_id is missing, link it
        IF v_member_record IS NOT NULL AND (v_member_record->>'auth_user_id') IS NULL THEN
            UPDATE members
            SET auth_user_id = v_user_id
            WHERE email = v_user_email AND auth_user_id IS NULL;

            -- Re-fetch after update
            v_member_record := v_member_record || jsonb_build_object('auth_user_id', v_user_id);
        END IF;
    END IF;

    -- Step 3: If member found, return it
    -- Note: v_member_record is jsonb (not record), so IS NOT NULL works correctly
    IF v_member_record IS NOT NULL THEN
        RETURN jsonb_build_object(
            'status', 'found',
            'member', v_member_record
        );
    END IF;

    -- Step 4: No member found. Check for approved application
    -- Use FOUND instead of IS NOT NULL (record with nullable columns)
    SELECT * INTO v_application
    FROM membership_applications
    WHERE email = v_user_email AND status = 'approved'
    LIMIT 1;

    IF FOUND THEN
        -- Auto-heal: create member record
        INSERT INTO members (email, full_name, city, country, membership_tier, membership_status, auth_user_id, application_id)
        VALUES (
            v_application.email,
            v_application.full_name,
            v_application.city,
            v_application.country,
            'founding',
            'active',
            v_user_id,
            v_application.id
        )
        ON CONFLICT (email) DO UPDATE
        SET auth_user_id = v_user_id,
            membership_status = 'active'
        WHERE members.auth_user_id IS NULL;

        RETURN jsonb_build_object(
            'status', 'created',
            'member', jsonb_build_object(
                'membership_status', 'active',
                'auth_user_id', v_user_id,
                'email', v_application.email,
                'full_name', v_application.full_name
            )
        );
    END IF;

    -- Step 5: Check for pending application
    -- Use FOUND instead of IS NOT NULL (record with nullable columns)
    SELECT * INTO v_application
    FROM membership_applications
    WHERE email = v_user_email AND status = 'pending'
    LIMIT 1;

    IF FOUND THEN
        RETURN jsonb_build_object('status', 'pending');
    END IF;

    -- Step 6: No application found
    RETURN jsonb_build_object('status', 'no_application');
END;
$$;

-- Ensure grant is still in place
GRANT EXECUTE ON FUNCTION public.get_or_create_member() TO authenticated;
