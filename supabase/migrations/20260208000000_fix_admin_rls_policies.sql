-- Migration: Fix Admin RLS Policies
-- Description: Create reusable is_admin() function and lock down all admin tables.
-- Issues fixed:
--   CRITICAL: admin_tasks/admin_concepts accessible by ANY authenticated user
--   CRITICAL: admin_inventory/admin_partners have no RLS policies
--   CRITICAL: corporate_inquiries has SELECT USING(false) blocking admin reads
--   CRITICAL: corporate_inquiries has no UPDATE policy (status changes fail silently)

-- ============================================================
-- 1. CREATE REUSABLE is_admin() FUNCTION
-- Single source of truth for admin email list.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND email = ANY(ARRAY[
            'cv@lux-sanctuary.com',
            'admin@swissperiences.com',
            'cauehvidal@gmail.com'
        ])
    );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================
-- 2. Ensure admin_tasks table exists (may have been created outside migrations)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Operations',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policy and create admin-only
DROP POLICY IF EXISTS "Admin full access tasks" ON admin_tasks;

CREATE POLICY "Admin full access tasks"
    ON admin_tasks
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================
-- 3. Ensure admin_concepts table exists
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_concepts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date_target TEXT,
    description TEXT,
    assets_req TEXT,
    status TEXT DEFAULT 'idea',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_concepts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access concepts" ON admin_concepts;

CREATE POLICY "Admin full access concepts"
    ON admin_concepts
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================
-- 4. Ensure admin_inventory exists + admin-only policy
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    pillar_score INTEGER CHECK (pillar_score >= 1 AND pillar_score <= 5),
    management_fee_rate DECIMAL(5,2) DEFAULT 30.00,
    nightly_rate_base DECIMAL(10,2),
    status TEXT DEFAULT 'scouting',
    owner_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_inventory ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE pol RECORD; BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'admin_inventory'
    LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON admin_inventory', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Admin full access inventory"
    ON admin_inventory
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Seed data (only if empty)
INSERT INTO admin_inventory (name, location, status, management_fee_rate, pillar_score)
SELECT * FROM (VALUES
    ('Villars Sky Loft', 'Villars-sur-Ollon', 'active', 30.00::decimal, 5),
    ('Verbier Sanctuary', 'Verbier', 'scouting', 35.00::decimal, 5),
    ('Zermatt Glass House', 'Zermatt', 'scouting', 35.00::decimal, 4)
) AS v(name, location, status, management_fee_rate, pillar_score)
WHERE NOT EXISTS (SELECT 1 FROM admin_inventory LIMIT 1);

-- ============================================================
-- 5. Ensure admin_partners exists + admin-only policy
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    base_cost_estimate TEXT,
    region TEXT,
    ethos_verified BOOLEAN DEFAULT FALSE,
    contact_details JSONB,
    last_service_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_partners ENABLE ROW LEVEL SECURITY;

DO $$ DECLARE pol RECORD; BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'admin_partners'
    LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON admin_partners', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Admin full access partners"
    ON admin_partners
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Seed data (only if empty)
INSERT INTO admin_partners (name, service_type, region, commission_rate, ethos_verified)
SELECT * FROM (VALUES
    ('Marc Leroux', 'Private Chef', 'Valais', 20.00::decimal, true),
    ('Elena Fischer', 'Mountain Guide', 'Bernese Oberland', 15.00::decimal, true),
    ('Swiss Transfer Pro', 'Logistics', 'Geneva', 10.00::decimal, false)
) AS v(name, service_type, region, commission_rate, ethos_verified)
WHERE NOT EXISTS (SELECT 1 FROM admin_partners LIMIT 1);

-- ============================================================
-- 6. FIX corporate_inquiries: Add admin SELECT + UPDATE
-- ============================================================
DROP POLICY IF EXISTS "Users cannot read inquiries" ON corporate_inquiries;

DROP POLICY IF EXISTS "Admin can read inquiries" ON corporate_inquiries;
CREATE POLICY "Admin can read inquiries"
    ON corporate_inquiries
    FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admin can update inquiries" ON corporate_inquiries;
CREATE POLICY "Admin can update inquiries"
    ON corporate_inquiries
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================
-- 7. Ensure status column exists on corporate_inquiries
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'corporate_inquiries'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE corporate_inquiries ADD COLUMN status TEXT DEFAULT 'new';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'corporate_inquiries'
        AND column_name = 'newsletter_opt_in'
    ) THEN
        ALTER TABLE corporate_inquiries ADD COLUMN newsletter_opt_in BOOLEAN DEFAULT false;
    END IF;
END $$;
