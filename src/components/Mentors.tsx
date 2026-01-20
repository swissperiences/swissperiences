import { useRef, useEffect } from "react";

interface Mentor {
    name: string;
    role: string;
    credential: string;
    image: string;
}

const mentors: Mentor[] = [
    {
        name: "Alexandre V.",
        role: "Strategy & Vision",
        credential: "Ex-Goldman Sachs • INSEAD",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Dr. Sarah L.",
        role: "Cultural Anthropology",
        credential: "PhD Cambridge • UNESCO Fellow",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Jean-Marc D.",
        role: "Alpine Logistics",
        credential: "uimla Guide • 20+ Years Exp.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop"
    },
    {
        name: "Elena R.",
        role: "Curartorial Lead",
        credential: "Ex-Monocle • Art Basel",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop"
    }
];

export const Mentors = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity-100", "translate-y-0");
                        entry.target.classList.remove("opacity-0", "translate-y-10");
                    }
                });
            },
            { threshold: 0.1 }
        );

        const cards = document.querySelectorAll(".mentor-card");
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-6 md:px-12 bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 space-y-6">
                    <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block">
                        The Curators
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                        Guided by those who have <br />
                        <span className="italic text-white/80">walked the path.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
                    {mentors.map((mentor, index) => (
                        <div
                            key={index}
                            className="mentor-card opacity-0 translate-y-10 transition-all duration-1000 ease-out group cursor-none"
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-neutral-900">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-700 ease-out"
                                />
                            </div>

                            <div className="space-y-2 border-t border-white/10 pt-4 group-hover:border-switz-red/50 transition-colors duration-500">
                                <h3 className="text-xl text-white font-serif">{mentor.name}</h3>
                                <p className="text-xs text-switz-red uppercase tracking-widest font-medium">{mentor.role}</p>
                                <p className="text-sm text-white/60 font-light">{mentor.credential}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
