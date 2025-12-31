import { motion } from "framer-motion";
import franckProvostLogo from "@/assets/logos/franck-provost-logo.png";

const logos = [
  { name: "Franck Provost", src: franckProvostLogo },
];

export default function TrustedBy() {
  return (
    <section className="bg-black py-20 grain-overlay">
      <div className="max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest text-white/40 mb-12 text-center uppercase"
        >
          Trusted By
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center h-10 md:h-12 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                loading="lazy"
                decoding="async"
                className="h-full w-auto max-w-[120px] md:max-w-[140px] object-contain brightness-0 invert"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
