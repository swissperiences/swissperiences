import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import MembershipGate from "../components/MembershipGate";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";
import { useAuth } from "@/hooks/use-auth";
import { MapPin, Clock, Users, ArrowRight, Gauge, Ruler, AlertTriangle } from "lucide-react";

export default function MountainCoaster() {
    const { lang } = useParams();
    const { isLoggedIn } = useAuth();
    const { t, i18n } = useTranslation("common");
    const langPrefix = lang ? `/${lang}` : "";
    const currentLang = i18n.language || "en";
    const BASE_URL = "https://www.swissperiences.ch";
    const langUrl = currentLang !== "en" ? `/${currentLang}` : "";

    const experienceStructuredData = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": "Mountain Coaster",
        "description": "Alpine coaster rides through the Swiss Alps. Speed through hairpin turns with panoramic mountain views at world-class coaster locations.",
        "image": `${BASE_URL}/images/experiences-hero.jpg`,
        "touristType": "Adventure travelers",
        "provider": {
            "@type": "Organization",
            "name": "Swissperiences",
            "url": BASE_URL
        }
    };

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: t("breadcrumbs.home", "Home"), href: `${BASE_URL}${langUrl}/` },
        { label: t("breadcrumbs.experiences", "Experiences"), href: `${BASE_URL}${langUrl}/experiences` },
        { label: "Mountain Coaster", href: `${BASE_URL}${langUrl}/experiences/mountain-coaster` },
    ]);

    const breadcrumbItems = [
        { label: t("breadcrumbs.home", "Home"), href: `${langPrefix}/` },
        { label: t("breadcrumbs.experiences", "Experiences"), href: `${langPrefix}/experiences` },
        { label: "Mountain Coaster" },
    ];

    const locations = [
        {
            title: "Glacier 3000 Alpine Coaster",
            region: "Les Diablerets, Vaud",
            desc: "The highest alpine coaster in the world. A 1-kilometre descent from 3,000 metres with views of 24 peaks above 4,000m. Reached via the aerial cablecar from Col du Pillon.",
            altitude: "3,000m",
            length: "1,000m",
            season: "May — October",
        },
        {
            title: "Oeschinensee Rodelbahn",
            region: "Kandersteg, Bernese Oberland",
            desc: "A classic alpine coaster above one of Switzerland's most beautiful mountain lakes. 750 metres of curves and drops through alpine meadows with UNESCO-listed panorama.",
            altitude: "1,700m",
            length: "750m",
            season: "May — October",
        },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Mountain Coaster | Alpine Adventure | Swissperiences"
                description="Alpine coaster rides at the best locations in Switzerland. Glacier 3000, Oeschinensee, and more. Curated adventure experiences in the Swiss Alps."
                keywords="mountain coaster switzerland, alpine coaster swiss alps, glacier 3000 coaster, oeschinensee rodelbahn, kandersteg coaster, adventure switzerland"
                canonical="https://www.swissperiences.ch/experiences/mountain-coaster"
                structuredData={[experienceStructuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/experiences-hero.jpg"
                            alt="Alpine mountain coaster track winding through the Swiss Alps"
                            className="w-full h-full object-cover object-center brightness-[0.85] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase mb-4"
                        >
                            The Ride
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-6"
                        >
                            Mountain Coaster
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/80 font-light text-lg"
                        >
                            Speed through the Alps. Hairpin turns, panoramic drops, and pure adrenaline at altitude.
                        </motion.p>
                    </div>
                </section>

                <MembershipGate title="Your ride awaits." subtitle="Location details, pricing, and booking available exclusively to members.">
                {/* Intro & Specs */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8"
                        >
                            <Breadcrumbs items={breadcrumbItems} />
                        </motion.div>
                        <h2 className="text-3xl font-serif mb-6">Not a theme park. The real Alps.</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            Alpine coasters are built into the mountain itself — steel rails carved through
                            meadows and forests with nothing between you and the panorama. You control the speed.
                            The mountain provides the backdrop. This is Switzerland's most visceral way to
                            experience altitude.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div className="flex flex-col gap-2">
                                <Users className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Solo or Duo</span>
                                <span className="text-xs text-white/50">Adults & children 8+</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Clock className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Half Day</span>
                                <span className="text-xs text-white/50">Including transfers</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <MapPin className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Multiple Locations</span>
                                <span className="text-xs text-white/50">Vaud & Bernese Oberland</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                        <h3 className="text-xl font-serif mb-6">Locations</h3>
                        <div className="space-y-6">
                            {locations.map((loc, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-sm font-bold text-white group-hover:text-switz-red transition-colors">{loc.title}</h4>
                                        <span className="text-xs text-white/40">{loc.season}</span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">{loc.region}</p>
                                    <p className="text-xs text-white/60 font-light">{loc.desc}</p>
                                    <div className="flex gap-4 mt-2">
                                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                                            <Ruler size={10} /> {loc.length}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                                            <Gauge size={10} /> {loc.altitude}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Safety note */}
                        <div className="mt-6 p-4 bg-white/[0.03] border border-white/5 flex gap-3 items-start">
                            <AlertTriangle size={14} className="text-amber-400/70 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-white/40 leading-relaxed">
                                Age and height restrictions apply. Children under 8 must ride with an adult.
                                Operation subject to weather conditions.
                            </p>
                        </div>

                        <a
                            href={isLoggedIn ? "/members/book" : "/request-access"}
                            className="w-full mt-8 flex items-center justify-between bg-white text-black px-6 py-4 uppercase tracking-widest text-xs hover:bg-switz-red hover:text-white transition-colors duration-300"
                        >
                            <span>{isLoggedIn ? "Book This Experience" : "Become a Member to Book"}</span>
                            <ArrowRight size={16} />
                        </a>
                        {!isLoggedIn && <p className="text-white/40 text-[10px] mt-3 text-center">Available to members only. Request access to unlock curated alpine experiences.</p>}
                    </div>
                </section>

                {/* Visual Break */}
                <section className="w-full h-[400px] md:h-[600px] overflow-hidden relative mb-24">
                    <img
                        src="/images/oeschinen-lake.jpg"
                        alt="Oeschinensee mountain lake panoramic view"
                        className="w-full h-full object-cover object-center opacity-60 brightness-[0.85] contrast-[1.1] saturate-[0.9]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl md:text-4xl font-serif text-white/90 italic text-center px-4">
                            "You control the speed. The mountain does the rest."
                        </p>
                    </div>
                </section>
                </MembershipGate>
            </main>

            <Footer />
        </div>
    );
}
