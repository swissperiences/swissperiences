-- Migration: Lock down waitlist table
-- Now that newsletter signups go through the edge function (service_role),
-- we can re-enable RLS and restrict access to admin only.

-- Re-enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist FORCE ROW LEVEL SECURITY;

-- Drop all existing policies
DO $$ DECLARE pol RECORD; BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'waitlist'
    LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist', pol.policyname);
    END LOOP;
END $$;

-- Only admin can read waitlist data
CREATE POLICY "Admin can read waitlist"
    ON waitlist
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- No direct INSERT from client (edge function uses service_role which bypasses RLS)
-- No UPDATE or DELETE needed
