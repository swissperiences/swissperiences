import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Camera, Wind, Disc } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CinematicMemories() {
    const { t } = useTranslation('home');

    const packages = [
        {
            icon: <Wind size={20} />,
            title: t('cinematic.package1.title'),
            desc: t('cinematic.package1.description')
        },
        {
            icon: <Disc size={20} />,
            title: t('cinematic.package2.title'),
            desc: t('cinematic.package2.description')
        },
        {
            icon: <Camera size={20} />,
            title: t('cinematic.package3.title'),
            desc: t('cinematic.package3.description')
        }
    ];

    const galleryItems = [
        { src: "/images/drone/lakeside-village-aerial.jpg", label: t('cinematic.gallery.movement'), span: "col-span-2 row-span-2" },
        { src: "/images/drone/lake-brienz-aerial.jpg", label: t('cinematic.gallery.nature'), span: "col-span-2" },
        { src: "/images/drone/villars-autumn-sunset.jpg", label: "Golden Hour", span: "col-span-1" },
        { src: "/images/drone/blausee-autumn-aerial.jpg", label: "Blausee", span: "col-span-1" },
        { src: "/images/drone/lake-alpine-serenity.jpg", label: t('cinematic.gallery.atmosphere'), span: "col-span-1" },
        { src: "/images/host-hiking.jpg", label: t('cinematic.gallery.portrait'), span: "col-span-1" },
        { src: "/images/drone/geneva-jet-deau-aerial.jpg", label: "Geneva", span: "col-span-2" },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Cinematic Swiss Memories | Professional Drone & Photo"
                description="Professional drone and cinematic content creation for your Swiss journey. Capture the raw beauty of the Alps without interrupting the moment."
                keywords="drone photography switzerland, cinematic travel video, swiss vacation photographer, aerial swiss alps, luxury travel content"
                canonical="https://swissperiences.ch/experiences/cinematic-memories"
                ogImage="https://www.swissperiences.ch/images/villars-drone.jpg"
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[85vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <motion.img
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "linear" }}
                            src="/images/villars-drone.jpg"
                            alt="Cinematic Drone Shot"
                            className="w-full h-full object-cover brightness-[0.7] contrast-[1.1] saturate-[0.8]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            {t('cinematic.heading')}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1]"
                        >
                            {t('cinematic.title').split(' ').slice(0, 2).join(' ')} <br />
                            <span className="italic opacity-60">{t('cinematic.title').split(' ').slice(2).join(' ')}</span>
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 80 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-px bg-switz-red mb-8"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl mx-auto text-white/50 font-light text-lg md:text-xl leading-relaxed whitespace-pre-line"
                        >
                            {t('cinematic.tagline')}
                        </motion.p>
                    </div>
                </section>

                {/* The Philosophy Section */}
                <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <div>
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">{t('cinematic.philosophy')}</span>
                            <h2 className="text-4xl md:text-5xl font-serif leading-tight">{t('cinematic.introTitle')}</h2>
                        </div>
                        <div className="space-y-6 text-white/60 font-light text-lg max-w-[45ch]">
                            <p>
                                {t('cinematic.introDesc1')}
                            </p>
                            <p>
                                {t('cinematic.introDesc2')}
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-white/[0.02] border border-white/5 rounded-sm -z-10 group-hover:scale-[1.02] transition-transform duration-700" />
                        <div className="aspect-video bg-neutral-900 overflow-hidden rounded-sm relative shadow-2xl">
                            {/* Cinematic Overlay Label */}
                            <div className="absolute top-6 right-6 z-20 pointer-events-none">
                                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans border border-white/10 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full">
                                    {t('cinematic.cinemaGrade')}
                                </span>
                            </div>

                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster="/images/zermatt-drone-poster.jpg"
                                className="w-full h-full object-cover"
                            >
                                <source src="/videos/zermatt-drone.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 pointer-events-none" />
                            <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
                                <div className="w-2 h-2 rounded-full bg-switz-red animate-pulse shadow-[0_0_8px_rgba(234,56,76,0.6)]" />
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">{t('cinematic.portfolioSample')} 01</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Specs */}
                <section className="bg-white/[0.02] border-y border-white/5 py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {packages.map((pkg, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-switz-red">
                                        {pkg.icon}
                                    </div>
                                    <h3 className="text-xl font-serif">{pkg.title}</h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        {pkg.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The "Vibe" Grid */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                            <div>
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">{t('cinematic.sampleAesthetics')}</span>
                                <h2 className="text-4xl font-serif text-white">{t('cinematic.theStyles')}</h2>
                            </div>
                            <p className="text-white/40 text-sm italic max-w-xs md:text-right">
                                {t('cinematic.stylesDescription')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px]">
                            {galleryItems.map((item, idx) => (
                                <div key={idx} className={cn("relative overflow-hidden group rounded-sm bg-neutral-900", item.span)}>
                                    <img
                                        src={item.src}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                        alt={item.label}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <span className="text-white text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white/20 pb-1">
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-32 px-6 text-center border-t border-white/5">
                    <div className="max-w-2xl mx-auto space-y-12">
                        <span className="text-switz-red text-[10px] uppercase tracking-[0.4em] font-bold">{t('cinematic.priceSession')}</span>
                        <h2 className="text-4xl md:text-5xl font-serif">{t('cinematic.footerTitle')}</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/41787002202?text=Hi%2C%20I'm%20interested%20in%20Cinematic%20Memories%20documentation."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                            >
                                {t('cinematic.cta')}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

        </div>
    );
}
