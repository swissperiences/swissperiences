import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";
import { Clock, Users, Mountain, ArrowRight } from "lucide-react";

export default function GuidedHikes() {
    const { lang } = useParams();
    const { t, i18n } = useTranslation("common");
    const langPrefix = lang ? `/${lang}` : "";
    const currentLang = i18n.language || "en";
    const BASE_URL = "https://www.swissperiences.ch";
    const langUrl = currentLang !== "en" ? `/${currentLang}` : "";

    const experienceStructuredData = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": "Guided Alpine Hikes",
        "description": "Expert-led alpine adventures in the Swiss Alps. From gentle valley walks to challenging summit ascents.",
        "image": `${BASE_URL}/images/host-hiking.jpg`,
        "touristType": "Luxury travelers",
        "provider": {
            "@type": "Organization",
            "name": "Swissperiences",
            "url": BASE_URL
        }
    };

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: t("breadcrumbs.home", "Home"), href: `${BASE_URL}${langUrl}/` },
        { label: t("breadcrumbs.experiences", "Experiences"), href: `${BASE_URL}${langUrl}/experiences` },
        { label: "Guided Hikes", href: `${BASE_URL}${langUrl}/experiences/guided-hikes` },
    ]);

    const breadcrumbItems = [
        { label: t("breadcrumbs.home", "Home"), href: `${langPrefix}/` },
        { label: t("breadcrumbs.experiences", "Experiences"), href: `${langPrefix}/experiences` },
        { label: "Guided Hikes" },
    ];
    const trails = [
        {
            title: "The Panoramic Circuit",
            desc: "A gentle ridgeline walk with 360° views of the Dents du Midi, Mont Blanc, and the Rhone Valley. Suitable for all fitness levels.",
            duration: "3-4 Hours",
            difficulty: "Easy"
        },
        {
            title: "Col de la Croix Ascent",
            desc: "A moderate climb through alpine meadows and pine forests to the Col de la Croix pass. Rewarded with sweeping views and a picnic lunch.",
            duration: "5-6 Hours",
            difficulty: "Moderate"
        },
        {
            title: "Glacier 3000 Summit Trail",
            desc: "A full-day alpine adventure to the glacier at 3,000m. Includes cable car access, guided glacier walk, and summit lunch.",
            duration: "Full Day",
            difficulty: "Challenging"
        }
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Guided Alpine Hikes | Expert Mountain Guides in Switzerland"
                description="Expert-led alpine adventures in the Swiss Alps. From gentle valley walks to challenging summit ascents. Every trail handpicked for beauty, safety, and solitude."
                keywords="guided hikes switzerland, swiss alps hiking, mountain guide villars, alpine trekking, glacier 3000 hike, swiss mountain experience"
                canonical="https://swissperiences.ch/experiences/guided-hikes"
                ogImage={`${BASE_URL}/images/host-hiking.jpg`}
                structuredData={[experienceStructuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/host-hiking.jpg"
                            alt="Alpine Hiking"
                            className="w-full h-full object-cover brightness-[0.6] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase mb-4"
                        >
                            The Experience
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-6"
                        >
                            Guided Hikes
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/80 font-light text-lg"
                        >
                            Expert mountain guides. Handpicked trails. Absolute solitude.
                        </motion.p>
                    </div>
                </section>

                {/* Intro */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8"
                        >
                            <Breadcrumbs items={breadcrumbItems} />
                        </motion.div>
                        <h2 className="text-3xl font-serif mb-6">The Alps on your terms.</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            Switzerland has over 65,000 km of marked hiking trails. We know the ones worth taking. Our certified mountain guides lead private expeditions tailored to your fitness level, interests, and pace.
                        </p>
                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            No tour groups. No crowds. Just you, the mountain, and a guide who knows every hidden waterfall and secret viewpoint.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div className="flex flex-col gap-2">
                                <Mountain className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">All Levels</span>
                                <span className="text-xs text-white/50">Easy to Expert</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Clock className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Flexible Duration</span>
                                <span className="text-xs text-white/50">Half or Full Day</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Users className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Private Groups</span>
                                <span className="text-xs text-white/50">1-8 Hikers</span>
                            </div>
                        </div>
                    </div>

                    {/* Trail Options */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                        <h3 className="text-xl font-serif mb-6">Curated Trails</h3>
                        <div className="space-y-6">
                            {trails.map((trail, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-sm font-bold text-white group-hover:text-switz-red transition-colors">{trail.title}</h4>
                                        <span className="text-xs text-white/40">{trail.duration}</span>
                                    </div>
                                    <p className="text-xs text-white/60 font-light">{trail.desc}</p>
                                    <span className="text-[10px] text-white/30 mt-1 block">Difficulty: {trail.difficulty}</span>
                                </div>
                            ))}
                        </div>
                        <a
                            href="/request-access"
                            className="w-full mt-8 flex items-center justify-between bg-white text-black px-6 py-4 uppercase tracking-widest text-xs hover:bg-switz-red hover:text-white transition-colors duration-300"
                        >
                            <span>Become a Member to Book</span>
                            <ArrowRight size={16} />
                        </a>
                        <p className="text-white/40 text-[10px] mt-3 text-center">Available to members only. Request access to unlock curated alpine experiences.</p>
                    </div>
                </section>

                {/* Visual Break */}
                <section className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
                    <img
                        src="/images/host-contemplating.jpg"
                        alt="Host contemplating the Swiss Alps"
                        className="w-full h-full object-cover object-center opacity-50 brightness-[0.85]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl md:text-4xl font-serif text-white/90 italic text-center px-4">
                            "The mountains are calling."
                        </p>
                    </div>
                </section>

            </main>

            <Footer />

        </div>
    );
}
