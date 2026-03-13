-- ============================================================
-- Discovery Packs: fixed-price seasonal experience packs
-- ============================================================

-- Enable unaccent for slug generation
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Enums
DO $$ BEGIN
  CREATE TYPE discovery_season AS ENUM ('spring', 'summer', 'autumn', 'winter');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE discovery_pack_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Main table
CREATE TABLE IF NOT EXISTS discovery_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title_pt TEXT NOT NULL,
  title_en TEXT NOT NULL,
  season discovery_season NOT NULL,
  price_chf NUMERIC(8,2) NOT NULL,
  duration_days INT NOT NULL,
  max_guests INT NOT NULL,
  status discovery_pack_status NOT NULL DEFAULT 'draft',
  cover_image_url TEXT,
  highlight_event TEXT,
  event_dates DATERANGE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Includes (what's in the pack)
CREATE TABLE IF NOT EXISTS discovery_pack_includes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID NOT NULL REFERENCES discovery_packs(id) ON DELETE CASCADE,
  label_pt TEXT NOT NULL,
  label_en TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discovery_packs_status ON discovery_packs(status);
CREATE INDEX IF NOT EXISTS idx_discovery_packs_season ON discovery_packs(season);
CREATE INDEX IF NOT EXISTS idx_discovery_includes_pack ON discovery_pack_includes(pack_id);

-- ============================================================
-- Slug auto-generation trigger
-- Generates: {title_en_slugified}-{season}-{year}
-- Only fires when slug is NULL on INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION generate_discovery_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  year_suffix TEXT;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Slugify title_en: unaccent → strip non-alphanumeric → collapse spaces → lowercase
    base_slug := lower(
      trim(
        regexp_replace(
          regexp_replace(
            unaccent(NEW.title_en),
            '[^a-zA-Z0-9\s-]', '', 'g'
          ),
          '\s+', '-', 'g'
        ),
        '-'
      )
    );

    -- Extract year from event_dates if available, otherwise use current year
    IF NEW.event_dates IS NOT NULL THEN
      year_suffix := EXTRACT(YEAR FROM lower(NEW.event_dates))::TEXT;
    ELSE
      year_suffix := EXTRACT(YEAR FROM NOW())::TEXT;
    END IF;

    NEW.slug := base_slug || '-' || NEW.season || '-' || year_suffix;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_discovery_slug ON discovery_packs;
CREATE TRIGGER trg_discovery_slug
  BEFORE INSERT ON discovery_packs
  FOR EACH ROW EXECUTE FUNCTION generate_discovery_slug();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE discovery_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_pack_includes ENABLE ROW LEVEL SECURITY;

-- Public can read active packs
DROP POLICY IF EXISTS "Public read active packs" ON discovery_packs;
CREATE POLICY "Public read active packs"
  ON discovery_packs FOR SELECT TO anon, authenticated
  USING (status = 'active');

-- Admin full access on packs
DROP POLICY IF EXISTS "Admin full access packs" ON discovery_packs;
CREATE POLICY "Admin full access packs"
  ON discovery_packs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt()->>'email'))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt()->>'email'));

-- Public can read includes for active packs
DROP POLICY IF EXISTS "Public read active includes" ON discovery_pack_includes;
CREATE POLICY "Public read active includes"
  ON discovery_pack_includes FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM discovery_packs WHERE id = pack_id AND status = 'active'));

-- Admin full access on includes
DROP POLICY IF EXISTS "Admin full access includes" ON discovery_pack_includes;
CREATE POLICY "Admin full access includes"
  ON discovery_pack_includes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt()->>'email'))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_emails WHERE email = auth.jwt()->>'email'));

-- Service role bypass (for edge function inserts via service_role key)
DROP POLICY IF EXISTS "Service role bypass packs" ON discovery_packs;
CREATE POLICY "Service role bypass packs"
  ON discovery_packs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role bypass includes" ON discovery_pack_includes;
CREATE POLICY "Service role bypass includes"
  ON discovery_pack_includes FOR ALL TO service_role USING (true) WITH CHECK (true);
