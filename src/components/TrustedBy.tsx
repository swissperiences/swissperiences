import { motion } from "framer-motion";

const logos = [
  { name: "UBS", width: "120px" },
  { name: "Franck Provost", width: "160px" },
  { name: "SSBM Geneva", width: "140px" },
  { name: "Franck Muller", width: "150px" },
];

export default function TrustedBy() {
  return (
    <section className="bg-black py-24 grain-overlay border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-[10px] tracking-[0.3em] text-white/30 mb-16 text-center uppercase font-medium"
        >
          Our Network & Heritage
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/60 text-sm md:text-base font-light text-center mb-16 max-w-2xl mx-auto -mt-10"
        >
          Deeply connected with Switzerland’s most prestigious institutions and maisons.
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 items-center justify-items-center">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-500"
            >
              <span
                className="text-white text-2xl md:text-3xl tracking-wide text-center"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  width: logo.width
                }}
              >
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

