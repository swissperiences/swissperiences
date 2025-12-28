import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Request Access",
    description: "A short inquiry. We respond personally.",
  },
  {
    number: "02",
    title: "We Curate",
    description: "We consider timing, pace, and intention — not volume.",
  },
  {
    number: "03",
    title: "Receive an Invitation",
    description: "If it aligns, you’ll receive a curated proposal.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-32 border-t border-white/10 scroll-mt-20">
      {/* Overlay for how it works section */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-[0.3em] text-white/80 mb-16 text-center uppercase font-light"
        >
          How Access Works
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <span className="text-6xl sm:text-7xl font-light text-white/20 mb-4 block">
                {step.number}
              </span>
              <h3 className="text-xl text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center text-xs text-white/40 font-light tracking-wide"
        >
          Access is intentional. Scale is not the goal.
        </motion.p>
      </div>
    </section >
  );
}
