-- ============================================================
-- Blocked Dates table
-- Allows admin to manually block dates for sanctuaries/experiences
-- (maintenance, holidays, owner use, etc.)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('sanctuary', 'experience')),
    item_id text NOT NULL,
    date date NOT NULL,
    reason text,
    created_at timestamptz DEFAULT now()
);

-- Unique constraint: same item can't have duplicate blocked date
ALTER TABLE public.blocked_dates
    ADD CONSTRAINT blocked_dates_unique_item_date UNIQUE (type, item_id, date);

-- Enable RLS
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Admin-only policies (using admin_emails table)
CREATE POLICY "admin_select_blocked_dates" ON public.blocked_dates
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_emails ae
            WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

CREATE POLICY "admin_insert_blocked_dates" ON public.blocked_dates
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_emails ae
            WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

CREATE POLICY "admin_delete_blocked_dates" ON public.blocked_dates
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_emails ae
            WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- ============================================================
-- RPC: get_blocked_dates (public, anyone authenticated can read)
-- Members need to see blocked dates to know what's unavailable
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_blocked_dates(
    p_type text,
    p_item_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Any authenticated user can read blocked dates (needed for calendar)
    IF auth.uid() IS NULL THEN
        RETURN '[]'::jsonb;
    END IF;

    SELECT COALESCE(jsonb_agg(to_char(bd.date, 'YYYY-MM-DD')), '[]'::jsonb)
    INTO result
    FROM public.blocked_dates bd
    WHERE bd.type = p_type
      AND bd.item_id = p_item_id
      AND bd.date >= CURRENT_DATE;

    RETURN result;
END;
$$;

-- ============================================================
-- RPC: admin_add_blocked_date
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_add_blocked_date(
    p_type text,
    p_item_id text,
    p_date date,
    p_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_email text;
    new_id uuid;
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

    -- Validate date is in the future
    IF p_date < CURRENT_DATE THEN
        RETURN jsonb_build_object('error', 'Cannot block past dates.');
    END IF;

    -- Insert (ON CONFLICT do nothing for duplicates)
    INSERT INTO public.blocked_dates (type, item_id, date, reason)
    VALUES (p_type, p_item_id, p_date, p_reason)
    ON CONFLICT (type, item_id, date) DO UPDATE SET reason = EXCLUDED.reason
    RETURNING id INTO new_id;

    RETURN jsonb_build_object('success', true, 'id', new_id);
END;
$$;

-- ============================================================
-- RPC: admin_remove_blocked_date
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_remove_blocked_date(
    p_blocked_date_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_email text;
BEGIN
    -- Verify admin
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
    IF NOT EXISTS (SELECT 1 FROM public.admin_emails WHERE email = caller_email) THEN
        RETURN jsonb_build_object('error', 'Unauthorized');
    END IF;

    DELETE FROM public.blocked_dates WHERE id = p_blocked_date_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- RPC: admin_get_all_blocked_dates (for admin panel)
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_get_all_blocked_dates()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    caller_email text;
    result jsonb;
BEGIN
    -- Verify admin
    SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
    IF NOT EXISTS (SELECT 1 FROM public.admin_emails WHERE email = caller_email) THEN
        RETURN '[]'::jsonb;
    END IF;

    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'id', bd.id,
            'type', bd.type,
            'item_id', bd.item_id,
            'date', to_char(bd.date, 'YYYY-MM-DD'),
            'reason', bd.reason,
            'created_at', bd.created_at
        ) ORDER BY bd.date ASC
    ), '[]'::jsonb)
    INTO result
    FROM public.blocked_dates bd;

    RETURN result;
END;
$$;
