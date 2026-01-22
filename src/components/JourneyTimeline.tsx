import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const itinerary = [
    {
        day: "Day 01",
        title: "Arrival & The Welcome",
        description: "Private transfer from Geneva. Check-in at the chalet. Evening welcome dinner prepared by our private Michelin-starred chef.",
        icon: "🏔️"
    },
    {
        day: "Day 02",
        title: "The Ascent & Stillness",
        description: "Guided alpine trek to the hidden Lac des Chavonnes or the peaks of Bretaye, with private gourmet catering facing the Mont Blanc massif and majestic Dents du Midi.",
        icon: "🧘"
    },
    {
        day: "Day 03",
        title: "The Craft",
        description: "Exclusive visit to an independent watchmaker's atelier or a master chocolatier. Hands-on immersion into Swiss precision.",
        icon: "🕰️"
    },
    {
        day: "Day 04",
        title: "The Peak",
        description: "Private helicopter crossing to the Glacier 3000. Experience the Peak Walk and a champagne toast on the ice, surrounded by 24 summits over 4,000 meters.",
        icon: "🚁"
    },
    {
        day: "Day 05",
        title: "The Deepening",
        description: "Thermal serenity and private spa immersion. A guided reflection day to integrate the alpine stillness.",
        icon: "💧"
    },
    {
        day: "Day 06",
        title: "The Celebration",
        description: "Michelin-starred farewell gala. Curated vintage pairings and a culinary masterpiece closing the circle.",
        icon: "✨"
    },
    {
        day: "Day 07",
        title: "Departure",
        description: "Private transfer back to Geneva or Zurich. You leave different than when you arrived.",
        icon: "✈️"
    }
];

export default function JourneyTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const lineColor = useTransform(scrollYProgress, [0, 0.5, 1], ["rgba(255,255,255,0.1)", "rgba(216, 181, 138, 0.8)", "rgba(255,255,255,0.1)"]);

    return (
        <section ref={containerRef} className="relative py-32 bg-background overflow-hidden">

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                        The Experience
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">
                        A week of elevated <span className="italic text-white/60">disconnection.</span>
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Vertical Line */}
                    <motion.div
                        className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] -ml-[0.5px] bg-white/10"
                        style={{ background: lineColor }}
                    />

                    <div className="space-y-20">
                        {itinerary.map((item, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center md:items-start group`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-[20px] md:left-1/2 -ml-[5px] w-[11px] h-[11px] rounded-full bg-background border border-white/30 z-20 md:mt-1 group-hover:border-switz-red group-hover:bg-switz-red transition-colors duration-500" />

                                {/* Content Spacer for Desktop */}
                                <div className="hidden md:block w-1/2" />

                                {/* Content Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`w-full md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
                                >
                                    <span className="text-switz-red text-xs font-bold tracking-widest uppercase mb-2 block opacity-70">
                                        {item.day}
                                    </span>
                                    <h3 className="text-2xl text-white font-serif mb-3 group-hover:text-switz-red-light transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/60 font-light leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
