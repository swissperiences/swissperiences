import { motion } from "framer-motion";
import { useState, Suspense, lazy } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const WaitlistModal = lazy(() => import("../components/WaitlistModal").then(m => ({ default: m.WaitlistModal })));

export default function VillarsRetreat() {
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);


    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <Navigation onWaitlistClick={() => setIsWaitlistOpen(true)} />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/apt-living-room-2.jpg"
                            alt="Villars Retreat Living Room"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase mb-4"
                        >
                            Private Residence
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-6"
                        >
                            The Villars Loft
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/80 font-light text-lg"
                        >
                            More than an apartment. Your personal headquarters in the Swiss Alps.
                        </motion.p>
                    </div>
                </section>

                {/* Intro & Amenities */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                    <div>
                        <h2 className="text-3xl font-serif mb-6">A home, not a rental.</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-6">
                            Located just minutes from the Villars-sur-Ollon ski station, this is my personal residence in the mountains.
                            It is not a sterile rental unit; it is a warm, curated space with a roaring fireplace, art on the walls, and a fully equipped chef's kitchen.
                        </p>
                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            I make it available to select guests when I am traveling. You will find it stocked, prepared, and ready for your arrival.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-white/80">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> 4 Bedrooms (Sleeps up to 8)
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Steps from Ski Pistes
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Large Sunset Balcony
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Wood-Burning Fireplace
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> High-Speed Starlink WiFi
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-switz-red rounded-full" /> Sonos Sound System
                            </div>
                        </div>
                    </div>

                    {/* Highlight Image: Fireplace */}
                    <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-sm group">
                        <img
                            src="/images/apartment-fireplace.jpg"
                            alt="Cozy Fireplace"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 text-xs uppercase tracking-widest text-white/90">
                            Aprés-Ski Evenings
                        </div>
                    </div>
                </section>

                {/* The Gallery Grid */}
                <section className="max-w-7xl mx-auto px-6 mb-24">
                    <h3 className="text-xs font-bold text-switz-red tracking-[0.2em] uppercase mb-8 ml-1">The Residence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 h-auto md:h-[500px]">

                        {/* Large Item */}
                        <div className="md:col-span-2 relative h-[300px] md:h-full overflow-hidden group">
                            <img
                                src="/images/apt-balcony-sunset.jpg"
                                alt="Balcony View"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="absolute bottom-6 left-6 text-white font-serif text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                Unrivaled Sunsets
                            </span>
                        </div>

                        {/* Stacked Items */}
                        <div className="flex flex-col gap-1 h-[500px] md:h-full">
                            <div className="flex-1 relative overflow-hidden group">
                                <img
                                    src="/images/apt-bathroom.jpg"
                                    alt="Premium Bath"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex-1 relative overflow-hidden group">
                                <img
                                    src="/images/apt-balcony-day.jpg"
                                    alt="Day View"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <div className="flex justify-center pb-24">
                    <button
                        onClick={() => setIsWaitlistOpen(true)}
                        className="bg-white text-black px-12 py-4 uppercase tracking-[0.25em] text-xs hover:bg-switz-red hover:text-white transition-colors duration-300"
                    >
                        Check Availability
                    </button>
                </div>
            </main>

            <Footer />

            <Suspense fallback={null}>
                <WaitlistModal
                    open={isWaitlistOpen}
                    onOpenChange={setIsWaitlistOpen}
                    selectedTier="Villars Alpine Retreat"
                />
            </Suspense>

        </div>
    );
}
