-- ============================================================
-- Debug + Fix: Create an RPC to test booking INSERT bypassing RLS
-- This also ensures policies are absolutely clean
-- ============================================================

-- First, let's verify we have the right policies by dropping ALL and recreating
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Drop every policy on bookings table
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'bookings'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON bookings', pol.policyname);
    END LOOP;
END $$;

-- Recreate all policies fresh
-- INSERT: member must be active and inserting for themselves
CREATE POLICY "Members can create own bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (
        member_id IN (
            SELECT id FROM members
            WHERE auth_user_id = auth.uid()
            AND membership_status = 'active'
        )
    );

-- SELECT: member can see own bookings
CREATE POLICY "Members can view own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
        member_id IN (
            SELECT id FROM members
            WHERE auth_user_id = auth.uid()
        )
    );

-- UPDATE: member can update own bookings
CREATE POLICY "Members can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (
        member_id IN (
            SELECT id FROM members
            WHERE auth_user_id = auth.uid()
        )
    );

-- Admin SELECT all
CREATE POLICY "Admins can view all bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Admin UPDATE all
CREATE POLICY "Admins can update all bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================
-- RPC: submit_booking — SECURITY DEFINER to bypass RLS
-- Same pattern as get_member_profile: safe because it verifies
-- the authenticated user owns the member_id
-- ============================================================
CREATE OR REPLACE FUNCTION public.submit_booking(
    p_member_id uuid,
    p_sanctuary_id text DEFAULT NULL,
    p_experience_type text DEFAULT NULL,
    p_check_in date DEFAULT NULL,
    p_check_out date DEFAULT NULL,
    p_preferred_date date DEFAULT NULL,
    p_guests integer DEFAULT 1,
    p_special_requests text DEFAULT NULL,
    p_total_nights integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_member record;
    v_booking_id uuid;
BEGIN
    -- Verify auth
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('error', 'Not authenticated');
    END IF;

    -- Verify the member_id belongs to the authenticated user and is active
    SELECT id, membership_status INTO v_member
    FROM members
    WHERE id = p_member_id AND auth_user_id = v_user_id
    LIMIT 1;

    IF v_member IS NULL THEN
        RETURN jsonb_build_object('error', 'Member not found for this user');
    END IF;

    IF v_member.membership_status != 'active' THEN
        RETURN jsonb_build_object('error', 'Membership is not active');
    END IF;

    -- Validate booking type
    IF p_sanctuary_id IS NULL AND p_experience_type IS NULL THEN
        RETURN jsonb_build_object('error', 'Must specify sanctuary or experience');
    END IF;

    -- Insert the booking
    INSERT INTO bookings (
        member_id, sanctuary_id, experience_type,
        check_in, check_out, preferred_date,
        guests, special_requests, total_nights, status
    ) VALUES (
        p_member_id, p_sanctuary_id, p_experience_type,
        p_check_in, p_check_out, p_preferred_date,
        p_guests, p_special_requests, p_total_nights, 'inquiry'
    )
    RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_booking TO authenticated;
