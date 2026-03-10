import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "mainEntity": {
            "@type": "Organization",
            "name": "Swissperiences",
            "email": "hello@swissperiences.ch",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Geneva",
                "addressCountry": "CH"
            }
        }
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Contact | Get in Touch | Swissperiences"
                description="Get in touch with Swissperiences. Inquire about memberships, bookings, or partnerships. Based in Geneva, Switzerland."
                keywords="contact swissperiences, swiss luxury concierge contact, alpine retreat inquiry, geneva switzerland travel"
                canonical="https://www.swissperiences.ch/contact"
                structuredData={structuredData}
            />
            <Navigation />

            <main>
                {/* Hero */}
                <section className="pt-32 pb-16 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6 block"
                        >
                            Get in Touch
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-8"
                        >
                            Let's talk.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl mx-auto text-white/60 font-light text-lg"
                        >
                            Whether you're inquiring about membership, planning a retreat, or exploring a partnership — we're here.
                        </motion.p>
                    </div>
                </section>

                {/* Contact Options */}
                <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Email */}
                        <a
                            href="mailto:hello@swissperiences.ch"
                            className="group bg-white/5 border border-white/10 hover:border-glacier-500/30 p-8 rounded-sm transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-switz-red mb-6 group-hover:bg-switz-red group-hover:text-white transition-all duration-500">
                                <Mail size={20} />
                            </div>
                            <h3 className="text-lg font-serif text-white mb-2">Email</h3>
                            <p className="text-white/50 text-sm mb-4">For general inquiries and bookings.</p>
                            <span className="text-switz-red text-xs uppercase tracking-widest">hello@swissperiences.ch</span>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/41787002202"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white/5 border border-white/10 hover:border-glacier-500/30 p-8 rounded-sm transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-switz-red mb-6 group-hover:bg-switz-red group-hover:text-white transition-all duration-500">
                                <MessageCircle size={20} />
                            </div>
                            <h3 className="text-lg font-serif text-white mb-2">WhatsApp</h3>
                            <p className="text-white/50 text-sm mb-4">Quick questions and real-time assistance.</p>
                            <span className="text-switz-red text-xs uppercase tracking-widest">Message us →</span>
                        </a>

                        {/* Location */}
                        <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-switz-red mb-6">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-lg font-serif text-white mb-2">Based in</h3>
                            <p className="text-white/50 text-sm mb-4">Operating across the Swiss Alps.</p>
                            <span className="text-white/60 text-xs uppercase tracking-widest">Geneva, Switzerland</span>
                        </div>
                    </div>
                </section>

                {/* FAQ-like Section */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">Common Questions</span>
                            <h2 className="text-3xl font-serif">Before you reach out.</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="border-b border-white/5 pb-8">
                                <h3 className="text-white font-serif text-lg mb-3">How do I become a member?</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    Membership is by application only. Submit your request through our <Link to="/request-access" className="text-switz-red hover:text-white transition-colors">Request Access</Link> page, and we'll review it within 48 hours.
                                </p>
                            </div>
                            <div className="border-b border-white/5 pb-8">
                                <h3 className="text-white font-serif text-lg mb-3">Can I book without being a member?</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    Our sanctuaries and most experiences are reserved for approved members. However, corporate retreats and team experiences are open to all companies.
                                </p>
                            </div>
                            <div className="border-b border-white/5 pb-8">
                                <h3 className="text-white font-serif text-lg mb-3">Do you work with travel agencies or hotels?</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    Yes. If you're a hotel, chalet operator, or travel advisor interested in partnering with us, reach out via email. We're selectively expanding our network.
                                </p>
                            </div>
                            <div className="pb-8">
                                <h3 className="text-white font-serif text-lg mb-3">What is the response time?</h3>
                                <p className="text-white/50 font-light text-sm leading-relaxed">
                                    We respond to all inquiries within 24 hours. For urgent matters, WhatsApp is the fastest channel.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6">Not sure where to start?</h2>
                        <p className="text-white/50 font-light mb-12">Apply for membership and we'll guide you from there.</p>
                        <a
                            href="/request-access"
                            className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                        >
                            Request Access
                        </a>
                    </div>
                </section>
            </main>

            <Footer />

        </div>
    );
}
