-- ============================================================
-- RPC: admin_add_blocked_date_range
-- Blocks all dates in a range (inclusive) for a sanctuary/experience.
-- Expands start_date..end_date into individual rows in blocked_dates.
-- Max 60 days per call.
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_add_blocked_date_range(
    p_type text,
    p_item_id text,
    p_start_date date,
    p_end_date date,
    p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_email text;
    day_count integer;
    inserted_count integer := 0;
    d date;
BEGIN
    -- Verify admin
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
    IF NOT EXISTS (SELECT 1 FROM public.admin_emails WHERE email = caller_email) THEN
        RETURN jsonb_build_object('error', 'Unauthorized');
    END IF;

    -- Validate type
    IF p_type NOT IN ('sanctuary', 'experience') THEN
        RETURN jsonb_build_object('error', 'Invalid type. Must be sanctuary or experience.');
    END IF;

    -- Validate date order
    IF p_start_date > p_end_date THEN
        RETURN jsonb_build_object('error', 'Start date must be on or before end date.');
    END IF;

    -- Validate not in the past
    IF p_start_date < CURRENT_DATE THEN
        RETURN jsonb_build_object('error', 'Cannot block past dates.');
    END IF;

    -- Validate max range (60 days)
    day_count := (p_end_date - p_start_date) + 1;
    IF day_count > 60 THEN
        RETURN jsonb_build_object('error', 'Maximum range is 60 days. You selected ' || day_count || ' days.');
    END IF;

    -- Insert each date in the range
    FOR d IN SELECT generate_series(p_start_date, p_end_date, '1 day'::interval)::date
    LOOP
        INSERT INTO public.blocked_dates (type, item_id, date, reason)
        VALUES (p_type, p_item_id, d, p_reason)
        ON CONFLICT (type, item_id, date) DO UPDATE SET reason = EXCLUDED.reason;
        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'days_blocked', inserted_count);
END;
$$;
