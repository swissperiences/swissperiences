// TODO: Replace with generated types from `supabase gen types typescript`
// after applying migration 20260314000000_create_discovery_packs.sql

export type DiscoverySeason = "spring" | "summer" | "autumn" | "winter";
export type DiscoveryPackStatus = "draft" | "active" | "archived";

export interface DiscoveryPackInclude {
  id: string;
  pack_id: string;
  label_pt: string;
  label_en: string;
  icon_name: string;
  sort_order: number;
}

export interface DiscoveryPack {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  season: DiscoverySeason;
  price_chf: number;
  duration_days: number;
  max_guests: number;
  status: DiscoveryPackStatus;
  cover_image_url: string | null;
  highlight_event: string | null;
  event_dates: string | null; // Postgres daterange as string "[2025-03-27,2025-05-11]"
  created_at: string;
  discovery_pack_includes?: DiscoveryPackInclude[];
}
