import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";

export default function VillarsRetreat() {
    const { lang } = useParams();
    const { t, i18n } = useTranslation("common");
    const langPrefix = lang ? `/${lang}` : "";
    const currentLang = i18n.language || "en";
    const BASE_URL = "https://www.swissperiences.ch";
    const langUrl = currentLang !== "en" ? `/${currentLang}` : "";

    const lodgingStructuredData = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": "The Villars Loft",
        "description": "Private designer loft in Villars-sur-Ollon. Your curated mountain sanctuary with fireplace, sunset views, and alpine soul.",
        "image": `${BASE_URL}/images/villars-hero.jpg`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Villars-sur-Ollon",
            "addressRegion": "Vaud",
            "addressCountry": "CH"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 46.2997,
            "longitude": 7.0542
        },
        "url": `${BASE_URL}/sanctuaries/villars`
    };

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: t("breadcrumbs.home", "Home"), href: `${BASE_URL}${langUrl}/` },
        { label: t("breadcrumbs.sanctuaries", "Sanctuaries"), href: `${BASE_URL}${langUrl}/sanctuaries` },
        { label: "The Villars Loft", href: `${BASE_URL}${langUrl}/sanctuaries/villars` },
    ]);

    const breadcrumbItems = [
        { label: t("breadcrumbs.home", "Home"), href: `${langPrefix}/` },
        { label: t("breadcrumbs.sanctuaries", "Sanctuaries"), href: `${langPrefix}/sanctuaries` },
        { label: "The Villars Loft" },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Villars Alpine Retreat | Private Designer Loft"
                description="Stay at a private designer loft in Villars-sur-Ollon. Your curated mountain sanctuary with fireplace, sunset views, and alpine soul. Minutes from ski pistes."
                keywords="villars sur ollon accommodation, swiss alpine loft, luxury chalet villars, private retreat switzerland, designer mountain home"
                canonical="https://swissperiences.ch/sanctuaries/villars"
                ogImage="https://www.swissperiences.ch/images/villars-hero.jpg"
                structuredData={[lodgingStructuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/villars-hero.jpg"
                            alt="Villars Retreat Living Room"
                            className="w-full h-full object-cover object-[center_30%] brightness-[0.85] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase mb-4"
                        >
                            Private Residence
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-6"
                        >
                            The Villars Loft
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/80 font-light text-lg"
                        >
                            More than an apartment. Your personal headquarters in the Swiss Alps.
                        </motion.p>
                    </div>
                </section>

                {/* Intro & Amenities */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8"
                        >
                            <Breadcrumbs items={breadcrumbItems} />
                        </motion.div>
                        <h2 className="text-3xl font-serif mb-6">A home, not a rental.</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            Located just minutes from the Villars-sur-Ollon ski station, this is my personal residence in the mountains.
                            It is not a sterile rental unit; it is a warm, curated space with a roaring fireplace, art on the walls, and a fully equipped chef's kitchen.
                        </p>
                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            I make it available to select guests when I am traveling. You will find it stocked, prepared, and ready for your arrival.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-white/80">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> 2 Bedrooms (Sleeps up to 4)
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Steps from Ski Pistes
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Large Sunset Balcony
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Wood-Burning Fireplace
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> High-Speed Starlink WiFi
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Sonos Sound System
                            </div>
                        </div>
                    </div>

                    {/* Highlight Image: Fireplace */}
                    <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-sm group">
                        <img
                            src="/images/villars-feature.jpg"
                            alt="Cozy Fireplace"
                            className="w-full h-full object-cover object-[center_35%] transition-transform duration-700 group-hover:scale-105 brightness-[0.85] contrast-[1.1] saturate-[0.9]"
                            loading="lazy"
                        />
                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/90">
                            Aprés-Ski Evenings
                        </div>
                    </div>
                </section>

                {/* Details & Atmosphere Section */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-16">
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Details & Atmosphere</span>
                            <h2 className="text-4xl font-serif">Curated for Comfort.</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Column 1: The Anchor (High Res Portrait) */}
                            <div className="space-y-8">
                                <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 border border-white/5">
                                    <img
                                        src="/images/loft/IMG_8759.jpg"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2000ms] ease-out grayscale hover:grayscale-0"
                                        alt="Loft Texture"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans">Texture Log No. 01</span>
                                    </div>
                                </div>
                                <div className="aspect-[1/1] overflow-hidden rounded-sm bg-neutral-900 group border border-white/5">
                                    <img
                                        src="/images/loft/IMG_6006.jpg"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2000ms] ease-out grayscale hover:grayscale-0"
                                        alt="Loft Light"
                                    />
                                </div>
                            </div>

                            {/* Column 2: The Narrative & Quote */}
                            <div className="pt-12 space-y-12">
                                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 group border border-white/10 relative">
                                    <img
                                        src="/images/loft/IMG_8736.jpg"
                                        className="w-full h-full object-cover group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[2000ms] ease-out grayscale"
                                        alt="Main Detail"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                                <div className="relative pl-8 border-l border-switz-red/30">
                                    <p className="text-white/60 font-light italic text-lg leading-relaxed max-w-[30ch]">
                                        "Every object in the loft has a story. From the vintage finds to local artisan textures, it's a sanctuary for the senses."
                                    </p>
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mt-4">— Internal Log</span>
                                </div>
                            </div>

                            {/* Column 3: Finishing Vignettes */}
                            <div className="space-y-8">
                                <div className="aspect-[1/1] overflow-hidden rounded-sm bg-neutral-900 group border border-white/5 relative">
                                    <img
                                        src="/images/loft/IMG_5973.jpg"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2000ms] ease-out grayscale hover:grayscale-0"
                                        alt="Loft Artifact"
                                    />
                                </div>
                                <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 border border-white/5">
                                    <img
                                        src="/images/loft/IMG_4277.jpg"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2000ms] ease-out grayscale hover:grayscale-0"
                                        alt="Loft Evening"
                                    />
                                    <div className="absolute bottom-4 right-4">
                                        <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans">046° 17' N / 007° 05' E</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Gallery Grid */}
                <section className="max-w-7xl mx-auto px-6 mb-24 text-center">
                    <h3 className="text-xs font-bold text-switz-red tracking-[0.2em] uppercase mb-8 ml-1 text-left">The Residence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 h-auto md:h-[500px]">

                        {/* Large Item */}
                        <div className="md:col-span-2 relative h-[300px] md:h-full overflow-hidden group">
                            <img
                                src="/images/villars-gallery-1.jpg"
                                alt="Balcony View"
                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 brightness-[0.85] contrast-[1.1]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="absolute bottom-6 left-6 text-white font-serif text-2xl italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                Unrivaled Sunsets
                            </span>
                        </div>

                        {/* Stacked Items */}
                        <div className="flex flex-col gap-1 h-[500px] md:h-full">
                            <div className="flex-1 relative overflow-hidden group">
                                <img
                                    src="/images/villars-gallery-2.jpg"
                                    alt="Premium Bath"
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 brightness-[0.85] contrast-[1.1]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex-1 relative overflow-hidden group">
                                <img
                                    src="/images/villars-gallery-3.jpg"
                                    alt="Day View"
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 brightness-[0.85] contrast-[1.1]"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 md:mt-24">
                        <a
                            href="/request-access"
                            className="inline-block bg-white text-black px-12 py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Become a Member to Book
                                <div className="w-0 group-hover:w-4 h-px bg-white transition-all duration-500" />
                            </span>
                        </a>
                        <p className="text-white/40 text-xs mt-4 max-w-sm">Membership required. Apply now for exclusive access to our sanctuaries.</p>
                    </div>
                </section>
            </main>

            <Footer />

        </div>
    );
}
