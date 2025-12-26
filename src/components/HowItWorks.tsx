import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "We Curate",
    description: "Every experience is personally vetted for quality and authenticity",
  },
  {
    number: "02",
    title: "You Discover",
    description: "Browse unique Swiss experiences matched to your interests",
  },
  {
    number: "03",
    title: "Experience Switzerland",
    description: "Book with confidence and feel the world again",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-black py-20 sm:py-32 border-t border-white/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest text-white/60 mb-16 text-center uppercase"
        >
          How It Works
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
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
