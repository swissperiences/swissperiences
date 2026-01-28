import { useTranslation } from 'react-i18next';
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const Founder = () => {
    const { t } = useTranslation('home');

    return (
        <section id="founder" className="py-32 px-6 md:px-12 bg-black/40 backdrop-blur-sm border-t border-white/5 scroll-mt-20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">

                    {/* Image Section */}
                    <ScrollReveal variant="scale" duration={1.5} className="w-full md:w-5/12">
                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                            <img
                                src="/images/caueh-vidal-spring.jpg"
                                alt="Caueh Vidal"
                                className="w-full h-full object-cover object-[center_25%] grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] hover:brightness-100"
                            />

                            {/* Visual Detail Badge */}
                            <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
                                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans">Location Log</span>
                                <p className="text-white text-base font-serif italic">Geneva, Switzerland</p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Text Section */}
                    <div className="w-full md:w-7/12 space-y-12">
                        <ScrollReveal variant="slideUp" delay={0.2}>
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-6">
                                {t('founder.heading')}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-4">
                                {t('founder.title')}
                            </h2>
                            <p className="font-sans uppercase tracking-[0.2em] text-[10px] md:text-xs text-white/60">
                                {t('founder.subtitle')}
                            </p>
                        </ScrollReveal>

                        {/* Narrow Body Column for Elegance */}
                        <div className="space-y-8 text-lg text-white/70 font-light leading-relaxed max-w-[45ch]">
                            <ScrollReveal variant="fade" delay={0.4}>
                                <p>
                                    {t('founder.bio1')}
                                </p>
                            </ScrollReveal>
                            <ScrollReveal variant="fade" delay={0.5}>
                                <p>
                                    {t('founder.bio2')}
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Editorial Quote Block */}
                        <ScrollReveal variant="slideUp" delay={0.6}>
                            <div className="relative pt-4">
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-switz-red/40" />
                                <blockquote className="pl-8 py-2">
                                    <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed max-w-[40ch]">
                                        "{t('founder.quote')}"
                                    </p>
                                </blockquote>
                            </div>
                        </ScrollReveal>

                        {/* Minimalist Visual Badges */}
                        <ScrollReveal variant="fade" delay={0.7} className="pt-8 flex flex-wrap gap-x-12 gap-y-8">
                            <div className="group">
                                <p className="text-[10px] text-switz-red uppercase tracking-[0.2em] mb-2">{t('founder.locationSub')}</p>
                                <h4 className="text-white font-serif text-lg lg:text-xl border-b border-white/10 pb-1 group-hover:border-switz-red transition-colors">{t('founder.locationLabel')}</h4>
                            </div>
                            <div className="group">
                                <p className="text-[10px] text-switz-red uppercase tracking-[0.2em] mb-2">{t('founder.retreatSub')}</p>
                                <h4 className="text-white font-serif text-lg lg:text-xl border-b border-white/10 pb-1 group-hover:border-switz-red transition-colors">{t('founder.retreatLabel')}</h4>
                            </div>
                        </ScrollReveal>
                    </div>

                </div>
            </div>
        </section>
    );
};
