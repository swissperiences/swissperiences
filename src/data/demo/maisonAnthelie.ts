/**
 * Demonstration data for the Swissperiences guest portal.
 *
 * Maison Anthélie is FICTIONAL. It is not a real property, and no real
 * property's name, branding, photography or content is used here. The guest,
 * the stay, the Wi-Fi credentials and the reception contact are invented; the
 * e-mail uses the reserved `.example` TLD and the phone number is a
 * placeholder pattern so neither can resolve to a real party.
 *
 * The surrounding places ARE real — public geography and landmarks of the
 * Val d'Hérens. That is deliberate: the curation layer is the part being
 * demonstrated, and inventing fake mountains would demonstrate nothing.
 *
 * No personal data of any real person appears in this file.
 */

export interface EssentialItem {
    id: string;
    label: string;
    value: string;
    detail?: string;
    copyable?: boolean;
}

export interface EssentialGroup {
    id: string;
    title: string;
    icon: "arrival" | "wifi" | "hours" | "house" | "reception";
    items: EssentialItem[];
}

export interface Recommendation {
    id: string;
    name: string;
    kind: string;
    distance: string;
    /** The editorial angle — why this, in the house's voice. */
    why: string;
    /** When it is actually good, not when it is open. */
    when: string;
    /** What the guest should expect to feel or find. */
    expect: string;
    image?: string;
}

export interface ServiceItem {
    id: string;
    name: string;
    description: string;
    note: string;
    group: "in-house" | "arranged";
}

export interface DemoProperty {
    slug: string;
    name: string;
    tagline: string;
    region: string;
    altitude: string;
    heroImage: string;
    guest: {
        greeting: string;
        room: string;
        arrival: string;
        departure: string;
        nights: number;
    };
    essentials: EssentialGroup[];
    recommendations: Recommendation[];
    services: ServiceItem[];
    reception: {
        line: string;
        email: string;
        hours: string;
    };
}

export const MAISON_ANTHELIE: DemoProperty = {
    slug: "maison-anthelie",
    name: "Maison Anthélie",
    tagline: "A house of nine rooms, held between the glacier and the valley.",
    region: "Val d'Hérens, Valais",
    altitude: "1,650 m",
    heroImage: "/images/_preview/sea-of-clouds-hero.jpeg",

    guest: {
        greeting: "Élise & Tomás",
        room: "Chambre Ferpècle",
        arrival: "Friday 14 August",
        departure: "Monday 17 August",
        nights: 3,
    },

    essentials: [
        {
            id: "arrival",
            title: "Arriving",
            icon: "arrival",
            items: [
                {
                    id: "drive",
                    label: "By road",
                    value: "40 minutes from Sion",
                    detail:
                        "Follow the valley road past Euseigne. The last four kilometres are single-track with passing places — take them slowly, the view is the point. Winter tyres from November.",
                },
                {
                    id: "parking",
                    label: "Parking",
                    value: "Covered, below the house",
                    detail: "Leave the car at the lower terrace. We carry the bags up.",
                },
                {
                    id: "train",
                    label: "By train",
                    value: "Sion, then the valley bus",
                    detail:
                        "Tell us your train and someone will meet it. The bus runs hourly until 19:40.",
                },
            ],
        },
        {
            id: "wifi",
            title: "Wi-Fi",
            icon: "wifi",
            items: [
                { id: "ssid", label: "Network", value: "Anthelie-Guest", copyable: true },
                { id: "pass", label: "Password", value: "coldsun1650", copyable: true },
                {
                    id: "note",
                    label: "Note",
                    value: "Strongest in the library and the south rooms",
                    detail: "The stone walls are a metre thick. This is not a fault.",
                },
            ],
        },
        {
            id: "hours",
            title: "Hours",
            icon: "hours",
            items: [
                { id: "in", label: "Check-in", value: "from 16:00" },
                { id: "out", label: "Check-out", value: "by 11:00" },
                {
                    id: "breakfast",
                    label: "Breakfast",
                    value: "07:30 – 10:30",
                    detail: "Served in the west room, or on the terrace when the sun clears the ridge — usually around 09:00 in August.",
                },
                { id: "sauna", label: "Sauna", value: "07:00 – 21:00", detail: "Booked in half-hours at reception. No charge." },
            ],
        },
        {
            id: "house",
            title: "The house",
            icon: "house",
            items: [
                { id: "quiet", label: "Quiet hours", value: "22:00 – 07:00" },
                { id: "shoes", label: "Shoes", value: "Left at the entrance", detail: "Slippers in your room, in three sizes." },
                {
                    id: "stove",
                    label: "Wood stove",
                    value: "Lit for you at dusk",
                    detail: "Wood is in the basket. If it goes out, leave it — someone will come.",
                },
                { id: "dogs", label: "Dogs", value: "Welcome, on the ground floor" },
            ],
        },
    ],

    recommendations: [
        {
            id: "euseigne",
            name: "Pyramides d'Euseigne",
            kind: "Geology",
            distance: "15 min by car",
            why: "Earth pillars capped with boulders, left by a glacier that has been gone ten thousand years. The road runs straight through one of them.",
            when: "Late afternoon, when the light comes side-on and the shadows do the explaining.",
            expect: "Twenty minutes, not an afternoon. Stop on the way back from anywhere.",
            image: "/images/_preview/dawn-fog-chalets.jpeg",
        },
        {
            id: "lac-bleu",
            name: "Lac Bleu d'Arolla",
            kind: "Walk",
            distance: "35 min by car, then 45 min on foot",
            why: "A small lake the colour of a held breath, fed by meltwater and nothing else. The colour is real and photographs badly, which is part of its argument.",
            when: "Before 10:00. By noon in August you will share it.",
            expect: "A steady climb through larch. Swimming is legal, brief, and unforgettable.",
            image: "/images/_preview/alpine-reset-lake.jpeg",
        },
        {
            id: "ferpecle",
            name: "Glacier de Ferpècle",
            kind: "Walk",
            distance: "25 min by car, then 2 h on foot",
            why: "You can still walk to the ice here. Painted markers on the rock show where the glacier stood in 1900, 1950, 1990. It is the most articulate thing in the valley.",
            when: "Start early. Weather turns after 14:00 more often than not.",
            expect: "Real terrain and real exposure. Boots, water, a layer more than you think.",
            image: "/images/_preview/cinematic-alpine-road.jpeg",
        },
        {
            id: "dixence",
            name: "Barrage de la Grande Dixence",
            kind: "Engineering",
            distance: "45 min by car",
            why: "The tallest gravity dam on earth: 285 metres of concrete, poured by hand-shifts through fifteen summers. Standing at the foot of it rearranges your sense of scale.",
            when: "Any clear day. The cable car to the crest runs June to September.",
            expect: "Cold at the wall even in August. The café at the top is ordinary; the walk along the crest is not.",
            image: "/images/_preview/lake-alpine-serenity.jpg",
        },
        {
            id: "evolene",
            name: "Évolène village",
            kind: "Village",
            distance: "10 min by car",
            why: "Timber houses of the seventeenth century, still lived in rather than preserved. Some women here still wear the valley dress on Sundays, and not for anyone's camera.",
            when: "Sunday morning, or Tuesday for the small market.",
            expect: "One street, an hour, a bakery worth the detour.",
            image: "/images/_preview/manifesto-village-aerial.jpeg",
        },
        {
            id: "bisse",
            name: "Bisse de Vex",
            kind: "Walk",
            distance: "20 min by car",
            why: "A wooden irrigation channel cut into the cliff six centuries ago, still carrying water. The path beside it is almost flat, which in this valley is a gift.",
            when: "Warm afternoons — the water keeps the air cool the whole way.",
            expect: "Two hours out and back, no climbing, sections with a handrail and a long way down.",
            image: "/images/_preview/lavaux-vineyards-sunset.jpeg",
        },
        {
            id: "cave",
            name: "A winemaker in the Valais",
            kind: "Table",
            distance: "35 min by car",
            why: "The valley grows Petite Arvine and Cornalin, grapes that barely exist outside these slopes. Ask reception which cellar is pouring this week — it changes, and we only send you where we would go.",
            when: "Late afternoon, by appointment. We make it.",
            expect: "An hour at a table in a cellar. Do not plan to drive afterwards.",
            image: "/images/_preview/sunset-golden.jpeg",
        },
        {
            id: "thermal",
            name: "The thermal baths at Ovronnaz",
            kind: "Water",
            distance: "1 h by car",
            why: "Outdoor pools facing the Rhône valley, thirty-four degrees, open into the dark. Worth the drive on the day your legs stop cooperating.",
            when: "After a long walk, or on the day the cloud comes down.",
            expect: "Busy at weekends. Quiet on a Tuesday evening.",
            image: "/images/_preview/thermal-pool-alps.jpeg",
        },
    ],

    services: [
        {
            id: "terrace-breakfast",
            name: "Breakfast on your terrace",
            description: "The same table, carried up to your room and laid outside.",
            note: "Ask the evening before",
            group: "in-house",
        },
        {
            id: "sauna-private",
            name: "Private sauna hour",
            description: "The wood-fired cabin at the tree line, heated for you alone.",
            note: "Half-hour slots, no charge",
            group: "in-house",
        },
        {
            id: "picnic",
            name: "Walking provisions",
            description: "Bread, valley cheese, dried meat, fruit, packed for the trail.",
            note: "Ordered by 20:00 the night before",
            group: "in-house",
        },
        {
            id: "laundry",
            name: "Laundry, same day",
            description: "Left before 09:00, returned pressed by evening.",
            note: "Bag in the wardrobe",
            group: "in-house",
        },
        {
            id: "guide",
            name: "Mountain guide, half day",
            description: "A certified guide from the valley. Glacier terrain, or a first via ferrata.",
            note: "48 hours' notice, weather permitting",
            group: "arranged",
        },
        {
            id: "chef",
            name: "Dinner by a valley cook",
            description: "Four courses, cooked in the house kitchen, served at the long table.",
            note: "Minimum four guests, 72 hours' notice",
            group: "arranged",
        },
        {
            id: "drive",
            name: "A drive over the passes",
            description: "A half-day route over the high road, with the stops that matter and none that do not.",
            note: "Subject to the pass being open",
            group: "arranged",
        },
        {
            id: "transfer",
            name: "Transfer to Sion or Geneva",
            description: "Door to platform, or door to terminal.",
            note: "Arranged the day before",
            group: "arranged",
        },
    ],

    reception: {
        // Fictional contact details. `.example` is reserved for documentation
        // (RFC 2606) and the number is a placeholder pattern — neither can
        // reach a real party.
        line: "+41 27 000 00 00",
        email: "reception@maison-anthelie.example",
        hours: "07:00 – 21:00, and the night line after that",
    },
};
