-- ============================================================
-- Member Profile Edit: add columns + update RPC
-- ============================================================

-- 1. Add new columns to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE members ADD COLUMN IF NOT EXISTS preferences text;

-- 2. Update get_member_profile to include new fields
CREATE OR REPLACE FUNCTION public.get_member_profile()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_user_email text;
    v_member jsonb;
BEGIN
    v_user_id := auth.uid();
    v_user_email := (SELECT email FROM auth.users WHERE id = v_user_id);

    IF v_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT jsonb_build_object(
        'id', m.id,
        'full_name', m.full_name,
        'email', m.email,
        'avatar_url', m.avatar_url,
        'city', m.city,
        'country', m.country,
        'phone', m.phone,
        'bio', m.bio,
        'preferences', m.preferences,
        'membership_tier', m.membership_tier,
        'membership_status', m.membership_status,
        'joined_at', m.joined_at
    ) INTO v_member
    FROM members m
    WHERE m.auth_user_id = v_user_id OR m.email = v_user_email
    LIMIT 1;

    RETURN v_member;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_member_profile() TO authenticated;

-- 3. Create update_member_profile RPC (SECURITY DEFINER — only updates own profile)
CREATE OR REPLACE FUNCTION public.update_member_profile(
    p_full_name text DEFAULT NULL,
    p_city text DEFAULT NULL,
    p_country text DEFAULT NULL,
    p_phone text DEFAULT NULL,
    p_bio text DEFAULT NULL,
    p_preferences text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_member_id uuid;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('error', 'Not authenticated');
    END IF;

    -- Find member for this auth user
    SELECT id INTO v_member_id
    FROM members
    WHERE auth_user_id = v_user_id
    LIMIT 1;

    IF v_member_id IS NULL THEN
        RETURN jsonb_build_object('error', 'Member not found');
    END IF;

    -- Update only non-null fields
    UPDATE members SET
        full_name = COALESCE(p_full_name, full_name),
        city = COALESCE(p_city, city),
        country = COALESCE(p_country, country),
        phone = COALESCE(p_phone, phone),
        bio = COALESCE(p_bio, bio),
        preferences = COALESCE(p_preferences, preferences),
        updated_at = NOW()
    WHERE id = v_member_id;

    RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_member_profile(text, text, text, text, text, text) TO authenticated;
