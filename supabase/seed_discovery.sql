-- ============================================================
-- Seed: Spring 2025 Discovery Packs
-- ============================================================

-- Pack 1: Morges Tulip Festival
INSERT INTO discovery_packs (
  title_pt, title_en, season, price_chf, duration_days, max_guests,
  status, highlight_event, event_dates, cover_image_url
) VALUES (
  'Festival das Tulipas de Morges',
  'Morges Tulip Festival',
  'spring',
  480.00,
  1,
  6,
  'active',
  'Festival des Tulipes de Morges',
  '[2025-03-27, 2025-05-11]',
  NULL -- cover image to be added
) ON CONFLICT (slug) DO NOTHING;

-- Pack 1 includes
WITH pack AS (
  SELECT id FROM discovery_packs WHERE slug = 'morges-tulip-festival-spring-2025'
)
INSERT INTO discovery_pack_includes (pack_id, label_pt, label_en, icon_name, sort_order)
SELECT pack.id, vals.*
FROM pack, (VALUES
  ('Transfer privado Genebra → Morges (Range Rover)', 'Private transfer Geneva → Morges (Range Rover)', 'car', 1),
  ('Passeio guiado entre 120 mil tulipas', 'Guided walk among 120,000 tulips', 'flower-2', 2),
  ('Almoço à beira do lago em brasserie curada', 'Lakeside lunch at a curated brasserie', 'utensils', 3),
  ('Paradas fotográficas no passeio do Lac Léman', 'Photo stops on Lac Léman promenade', 'camera', 4)
) AS vals(label_pt, label_en, icon_name, sort_order);

-- Pack 2: Montreux Narcissus Fields
INSERT INTO discovery_packs (
  title_pt, title_en, season, price_chf, duration_days, max_guests,
  status, highlight_event, event_dates, cover_image_url
) VALUES (
  'Campos de Narcisos de Montreux',
  'Montreux Narcissus Fields',
  'spring',
  390.00,
  1,
  4,
  'active',
  'Narcisses de Montreux',
  '[2025-04-25, 2025-05-25]',
  NULL -- cover image to be added
) ON CONFLICT (slug) DO NOTHING;

-- Pack 2 includes
WITH pack AS (
  SELECT id FROM discovery_packs WHERE slug = 'montreux-narcissus-fields-spring-2025'
)
INSERT INTO discovery_pack_includes (pack_id, label_pt, label_en, icon_name, sort_order)
SELECT pack.id, vals.*
FROM pack, (VALUES
  ('Transfer privado Genebra → Montreux', 'Private transfer Geneva → Montreux', 'car', 1),
  ('Trilha pelos campos de narcisos acima do lago', 'Hike through narcissus fields above the lake', 'mountain', 2),
  ('Parada no Château de Chillon (horário privilegiado: 9h)', 'Château de Chillon stop (insider timing: arrive 9am)', 'castle', 3),
  ('Piquenique alpino com produtos locais', 'Alpine picnic with local produce', 'sandwich', 4)
) AS vals(label_pt, label_en, icon_name, sort_order);
