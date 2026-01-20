import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function TrustedBy() {
  const { t } = useTranslation(['home']);

  // Placeholder logos - realistic Swiss/luxury brands
  const trustedLogos = [
    { name: 'Lindt', width: '120px' },
    { name: 'Rolex', width: '100px' },
    { name: 'Swiss International Air Lines', width: '140px' },
    { name: 'Credit Suisse', width: '130px' },
    { name: 'Nestlé', width: '110px' },
  ];

  return (
    <section className="relative w-full py-20 bg-black/30 backdrop-blur-sm border-y border-white/10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
        >
          {/* Heading */}
          <p className="text-center text-sm text-white/50 font-light tracking-widest uppercase mb-12">
            {t('home:trustedBy.heading', 'Trusted by Leading Organizations')}
          </p>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
            {trustedLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center justify-center"
              >
                {/* Placeholder logo - elegant text representation */}
                <div
                  className="text-white/40 font-light tracking-wider text-lg hover:text-white/70 transition-colors duration-300"
                  style={{ width: logo.width }}
                >
                  {logo.name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subtle tagline */}
          <p className="text-center text-xs text-white/30 font-light mt-12 max-w-2xl mx-auto">
            {t('home:trustedBy.tagline', 'Join exclusive organizations experiencing Switzerland beyond the ordinary.')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
