import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { buildBreadcrumbJsonLd } from "../components/Breadcrumbs";
import MembershipGate from "../components/MembershipGate";
import { ArrowRight } from "lucide-react";

export default function Sanctuaries() {
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: "Home", href: "https://www.swissperiences.ch/" },
        { label: "Sanctuaries", href: "https://www.swissperiences.ch/sanctuaries" },
    ]);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Swissperiences Sanctuaries",
        "description": "A curated network of private alpine sanctuaries.",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "LodgingBusiness",
                    "name": "The Villars Loft",
                    "address": { "@type": "PostalAddress", "addressLocality": "Villars-sur-Ollon", "addressCountry": "CH" }
                }
            }
        ]
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Alpine Sanctuaries | Private Retreats in Switzerland"
                description="Discover our network of curated alpine sanctuaries. Private residences in the Swiss Alps designed for those seeking silence and beauty."
                keywords="swiss alpine sanctuary, private retreat switzerland, luxury chalet villars, exclusive swiss accommodation, alpine hideaway"
                canonical="https://www.swissperiences.ch/sanctuaries"
                structuredData={[structuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[80vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/villars-sunrise.jpg"
                            alt="Swiss Alps Panorama"
                            className="w-full h-full object-cover brightness-[0.6] contrast-[1.1] saturate-[0.9]"
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
                            Our Sanctuaries
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/60 font-light text-lg"
                        >
                            Private residences in the world's most serene landscapes. Each one handpicked. Each one a home.
                        </motion.p>
                    </div>
                </section>

                <MembershipGate title="Your sanctuary awaits." subtitle="Full details, availability, and member pricing visible after approval.">
                {/* Villars — Active */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        <Link to="/sanctuaries/villars" className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-900">
                            <img
                                src="/images/villars-hero.jpg"
                                alt="The Villars Loft"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute top-6 left-6">
                                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                                    Active
                                </span>
                            </div>
                            <div className="absolute bottom-6 left-6">
                                <span className="text-[10px] text-white/50 uppercase tracking-[0.2em]">046° 17' N / 007° 05' E</span>
                            </div>
                        </Link>
                        <div className="space-y-6">
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold">Sanctuary 01</span>
                            <h2 className="text-4xl md:text-5xl font-serif leading-tight">The Villars Loft</h2>
                            <p className="text-white/40 text-sm uppercase tracking-widest">Villars-sur-Ollon, Swiss Alps</p>
                            <p className="text-white/60 font-light leading-relaxed max-w-lg">
                                A private designer loft steps from the ski pistes. Fireplace, sunset balcony, Starlink WiFi, and Sonos throughout. Not a rental — a curated residence made available to select guests.
                            </p>
                            <div className="grid grid-cols-2 gap-4 text-sm text-white/80 pt-4">
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> 2 Bedrooms
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Steps from Pistes
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Wood Fireplace
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> From CHF 1,200/night
                                </div>
                            </div>
                            <Link
                                to="/sanctuaries/villars"
                                className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 mt-4"
                            >
                                Explore Villars <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="border-t border-white/5" />
                </div>

                {/* Coming Soon Sanctuaries */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="text-center mb-16">
                        <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Expanding the Network</span>
                        <h2 className="text-3xl md:text-4xl font-serif">What's next.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Verbier */}
                        <div className="group relative overflow-hidden rounded-sm border border-white/5">
                            <div className="aspect-[16/9] overflow-hidden relative">
                                <img
                                    src="/images/verbier-mountains.jpg"
                                    alt="Verbier, Swiss Alps"
                                    className="w-full h-full object-cover object-[center_40%] brightness-[0.4] saturate-[0.6] group-hover:brightness-[0.5] transition-all duration-700"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl md:text-8xl font-serif text-white/[0.08]">02</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white/30 text-[9px] uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">2027</span>
                                </div>
                                <h3 className="text-2xl font-serif text-white/70 mb-2">Verbier</h3>
                                <p className="text-white/40 text-sm mb-4">Valais, Switzerland</p>
                                <p className="text-white/30 font-light text-sm leading-relaxed">
                                    A high-altitude sanctuary in one of the world's most coveted alpine villages. Designed for those who chase both powder and peace.
                                </p>
                            </div>
                        </div>

                        {/* Zermatt */}
                        <div className="group relative overflow-hidden rounded-sm border border-white/5">
                            <div className="aspect-[16/9] overflow-hidden relative">
                                <img
                                    src="/images/zermatt-matterhorn.jpg"
                                    alt="Zermatt, Matterhorn"
                                    className="w-full h-full object-cover object-[center_20%] brightness-[0.4] saturate-[0.6] group-hover:brightness-[0.5] transition-all duration-700"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl md:text-8xl font-serif text-white/[0.08]">03</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white/30 text-[9px] uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">2028</span>
                                </div>
                                <h3 className="text-2xl font-serif text-white/70 mb-2">Zermatt</h3>
                                <p className="text-white/40 text-sm mb-4">Matterhorn, Switzerland</p>
                                <p className="text-white/30 font-light text-sm leading-relaxed">
                                    At the foot of the most iconic mountain in the Alps. A sanctuary where grandeur meets solitude.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 text-center border-t border-white/5">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">Your sanctuary awaits.</h2>
                        <p className="text-white/50 font-light mb-12">Full details, availability, and member pricing visible after approval.</p>
                        <a
                            href="/request-access"
                            className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                        >
                            Request Access
                        </a>
                    </div>
                </section>
                </MembershipGate>
            </main>

            <Footer />

        </div>
    );
}
