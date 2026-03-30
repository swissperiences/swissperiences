/**
 * Package data + drone clip mapping for promo reels.
 *
 * Drone clips are from tools/reel-forge/output/ — symlinked or copied
 * into public/ for Remotion's staticFile() to find them.
 *
 * Clip assignments based on visual match to each package's vibe:
 *   0001 (14s) — short alpine pan → Alpine Reset
 *   0002 (35s) — sweeping valley → Grand Tour
 *   0003 (35s) — mountain reveal → Alpine Bloom
 *   0004 (35s) — snow landscape → Winter Escape
 *   0005 (35s) — aerial village → Vineyard & Valley
 *   0009 (35s) — dramatic flight → Cinematic Weekend
 *   0011 (35s) — sunset glow → Spring Reset
 */
export interface PackageEntry {
  id: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  previewIncludes: string[];
  availability: string;
  droneClip: string;
}

export const packages: PackageEntry[] = [
  {
    id: "alpine-reset",
    name: "The Alpine Reset",
    tagline: "Silence, altitude, restoration.",
    price: "From CHF 890",
    duration: "3 nights",
    previewIncludes: ["The Sanctuary Loft", "Guided alpine hike", "Local thermal spa entry"],
    availability: "Year-round",
    droneClip: "DJI_20260225132459_0001_D_reel_cold.mp4",
  },
  {
    id: "winter-escape",
    name: "The Winter Escape",
    tagline: "Snow, warmth, ritual.",
    price: "From CHF 1,490",
    duration: "4 nights",
    previewIncludes: ["The Sanctuary Loft", "2-day ski pass", "Thermal baths", "Fondue evening"],
    availability: "December — March",
    droneClip: "DJI_20260225133004_0004_D_reel_cold.mp4",
  },
  {
    id: "cinematic-weekend",
    name: "The Cinematic Weekend",
    tagline: "Your story, our lens.",
    price: "From CHF 690",
    duration: "2 nights",
    previewIncludes: ["The Sanctuary Loft", "Drone filming session", "Half-day road journey"],
    availability: "April — November",
    droneClip: "DJI_20260225133941_0009_D_reel_cold.mp4",
  },
  {
    id: "grand-tour",
    name: "The Grand Tour",
    tagline: "Everything. Unhurried.",
    price: "From CHF 2,490",
    duration: "5 nights",
    previewIncludes: ["The Sanctuary Loft", "Full road journey", "Premium dining", "Guided hike", "Cinematic memories"],
    availability: "Year-round",
    droneClip: "DJI_20260225132526_0002_D_reel_cold.mp4",
  },
  {
    id: "alpine-bloom",
    name: "The Alpine Bloom",
    tagline: "Wildflowers, altitude, renewal.",
    price: "From CHF 890",
    duration: "3 nights",
    previewIncludes: ["The Sanctuary Loft", "Guided wildflower hike", "Alpine cheese farm visit"],
    availability: "April — June",
    droneClip: "DJI_20260225132726_0003_D_reel_cold.mp4",
  },
  {
    id: "vineyard-valley",
    name: "The Vineyard & Valley",
    tagline: "From the peaks to the terraces.",
    price: "From CHF 1,290",
    duration: "4 nights",
    previewIncludes: ["The Sanctuary Loft", "Lavaux wine tasting", "Lake cruise", "Founder dinner"],
    availability: "April — October",
    droneClip: "DJI_20260225133235_0005_D_reel_cold.mp4",
  },
  {
    id: "spring-reset",
    name: "The Spring Reset",
    tagline: "Less is enough.",
    price: "From CHF 490",
    duration: "2 nights",
    previewIncludes: ["The Sanctuary Loft", "Guided morning hike", "Nothing else"],
    availability: "March — June",
    droneClip: "DJI_20260225134426_0011_D_reel_cold.mp4",
  },
];
