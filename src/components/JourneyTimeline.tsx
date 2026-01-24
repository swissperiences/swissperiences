import { useRef } from "react";
import { useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
            }
        ]
    },
    {
        id: "ale-alex",
        title: "The Alpine Protocol",
        guests: "Ale & Alex",
        quote: "Precision meets the peak state.",
        description: "A high-altitude narrative following the transition from urban Geneva to the rugged summits of the Swiss Alps.",
        itinerary: [
            {
                day: "Day 01 // Departure",
                title: "Urban Origins",
                description: "Leaving the city behind. A final moment at the Pont de la Machine.",
                image: "/images/guests/ale_alex/1.jpg"
            },
            {
                day: "Day 01 // The Ascent",
                title: "The Balcony",
                description: "Mont Salève. Looking back at Geneva from above.",
                image: "/images/guests/ale_alex/2.jpg"
            }
        ]
    }
];

export default function JourneyTimeline() {
    const { t, i18n } = useTranslation('home');
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const handleNavigateToArchives = () => {
        navigate(`/${i18n.language}/journals`);
        window.scrollTo(0, 0);
    };

    return (
        <section id="journals" ref={containerRef} className="relative py-32 bg-background overflow-hidden scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="text-center mb-24">
                    <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                        {t('archives.heading')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                        {t('archives.title')}
                    </h2>
                    <p className="max-w-2xl mx-auto text-white/60 font-light text-lg">
                        {t('archives.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {journals.map((journal) => (
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
                            <div className="space-y-12 border-l border-white/5 pl-8 ml-4 relative">
                                {journal.itinerary.map((item, index) => (
                                    <div key={index} className="relative group/item">
                                        {/* Dot */}
                                        <div className="absolute -left-[37.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-white/20 group-hover/item:bg-switz-red transition-colors duration-300" />

                                        <div className="mb-4">
                                            <span className="text-switz-red text-[9px] font-bold tracking-[0.3em] uppercase block opacity-60 mb-2">
                                                {item.day}
                                            </span>
                                            <h4 className="text-lg text-white font-serif group-hover/item:text-switz-red-light transition-colors duration-500">
                                                {item.title}
                                            </h4>
                                        </div>

                                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-900 border border-white/5">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover object-[center_30%] scale-[1.01] group-hover/item:scale-105 transition-all duration-1000 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] group-hover/item:brightness-100"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Mysterious Teaser Item */}
                                <div
                                    onClick={handleNavigateToArchives}
                                    className="relative group/teaser cursor-pointer opacity-40 hover:opacity-100 transition-all duration-700"
                                >
                                    <div className="absolute -left-[37.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-white/10" />

                                    <div className="mb-4 blur-[3px] group-hover/teaser:blur-0 transition-all duration-700">
                                        <span className="text-white/20 text-[9px] font-bold tracking-[0.3em] uppercase block mb-2">
                                            Hidden Segment
                                        </span>
                                        <h4 className="text-lg text-white/40 font-serif lowercase italic">
                                            and the moments that followed...
                                        </h4>
                                    </div>

                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center group-hover/teaser:bg-white/[0.05] transition-all duration-700">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-px bg-white/10 group-hover/teaser:w-12 transition-all duration-700" />
                                            <span className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Status: Archived</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <button
                        onClick={handleNavigateToArchives}
                        className="group inline-flex items-center gap-4 text-xs text-white uppercase tracking-[0.3em] hover:text-switz-red transition-colors"
                    >
                        <span>{t('archives.cta')}</span>
                        <div className="w-12 h-px bg-white/20 group-hover:bg-switz-red group-hover:w-20 transition-all duration-500" />
                    </button>
                </div>
            </div>
        </section>
    );
}
