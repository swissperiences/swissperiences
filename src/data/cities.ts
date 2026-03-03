export interface CityHighlight {
    icon: string;
    title: string;
    description: string;
}

export interface RelatedLink {
    title: string;
    href: string;
}

export interface CuratedActivity {
    title: string;
    type: string;
    href: string;
    duration?: string;
}

export interface City {
    slug: string;
    name: string;
    region: string;
    canton: string;
    coordinates: string;
    elevation: string;

    heroImage: string;
    heroPosition?: string;
    detailHeroImage?: string;
    detailHeroPosition?: string;
    tagline: string;
    description: string;

    highlights: CityHighlight[];

    relatedExperiences: RelatedLink[];
    relatedSanctuaries: RelatedLink[];
    relatedJournals: RelatedLink[];
    curatedActivities?: CuratedActivity[];

    seo: {
        title: string;
        description: string;
        keywords: string;
    };
}

const GYG_PARTNER = "XJZ4DP0";
function gyg(path: string, cmp: string) {
    return `https://www.getyourguide.com${path}?partner_id=${GYG_PARTNER}&utm_medium=online_publisher&utm_source=swissperiences&cmp=${cmp}`;
}

export const cities: City[] = [
    {
        slug: "geneva",
        name: "Geneva",
        region: "Lake Geneva Region",
        canton: "Geneva",
        coordinates: "046° 12' N / 006° 09' E",
        elevation: "375m",
        heroImage: "/images/drone/geneva-jet-deau-aerial.jpg",
        heroPosition: "object-[center_25%]",
        tagline: "Where every Swissperiences journey begins.",
        description: "Geneva is the cosmopolitan gateway to the Swiss Alps. Nestled at the southwestern tip of Lac Léman, this international city blends lakeside elegance with a refined cultural scene. For our guests, it serves as the perfect departure point — where urban sophistication meets the first whisper of alpine air.",
        highlights: [
            {
                icon: "Plane",
                title: "International Gateway",
                description: "Direct flights from major cities worldwide. Your alpine journey starts here."
            },
            {
                icon: "Wine",
                title: "Lakeside Sophistication",
                description: "World-class dining, historic Old Town, and the iconic Jet d'Eau on Lac Léman."
            },
            {
                icon: "Car",
                title: "Gateway to the Alps",
                description: "90 minutes to Villars. 2 hours to Zermatt. The perfect starting point for any itinerary."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [
            { title: "The Winter Ascent", href: "/journals/the-winter-ascent" },
            { title: "The Alpine Protocol", href: "/journals/the-alpine-protocol" }
        ],
        curatedActivities: [
            { title: "Lake Geneva Cruise", type: "Cruise", duration: "50 min", href: gyg("/geneva-l54/geneva-50-minute-lake-geneva-cruise-t292285/", "geneva") },
            { title: "Old Town, Chocolate & Lake Walking Tour", type: "Tour", duration: "3 hours", href: gyg("/geneva-l54/geneva-old-town-chocolate-lake-guided-walking-tour-t1033020/", "geneva") },
            { title: "Best of Geneva City Tour", type: "Tour", duration: "3 hours", href: gyg("/geneva-l54/best-of-geneva-city-tour-international-area-and-old-town-t4825/", "geneva") },
        ],
        seo: {
            title: "Geneva | Gateway to the Swiss Alps | Swissperiences",
            description: "Geneva is where every Swissperiences journey begins. Discover curated luxury experiences departing from Switzerland's cosmopolitan lakeside capital.",
            keywords: "geneva switzerland luxury, geneva travel experiences, swiss alps from geneva, lake geneva, geneva curated travel"
        }
    },
    {
        slug: "villars-sur-ollon",
        name: "Villars-sur-Ollon",
        region: "Vaud Alps",
        canton: "Vaud",
        coordinates: "046° 17' N / 007° 05' E",
        elevation: "1,300m",
        heroImage: "/images/villars/sea-of-clouds-sunset.jpeg",
        heroPosition: "object-[center_60%]",
        tagline: "Our home. Our first sanctuary.",
        description: "Perched at 1,300 meters in the Vaud Alps, Villars-sur-Ollon is a year-round alpine village with a rare combination of accessibility and serenity. Home to The Villars Loft — our first sanctuary — this is where Swissperiences was born. Ski-in proximity, panoramic sunsets over the Rhône Valley, and a pace of life that resets everything.",
        highlights: [
            {
                icon: "Home",
                title: "The Villars Loft",
                description: "Our flagship sanctuary. A designer loft with fireplace, sunset balcony, and steps from the pistes."
            },
            {
                icon: "Snowflake",
                title: "Year-Round Alpine",
                description: "Winter skiing, summer hiking, autumn foliage. Every season reveals a different character."
            },
            {
                icon: "Sun",
                title: "The Golden Hour",
                description: "Villars faces west. The sunsets over the Rhône Valley are legendary."
            }
        ],
        relatedExperiences: [
            { title: "Private Chef Experience", href: "/experiences/private-chef" },
            { title: "Cinematic Memories", href: "/experiences/cinematic-memories" }
        ],
        relatedSanctuaries: [
            { title: "The Villars Loft", href: "/sanctuaries/villars" }
        ],
        relatedJournals: [],
        curatedActivities: [
            { title: "Glacier 3000 Cable Car", type: "Adventure", duration: "Full day", href: gyg("/bernese-oberland-l71/glacier-3000-cable-car-roundtrip-ticket-t204637/", "villars-sur-ollon") },
            { title: "Glacier 3000 & Montreux Day Trip", type: "Day Trip", duration: "Full day", href: gyg("/geneva-l54/gold-tour-at-the-glacier-3000-and-montreux-t85871/", "villars-sur-ollon") },
            { title: "Diablerets & Glacier 3000 Day Trip", type: "Day Trip", duration: "Full day", href: gyg("/montreux-l32355/diablerets-riviera-col-du-pillon-glacier-3000-day-trip-t137591/", "villars-sur-ollon") },
        ],
        seo: {
            title: "Villars-sur-Ollon | Alpine Sanctuary | Swissperiences",
            description: "Villars-sur-Ollon is home to our first sanctuary — The Villars Loft. A designer alpine retreat at 1,300m in the Vaud Alps.",
            keywords: "villars sur ollon, swiss alpine village, villars loft, vaud alps accommodation, luxury ski chalet villars"
        }
    },
    {
        slug: "verbier",
        name: "Verbier",
        region: "Valais",
        canton: "Valais",
        coordinates: "046° 06' N / 007° 13' E",
        elevation: "1,500m",
        heroImage: "/images/verbier-mountains.jpg",
        heroPosition: "object-[center_40%]",
        tagline: "Where powder meets prestige.",
        description: "Verbier sits at 1,500 meters in the heart of Valais, renowned globally for its off-piste terrain and vibrant alpine culture. One of the world's most coveted ski destinations, it balances raw mountain energy with refined hospitality. Our next sanctuary is being curated here for 2027.",
        highlights: [
            {
                icon: "Mountain",
                title: "World-Class Terrain",
                description: "Over 400km of runs. Legendary off-piste. The Mont Fort glacier at 3,330m."
            },
            {
                icon: "Music",
                title: "Cultural Pulse",
                description: "Home to the Verbier Festival. A village where alpine tradition meets international culture."
            },
            {
                icon: "Compass",
                title: "Sanctuary 02 — Coming 2027",
                description: "Our second sanctuary is being curated in Verbier. A high-altitude residence for those who chase powder and peace."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" },
            { title: "Guided Hikes", href: "/experiences/guided-hikes" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [],
        curatedActivities: [
            { title: "Private Ski Lessons — All Levels", type: "Skiing", duration: "Half day", href: gyg("/verbier-l189157/private-ski-lessons-for-all-levels-verbier-t1139721/", "verbier") },
            { title: "Group Ski Lessons", type: "Skiing", duration: "Half day", href: gyg("/verbier-l189157/adult-group-lessons-verbier-t1140639/", "verbier") },
        ],
        seo: {
            title: "Verbier | High-Altitude Alpine Village | Swissperiences",
            description: "Verbier — where powder meets prestige. Discover curated experiences in one of the world's most coveted alpine destinations.",
            keywords: "verbier switzerland, verbier luxury, verbier ski, valais alps, verbier travel experiences"
        }
    },
    {
        slug: "zermatt",
        name: "Zermatt",
        region: "Valais",
        canton: "Valais",
        coordinates: "046° 01' N / 007° 45' E",
        elevation: "1,620m",
        heroImage: "/images/zermatt-matterhorn.jpg",
        heroPosition: "object-[center_20%]",
        tagline: "In the shadow of the Matterhorn.",
        description: "Zermatt is the car-free village at the foot of the most iconic mountain in the Alps. At 1,620 meters, surrounded by 29 peaks over 4,000m, it offers a concentration of alpine grandeur unmatched anywhere else. Our third sanctuary is planned here for 2028 — where solitude meets the sublime.",
        highlights: [
            {
                icon: "Mountain",
                title: "The Matterhorn",
                description: "4,478 meters of pure alpine mythology. The most photographed mountain in the world."
            },
            {
                icon: "Train",
                title: "Car-Free Village",
                description: "No cars. Electric taxis and the Gornergrat railway. The Alps as they should be experienced."
            },
            {
                icon: "Compass",
                title: "Sanctuary 03 — Coming 2028",
                description: "Our third sanctuary. At the foot of the Matterhorn, where grandeur meets solitude."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" },
            { title: "Cinematic Memories", href: "/experiences/cinematic-memories" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [],
        curatedActivities: [
            { title: "Gornergrat Cogwheel Train", type: "Train", duration: "Half day", href: gyg("/zermatt-l1514/zermatt-gornergrat-railway-cogwheel-train-ticket-t262127/", "zermatt") },
            { title: "Matterhorn Glacier Paradise", type: "Adventure", duration: "Half day", href: gyg("/zermatt-l1514/zermatt-discover-the-matterhorn-glacier-paradise-t394219/", "zermatt") },
            { title: "Paragliding with Matterhorn Views", type: "Adventure", duration: "1 hour", href: gyg("/zermatt-l1514/zermatt-paragliding-passenger-flight-with-matterhorn-views-t969350/", "zermatt") },
        ],
        seo: {
            title: "Zermatt | Matterhorn Village | Swissperiences",
            description: "Zermatt — the car-free alpine village beneath the Matterhorn. Discover curated experiences in Switzerland's most iconic mountain destination.",
            keywords: "zermatt switzerland, matterhorn, zermatt luxury, car-free alpine village, zermatt travel experiences"
        }
    },
    {
        slug: "interlaken",
        name: "Interlaken",
        region: "Bernese Oberland",
        canton: "Bern",
        coordinates: "046° 41' N / 007° 51' E",
        elevation: "568m",
        heroImage: "/images/drone/lake-brienz-aerial.jpg",
        heroPosition: "object-center",
        tagline: "Between two lakes, beneath three giants.",
        description: "Interlaken sits in the geographical heart of the Bernese Oberland, flanked by Lake Thun and Lake Brienz, with the Eiger, Mönch, and Jungfrau towering above. It is the gateway to the high alpine world — a place where turquoise waters meet vertical landscapes and every direction offers a new dimension of the Alps.",
        highlights: [
            {
                icon: "Waves",
                title: "Two Lakes",
                description: "Lake Thun and Lake Brienz — twin alpine jewels with impossibly turquoise waters."
            },
            {
                icon: "Mountain",
                title: "Jungfrau Region",
                description: "Gateway to the Eiger, Mönch, and Jungfrau. The Jungfraujoch — Top of Europe — at 3,454m."
            },
            {
                icon: "MapPin",
                title: "Alpine Crossroads",
                description: "The central hub connecting Grindelwald, Lauterbrunnen, and the high passes of the Oberland."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" },
            { title: "Guided Hikes", href: "/experiences/guided-hikes" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [
            { title: "The Winter Ascent", href: "/journals/the-winter-ascent" },
            { title: "The Return", href: "/journals/the-return" }
        ],
        curatedActivities: [
            { title: "Jungfraujoch — Top of Europe", type: "Day Trip", duration: "Full day", href: gyg("/interlaken-l793/from-interlaken-day-trip-to-jungfraujoch-t111106/", "interlaken") },
            { title: "Tandem Paragliding", type: "Adventure", duration: "1 hour", href: gyg("/interlaken-l793/interlaken-tandem-paragliding-flight-t780/", "interlaken") },
            { title: "Lake Thun & Brienz Boat Cruise", type: "Cruise", duration: "Full day", href: gyg("/interlaken-l793/attraction-ticket-day-pass-for-lake-thunbrienz-boat-cruise-t477132/", "interlaken") },
        ],
        seo: {
            title: "Interlaken | Heart of the Bernese Oberland | Swissperiences",
            description: "Interlaken — between two lakes, beneath three giants. The gateway to the Jungfrau region and the heart of the Swiss Alps.",
            keywords: "interlaken switzerland, bernese oberland, jungfrau region, lake thun, lake brienz, interlaken luxury travel"
        }
    },
    {
        slug: "lauterbrunnen",
        name: "Lauterbrunnen",
        region: "Bernese Oberland",
        canton: "Bern",
        coordinates: "046° 35' N / 007° 54' E",
        elevation: "795m",
        heroImage: "/images/lauterbrunnen-valley.jpg",
        heroPosition: "object-center",
        detailHeroImage: "/images/lauterbrunnen-staubbach.jpg",
        detailHeroPosition: "object-[center_30%]",
        tagline: "The valley of 72 waterfalls.",
        description: "Lauterbrunnen is a glacial valley carved between towering limestone cliffs, home to 72 waterfalls including the legendary Staubbach Falls. This is the landscape that inspired Tolkien's Rivendell — a place of vertical beauty, cascading water, and a silence so profound it changes you. Every Swissperiences journey through the Oberland passes through here.",
        highlights: [
            {
                icon: "Droplets",
                title: "72 Waterfalls",
                description: "Including the Staubbach Falls — 297 meters of free-falling water visible from the village floor."
            },
            {
                icon: "BookOpen",
                title: "Tolkien's Inspiration",
                description: "The valley that inspired Rivendell. Walk between the cliffs and you'll understand why."
            },
            {
                icon: "Camera",
                title: "Cinematic Valley",
                description: "One of the most photographed valleys in Europe. Every angle is a composition."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" },
            { title: "Cinematic Memories", href: "/experiences/cinematic-memories" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [
            { title: "The Winter Ascent", href: "/journals/the-winter-ascent" },
            { title: "The Return", href: "/journals/the-return" }
        ],
        curatedActivities: [
            { title: "Trümmelbach Falls & Mürren Hike", type: "Hiking", duration: "5 hours", href: gyg("/lauterbrunnen-l2863/hike-lauterbrunnen-murren-with-trummelbach-waterfalls-visit-t1043510/", "lauterbrunnen") },
            { title: "Jungfraujoch Roundtrip Train", type: "Train", duration: "Full day", href: gyg("/lauterbrunnen-l2863/from-lauterbrunnen-roundtrip-train-and-jungfraujoch-ticket-t456289/", "lauterbrunnen") },
            { title: "Schilthorn & Bond World 007", type: "Day Trip", duration: "Full day", href: gyg("/lausanne-l463/from-lausanne-spectacular-schilthorn-with-007-experience-t270077/", "lauterbrunnen") },
        ],
        seo: {
            title: "Lauterbrunnen | Valley of 72 Waterfalls | Swissperiences",
            description: "Lauterbrunnen — the valley of 72 waterfalls that inspired Tolkien. Discover curated experiences in Switzerland's most dramatic glacial valley.",
            keywords: "lauterbrunnen, lauterbrunnen valley, staubbach falls, 72 waterfalls, bernese oberland, tolkien rivendell switzerland"
        }
    },
    {
        slug: "montreux",
        name: "Montreux",
        region: "Lake Geneva Region",
        canton: "Vaud",
        coordinates: "046° 26' N / 006° 54' E",
        elevation: "390m",
        heroImage: "/images/lake-geneva/sunset-golden.jpeg",
        heroPosition: "object-[center_40%]",
        tagline: "The Swiss Riviera.",
        description: "Montreux stretches along the eastern shore of Lac Léman, sheltered by the Alps and warmed by a microclimate that allows palm trees to grow at the foot of mountains. Home to the legendary Jazz Festival, the Château de Chillon, and the Lavaux UNESCO vineyards, it is the intersection of Mediterranean warmth and alpine grandeur.",
        highlights: [
            {
                icon: "Music",
                title: "Jazz Capital",
                description: "Home to the Montreux Jazz Festival. Where Freddie Mercury found his creative sanctuary."
            },
            {
                icon: "Wine",
                title: "Lavaux Vineyards",
                description: "UNESCO World Heritage terraced vineyards cascading to the lake. A thousand years of viticulture."
            },
            {
                icon: "Castle",
                title: "Château de Chillon",
                description: "The most visited castle in Switzerland. A medieval fortress on the edge of Lac Léman."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [
            { title: "The Winter Ascent", href: "/journals/the-winter-ascent" }
        ],
        curatedActivities: [
            { title: "Château de Chillon Entrance", type: "Culture", duration: "2 hours", href: gyg("/montreux-l32355/montreux-entrance-ticket-to-fort-de-chillon-t532516/", "montreux") },
            { title: "Rochers-de-Naye Summit", type: "Train", duration: "Half day", href: gyg("/montreux-l32355/attraction-ticket-montreux-to-rochers-de-naye-t547366/", "montreux") },
            { title: "Lavaux Wine Tour", type: "Tasting", duration: "4 hours", href: gyg("/montreux-l32355/wine-tour-in-the-canton-of-vaud-lavaux-vineyards-t718850/", "montreux") },
            { title: "Freddie Mercury Walking Tour", type: "Tour", duration: "2 hours", href: gyg("/montreux-l32355/montreux-in-the-footsteps-of-freddie-mercury-t364460/", "montreux") },
        ],
        seo: {
            title: "Montreux | The Swiss Riviera | Swissperiences",
            description: "Montreux — the Swiss Riviera on Lac Léman. Jazz, vineyards, and Château de Chillon at the foot of the Alps.",
            keywords: "montreux switzerland, swiss riviera, montreux jazz, lavaux vineyards, chateau chillon, lake geneva"
        }
    },
    {
        slug: "lausanne",
        name: "Lausanne",
        region: "Lake Geneva Region",
        canton: "Vaud",
        coordinates: "046° 31' N / 006° 38' E",
        elevation: "495m",
        heroImage: "/images/lausanne-cathedral.jpg",
        heroPosition: "object-[center_60%]",
        tagline: "Olympic spirit, alpine soul.",
        description: "Lausanne rises in terraces from Lac Léman into the Jorat hills, a dynamic university city that hosts the International Olympic Committee. With its Gothic cathedral, vibrant Flon district, and position as the gateway to the Lavaux vineyards, it offers an urban energy unique in the Swiss landscape — cultured, youthful, and always looking forward.",
        highlights: [
            {
                icon: "Trophy",
                title: "Olympic Capital",
                description: "Home to the International Olympic Committee and the Olympic Museum on the lakefront."
            },
            {
                icon: "GraduationCap",
                title: "University City",
                description: "EPFL, University of Lausanne, and the EHL — a hub of innovation and hospitality education."
            },
            {
                icon: "Grape",
                title: "Gateway to Lavaux",
                description: "The UNESCO terraced vineyards begin at the city's eastern edge. Wine country on foot."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [],
        curatedActivities: [
            { title: "Olympic Museum", type: "Culture", duration: "2 hours", href: gyg("/lausanne-l463/switzerland-the-olympic-museum-entry-ticket-audio-guide-t409447/", "lausanne") },
            { title: "Lavaux Vineyard Experience", type: "Tasting", duration: "3 hours", href: gyg("/lausanne-l463/lavaux-vineyard-experience-t799474/", "lausanne") },
            { title: "Riviera & Lavaux Cruise", type: "Cruise", duration: "3 hours", href: gyg("/lausanne-l463/lausanne-3-hour-riviera-and-lavaux-region-cruise-t372775/", "lausanne") },
        ],
        seo: {
            title: "Lausanne | Olympic Capital on Lac Léman | Swissperiences",
            description: "Lausanne — Olympic capital, university hub, and gateway to the Lavaux vineyards on the shores of Lac Léman.",
            keywords: "lausanne switzerland, olympic capital, lausanne travel, lac leman, lavaux vineyards, lausanne luxury"
        }
    },
    {
        slug: "lucerne",
        name: "Lucerne",
        region: "Central Switzerland",
        canton: "Lucerne",
        coordinates: "047° 03' N / 008° 18' E",
        elevation: "436m",
        heroImage: "/images/lucerne-chapel-bridge.jpg",
        heroPosition: "object-[center_55%]",
        tagline: "Where the Alps meet the old world.",
        description: "Lucerne sits at the northern edge of Lake Lucerne, where the pre-alpine foothills begin their dramatic rise. Its medieval Chapel Bridge, baroque churches, and car-free old town create an atmosphere of timeless elegance. Mount Pilatus and Rigi are a cable car ride away — making it a rare place where 800 years of history meets 2,000 meters of alpine panorama.",
        highlights: [
            {
                icon: "Landmark",
                title: "Chapel Bridge",
                description: "Europe's oldest covered wooden bridge. A 14th-century icon spanning the Reuss River."
            },
            {
                icon: "Mountain",
                title: "Pilatus & Rigi",
                description: "Two legendary peaks accessible by cable car and cogwheel railway from the city center."
            },
            {
                icon: "Ship",
                title: "Lake Lucerne",
                description: "Steamboat cruises through alpine scenery. The most dramatic lake in Central Switzerland."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [],
        curatedActivities: [
            { title: "Mt. Pilatus Golden Round Trip", type: "Day Trip", duration: "Full day", href: gyg("/lucerne-l867/mt-pilatus-cable-car-cog-rail-lake-cruise-from-lucerne-t123611/", "lucerne") },
            { title: "Lake Lucerne Discovery Cruise", type: "Cruise", duration: "1 hour", href: gyg("/lucerne-l867/lucerne-lake-lucerne-1-hour-discovery-cruise-t1168411/", "lucerne") },
            { title: "Classic Rigi Round Trip", type: "Train", duration: "Full day", href: gyg("/lucerne-l867/classic-rigi-round-trip-from-lucerne-t43859/", "lucerne") },
        ],
        seo: {
            title: "Lucerne | Medieval Charm & Alpine Peaks | Swissperiences",
            description: "Lucerne — where medieval charm meets alpine grandeur. Chapel Bridge, Mount Pilatus, and Lake Lucerne in the heart of Switzerland.",
            keywords: "lucerne switzerland, chapel bridge, mount pilatus, lake lucerne, central switzerland, lucerne luxury travel"
        }
    },
    {
        slug: "grindelwald",
        name: "Grindelwald",
        region: "Bernese Oberland",
        canton: "Bern",
        coordinates: "046° 37' N / 008° 02' E",
        elevation: "1,034m",
        heroImage: "/images/grindelwald-eiger.jpg",
        heroPosition: "object-[center_35%]",
        tagline: "In the shadow of the Eiger.",
        description: "Grindelwald is the alpine village that lives beneath the Eiger's legendary north face. At 1,034 meters in the Bernese Oberland, it is a place of vertical drama — where glaciers descend into green valleys and the sound of cowbells mingles with the silence of high altitude. Traditional, authentic, and utterly spectacular.",
        highlights: [
            {
                icon: "Mountain",
                title: "The Eiger North Face",
                description: "One of the most formidable walls in alpinism. Visible from the village, dominating the skyline."
            },
            {
                icon: "CableCar",
                title: "First & Männlichen",
                description: "Cable cars to First (2,168m) and Männlichen for panoramic ridge walks and alpine restaurants."
            },
            {
                icon: "Snowflake",
                title: "Year-Round Mountain Life",
                description: "Winter skiing, summer paragliding, autumn wandering. A village that never sleeps through a season."
            }
        ],
        relatedExperiences: [
            { title: "Alps Road Journey", href: "/experiences/road-journey" },
            { title: "Guided Hikes", href: "/experiences/guided-hikes" }
        ],
        relatedSanctuaries: [],
        relatedJournals: [
            { title: "The Winter Ascent", href: "/journals/the-winter-ascent" }
        ],
        curatedActivities: [
            { title: "First Cliff Walk & Cable Car", type: "Adventure", duration: "Half day", href: gyg("/grindelwald-l1613/attraction-ticket-grindelwald-first-cableway-cliff-walk-t468583/", "grindelwald") },
            { title: "Mount First Adventure", type: "Adventure", duration: "Full day", href: gyg("/grindelwald-l1613/grindelwald-gondola-and-mount-first-adventure-t186681/", "grindelwald") },
            { title: "Jungfraujoch Railway from Grindelwald", type: "Train", duration: "Full day", href: gyg("/grindelwald-l1613/from-grindelwald-jungfraujoch-round-trip-railway-ticket-t457803/", "grindelwald") },
        ],
        seo: {
            title: "Grindelwald | Eiger Village | Swissperiences",
            description: "Grindelwald — the alpine village in the shadow of the Eiger. Discover curated experiences in the heart of the Bernese Oberland.",
            keywords: "grindelwald switzerland, eiger north face, bernese oberland, grindelwald first, jungfrau region, grindelwald luxury"
        }
    }
];

export function getCityBySlug(slug: string): City | undefined {
    return cities.find(c => c.slug === slug);
}
