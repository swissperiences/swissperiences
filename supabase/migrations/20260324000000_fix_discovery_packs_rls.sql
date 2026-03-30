-- ============================================================
-- Fix discovery_packs RLS: use is_admin() instead of jwt->>'email'
-- Also fix generate_discovery_slug missing SET search_path
-- ============================================================

-- 1. Fix admin policies on discovery_packs to use is_admin()
DROP POLICY IF EXISTS "Admin full access packs" ON discovery_packs;
CREATE POLICY "Admin full access packs"
  ON discovery_packs FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 2. Fix admin policies on discovery_pack_includes to use is_admin()
DROP POLICY IF EXISTS "Admin full access includes" ON discovery_pack_includes;
CREATE POLICY "Admin full access includes"
  ON discovery_pack_includes FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3. Fix generate_discovery_slug missing SET search_path
CREATE OR REPLACE FUNCTION generate_discovery_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate slug from English title
  base_slug := lower(regexp_replace(NEW.title_en, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);

  -- Ensure uniqueness
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM discovery_packs WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;
