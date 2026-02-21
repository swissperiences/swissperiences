import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import { ArrowLeft, Clock, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { cn } from "@/lib/utils";
import { journals } from "@/data/journals";

export default function Journals() {
    const navigate = useNavigate();

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Guest Journals | Real Alpine Stories | Swissperiences"
                description="Real stories from real travelers. Explore our archive of curated Swiss journeys."
            />
            <Navigation />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="mb-24">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-white/40 hover:text-switz-red transition-colors text-xs uppercase tracking-[0.2em] mb-8"
                        >
                            <ArrowLeft size={14} /> Back to Sanctuary
                        </motion.button>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-2xl">
                                <span className="text-switz-red text-xs font-bold tracking-[0.3em] uppercase block mb-4">
                                    The Archives
                                </span>
                                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
                                    Guest Journals
                                </h1>
                                <p className="text-white/60 font-light text-lg leading-relaxed">
                                    Every journey is a blank canvas. Here we document the colors, the routes, and the moments that defined our signature intakes.
                                </p>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="flex items-center gap-4 text-white/20 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2"><Clock size={12} /> Real Time</div>
                                    <div className="flex items-center gap-2"><Camera size={12} /> Real Memories</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Journal Grid */}
                    <div className="space-y-40">
                        {journals.map((journal, jIdx) => (
                            <section key={journal.id} className="relative">
                                {/* Journal Title Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
                                    <div className="lg:col-span-4">
                                        <div className="sticky top-32">
                                            <span className="text-switz-red/50 text-[10vw] font-serif leading-none absolute -top-12 -left-4 pointer-events-none opacity-10">
                                                0{jIdx + 1}
                                            </span>
                                            <h2 className="text-4xl font-serif text-white mb-4 relative z-10">{journal.guests}</h2>
                                            <p className="text-switz-red text-sm uppercase tracking-[0.3em] mb-6">{journal.title}</p>
                                            <div className="w-12 h-px bg-white/20 mb-6" />
                                            <p className="text-white/50 font-light italic text-sm leading-relaxed mb-8">
                                                "{journal.description}"
                                            </p>

                                            <button
                                                onClick={() => navigate(`/journals/${journal.slug}`)}
                                                className="text-white text-xs uppercase tracking-[0.2em] border-b border-white/20 pb-1 hover:text-switz-red hover:border-switz-red transition-all"
                                            >
                                                Read Full Journal
                                            </button>
                                        </div>
                                    </div>

                                    {/* Full Timeline */}
                                    <div className="lg:col-span-8 space-y-32">
                                        {journal.itinerary.map((item, iIdx) => (
                                            <motion.div
                                                key={iIdx}
                                                initial={{ opacity: 0, y: 40 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-10%" }}
                                                transition={{ duration: 0.8 }}
                                                className="group cursor-pointer"
                                                onClick={() => navigate(`/journals/${journal.slug}`)}
                                            >
                                                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm mb-8 bg-neutral-900 shadow-2xl grain-overlay">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className={cn(
                                                            "w-full h-full object-cover scale-[1.01] hover:scale-105 transition-all duration-1000 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] hover:brightness-100",
                                                            (item as any).position || "object-center"
                                                        )}
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                                                </div>
                                                <div className="max-w-xl">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <span className="text-[10px] text-switz-red font-bold uppercase tracking-[0.3em]">
                                                            {item.day}
                                                        </span>
                                                        <div className="h-px flex-grow bg-white/5" />
                                                    </div>
                                                    <h3 className="text-2xl font-serif text-white mb-4 group-hover:text-switz-red-light transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-white/60 font-light leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-40 text-center border-t border-white/5 pt-24">
                        <h2 className="text-3xl font-serif text-white mb-8 italic">Your story could be next.</h2>
                        <button
                            onClick={() => navigate("/#upcoming-retreats")}
                            className="bg-white text-black px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-switz-red hover:text-white transition-all duration-500"
                        >
                            Request Invitation
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
