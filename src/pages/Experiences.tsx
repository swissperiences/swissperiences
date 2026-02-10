import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { ArrowRight, Car, Camera, ChefHat, Mountain } from "lucide-react";

export default function Experiences() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Swissperiences Experiences",
        "description": "Curated premium experiences in the Swiss Alps.",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Alps Road Journey" },
            { "@type": "ListItem", "position": 2, "name": "Cinematic Memories" },
            { "@type": "ListItem", "position": 3, "name": "Private Chef" },
            { "@type": "ListItem", "position": 4, "name": "Guided Hikes" }
        ]
    };

    const experiences = [
        {
            icon: <Car size={24} />,
            title: "Alps Road Journey",
            subtitle: "Private Guide & Luxury SUV",
            price: "From CHF 850",
            description: "Private luxury SUV expeditions through the most beautiful roads in Switzerland. UNESCO heritage sites, hidden vineyards, legendary mountain passes. Your pace, your journey.",
            image: "/images/alpine-road-villars.jpg",
            href: "/experiences/road-journey",
            available: true,
        },
        {
            icon: <Camera size={24} />,
            title: "Cinematic Memories",
            subtitle: "Professional Drone & Photo",
            price: "From CHF 600",
            description: "Professional drone and cinematic content creation for your Swiss journey. We capture the raw beauty of the Alps without interrupting the moment.",
            image: "/images/villars-drone.jpg",
            href: "/experiences/cinematic-memories",
            available: true,
        },
        {
            icon: <ChefHat size={24} />,
            title: "Private Chef",
            subtitle: "In-Chalet Fine Dining",
            price: "From CHF 400",
            description: "A curated dining experience in the privacy of your sanctuary. Local ingredients, Swiss-French technique, served at your table with a view of the Alps.",
            image: "/images/loft/IMG_8759.jpg",
            href: "/experiences/private-chef",
            available: true,
        },
        {
            icon: <Mountain size={24} />,
            title: "Guided Hikes",
            subtitle: "Expert Mountain Guides",
            price: "From CHF 300",
            description: "Expert-led alpine adventures from gentle valley walks to challenging summit ascents. Every trail handpicked for beauty, safety, and solitude.",
            image: "/images/host-hiking.jpg",
            href: "/experiences/guided-hikes",
            available: true,
        },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Premium Alpine Experiences | Swissperiences"
                description="Curated premium experiences in the Swiss Alps. Private road journeys, cinematic documentation, in-chalet dining, and guided alpine hikes."
                keywords="swiss alps experiences, luxury experiences switzerland, private chef swiss alps, guided hike switzerland, luxury suv tour switzerland, drone photography alps"
                canonical="https://swissperiences.ch/experiences"
                structuredData={structuredData}
            />
            <Navigation />

            <main>
                {/* Hero */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/alpine-road-villars.jpg"
                            alt="Swiss Experience"
                            className="w-full h-full object-cover brightness-[0.5] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            The Collection
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1]"
                        >
                            Experiences
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/60 font-light text-lg"
                        >
                            Not activities. Not tours. Curated moments designed to deepen your connection with Switzerland.
                        </motion.p>
                    </div>
                </section>

                {/* Experience Cards */}
                <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                    <div className="space-y-24">
                        {experiences.map((exp, idx) => (
                            <div key={exp.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                                {/* Image */}
                                <Link
                                    to={exp.href}
                                    className={`group relative aspect-[4/3] overflow-hidden rounded-sm bg-neutral-900 ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}
                                >
                                    <img
                                        src={exp.image}
                                        alt={exp.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                {/* Content */}
                                <div className={`space-y-6 ${idx % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-switz-red">
                                        {exp.icon}
                                    </div>
                                    <div>
                                        <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-2">{exp.subtitle}</span>
                                        <h2 className="text-3xl md:text-4xl font-serif leading-tight">{exp.title}</h2>
                                    </div>
                                    <p className="text-white/60 font-light leading-relaxed max-w-lg">
                                        {exp.description}
                                    </p>
                                    <div className="flex items-center gap-6 pt-2">
                                        <span className="text-white/80 text-lg font-serif">{exp.price}</span>
                                    </div>
                                    <Link
                                        to={exp.href}
                                        className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                                    >
                                        Learn More <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* For Teams Banner */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Corporate</span>
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">Experiences for Teams</h2>
                        <p className="text-white/60 font-light mb-12 max-w-xl mx-auto">
                            All of our experiences can be tailored for corporate groups. Strategic retreats, team building, and executive offsites in the Swiss Alps.
                        </p>
                        <Link
                            to="/for-teams"
                            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                        >
                            Explore Corporate <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">Your experience awaits.</h2>
                        <p className="text-white/50 font-light mb-12">Member pricing and booking available after approval.</p>
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
