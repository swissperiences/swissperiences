-- ============================================================
-- RPC: admin_update_booking_status — SECURITY DEFINER
-- Same pattern as admin_update_application_status
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_update_booking_status(
    p_booking_id uuid,
    p_new_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_email text;
    v_booking record;
BEGIN
    -- Verify admin
    v_user_email := (SELECT email FROM auth.users WHERE id = auth.uid());

    IF v_user_email IS NULL OR NOT EXISTS (SELECT 1 FROM admin_emails WHERE email = v_user_email) THEN
        RAISE EXCEPTION 'Unauthorized: admin access required';
    END IF;

    -- Validate status
    IF p_new_status NOT IN ('inquiry', 'confirmed', 'cancelled', 'completed') THEN
        RAISE EXCEPTION 'Invalid status: %', p_new_status;
    END IF;

    -- Get booking
    SELECT * INTO v_booking FROM bookings WHERE id = p_booking_id;
    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found';
    END IF;

    -- Update
    UPDATE bookings
    SET status = p_new_status
    WHERE id = p_booking_id;

    RETURN jsonb_build_object('success', true, 'status', p_new_status);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_booking_status TO authenticated;
