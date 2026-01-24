import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import SEO from "@/components/SEO";

const Success = () => {
    const { t } = useTranslation('common');

    return (
        <div className="min-h-[100svh] bg-black relative flex items-center justify-center overflow-hidden grain-overlay">
            <SEO
                title={`${t('successPage.title')} | Swissperiences`}
                description={t('successPage.discretion')}
            />
            <div className="cursor-none" />

            {/* Immersive Background: Layered Slow-Motion Chaos & Peace */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-110 blur-2xl opacity-40 contrast-125 grayscale"
                >
                    <source src="/videos/hero-final.mp4" type="video/mp4" />
                </video>
                {/* Scrim for absolute visual silence */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <main className="relative z-10 text-center px-10 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                    className="animate-breath"
                >
                    <h1 className="text-white text-3xl md:text-5xl font-serif italic mb-8 tracking-tight font-light leading-snug">
                        {t('successPage.title')}<br />
                        <span className="text-white/60">{t('successPage.subtitle')}</span>
                    </h1>

                    <div className="w-12 h-px bg-white/10 mx-auto mb-10" />

                    <p className="text-white/40 font-light text-sm md:text-base leading-relaxed tracking-wide space-y-4">
                        <span className="block italic">{t('successPage.discretion')}</span>
                        <span className="block mt-4">
                            {t('successPage.contact')}
                        </span>
                    </p>
                </motion.div>

                {/* Minimalist exit link: Subtle 30% opacity text-link without borders */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full"
                >
                    <Link
                        to="/"
                        className="text-[10px] text-white/30 hover:text-white/60 uppercase tracking-[0.4em] transition-all duration-1000 ease-swiss-luxury"
                    >
                        {t('successPage.backLink')}
                    </Link>
                </motion.div>
            </main>
        </div>
    );
};

export default Success;
