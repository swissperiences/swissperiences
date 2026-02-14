
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
        quote: "One weekend. A lifetime of memories.",
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
        quote: "Precision meets the peak state.",
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
        coverPosition: "object-top",
        itinerary: [
            {
                day: "Day 01 // Arrival",
                title: "The Turquoise Shore",
                description: "Lake Brienz. The water so impossibly turquoise it felt unreal. Leo sat at the shore, letting the mountain air replace the London grey. A quiet reset before the journey deeper into the Alps.",
                image: "/images/guests/leo/1.jpeg",
                position: "object-[center_30%]"
            },
            {
                day: "Day 01 // The Descent",
                title: "Into the Gorge",
                description: "Aareschlucht. Descending into the ancient gorge carved by millennia of glacial water. The walls narrowing, the light dimming, the sound of rushing water echoing off limestone. A cathedral built by nature.",
                image: "/images/guests/leo/2.jpeg",
                position: "object-center"
            },
            {
                day: "Day 01 // The Valley",
                title: "Golden Lauterbrunnen",
                description: "Arriving at the valley of 72 waterfalls dressed in full autumn gold. The second time here, yet the view from the ridge still stopped him mid-sentence. The Swiss flag catching the breeze, the valley floor glowing below.",
                image: "/images/guests/leo/3.jpeg",
                position: "object-[center_20%]"
            },
            {
                day: "Day 01 // The Falls",
                title: "Staubbach Encounters",
                description: "Walking through the village beneath the Staubbach Falls. The spray, the light, the sound of water meeting stone. Leo owned the streets of Lauterbrunnen like a runway, the Alps as his backdrop.",
                image: "/images/guests/leo/4.jpeg",
                position: "object-center"
            },
            {
                day: "Day 02 // The Summit",
                title: "Among Friends, Among Peaks",
                description: "A second morning in the mountains. Snow-capped peaks framing the horizon, a wooden chalet at the edge of the world. No agenda—just coffee, conversation, and the kind of view that makes you question why you ever leave.",
                image: "/images/guests/leo/5.jpeg",
                position: "object-[center_25%]"
            }
        ],
        content: [
            "Some places call you back. Not with urgency, but with a quiet pull—a memory of how the air tasted, how the silence felt, how the light hit the mountains at a certain hour. For Leo, Switzerland was that place.",
            "Having left Brazil years ago for the relentless pace of London, Leo had built a life defined by movement and reinvention. But his first visit to the Swiss Alps had planted something. A stillness. A counterweight to everything London demanded. So when the chance came to return, there was no hesitation.",
            "The second journey began where the water meets the mountains—Lake Brienz, its surface an impossible shade of turquoise that no photograph can truly capture. From there, we descended into the Aareschlucht, a gorge so ancient and narrow it feels like stepping into the earth's memory. The limestone walls, sculpted by thousands of years of glacial force, hummed with a kind of geological patience that puts human urgency into perspective.",
            "Lauterbrunnen in autumn is a different creature than in winter. The valley was ablaze—golds, ambers, deep reds cascading down the cliffs. Standing at the ridge with the Swiss flag snapping in the wind, Leo looked out over the valley and simply stood there. No phone. No words. Just presence. It was the look of someone recognizing something familiar, yet seeing it with new eyes.",
            "The village below the Staubbach Falls became his stage. There is a confidence that comes from returning to a place that moved you—a sense of ownership, of belonging. Leo walked through Lauterbrunnen not as a tourist, but as someone coming home to a feeling.",
            "The final morning was the quietest. A wooden chalet, snow on the distant peaks, and the kind of conversation that only happens when there is nothing competing for your attention. No schedule to keep, no train to catch. Just two friends, a view that stretched to the horizon, and the unspoken understanding that the mountains had done their work again."
        ]
    }
];
