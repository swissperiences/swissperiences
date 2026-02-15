import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Founder } from "../components/Founder";

export default function About() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "Organization",
            "name": "Swissperiences",
            "founder": {
                "@type": "Person",
                "name": "The Host",
                "jobTitle": "Founder",
                "address": { "@type": "PostalAddress", "addressCountry": "CH" }
            },
            "description": "A private network of curated alpine sanctuaries for those seeking silence in a noisy world.",
            "url": "https://swissperiences.ch"
        }
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="About Swissperiences | Our Story & Philosophy"
                description="Born in the Swiss Alps, Swissperiences curates silence for those who've earned it. Meet the founder, the philosophy, and the vision behind the brand."
                keywords="about swissperiences, swiss luxury concierge, alpine experiences founder, switzerland premium travel"
                canonical="https://swissperiences.ch/about"
                structuredData={structuredData}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/about-hero.jpg"
                            alt="Founder overlooking the Swiss Alps from Grindelwald"
                            className="w-full h-full object-cover object-[center_40%] brightness-[0.6] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            Our Story
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-8"
                        >
                            Born from Silence
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/60 font-light text-lg"
                        >
                            In a world optimized for stimulation, we curate its opposite.
                        </motion.p>
                    </div>
                </section>

                {/* Philosophy Section */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                        <div>
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">The Philosophy</span>
                            <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight">We don't sell experiences.<br /><span className="text-white/50 italic">We protect space.</span></h2>
                            <div className="space-y-6 text-white/60 font-light leading-relaxed">
                                <p>
                                    Swissperiences was born from a simple observation: the most successful people in the world have access to everything — except silence.
                                </p>
                                <p>
                                    Every luxury hotel competes for your attention. Every concierge fills your schedule. Every "exclusive" experience is designed to be shared on social media.
                                </p>
                                <p>
                                    We took the opposite approach. No itineraries. No networking events. No pressure to perform. Just curated alpine sanctuaries where you can exist without explanation.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 group">
                                <img
                                    src="/images/drone/villars-winter-sunset.jpg"
                                    alt="Villars village at sunset in winter"
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-[0.85]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-neutral-950 border border-white/10 px-6 py-4">
                                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] block mb-1">Founded</span>
                                <span className="text-white font-serif text-lg">Villars, 2024</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Founder */}
                <Founder />

                {/* Values Section */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Our Principles</span>
                            <h2 className="text-3xl md:text-4xl font-serif">What we believe.</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                            <div className="space-y-4">
                                <div className="text-4xl text-white/10 font-serif italic">01</div>
                                <h3 className="text-xl font-serif">Less is Everything</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    We believe the greatest luxury is an empty calendar. Our sanctuaries are designed for decompression, not stimulation.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-4xl text-white/10 font-serif italic">02</div>
                                <h3 className="text-xl font-serif">Curated, Not Crowded</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    Every member is selected. Every experience is intentional. We keep our community small because intimacy is the point.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="text-4xl text-white/10 font-serif italic">03</div>
                                <h3 className="text-xl font-serif">Swiss Precision, Human Soul</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    The logistics are flawless. The hospitality is personal. We combine Swiss efficiency with the warmth of a home, not a hotel.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="py-24 md:py-32 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">The Vision</span>
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                            A network of sanctuaries.<br /><span className="text-white/50 italic">One philosophy.</span>
                        </h2>
                        <div className="space-y-6 text-white/60 font-light text-lg leading-relaxed max-w-2xl mx-auto">
                            <p>
                                Swissperiences began with a single loft in the Swiss Alps. A personal space that was too beautiful to keep to ourselves.
                            </p>
                            <p>
                                The vision is a carefully curated network of sanctuaries across the world's most serene landscapes — each one handpicked, each one a home.
                            </p>
                        </div>
                        <div className="flex justify-center gap-12 mt-16 text-center">
                            <div>
                                <span className="text-3xl font-serif text-white">1</span>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2">Active Sanctuary</p>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div>
                                <span className="text-3xl font-serif text-white/40">2</span>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2">In Development</p>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div>
                                <span className="text-3xl font-serif text-white/40">∞</span>
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2">The Ambition</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 text-center border-t border-white/5">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to disconnect?</h2>
                        <p className="text-white/50 font-light mb-12">Membership is by application only.</p>
                        <a
                            href="/request-access"
                            className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                        >
                            Request Access
                        </a>
                    </div>
                </section>
            </main>

            <Footer />

        </div>
    );
}
