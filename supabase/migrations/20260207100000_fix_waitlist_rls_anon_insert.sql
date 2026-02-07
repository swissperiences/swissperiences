-- Disable RLS on waitlist table.
-- This table only stores newsletter signup emails — no sensitive data.
-- Anonymous users need to INSERT, and there's no need for row-level restrictions.

-- Drop all policies first (clean slate)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'waitlist' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON waitlist', pol.policyname);
    END LOOP;
END $$;

ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist NO FORCE ROW LEVEL SECURITY;

-- Grant insert to anon role explicitly
GRANT INSERT ON waitlist TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
