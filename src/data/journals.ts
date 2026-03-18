
export interface JournalEntry {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    guests: string;
    date: string;
    quote: string;
    description: string;
    coverImage: string;
    coverPosition?: string;
    itinerary: {
        day: string;
        title: string;
        description: string;
        image: string;
        position?: string;
    }[];
    content: string[]; // Array of paragraphs for the full article
}

export const journals: JournalEntry[] = [
    {
        id: "wagner",
        slug: "the-winter-ascent",
        title: "The Winter Ascent",
        subtitle: "A Grand Tour Condensed",
        guests: "Wagner, Andreia & Helena",
        date: "February 2024",
        quote: "We didn't see Switzerland. We felt it.",
        description: "A seamless 48-hour condensed Grand Tour. From Geneva's urban luxury to the deep heart of the Bernese Oberland.",
        coverImage: "/images/guests/wagner/1.jpeg",
        coverPosition: "object-top",
        itinerary: [
            {
                day: "Saturday Morning",
                title: "From City to Vines",
                description: "Departing Geneva, we drove along Lac Léman to the Lavaux UNESCO Vineyards. A private drive through the hanging terraces with Andreia, Helena, and Wagner soaking in the lake views.",
                image: "/images/guests/wagner/1.jpeg",
                position: "object-top"
            },
            {
                day: "Saturday Afternoon",
                title: "The Bernese Oberland",
                description: "Climbing towards Interlaken and Grindelwald. We explored the valley floor and ascended to the viewpoints, surrounded by the Eiger, Mönch, and Jungfrau.",
                image: "/images/guests/wagner/2.jpeg"
            },
            {
                day: "The Overnight",
                title: "Sleeping in the Shadow of Giants",
                description: "A cozy evening in Grindelwald. Traditional fondue, mountain air, and the silence of the Alps after the day trippers have left.",
                image: "/images/guests/wagner/3.jpeg"
            },
            {
                day: "Sunday Morning",
                title: "Valley of Waterfalls",
                description: "Lauterbrunnen. Walking between the 72 waterfalls with the Swissperiences founder, feeling the spray of the Staubbach, and exploring the cliffs that inspired Tolkien's Rivendell.",
                image: "/images/guests/wagner/4.jpeg"
            },
            {
                day: "Sunday Early Afternoon",
                title: "The Blue Jewel",
                description: "A stop at Blausee Lake. Crystal clear trout waters and ancient pine forests before the scenic drive back descending to Geneva.",
                image: "/images/guests/wagner/5.jpeg"
            }
        ],
        content: [
            "The challenge was clear: How to condense the essence of the Grand Tour into a single weekend?",
            "For Wagner and his family, time was the ultimate luxury. They wanted to see the best of Switzerland, but without the rush of a typical tourist itinerary. We designed 'The Winter Ascent' as a curated narrative that moves seamlessly from the sophisticated urban landscape of Geneva to the raw, majestic power of the Bernese Oberland.",
            "Our journey began with the sun rising over Lac Léman, casting a golden glow on the Lavaux vineyards. These ancient terraces, carved by monks centuries ago, provided the perfect prologue—a testament to how humanity can shape nature with respect and beauty.",
            "As we ascended into the mountains, the atmosphere shifted. The air grew thinner, crisper. The noise of the world fell away, replaced by the silence of the Eiger's north face. In Grindelwald, we didn't just 'stay'; we inhabited the mountain. The evening was spent in quiet reflection, watching the alpenglow fade from the peaks.",
            "Lauterbrunnen offered a different kind of magic. Walking beneath the Staubbach Falls, one feels small in the best possible way. It is a reminder of nature's scale and permanence. The trip concluded at Blausee, a jewel of blue amidst the winter grey, offering a moment of absolute clarity before our return to civilization.",
            "This was not just a trip. It was a reconnection—with family, with nature, and with oneself."
        ]
    },
    {
        id: "ale-alex",
        slug: "the-alpine-protocol",
        title: "The Alpine Protocol",
        subtitle: "Precision & Peak State",
        guests: "Ale & Alex",
        date: "March 2024",
        quote: "What stood out most was the silence.",
        description: "A high-altitude narrative following the transition from urban Geneva to the rugged summits of the Swiss Alps, balancing mechanical power with human connection.",
        coverImage: "/images/guests/ale_alex/1.jpg",
        coverPosition: "object-[center_30%]",
        itinerary: [
            {
                day: "Day 01 // Departure",
                title: "Urban Origins",
                description: "Leaving the city behind. A final moment at the Pont de la Machine in Geneva before setting our compass towards the mountains.",
                image: "/images/guests/ale_alex/1.jpg",
                position: "object-[center_30%]"
            },
            {
                day: "Day 01 // The Ascent",
                title: "The Balcony",
                description: "Mont Salève. Crossing the border to look back at the city from above. A moment on the 'Balcony of Geneva' before turning definitively towards the high Alps.",
                image: "/images/guests/ale_alex/2.jpg",
                position: "object-top"
            },
            {
                day: "Day 02 // Exploration",
                title: "Alpine Sanctuary",
                description: "Settling into the rhythm of the mountains. Exploring the ridges and finding perspective high above the cloud line.",
                image: "/images/guests/ale_alex/3.jpg",
                position: "object-[center_20%]"
            },
            {
                day: "Day 02 // Atmosphere",
                title: "Quiet Moments",
                description: "Connection in the stillness. The luxury of time spent together, surrounded by the silence of the peaks.",
                image: "/images/guests/ale_alex/4.jpg",
                position: "object-center"
            },
            {
                day: "Day 03 // The Return",
                title: "Lasting Memories",
                description: "Descending with a new state of mind. The journey ends, but the feeling of the Alps remains.",
                image: "/images/guests/ale_alex/5.jpg",
                position: "object-[center_10%]"
            }
        ],
        content: [
            "For Ale and Alex, the mountains are not just a destination; they are a state of mind. 'The Alpine Protocol' was designed to mirror their own drive for precision and excellence.",
            "Starting in Geneva, the transition was deliberate. We didn't rush. We stopped at Mont Salève, the 'Balcony of Geneva', to look back at the city one last time—a symbolic leaving behind of the urban rush.",
            "The journey was characterized by contrast: the mechanical power of the drive versus the absolute stillness of the high alpine ridges. We sought out places where the horizon feels infinite, allowing for conversations that only happen when you are 2,000 meters above sea level.",
            "What stood out most was the silence. In a world of constant noise, finding true silence is a luxury. We curated moments—a coffee on a ridge, a walk through a snow-covered forest—where the only sound was the crunch of snow underfoot.",
            "This journey was about finding a 'peak state'—that mental clarity that comes from high altitude and deep connection."
        ]
    },
    {
        id: "leo",
        slug: "the-return",
        title: "The Return",
        subtitle: "From London to the Alps, Again",
        guests: "Leo",
        date: "October 2025",
        quote: "The mountains don't change. You do.",
        description: "A Brazilian soul, forged in the rhythm of London, crossing the Alps for the second time—chasing the autumn light and the silence he couldn't forget.",
        coverImage: "/images/guests/leo/1.jpeg",
        coverPosition: "object-[center_60%]",
        itinerary: [
            {
                day: "Day 01 // Lake Brienz",
                title: "The Turquoise Shore",
                description: "First stop: Lake Brienz. That shade of turquoise that you think is edited until you see it in person. Leo posted up by the shore, already planning the next move on his phone. The Alps can wait—London habits die hard.",
                image: "/images/guests/leo/1.jpeg",
                position: "object-[center_30%]"
            },
            {
                day: "Day 01 // Aareschlucht",
                title: "Into the Gorge",
                description: "The Aare Gorge. Narrow limestone walls carved over thousands of years by glacial water, with walkways that hug the rock face. Leo exploring the depths with the sound of rushing water all around.",
                image: "/images/guests/leo/2.jpeg",
                position: "object-center"
            },
            {
                day: "Day 01 // Lauterbrunnen",
                title: "The Valley in Gold",
                description: "Lauterbrunnen in full autumn mode. The valley of 72 waterfalls, this time painted in gold and amber. The Swiss flag on the ridge, the valley floor below—his second time here, still just as impressive.",
                image: "/images/guests/leo/3.jpeg",
                position: "object-[center_20%]"
            },
            {
                day: "Day 01 // Staubbach",
                title: "Under the Falls",
                description: "Walking through Lauterbrunnen village with the Staubbach Falls towering behind. Classic alpine scenery—chalets, cliffs, and that waterfall cascading 300 meters down the rock face.",
                image: "/images/guests/leo/4.jpeg",
                position: "object-center"
            },
            {
                day: "Day 02 // Morning",
                title: "Among Friends, Among Peaks",
                description: "Day two. A morning at a mountain chalet with the Swissperiences founder—snow-capped peaks behind, autumn colors below. No itinerary, just good company and the kind of views that remind you why you came back.",
                image: "/images/guests/leo/5.jpeg",
                position: "object-[center_25%]"
            }
        ],
        content: [
            "Some places stick with you. For Leo, a Brazilian living in London, Switzerland was one of those. His first visit had left a mark—something about the air, the silence, the scale of the mountains. When the chance came to return in autumn, he didn't think twice.",
            "The trip started at Lake Brienz, where the water is that shade of turquoise you have to see in person. From there we drove to the Aare Gorge—ancient, narrow, with limestone walls shaped by thousands of years of glacial water. A completely different atmosphere from the open lake just minutes before.",
            "Lauterbrunnen was the main event. In autumn, the valley transforms. The 72 waterfalls were still flowing, but now framed by golds and reds instead of snow. Standing at the ridge overlook with the Swiss flag catching the wind, Leo took it in quietly. His second time here, but the valley still had something new to show.",
            "Walking through the village below Staubbach Falls felt unhurried. No crowds, no rush. Just the sound of water hitting stone and the late afternoon light hitting the cliff face. The kind of moment this region does better than anywhere.",
            "The second morning was the simplest and maybe the best. A chalet in the mountains, coffee, conversation with a friend, and snow-capped peaks stretching to the horizon. No agenda. That's the point of coming back—you already know the highlights, so you can slow down and just be there."
        ]
    }
];
