import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms & Conditions | Swissperiences"
        description="Swissperiences Terms and Conditions. Information regarding deposits, cancellations, weather policies, and governing law."
        canonical="https://www.swissperiences.ch/terms"
      />
      <Navigation />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-16">
            Terms & Conditions
          </h1>

          <div className="space-y-16 text-white/80 font-light leading-relaxed">

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-white">1. Deposits & Cancellations</h2>
              <ul className="space-y-4 list-disc pl-4 text-sm md:text-base">
                <li>
                  The CHF 500 deposit is fully refundable up to 60 days prior to the retreat start date.
                </li>
                <li>
                  For 'Day Experiences' (Day Pass), deposits are refundable up to 72 hours before the scheduled booking.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-white">2. Weather & Force Majeure</h2>
              <p className="text-sm md:text-base">
                Alpine activities (drones, hiking, driving) are subject to weather conditions. In case of unsafe weather, we offer rescheduling or a full refund of the experience fee.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-white">3. Liability</h2>
              <p className="text-sm md:text-base">
                Swissperiences acts as a curator and guide. Guests are responsible for their own travel insurance and physical capability for outdoor activities.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-xl font-serif text-white">4. Governing Law</h2>
              <p className="text-sm md:text-base">
                These terms are governed by Swiss law. Any disputes shall be subject to the exclusive jurisdiction of the courts of the Canton of Vaud, Switzerland.
              </p>
            </section>

            <div className="pt-12 border-t border-white/10 text-xs text-white/40">
              <p>Last Updated: Spring 2026</p>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
