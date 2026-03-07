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
}

export const packages: PackageData[] = [
  {
    id: "alpine-reset",
    name: "The Alpine Reset",
    duration: "3 nights",
    price: "From CHF 1,200",
    soloPrice: "CHF 1,200",
    couplePrice: "CHF 1,800",
    groupPrice: "CHF 2,400",
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
    image: "/images/caueh-vidal-spring.jpg",
    imagePosition: "object-[center_25%]",
  },
  {
    id: "winter-escape",
    name: "The Winter Escape",
    duration: "4 nights",
    price: "From CHF 1,600",
    soloPrice: "CHF 1,600",
    couplePrice: "CHF 2,500",
    groupPrice: "CHF 3,200",
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
    image: "/images/villars/ski-villars-slopes.jpeg",
  },
  {
    id: "cinematic-weekend",
    name: "The Cinematic Weekend",
    duration: "2 nights",
    price: "From CHF 950",
    soloPrice: "CHF 950",
    couplePrice: "CHF 1,500",
    groupPrice: "CHF 2,000",
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
    image: "/images/drone/lake-brienz-aerial.jpg",
  },
  {
    id: "grand-tour",
    name: "The Grand Tour",
    duration: "5 nights",
    price: "From CHF 3,000",
    soloPrice: "CHF 3,000",
    couplePrice: "CHF 4,500",
    groupPrice: "CHF 5,500",
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
  },
  {
    id: "alpine-bloom",
    name: "The Alpine Bloom",
    duration: "3 nights",
    price: "From CHF 1,200",
    soloPrice: "CHF 1,200",
    couplePrice: "CHF 1,800",
    groupPrice: "CHF 2,400",
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
    image: "/images/caueh-vidal-spring.jpg",
  },
  {
    id: "vineyard-valley",
    name: "The Vineyard & Valley",
    duration: "4 nights",
    price: "From CHF 1,800",
    soloPrice: "CHF 1,800",
    couplePrice: "CHF 2,800",
    groupPrice: "CHF 3,600",
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
    id: "spring-reset",
    name: "The Spring Reset",
    duration: "2 nights",
    price: "From CHF 850",
    soloPrice: "CHF 850",
    couplePrice: "CHF 1,300",
    groupPrice: "CHF 1,700",
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
];
