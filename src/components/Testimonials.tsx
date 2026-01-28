import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
    id: number;
    quote: string;
    author: string;
    role: string;
    location: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "An absolute masterclass in hospitality. The attention to detail in Villars was unlike anything we've experienced. It felt less like a hotel and more like staying with a very well-connected friend.",
        author: "Elena & Marcus",
        role: "Private Clients",
        location: "London, UK"
    },
    {
        id: 2,
        quote: "The road journey was transformative. Driving through the passes with Caueh's curated itinerary opened our eyes to a side of Switzerland we would never have found on our own.",
        author: "Sarah J.",
        role: "Creative Director",
        location: "New York, USA"
    },
    {
        id: 3,
        quote: "Swissperiences doesn't just book a trip; they craft a narrative. Every day felt like a scene from a movie, perfectly paced and full of genuine surprises.",
        author: "David L.",
        role: "Entrepreneur",
        location: "Singapore"
    }
];

export const Testimonials = () => {
    const { } = useTranslation('home');
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-32 px-6 md:px-12 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
            {/* Background nuance */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-8">
                            Guest Journal
                        </span>
                    </motion.div>

                    <div className="relative max-w-4xl min-h-[400px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex flex-col items-center"
                            >
                                <Quote className="w-12 h-12 text-white/10 mb-8" />

                                <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white/90 leading-tight md:leading-snug italic mb-10 max-w-3xl">
                                    "{testimonials[currentIndex].quote}"
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-white text-sm tracking-widest uppercase font-medium">
                                        {testimonials[currentIndex].author}
                                    </p>
                                    <div className="flex items-center justify-center gap-3 text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans">
                                        <span>{testimonials[currentIndex].role}</span>
                                        <span className="w-1 h-1 rounded-full bg-switz-red" />
                                        <span>{testimonials[currentIndex].location}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-8 mt-12">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        <div className="flex gap-3">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-switz-red w-6" : "bg-white/20 hover:bg-white/40"
                                        }`}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="p-3 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};
