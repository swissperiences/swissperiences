import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import MembershipGate from "../components/MembershipGate";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";
import { useAuth } from "@/hooks/use-auth";
import { Clock, Users, Utensils, ArrowRight, MapPin, MessageSquare, ChefHat, Sparkles } from "lucide-react";

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
        "name": "Private Chef — Bespoke In-Home Dining",
        "description": "A bespoke dining experience crafted around you. Seasonal ingredients, Swiss-French technique, available across Switzerland.",
        "image": `${BASE_URL}/images/chef/private-chef-hero.jpeg`,
        "provider": {
            "@type": "Organization",
            "name": "Swissperiences",
            "url": BASE_URL
        },
        "areaServed": {
            "@type": "Country",
            "name": "Switzerland"
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

    const galleryImages = [
        { src: "/images/chef/scallops-caviar.jpg", alt: "Scallops with caviar and asparagus" },
        { src: "/images/chef/ceviche.jpg", alt: "Fresh ceviche with seasonal vegetables" },
        { src: "/images/chef/fish-elegant.jpg", alt: "Pan-seared fish with herb purée" },
        { src: "/images/chef/burrata-prosciutto.jpg", alt: "Burrata and prosciutto plates" },
        { src: "/images/chef/dessert-artistic.jpg", alt: "Artistic dessert presentation" },
        { src: "/images/chef/crumble-caramel.jpg", alt: "Apple crumble with salted caramel" },
    ];

    const steps = [
        {
            icon: MessageSquare,
            title: "Tell us your vision",
            desc: "Share your preferences, dietary needs, group size, and the occasion. We listen first."
        },
        {
            icon: ChefHat,
            title: "We craft your menu",
            desc: "Our chef designs a bespoke multi-course experience using seasonal, locally sourced ingredients."
        },
        {
            icon: Sparkles,
            title: "Sit back and enjoy",
            desc: "Your chef arrives, prepares everything on-site, serves each course, and leaves your kitchen spotless."
        }
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Private Chef | Bespoke In-Home Dining Across Switzerland"
                description="A bespoke dining experience crafted around you. Seasonal ingredients, Swiss-French technique, from intimate dinners to celebrations. Available across Switzerland."
                keywords="private chef switzerland, private chef geneva, in-home dining, bespoke dining experience, private dining swiss alps, luxury catering switzerland, personal chef service"
                canonical="https://www.swissperiences.ch/experiences/private-chef"
                ogImage={`${BASE_URL}/images/chef/private-chef-hero.jpeg`}
                structuredData={[serviceStructuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/chef/private-chef-hero.jpeg"
                            alt="Bespoke Private Chef Experience"
                            className="w-full h-full object-cover object-center brightness-[0.65] contrast-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
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
                            Fine dining, wherever you are in Switzerland. Crafted around you.
                        </motion.p>
                    </div>
                </section>

                <MembershipGate title="Your private dining experience." subtitle="Menus, pricing, and booking available exclusively to members.">
                {/* Intro + Bespoke Philosophy */}
                <section className="max-w-7xl mx-auto px-6 py-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Breadcrumbs items={breadcrumbItems} />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif mb-6">Your menu. Your moment.</h2>
                            <p className="text-white/60 font-light leading-relaxed mb-6">
                                Every dinner we host is different — because every guest is different. There are no fixed menus here. Tell us what you love, and our chef will design a multi-course experience around your preferences, dietary needs, and the occasion.
                            </p>
                            <p className="text-white/60 font-light leading-relaxed mb-6">
                                Our chefs are hand-picked from Switzerland's most celebrated kitchens. They bring seasonal, locally sourced ingredients directly to your home — whether that's a lakeside apartment in Geneva, a chalet in Verbier, or anywhere in between.
                            </p>
                            <p className="text-white/55 font-light leading-relaxed text-sm">
                                From intimate dinners for two to group celebrations of up to twelve, with optional wine pairings from Swiss vineyards. Available on demand, across Switzerland.
                            </p>
                        </div>

                        {/* Feature Cards */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                                <Utensils className="text-switz-red w-5 h-5 mb-3" />
                                <span className="text-sm font-medium block mb-1">Bespoke Menus</span>
                                <span className="text-xs text-white/60">Crafted around your preferences</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                                <Clock className="text-switz-red w-5 h-5 mb-3" />
                                <span className="text-sm font-medium block mb-1">On Demand</span>
                                <span className="text-xs text-white/60">Book when you need us</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                                <Users className="text-switz-red w-5 h-5 mb-3" />
                                <span className="text-sm font-medium block mb-1">2–12 Guests</span>
                                <span className="text-xs text-white/60">Intimate to celebration</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                                <MapPin className="text-switz-red w-5 h-5 mb-3" />
                                <span className="text-sm font-medium block mb-1">Across Switzerland</span>
                                <span className="text-xs text-white/60">Geneva, Alps & beyond</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Food Gallery */}
                <section className="max-w-7xl mx-auto px-6 pb-24">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-8">From Our Kitchen</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {galleryImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="aspect-square overflow-hidden relative group"
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-white/30 text-xs mt-4 text-center">Seasonal dishes — menus change with every booking</p>
                </section>

                {/* How It Works */}
                <section className="bg-white/[0.02] border-y border-white/10 py-24">
                    <div className="max-w-5xl mx-auto px-6">
                        <h3 className="text-2xl font-serif text-center mb-16">How it works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 mb-6">
                                        <step.icon className="text-switz-red w-5 h-5" />
                                    </div>
                                    <span className="text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase block mb-3">Step {idx + 1}</span>
                                    <h4 className="text-sm font-bold mb-2">{step.title}</h4>
                                    <p className="text-xs text-white/60 font-light leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visual Break + CTA */}
                <section className="w-full h-[400px] md:h-[500px] overflow-hidden relative">
                    <img
                        src="/images/chef/restaurant-ambiance.jpg"
                        alt="Fine dining ambiance"
                        className="w-full h-full object-cover object-center opacity-60 brightness-[0.85]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950/60" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <p className="text-xl md:text-3xl font-serif text-white/90 mb-8 max-w-2xl">
                            Every detail considered. Every course personal. Every evening yours.
                        </p>
                        <a
                            href={isLoggedIn ? "/members/book" : "/request-access"}
                            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 uppercase tracking-widest text-xs hover:bg-switz-red hover:text-white transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-switz-red focus:ring-offset-2 focus:ring-offset-neutral-950"
                        >
                            <span>{isLoggedIn ? "Book This Experience" : "Become a Member to Book"}</span>
                            <ArrowRight size={16} />
                        </a>
                        {!isLoggedIn && (
                            <p className="text-white/40 text-[10px] mt-4">
                                Available to members only. Request access to unlock curated experiences.
                            </p>
                        )}
                    </div>
                </section>
                </MembershipGate>

            </main>

            <Footer />

        </div>
    );
}
