import { useRef, useEffect } from "react";

export const Founder = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        entry.target.classList.remove("opacity-0", "translate-y-10");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const cards = document.querySelectorAll(".reveal-on-scroll");
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-6 md:px-12 bg-black/40 backdrop-blur-sm border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">

                    {/* Image Section */}
                    <div className="w-full md:w-5/12 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out">
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                            <img
                                src="/images/caueh-vidal-spring.jpg"
                                alt="Caueh Vidal"
                                className="w-full h-full object-cover object-[center_25%] grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] hover:brightness-100"
                            />
                            <div className="absolute bottom-6 left-6 z-20">
                                <p className="text-white text-lg font-serif italic">Geneva, Switzerland</p>
                            </div>
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="w-full md:w-7/12 space-y-8 reveal-on-scroll opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-200">
                        <div>
                            <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-4">
                                The Founder & Host
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
                                Caueh Vidal <br />
                                <span className="italic text-white/50 text-3xl md:text-4xl">Your Private Alpine Guide.</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg text-white/70 font-light leading-relaxed max-w-xl">
                            <p>
                                Based in <strong>Geneva</strong> and deeply rooted in the alpine serenity of Villars-sur-Ollon, I created Swissperiences to offer what big agencies cannot:
                                a personal connection to the Swiss Alps.
                            </p>
                            <p>
                                I don't just book your trip; I host it. From the moment I pick you up in my <strong>Range Rover</strong>,
                                to the cinematic <strong>drone memories</strong> we capture together, every detail is personally curated.
                            </p>
                            <p className="text-sm border-l-2 border-switz-red pl-4 italic opacity-80">
                                "Fluency in Portuguese, English, and Spanish allows me to bridge the gap between
                                international warmth and Swiss precision."
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-white font-serif text-xl mb-1">Geneva Based</h4>
                                    <p className="text-xs text-switz-red uppercase tracking-widest">Global Perspective</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-serif text-xl mb-1">Villars Retreat</h4>
                                    <p className="text-xs text-switz-red uppercase tracking-widest">Alpine Sanctuary</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
