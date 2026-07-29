import { useRef } from "react";
import { useScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import { journals } from "@/data/journals";

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
                        <div key={journal.id} className="relative flex flex-col h-full">

                            {/* Journal Header */}
                            <div className="mb-12 text-center lg:text-left">
                                <h3 className="text-2xl font-serif text-white mb-2">{journal.guests}</h3>
                                <p className="text-switz-red text-sm uppercase tracking-widest mb-4">{journal.title}</p>
                                <p className="text-white/60 font-light italic text-sm border-l border-white/20 pl-4 mb-6">
                                    "{journal.quote}"
                                </p>

                                {/* New Impact Section for Social Proof */}
                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 backdrop-blur-sm relative group cursor-pointer hover:bg-white/10 transition-colors" onClick={() => navigate(`/${i18n.language}/journals/${journal.slug}`)}>
                                    <span className="absolute -top-3 left-4 bg-black px-2 text-xs text-switz-red uppercase tracking-[0.2em]">The Impact</span>
                                    <p className="text-white/80 font-serif text-lg leading-relaxed line-clamp-4">
                                        "{journal.content[0]}"
                                    </p>
                                    <p className="mt-4 text-xs text-white/40 uppercase tracking-widest group-hover:text-switz-red transition-colors flex items-center gap-2">
                                        Read Story <div className="w-8 h-px bg-white/20 group-hover:bg-switz-red transition-colors" />
                                    </p>
                                </div>
                            </div>

                            {/* Mini Timeline */}
                            <div className="space-y-12 border-l border-white/5 pl-8 ml-4 relative flex-grow">
                                {journal.itinerary.slice(0, 2).map((item, index) => (
                                    <div key={index} className="relative group/item">
                                        {/* Dot */}
                                        <div className="absolute -left-[37.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-white/20 group-hover/item:bg-switz-red transition-colors duration-300" />

                                        <div className="mb-4">
                                            <span className="text-switz-red text-xs font-bold tracking-[0.3em] uppercase block opacity-60 mb-2">
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
                                                className={cn(
                                                    "w-full h-full object-cover scale-[1.01] group-hover/item:scale-105 transition-all duration-1000 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] group-hover/item:brightness-100",
                                                    (item as any).position || "object-[center_30%]"
                                                )}
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
                                        <span className="text-white/20 text-xs font-bold tracking-[0.3em] uppercase block mb-2">
                                            Hidden Segment
                                        </span>
                                        <h4 className="text-lg text-white/40 font-serif lowercase italic">
                                            and the moments that followed...
                                        </h4>
                                    </div>

                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center group-hover/teaser:bg-white/[0.05] transition-all duration-700">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-px bg-white/10 group-hover/teaser:w-12 transition-all duration-700" />
                                            <span className="text-xs text-white/20 uppercase tracking-[0.4em]">Status: Archived</span>
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
