import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import MembershipGate from "../components/MembershipGate";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";
import { useAuth } from "@/hooks/use-auth";
import { Clock, Users, Utensils, ArrowRight } from "lucide-react";

export default function PrivateChef() {
    const { lang } = useParams();
    const { isLoggedIn } = useAuth();
    const { t, i18n } = useTranslation("common");
    const langPrefix = lang ? `/${lang}` : "";
    const currentLang = i18n.language || "en";
    const BASE_URL = "https://www.swissperiences.ch";
    const langUrl = currentLang !== "en" ? `/${currentLang}` : "";

    const serviceStructuredData = {
        "@context": "https://schema.org",
        "@type": "FoodService",
        "name": "Private Chef — In-Chalet Dining",
        "description": "A curated dining experience in the privacy of your alpine sanctuary. Local ingredients, Swiss-French technique, served with a view of the Alps.",
        "image": `${BASE_URL}/images/loft/IMG_8759.jpg`,
        "provider": {
            "@type": "Organization",
            "name": "Swissperiences",
            "url": BASE_URL
        },
        "areaServed": {
            "@type": "Place",
            "name": "Swiss Alps"
        }
    };

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: t("breadcrumbs.home", "Home"), href: `${BASE_URL}${langUrl}/` },
        { label: t("breadcrumbs.experiences", "Experiences"), href: `${BASE_URL}${langUrl}/experiences` },
        { label: "Private Chef", href: `${BASE_URL}${langUrl}/experiences/private-chef` },
    ]);

    const breadcrumbItems = [
        { label: t("breadcrumbs.home", "Home"), href: `${langPrefix}/` },
        { label: t("breadcrumbs.experiences", "Experiences"), href: `${langPrefix}/experiences` },
        { label: "Private Chef" },
    ];
    const menus = [
        {
            title: "Alpine Aperitivo",
            desc: "A curated selection of Swiss and alpine charcuterie, local cheeses, and seasonal accompaniments. Perfect for arrival evenings.",
            duration: "1-2 Hours",
            guests: "2-8 Guests"
        },
        {
            title: "The Full Experience",
            desc: "A multi-course Swiss-French dinner prepared and served in your chalet. From amuse-bouche to dessert, with paired wines from local vineyards.",
            duration: "3-4 Hours",
            guests: "2-6 Guests"
        },
        {
            title: "Fondue & Raclette Night",
            desc: "The quintessential Swiss evening. Traditional cheese fondue or raclette with all the fixings, paired with Fendant from Valais.",
            duration: "2-3 Hours",
            guests: "2-8 Guests"
        }
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Private Chef | In-Chalet Dining in the Swiss Alps"
                description="A curated dining experience in the privacy of your alpine sanctuary. Local ingredients, Swiss-French technique, served with a view of the Alps."
                keywords="private chef switzerland, in-chalet dining, swiss alps dining, luxury catering villars, fondue experience, alpine fine dining"
                canonical="https://www.swissperiences.ch/experiences/private-chef"
                ogImage={`${BASE_URL}/images/loft/IMG_8759.jpg`}
                structuredData={[serviceStructuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/loft/IMG_8759.jpg"
                            alt="Private Chef Experience"
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
                            Private Chef
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/80 font-light text-lg"
                        >
                            Fine dining in the privacy of your sanctuary. No reservations needed.
                        </motion.p>
                    </div>
                </section>

                <MembershipGate title="Your private dining experience." subtitle="Menus, pricing, and booking available exclusively to members.">
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
                        <h2 className="text-3xl font-serif mb-6">Your table. Your mountain.</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            Why fight for a reservation when the best table in the Alps is in your chalet? Our network of local chefs brings Swiss-French gastronomy directly to your sanctuary.
                        </p>
                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            From intimate dinners for two to group celebrations, every meal is crafted with local, seasonal ingredients and served with care.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div className="flex flex-col gap-2">
                                <Utensils className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Multi-Course</span>
                                <span className="text-xs text-white/50">Swiss-French Cuisine</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Clock className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Flexible Timing</span>
                                <span className="text-xs text-white/50">Lunch or Dinner</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Users className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Intimate or Group</span>
                                <span className="text-xs text-white/50">2-8 Guests</span>
                            </div>
                        </div>
                    </div>

                    {/* Menu Options */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                        <h3 className="text-xl font-serif mb-6">Curated Menus</h3>
                        <div className="space-y-6">
                            {menus.map((menu, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-sm font-bold text-white group-hover:text-switz-red transition-colors">{menu.title}</h4>
                                        <span className="text-xs text-white/40">{menu.duration}</span>
                                    </div>
                                    <p className="text-xs text-white/60 font-light">{menu.desc}</p>
                                    <span className="text-[10px] text-white/30 mt-1 block">{menu.guests}</span>
                                </div>
                            ))}
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
                <section className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
                    <img
                        src="/images/loft/IMG_8736.jpg"
                        alt="Chalet Atmosphere"
                        className="w-full h-full object-cover object-center opacity-50 brightness-[0.85]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl md:text-4xl font-serif text-white/90 italic text-center px-4">
                            "The best restaurant in the Alps has no sign."
                        </p>
                    </div>
                </section>
                </MembershipGate>

            </main>

            <Footer />

        </div>
    );
}
