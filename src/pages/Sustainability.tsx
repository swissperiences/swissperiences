import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// ─── SDG Data ────────────────────────────────────────────────────────────────

interface SDGItem {
    number: number;
    title: string;
    description: string;
    color: string;
}

const sdgs: SDGItem[] = [
    {
        number: 8,
        title: "Decent Work & Economic Growth",
        description:
            "We collaborate with local guides, restaurants and producers in Villars and the surrounding region. Each stay redirects part of your investment into people who actually live and work in these mountains.",
        color: "#A21942",
    },
    {
        number: 11,
        title: "Sustainable Cities & Communities",
        description:
            "We keep groups intentionally small, move off‑peak whenever possible and encourage guests to slow down instead of 'checking off' attractions. Less crowding, more connection with the village as it really is.",
        color: "#FD9D24",
    },
    {
        number: 12,
        title: "Responsible Consumption & Production",
        description:
            "We prioritize local food, seasonal products and simple experiences over high‑impact, high‑waste activities. A weekend here is built around time, silence and place — not constant consumption.",
        color: "#BF8B2E",
    },
    {
        number: 13,
        title: "Climate Action",
        description:
            "Swissperiences operates a handful of curated weekends per season, not mass tourism. We're exploring ways to further reduce our footprint over time while still making the mountains accessible with care.",
        color: "#3F7E44",
    },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function Sustainability() {
    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Sustainability | Swissperiences"
                description="How Swissperiences aligns with the UN Sustainable Development Goals — local economy, small groups, seasonal produce, and low-impact travel in the Swiss Alps."
                keywords="sustainability, SDGs, responsible travel, swiss alps, eco-friendly, sustainable tourism"
                canonical="https://swissperiences.ch/sustainability"
            />
            <Navigation />

            <main>
                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block"
                        >
                            Our Commitment
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight"
                        >
                            Swissperiences & the SDGs<span className="text-switz-red">.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 font-light text-lg md:text-xl leading-relaxed max-w-xl mx-auto"
                        >
                            Small, on purpose. But still connected to something bigger.
                        </motion.p>
                    </div>
                </section>

                {/* ── Intro ────────────────────────────────────────────── */}
                <section className="max-w-3xl mx-auto px-6 pb-20 md:pb-28">
                    <ScrollReveal>
                        <div className="border-l-2 border-switz-red/30 pl-6 md:pl-8">
                            <p className="text-white/60 font-light text-base md:text-lg leading-relaxed">
                                Swissperiences is small by design — but even a few weekends in the Alps can align with something bigger. Our work touches a handful of the UN Sustainable Development Goals in a very local, very human way.
                            </p>
                        </div>
                    </ScrollReveal>
                </section>

                {/* ── SDG Cards ────────────────────────────────────────── */}
                <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-28">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {sdgs.map((sdg, index) => (
                            <ScrollReveal key={sdg.number} delay={index * 0.1}>
                                <div className="group border border-white/5 hover:border-white/15 rounded-sm p-8 md:p-10 transition-all duration-500 h-full">
                                    <div className="flex items-center gap-4 mb-5">
                                        <span
                                            className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm"
                                            style={{
                                                backgroundColor: sdg.color + "20",
                                                color: sdg.color,
                                            }}
                                        >
                                            SDG {sdg.number}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-serif text-white mb-4 group-hover:text-white/90 transition-colors">
                                        {sdg.title}<span className="text-switz-red">.</span>
                                    </h3>
                                    <p className="text-white/40 font-light text-sm leading-relaxed group-hover:text-white/55 transition-colors">
                                        {sdg.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </section>

                {/* ── Closing ──────────────────────────────────────────── */}
                <section className="border-t border-white/5 py-20 md:py-28">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <ScrollReveal>
                            <p className="text-white/50 font-light text-base md:text-lg leading-relaxed italic max-w-xl mx-auto">
                                "We're not a big resort — we're a small practice in how travel can feel lighter, fairer and more rooted in place."
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
