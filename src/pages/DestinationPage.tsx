import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    ArrowRight, MapPin, Mountain, Train, Wine, Plane, Car, Camera,
    Snowflake, Sun, Music, Compass, Home, Droplets, BookOpen, Waves,
    Ship, Landmark, Trophy, GraduationCap, Grape, Castle, CableCar
} from "lucide-react";
import { getCityBySlug } from "@/data/cities";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "@/components/Breadcrumbs";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    MapPin, Mountain, Train, Wine, Plane, Car, Camera, Snowflake, Sun,
    Music, Compass, Home, Droplets, BookOpen, Waves, Ship, Landmark,
    Trophy, GraduationCap, Grape, Castle, CableCar,
};

function getIcon(name: string) {
    return iconMap[name] || MapPin;
}

export default function DestinationPage() {
    const { slug, lang } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("common");
    const city = getCityBySlug(slug || "");

    // Language-aware path prefix for breadcrumb links
    const langPrefix = lang ? `/${lang}` : "";
    const currentLang = i18n.language || "en";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!city) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-serif mb-4">Destination Not Found</h1>
                    <button onClick={() => navigate("/destinations")} className="text-switz-red hover:underline">
                        {t("destinations.backToAll", "All Destinations")}
                    </button>
                </div>
            </div>
        );
    }

    const BASE_URL = "https://www.swissperiences.ch";
    const langUrl = currentLang !== "en" ? `/${currentLang}` : "";

    const touristDestinationData = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": city.name,
        "description": city.seo.description,
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": parseFloat(city.coordinates.split("N")[0].replace(/[°']/g, "").trim().replace(/\s+/g, ".")),
            "longitude": parseFloat(city.coordinates.split("/")[1].replace(/[°'EWNS]/g, "").trim().replace(/\s+/g, "."))
        },
        "image": `${BASE_URL}${city.detailHeroImage || city.heroImage}`,
        "touristType": "Luxury travelers",
        "containedInPlace": {
            "@type": "Country",
            "name": "Switzerland"
        }
    };

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: t("breadcrumbs.home", "Home"), href: `${BASE_URL}${langUrl}/` },
        { label: t("breadcrumbs.destinations", "Destinations"), href: `${BASE_URL}${langUrl}/destinations` },
        { label: city.name, href: `${BASE_URL}${langUrl}/destinations/${city.slug}` },
    ]);

    const breadcrumbItems = [
        { label: t("breadcrumbs.home", "Home"), href: `${langPrefix}/` },
        { label: t("breadcrumbs.destinations", "Destinations"), href: `${langPrefix}/destinations` },
        { label: city.name },
    ];

    const hasRelated = city.relatedExperiences.length > 0 || city.relatedSanctuaries.length > 0 || city.relatedJournals.length > 0;

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title={city.seo.title}
                description={city.seo.description}
                keywords={city.seo.keywords}
                canonical={`${BASE_URL}/destinations/${city.slug}`}
                ogImage={`${BASE_URL}${city.detailHeroImage || city.heroImage}`}
                structuredData={[touristDestinationData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[75vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <motion.img
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 8, ease: "linear" }}
                            src={city.detailHeroImage || city.heroImage}
                            alt={city.name}
                            className={`w-full h-full object-cover brightness-[0.6] contrast-[1.1] saturate-[0.9] ${city.detailHeroPosition || city.heroPosition || "object-center"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            {city.region}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.1]"
                        >
                            {city.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/50 font-light text-lg md:text-xl italic font-serif"
                        >
                            {city.tagline}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8"
                        >
                            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{city.coordinates}</span>
                        </motion.div>
                    </div>
                </section>

                {/* Introduction + Stats */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Breadcrumbs items={breadcrumbItems} />
                            </motion.div>
                            <p className="text-white/60 font-light text-lg leading-relaxed max-w-[60ch]">
                                {city.description}
                            </p>
                        </div>
                        <div className="space-y-6 border border-white/5 rounded-sm p-8 bg-white/[0.02]">
                            <div>
                                <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] block mb-1">{t("destinations.elevation", "Elevation")}</span>
                                <span className="text-white text-lg font-light">{city.elevation}</span>
                            </div>
                            <div className="border-t border-white/5 pt-4">
                                <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] block mb-1">{t("destinations.canton", "Canton")}</span>
                                <span className="text-white text-lg font-light">{city.canton}</span>
                            </div>
                            <div className="border-t border-white/5 pt-4">
                                <span className="text-white/30 text-[10px] uppercase tracking-[0.2em] block mb-1">{t("destinations.coordinates", "Coordinates")}</span>
                                <span className="text-white/70 text-sm font-light">{city.coordinates}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Highlights */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">{t("destinations.highlights", "Highlights")}</span>
                        <h2 className="text-3xl md:text-4xl font-serif mb-16">What defines {city.name}.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {city.highlights.map((highlight, i) => {
                                const Icon = getIcon(highlight.icon);
                                return (
                                    <div key={i} className="space-y-6">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-switz-red">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="text-xl font-serif">{highlight.title}</h3>
                                        <p className="text-white/50 font-light text-sm leading-relaxed">
                                            {highlight.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Related Content */}
                {hasRelated && (
                    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                        <div className="space-y-16">
                            {city.relatedSanctuaries.length > 0 && (
                                <div>
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-8">
                                        {t("destinations.relatedSanctuaries", "Stay Here")}
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {city.relatedSanctuaries.map((link, i) => (
                                            <Link
                                                key={i}
                                                to={link.href}
                                                className="group flex items-center justify-between border border-white/5 hover:border-white/20 rounded-sm p-6 transition-all duration-500"
                                            >
                                                <span className="text-white/80 group-hover:text-white font-light transition-colors">{link.title}</span>
                                                <ArrowRight size={14} className="text-white/20 group-hover:text-switz-red transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {city.relatedExperiences.length > 0 && (
                                <div>
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-8">
                                        {t("destinations.relatedExperiences", "Experiences Here")}
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {city.relatedExperiences.map((link, i) => (
                                            <Link
                                                key={i}
                                                to={link.href}
                                                className="group flex items-center justify-between border border-white/5 hover:border-white/20 rounded-sm p-6 transition-all duration-500"
                                            >
                                                <span className="text-white/80 group-hover:text-white font-light transition-colors">{link.title}</span>
                                                <ArrowRight size={14} className="text-white/20 group-hover:text-switz-red transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {city.relatedJournals.length > 0 && (
                                <div>
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-8">
                                        {t("destinations.relatedJournals", "Stories from Here")}
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {city.relatedJournals.map((link, i) => (
                                            <Link
                                                key={i}
                                                to={link.href}
                                                className="group flex items-center justify-between border border-white/5 hover:border-white/20 rounded-sm p-6 transition-all duration-500"
                                            >
                                                <span className="text-white/80 group-hover:text-white font-light transition-colors">{link.title}</span>
                                                <ArrowRight size={14} className="text-white/20 group-hover:text-switz-red transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="py-24 px-6 text-center border-t border-white/5">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">{t("destinations.ctaTitle", "Your destination awaits.")}</h2>
                        <p className="text-white/50 font-light mb-12">Full details, availability, and member pricing visible after approval.</p>
                        <a
                            href="/request-access"
                            className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                        >
                            {t("destinations.ctaButton", "Become a Member")}
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
