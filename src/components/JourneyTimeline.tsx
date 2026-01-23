import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const journals = [
    {
        id: "wager",
        title: "The Winter Ascent",
        guests: "Wager, Andreia & Helena",
        quote: "One weekend. A lifetime of memories.",
        description: "A seamless 48-hour condensed Grand Tour. From Geneva's urban luxury to the deep heart of the Bernese Oberland.",
        itinerary: [
            {
                day: "Saturday Morning",
                title: "From City to Vines",
                description: "Departing Geneva, we drove along Lac Léman to the Lavaux UNESCO Vineyards. A private drive through the hanging terraces with Andreia, Helena, and Wager soaking in the lake views.",
                image: "/images/guests/wager/uploaded_image_0_1769163527795.jpg"
            },
            {
                day: "Saturday Afternoon",
                title: "The Bernese Oberland",
                description: "Climbing towards Interlaken and Grindelwald. We explored the valley floor and ascended to the viewpoints, surrounded by the Eiger, Mönch, and Jungfrau.",
                image: "/images/guests/wager/uploaded_image_1_1769163527795.jpg"
            },
            {
                day: "The Overnight",
                title: "Sleeping in the Shadow of Giants",
                description: "A cozy evening in Grindelwald. Traditional fondue, mountain air, and the silence of the Alps after the day trippers have left.",
                image: "/images/guests/wager/uploaded_image_2_1769163527795.jpg"
            },
            {
                day: "Sunday Morning",
                title: "Valley of Waterfalls",
                description: "Lauterbrunnen. Walking between the 72 waterfalls, feeling the spray of the Staubbach, and exploring the cliffs that inspired Tolkien's Rivendell.",
                image: "/images/guests/wager/uploaded_image_3_1769163527795.jpg"
            },
            {
                day: "Sunday Early Afternoon",
                title: "The Blue Jewel",
                description: "A stop at Blausee Lake. Crystal clear trout waters and ancient pine forests before the scenic drive back descending to Geneva.",
                image: "/images/guests/wager/uploaded_image_4_1769163527795.jpg"
            }
        ]
    },
    {
        id: "ale-alex",
        title: "The Summer Riviera",
        guests: "Ale & Alex",
        quote: "Lakeside serenity meets alpine heights.",
        description: "A sun-drenched exploration of the French-Swiss border, the Riviera, and the international heart of Geneva.",
        itinerary: [
            {
                day: "The Capital of Peace",
                title: "Geneva International",
                description: "Starting at the Palais des Nations. A walk through history where the world meets, surrounded by the flags of 193 nations.",
                image: "/images/guests/ale_alex/uploaded_image_0_1769163731115.jpg"
            },
            {
                day: "The French Balcony",
                title: "Mont Salève",
                description: "Crossing slightly into France to ascend Mont Salève. The 'Balcony of Geneva' offers the most commanding view of the city and the Jet d'Eau.",
                image: "/images/guests/ale_alex/uploaded_image_3_1769163731115.jpg"
            },
            {
                day: "The Riviera",
                title: "Vevey & The Fork",
                description: "A drive along the coast to Vevey. Standing by the iconic Charlie Chaplin statue and the giant fork in the lake.",
                image: "/images/guests/ale_alex/uploaded_image_1_1769163731115.jpg"
            },
            {
                day: "Lakeside Leisure",
                title: "Crystal Waters",
                description: "Private moments on the piers of Lac Léman. The water is so clear in summer it invites you to pause and breathe.",
                image: "/images/guests/ale_alex/uploaded_image_2_1769163731115.jpg"
            },
            {
                day: "The Icon",
                title: "Jet d'Eau",
                description: "Returning to the center. No trip to Geneva is complete without greeting the 140-meter tall guardian of the harbor.",
                image: "/images/guests/ale_alex/uploaded_image_4_1769163731115.jpg"
            }
        ]
    }
];

export default function JourneyTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="relative py-32 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-24">
                    <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                        Guest Journals
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        Curated Memories
                    </h2>
                    <p className="max-w-2xl mx-auto text-white/60 font-light">
                        Every journey is bespoke. Here are two distinct stories from our archives.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {journals.map((journal, jIdx) => (
                        <div key={journal.id} className="relative">

                            {/* Journal Header */}
                            <div className="mb-12 text-center lg:text-left">
                                <h3 className="text-2xl font-serif text-white mb-2">{journal.guests}</h3>
                                <p className="text-switz-red text-sm uppercase tracking-widest mb-4">{journal.title}</p>
                                <p className="text-white/60 font-light italic text-sm border-l border-white/20 pl-4">
                                    "{journal.quote}"
                                </p>
                            </div>

                            {/* Mini Timeline */}
                            <div className="space-y-12 border-l border-white/10 pl-8 ml-4 relative">
                                {journal.itinerary.map((item, index) => (
                                    <div key={index} className="relative group">
                                        {/* Dot */}
                                        <div className="absolute -left-[37.5px] top-1.5 w-3 h-3 rounded-full bg-background border border-white/30 group-hover:bg-switz-red group-hover:border-switz-red transition-colors duration-300" />

                                        <div className="mb-4">
                                            <span className="text-switz-red text-[10px] font-bold tracking-widest uppercase block opacity-70 mb-1">
                                                {item.day}
                                            </span>
                                            <h4 className="text-lg text-white font-serif group-hover:text-switz-red-light transition-colors">
                                                {item.title}
                                            </h4>
                                        </div>

                                        <div className="relative aspect-video w-full overflow-hidden rounded-sm mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        </div>

                                        <p className="text-white/50 text-sm font-light leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
