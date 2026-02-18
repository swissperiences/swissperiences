-- ============================================================
-- Add estimated_price parameter to submit_booking RPC
-- The field already exists in the bookings table but was never
-- populated. Now the frontend calculates it before submission.
-- ============================================================

-- Drop old function signature (9 params) to avoid ambiguity
DROP FUNCTION IF EXISTS public.submit_booking(uuid, text, text, date, date, date, integer, text, integer);

CREATE OR REPLACE FUNCTION public.submit_booking(
    p_member_id uuid,
    p_sanctuary_id text DEFAULT NULL,
    p_experience_type text DEFAULT NULL,
    p_check_in date DEFAULT NULL,
    p_check_out date DEFAULT NULL,
    p_preferred_date date DEFAULT NULL,
    p_guests integer DEFAULT 1,
    p_special_requests text DEFAULT NULL,
    p_total_nights integer DEFAULT NULL,
    p_estimated_price numeric DEFAULT NULL
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
        guests, special_requests, total_nights,
        estimated_price, status
    ) VALUES (
        p_member_id, p_sanctuary_id, p_experience_type,
        p_check_in, p_check_out, p_preferred_date,
        p_guests, p_special_requests, p_total_nights,
        p_estimated_price, 'inquiry'
    )
    RETURNING id INTO v_booking_id;

    RETURN jsonb_build_object('success', true, 'booking_id', v_booking_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_booking(uuid, text, text, date, date, date, integer, text, integer, numeric) TO authenticated;
