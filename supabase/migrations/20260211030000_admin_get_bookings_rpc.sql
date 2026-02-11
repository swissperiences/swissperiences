-- ============================================================
-- RPC: admin_get_bookings — SECURITY DEFINER to bypass RLS
-- Same pattern as admin_get_applications: verifies admin access
-- then returns all bookings with member info
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_get_bookings()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_email text;
    v_bookings jsonb;
BEGIN
    -- Verify admin
    v_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());

    IF v_user_email IS NULL OR NOT EXISTS (SELECT 1 FROM admin_emails WHERE email = v_user_email) THEN
        RAISE EXCEPTION 'Unauthorized: admin access required';
    END IF;

    -- Get all bookings with member info
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', b.id,
            'member_id', b.member_id,
            'sanctuary_id', b.sanctuary_id,
            'experience_type', b.experience_type,
            'check_in', b.check_in,
            'check_out', b.check_out,
            'preferred_date', b.preferred_date,
            'guests', b.guests,
            'special_requests', b.special_requests,
            'status', b.status,
            'total_nights', b.total_nights,
            'estimated_price', b.estimated_price,
            'created_at', b.created_at,
            'member_name', m.full_name,
            'member_email', m.email
        ) ORDER BY b.created_at DESC
    ), '[]'::jsonb) INTO v_bookings
    FROM bookings b
    LEFT JOIN members m ON m.id = b.member_id;

    RETURN v_bookings;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_bookings() TO authenticated;
