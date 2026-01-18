import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const stepsKeys = ['step1', 'step2', 'step3'];

export default function HowItWorks() {
  const { t } = useTranslation('home');
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
          {t('howItWorks.heading')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {stepsKeys.map((stepKey, index) => (
            <motion.div
              key={stepKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <span className="text-6xl sm:text-7xl font-light text-white/20 mb-4 block">
                {t(`howItWorks.${stepKey}.number`)}
              </span>
              <h3 className="text-xl text-white mb-3">
                {t(`howItWorks.${stepKey}.title`)}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                {t(`howItWorks.${stepKey}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section >
  );
}
