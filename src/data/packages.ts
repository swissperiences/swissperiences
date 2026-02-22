export interface PackageData {
  id: string;
  name: string;
  duration: string;
  price: string;
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
    price: "From CHF 1,800",
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
    highlights: ["Best for solo travellers & couples", "Available year-round", "Minimum altitude: 1,300m"],
    groupSize: "1 – 4 guests",
    availability: "Year-round",
    image: "/images/caueh-vidal-spring.jpg",
    imagePosition: "object-[center_25%]",
  },
  {
    id: "winter-escape",
    name: "The Winter Escape",
    duration: "4 nights",
    price: "From CHF 2,500",
    tagline: "Snow, warmth, ritual.",
    description:
      "Four nights that follow the rhythm of winter in Villars. Ski the uncrowded slopes, soak in natural thermal baths, and end with a traditional fondue evening by the fireplace. The cold outside makes the warmth inside feel earned.",
    previewIncludes: ["The Sanctuary Loft", "4-day ski pass", "Thermal baths", "Fondue evening"],
    includes: [
      "4 nights at The Sanctuary Loft",
      "4-day ski pass (Villars-Gryon-Diablerets)",
      "Thermal bath experience",
      "Fondue evening (private, by fireplace)",
      "Welcome package with Swiss wines",
      "Transfer from nearest station",
    ],
    highlights: ["Best for couples & small groups", "Ski-in access", "Authentic, not resort-like"],
    groupSize: "1 – 4 guests",
    availability: "December — March",
    image: "/images/villars/ski-villars-slopes.jpeg",
  },
  {
    id: "cinematic-weekend",
    name: "The Cinematic Weekend",
    duration: "2 nights",
    price: "From CHF 1,500",
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
    highlights: ["Unique to Swissperiences", "Perfect for special occasions", "Professional 4K footage"],
    groupSize: "1 – 4 guests",
    availability: "April — November (weather dependent)",
    image: "/images/drone/lake-brienz-aerial.jpg",
  },
  {
    id: "grand-tour",
    name: "The Grand Tour",
    duration: "5 nights",
    price: "From CHF 4,500",
    tagline: "Everything. Unhurried.",
    description:
      "Five nights of complete immersion. The full road journey through three cantons, a private chef for one evening, a guided hike to a summit, and cinematic memories of it all. This is everything we do, distilled into one stay.",
    previewIncludes: ["The Sanctuary Loft", "Full road journey", "Private chef", "Guided hike", "Cinematic memories"],
    includes: [
      "5 nights at The Sanctuary Loft",
      "Full road journey (2 days, 3 cantons)",
      "Private chef dinner (one evening)",
      "Guided alpine hike (full day)",
      "Cinematic drone filming & edited highlight reel",
      "Welcome aperitif & Swiss wine selection",
      "Curated dining & activity itinerary",
    ],
    highlights: ["Our most complete experience", "Best for milestone celebrations", "Everything personally curated"],
    groupSize: "1 – 6 guests",
    availability: "Year-round (road journey: April — November)",
    image: "/images/drone/villars-autumn-sunset.jpg",
  },
];
