import { motion } from "framer-motion";

export default function PhilosophySpacer() {
    return (
        <section className="bg-background py-32 md:py-48 flex items-center justify-center relative overflow-hidden">
            {/* Subtle Grain Overlay if needed, or keep clean black */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

            <div className="max-w-4xl mx-auto px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    {/* Decorative small divider */}
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto mb-12"></div>

                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl font-serif text-white/90 leading-tight tracking-wide"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                    >
                        "True luxury is the privilege<br className="hidden md:block" /> of being unavailable."
                    </h2>

                    <p className="mt-8 text-xs md:text-sm uppercase tracking-[0.3em] text-white/30 font-light">
                        A State of Mind
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
