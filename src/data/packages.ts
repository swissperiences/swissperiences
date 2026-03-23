export interface PackageData {
  id: string;
  name: string;
  duration: string;
  price: string;
  soloPrice?: string;
  couplePrice?: string;
  groupPrice?: string;
  tagline: string;
  description: string;
  includes: string[];
  previewIncludes: string[];
  highlights: string[];
  groupSize: string;
  availability: string;
  image: string;
  imagePosition?: string;
  /** Optional badge for event-tied packages (e.g. "Pride Edition", "Tulip Festival") */
  eventBadge?: string;
  /** Specific event dates, shown alongside the badge (e.g. "25–28 Jun 2026") */
  eventDates?: string;
}

/*
 * Package ordering strategy (updated Mar 2026):
 *
 * 1–3: Event-tied packages (time-sensitive, ordered by soonest date)
 * 4–7: Core packages (evergreen or in-season, by broad appeal)
 * 8–10: Seasonal / niche (off-season or minimal)
 *
 * Homepage shows slice(0, 8). Reorder when seasons change.
 */
export const packages: PackageData[] = [
  // ── Event-tied (time-sensitive) ────────────────────────────────
  {
    id: "jazz-alps",
    name: "The Jazz & Alps",
    duration: "1 night",
    price: "From CHF 290",
    soloPrice: "CHF 290",
    couplePrice: "CHF 450",
    tagline: "Live music, then silence.",
    description:
      "One night built around the Montreux Jazz Festival Spotlight Sessions — held at the Théâtre du Villars Palace, a five-minute walk from the loft. Arrive, settle in, walk to the show, and return to the Alps when the last note fades. No transfers, no logistics. Just music at altitude.",
    previewIncludes: ["The Sanctuary Loft", "MJF Spotlight Session ticket", "Pre-show aperitif"],
    includes: [
      "1 night at The Sanctuary Loft",
      "MJF Spotlight Session ticket (1 show)",
      "Pre-show aperitif at the loft — wine & local cheese",
      "Curated Villars walking route for the morning after",
    ],
    highlights: ["Venue is a 5-min walk from the loft", "Our most accessible package", "Extend to 2 nights on request"],
    groupSize: "1 – 2 guests",
    availability: "3–4 April 2026",
    image: "/images/villars/loft-fireplace-evening.jpeg",
    eventBadge: "MJF Spotlight",
    eventDates: "3–4 Apr 2026",
  },
  {
    id: "tulip-trail",
    name: "The Tulip Trail",
    duration: "2 nights",
    price: "From CHF 590",
    soloPrice: "CHF 590",
    couplePrice: "CHF 890",
    groupPrice: "CHF 1,190",
    tagline: "Colour below, silence above.",
    description:
      "Two nights timed to the Fête de la Tulipe in Morges — over 140,000 tulips across 350 varieties blooming along the lakeshore. Drive down from Villars through the vineyards, wander the floral trails of Parc de l'Indépendance, and return to the Alps before the crowds notice you left. The 2026 edition follows the theme 'Contes et Légendes' — fairy tales woven through the gardens.",
    previewIncludes: ["The Sanctuary Loft", "Fête de la Tulipe visit", "Lavaux vineyard drive"],
    includes: [
      "2 nights at The Sanctuary Loft",
      "Fête de la Tulipe — Morges (self-guided, free entry)",
      "Scenic drive through Lavaux vineyards",
      "Welcome provisions — bread, cheese, spring wines",
      "Curated walking map of Morges old town",
    ],
    highlights: ["Late March — early May only", "The easiest weekend escape we offer", "Lake Geneva + Alps in one stay"],
    groupSize: "1 – 4 guests",
    availability: "March — May",
    image: "/images/lake-geneva/sunset-golden.jpeg",
    eventBadge: "Tulip Festival",
    eventDates: "27 Mar – 10 May 2026",
  },
  {
    id: "lakeshore-alps",
    name: "The Lakeshore & Alps",
    duration: "3 nights",
    price: "From CHF 990",
    soloPrice: "CHF 990",
    couplePrice: "CHF 1,590",
    groupPrice: "CHF 2,190",
    tagline: "From the festivities to the silence.",
    description:
      "Three nights between altitude and the lakeshore, timed to Lausanne Pride 2026 — the first Romandie Pride in Lausanne in twenty years. Arrive when the city pulses, retreat to the Alps when you need silence. Private wine tastings in the Lavaux UNESCO vineyards, a half-day cruise on Lac Léman, a guided alpine hike, and a curated welcome hamper waiting at the loft. Nothing scheduled that isn't wanted.",
    previewIncludes: ["The Sanctuary Loft", "Lavaux wine tasting", "Lake cruise", "Private transfers"],
    includes: [
      "3 nights at The Sanctuary Loft",
      "Private Lavaux wine tasting (2 domaines)",
      "Lake Geneva cruise (half-day)",
      "Guided alpine hike (half-day, private)",
      "Curated welcome hamper — wines, cheese, charcuterie",
      "Private transfer — GVA ↔ Villars",
    ],
    highlights: ["First Edition — Lausanne Pride 2026", "Villars is 45 min from Lausanne", "Solo-friendly & couples welcome"],
    groupSize: "1 – 4 guests",
    availability: "25–28 June 2026",
    image: "/images/lake-geneva/lavaux-vineyards-sunset.jpeg",
    eventBadge: "Pride Edition",
    eventDates: "25–28 Jun 2026",
  },
  // ── Core packages (evergreen / in-season) ──────────────────────
  {
    id: "alpine-reset",
    name: "The Alpine Reset",
    duration: "3 nights",
    price: "From CHF 890",
    soloPrice: "CHF 890",
    couplePrice: "CHF 1,390",
    groupPrice: "CHF 1,790",
    tagline: "Silence, altitude, restoration.",
    description:
      "Three nights of deliberate stillness at 1,300 metres. Wake to the Alps, hike through valleys most visitors never see, and restore at a local thermal spa. This is not a holiday — it's a recalibration.",
    previewIncludes: ["The Sanctuary Loft", "Guided alpine hike", "Local thermal spa entry"],
    includes: [
      "3 nights at The Sanctuary Loft",
      "Guided alpine hike (half-day, private)",
      "Local thermal spa entry (full day)",
      "Welcome aperitif & local charcuterie",
      "Curated local dining recommendations",
    ],
    highlights: ["Perfect for solo travellers & couples", "Available year-round", "Minimum altitude: 1,300m"],
    groupSize: "1 – 4 guests",
    availability: "Year-round",
    image: "/images/villars/alpine-reset-lake.jpeg",
  },
  {
    id: "cinematic-weekend",
    name: "The Cinematic Weekend",
    duration: "2 nights",
    price: "From CHF 690",
    soloPrice: "CHF 690",
    couplePrice: "CHF 1,090",
    groupPrice: "CHF 1,490",
    tagline: "Your story, our lens.",
    description:
      "Two nights built around a cinematic road journey through the Swiss Alps. Professional drone filming captures the landscapes from perspectives reserved for eagles. You leave with memories and a film.",
    previewIncludes: ["The Sanctuary Loft", "Drone filming session", "Half-day road journey"],
    includes: [
      "2 nights at The Sanctuary Loft",
      "Professional drone filming session",
      "Half-day road journey (Cols des Alpes)",
      "Edited cinematic highlight reel (delivered within 14 days)",
      "Light breakfast provisions",
    ],
    highlights: ["Unique to Swissperiences", "Solo or duo — your story, your pace", "Professional 4K footage"],
    groupSize: "1 – 4 guests",
    availability: "April — November (weather dependent)",
    image: "/images/drone/cinematic-alpine-road.jpeg",
  },
  {
    id: "alpine-bloom",
    name: "The Alpine Bloom",
    duration: "3 nights",
    price: "From CHF 890",
    soloPrice: "CHF 890",
    couplePrice: "CHF 1,390",
    groupPrice: "CHF 1,790",
    tagline: "Wildflowers, altitude, renewal.",
    description:
      "Three nights timed to the brief window when the Alps come alive. The snow retreats, the meadows bloom, and the trails empty out. A guided wildflower hike with a local botanist, a morning at an alpine cheese farm, and a thermal spa session to close. Spring in the mountains is not a season — it's a secret.",
    previewIncludes: ["The Sanctuary Loft", "Guided wildflower hike", "Alpine cheese farm visit"],
    includes: [
      "3 nights at The Sanctuary Loft",
      "Guided wildflower hike with local botanist (half-day)",
      "Alpine cheese farm visit with tasting",
      "Thermal spa entry (full day)",
      "Welcome aperitif with local spring wines",
      "Curated trail map for independent exploration",
    ],
    highlights: ["Available April — June only", "Solo-friendly — no single supplements", "The Alps at their most vivid"],
    groupSize: "1 – 4 guests",
    availability: "April — June",
    image: "/images/villars/dawn-fog-chalets.jpeg",
  },
  {
    id: "vineyard-valley",
    name: "The Vineyard & Valley",
    duration: "4 nights",
    price: "From CHF 1,290",
    soloPrice: "CHF 1,290",
    couplePrice: "CHF 1,990",
    groupPrice: "CHF 2,690",
    tagline: "From the peaks to the terraces.",
    description:
      "Four nights that move between altitude and lakeside. Start in Villars at 1,300m, then descend to the Lavaux UNESCO vineyards for a private tasting above Lac Léman. A lake cruise, a guided ridge hike, and a founder-hosted dinner at the loft round out a stay designed for those who want depth, not distance.",
    previewIncludes: ["The Sanctuary Loft", "Lavaux wine tasting", "Lake cruise", "Founder dinner"],
    includes: [
      "4 nights at The Sanctuary Loft",
      "Private Lavaux wine tasting (2 domaines)",
      "Lake Geneva cruise (half-day)",
      "Guided alpine hike (half-day)",
      "Founder-hosted dinner at the loft",
      "Welcome package with regional wines & cheese",
    ],
    highlights: ["Wine + mountains — the best of Vaud", "Works beautifully solo or as a couple", "Founder personally hosts the closing dinner"],
    groupSize: "1 – 4 guests",
    availability: "April — October",
    image: "/images/lake-geneva/sunset-golden.jpeg",
  },
  {
    id: "grand-tour",
    name: "The Grand Tour",
    duration: "5 nights",
    price: "From CHF 2,490",
    soloPrice: "CHF 2,490",
    couplePrice: "CHF 3,890",
    groupPrice: "CHF 4,890",
    tagline: "Everything. Unhurried.",
    description:
      "Five nights of complete immersion. The full road journey through three cantons, two curated dining evenings at hand-picked restaurants, a guided hike to a summit, and cinematic memories of it all. This is everything we do, distilled into one stay.",
    previewIncludes: ["The Sanctuary Loft", "Full road journey", "Premium dining", "Guided hike", "Cinematic memories"],
    includes: [
      "5 nights at The Sanctuary Loft",
      "Full road journey (2 days, 3 cantons)",
      "2 premium dining experiences (curated restaurants)",
      "Guided alpine hike (full day)",
      "Cinematic drone filming & edited highlight reel",
      "Welcome aperitif & Swiss wine selection",
      "Thermal spa experience",
    ],
    highlights: ["Our most complete experience", "Perfect solo or with company", "Everything personally curated"],
    groupSize: "1 – 6 guests",
    availability: "Year-round (road journey: April — November)",
    image: "/images/drone/villars-autumn-sunset.jpg",
    imagePosition: "object-[center_35%]",
  },
  // ── Seasonal / niche ───────────────────────────────────────────
  {
    id: "spring-reset",
    name: "The Spring Reset",
    duration: "2 nights",
    price: "From CHF 490",
    soloPrice: "CHF 490",
    couplePrice: "CHF 790",
    groupPrice: "CHF 990",
    tagline: "Less is enough.",
    description:
      "Two nights of deliberate simplicity. The loft, one guided morning hike, and nothing else planned. No spa bookings, no dinner reservations, no schedule. Just the balcony, the mountains turning green, and the permission to do absolutely nothing. The shortest stay we offer — and often the one guests remember most.",
    previewIncludes: ["The Sanctuary Loft", "Guided morning hike", "Nothing else"],
    includes: [
      "2 nights at The Sanctuary Loft",
      "Guided morning hike (2–3 hours)",
      "Welcome provisions (bread, cheese, wine)",
      "Curated silence — no scheduled activities",
    ],
    highlights: ["Our most minimal package — by design", "Ideal for solo travellers", "The Alps without the itinerary"],
    groupSize: "1 – 2 guests",
    availability: "March — June",
    image: "/images/villars/sea-of-clouds-sunset.jpeg",
  },
  {
    id: "winter-escape",
    name: "The Winter Escape",
    duration: "4 nights",
    price: "From CHF 1,490",
    soloPrice: "CHF 1,490",
    couplePrice: "CHF 2,290",
    groupPrice: "CHF 2,990",
    tagline: "Snow, warmth, ritual.",
    description:
      "Four nights that follow the rhythm of winter in Villars. Ski the uncrowded slopes, soak in natural thermal baths, and end with a traditional fondue evening by the fireplace. The cold outside makes the warmth inside feel earned.",
    previewIncludes: ["The Sanctuary Loft", "2-day ski pass", "Thermal baths", "Fondue evening"],
    includes: [
      "4 nights at The Sanctuary Loft",
      "2-day ski pass (Villars-Gryon-Diablerets)",
      "Thermal bath experience",
      "Fondue evening (private, by fireplace)",
      "Welcome package with Swiss wines",
      "Ski equipment rental available as add-on",
    ],
    highlights: ["Solo-friendly & great for couples", "Ski-in access", "Authentic, not resort-like"],
    groupSize: "1 – 4 guests",
    availability: "December — March",
    image: "/images/villars/winter-escape-ski-sunset.jpeg",
  },
];
