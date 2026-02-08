import { motion } from "framer-motion";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";

export default function RoadJourney() {
    const routes = [
        {
            title: "Lavaux: The Grand Cru Drive",
            desc: "A UNESCO Heritage journey through hanging vineyards. Includes private tastings at wineries closed to the general public.",
            duration: "4-6 Hours"
        },
        {
            title: "Heritage: Castles & Cacao",
            desc: "A medieval immersion into Gruyères. We visit the castle, the cheesemakers, and the Cailler chocolate atelier with VIP access.",
            duration: "6-8 Hours"
        },
        {
            title: "The High Pass Circuit (Summer Only)",
            desc: "Grimsel, Furka, Gotthard. Three legendary mountain passes in one day. High-altitude adrenaline and panoramic lunches.",
            duration: "Full Day"
        }
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white pb-24">
            <SEO
                title="Swiss Alps Road Journey | Private Guide & Luxury SUV"
                description="Private luxury SUV expeditions through the Swiss Alps. UNESCO heritage sites, hidden gems, and local hosts. Your pace, your journey."
                keywords="swiss alps driving, luxury suv switzerland, luxury road trip switzerland, lavaux vineyard tour, gruyeres tour, private swiss guide"
                canonical="https://swissperiences.ch/experiences/road-journey"
                ogImage="https://www.swissperiences.ch/images/range-rover-enhanced.jpg"
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/range-rover-enhanced.jpg"
                            alt="Luxury SUV on Swiss alpine road"
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
                            The Journey
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-6"
                        >
                            Alps Road Journey
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/80 font-light text-lg"
                        >
                            Your private guide. Your pace. The most beautiful roads in the world.
                        </motion.p>
                    </div>
                </section>

                {/* Intro & Specs */}
                <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-serif mb-6">Not just a driver. A host.</h2>
                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            Switzerland is best seen from the road, but driving here requires focus.
                            Allow me to handle the navigation while you immerse yourself in the landscape.
                            Conducted in a premium luxury SUV—providing comfort, style, and panoramic roof views.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                            <div className="flex flex-col gap-2">
                                <Users className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Any Size Group</span>
                                <span className="text-xs text-white/50">1-4 Passengers</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Clock className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Flexible Duration</span>
                                <span className="text-xs text-white/50">Half or Full Day</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <MapPin className="text-switz-red w-5 h-5" />
                                <span className="text-sm font-medium">Door-to-Door</span>
                                <span className="text-xs text-white/50">Geneva or Villars Pickup</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                        <h3 className="text-xl font-serif mb-6">Curated Routes</h3>
                        <div className="space-y-6">
                            {routes.map((route, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-sm font-bold text-white group-hover:text-switz-red transition-colors">{route.title}</h4>
                                        <span className="text-xs text-white/40">{route.duration}</span>
                                    </div>
                                    <p className="text-xs text-white/60 font-light">{route.desc}</p>
                                </div>
                            ))}
                        </div>
                        <a
                            href="/request-access"
                            className="w-full mt-8 flex items-center justify-between bg-white text-black px-6 py-4 uppercase tracking-widest text-xs hover:bg-switz-red hover:text-white transition-colors duration-300"
                        >
                            <span>Plan Your Route</span>
                            <ArrowRight size={16} />
                        </a>
                    </div>
                </section>

                {/* Gallery / Visual Break */}
                <section className="w-full h-[400px] md:h-[600px] overflow-hidden relative mb-24">
                    <img
                        src="/images/range-rover-villars.jpg"
                        alt="On the road"
                        className="w-full h-full object-cover object-center opacity-60 brightness-[0.85] contrast-[1.1] saturate-[0.9]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl md:text-4xl font-serif text-white/90 italic text-center px-4">
                            "The journey is the destination."
                        </p>
                    </div>
                </section>
            </main>

            <Footer />

        </div>
    );
}
