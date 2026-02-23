import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";
import MembershipGate from "../components/MembershipGate";
import { cities } from "@/data/cities";

export default function Destinations() {
    const { t } = useTranslation("common");

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: "Home", href: "https://www.swissperiences.ch/" },
        { label: "Destinations", href: "https://www.swissperiences.ch/destinations" },
    ]);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Swissperiences Destinations",
        "description": "Curated Swiss destinations for luxury alpine experiences.",
        "itemListElement": cities.map((city, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
                "@type": "TouristDestination",
                "name": city.name,
                "url": `https://www.swissperiences.ch/destinations/${city.slug}`
            }
        }))
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Curated Swiss Destinations | Geneva, Villars, Zermatt | Swissperiences"
                description="Explore our curated network of Swiss destinations. From Geneva to Zermatt, each location handpicked for extraordinary alpine experiences."
                keywords="swiss destinations, switzerland travel, alpine cities, geneva, zermatt, interlaken, villars, lauterbrunnen, luxury swiss travel"
                canonical="https://www.swissperiences.ch/destinations"
                structuredData={[structuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[80vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/destinations-hero.jpg"
                            alt="Aerial view of Geneva with Jet d'Eau and Lake Léman"
                            className="w-full h-full object-cover object-[center_40%] brightness-[0.5] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            The Network
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1]"
                        >
                            {t("destinations.heroTitle", "Destinations")}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/60 font-light text-lg"
                        >
                            {t("destinations.heroSubtitle", "The places that define our journeys. Each one handpicked. Each one extraordinary.")}
                        </motion.p>
                    </div>
                </section>

                <MembershipGate title="Your destination awaits." subtitle="Explore our curated destinations. Apply for membership to unlock the full guide.">
                {/* Destinations Grid */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-24">
                    {cities.map((city, idx) => (
                        <div
                            key={city.slug}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center ${idx % 2 !== 0 ? "lg:[direction:rtl]" : ""}`}
                        >
                            <Link
                                to={`/destinations/${city.slug}`}
                                className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-900 lg:[direction:ltr]"
                            >
                                <img
                                    src={city.heroImage}
                                    alt={city.name}
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] ${city.heroPosition || "object-center"}`}
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em]">{city.coordinates}</span>
                                </div>
                            </Link>
                            <div className="space-y-6 lg:[direction:ltr]">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold">
                                    {String(idx + 1).padStart(2, "0")} / {city.region}
                                </span>
                                <h2 className="text-4xl md:text-5xl font-serif leading-tight">{city.name}</h2>
                                <p className="text-white/40 text-sm uppercase tracking-widest">{city.canton}, Switzerland</p>
                                <p className="text-white/60 font-light leading-relaxed max-w-lg italic font-serif">
                                    "{city.tagline}"
                                </p>
                                <Link
                                    to={`/destinations/${city.slug}`}
                                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 mt-4"
                                >
                                    {t("destinations.explore", "Explore")} {city.name} <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>

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
                </MembershipGate>
            </main>

            <Footer />
        </div>
    );
}
