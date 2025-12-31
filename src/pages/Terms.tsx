import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Terms of Service | Swissperiences"
        description="Swissperiences Terms of Service. Read our terms and conditions for using our website and booking experiences in Switzerland."
        keywords="terms of service, terms and conditions, legal"
        canonical="https://swissperiences.ch/terms"
      />
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Swissperiences</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
          Terms of Service
        </h1>
        <p className="text-white/40 text-sm mb-12">
          Last updated: December 2025
        </p>

        <div className="space-y-12">
          {/* Agreement Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Agreement to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              By accessing or using the Swissperiences website, you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          {/* Services Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Our Services</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Swissperiences is a curated retreat and experience service launching in Spring 2026. 
              Currently, we offer a waitlist for early access to our experiences.
            </p>
            <p className="text-white/70 leading-relaxed">
              All experiences, accommodations, and activities will be subject to availability and 
              additional terms at the time of booking.
            </p>
          </section>

          {/* Waitlist Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Waitlist</h2>
            <p className="text-white/70 leading-relaxed">
              Joining our waitlist is free and non-binding. Waitlist members will receive priority 
              access to book experiences when we launch. You may unsubscribe from the waitlist at 
              any time by contacting us.
            </p>
          </section>

          {/* Intellectual Property Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed">
              All content on this website, including text, images, logos, and design elements, 
              is the property of Swissperiences and is protected by copyright laws. You may not 
              reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          {/* Limitation of Liability Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed">
              Swissperiences provides this website on an "as is" basis. We make no warranties 
              regarding the accuracy or completeness of any content. We shall not be liable for 
              any indirect, incidental, or consequential damages arising from your use of the website.
            </p>
          </section>

          {/* Changes Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting to the website. Your continued use of the website 
              constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Data Protection Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Data Protection</h2>
            <p className="text-white/70 leading-relaxed">
              Your use of this website is also governed by our Privacy Policy, which explains how we
              collect, use, and protect your personal data in compliance with Swiss FADP and GDPR.
              Please review our{" "}
              <a href="/privacy" className="text-white hover:underline focus:outline-none focus:underline">
                Privacy Policy
              </a>{" "}
              for more information.
            </p>
          </section>

          {/* Governing Law Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Governing Law</h2>
            <p className="text-white/70 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Switzerland.
              Any disputes shall be subject to the exclusive jurisdiction of the courts of Switzerland.
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Contact</h2>
            <p className="text-white/70 leading-relaxed">
              For questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:hello@swissperiences.ch"
                className="text-white hover:underline focus:outline-none focus:underline"
              >
                hello@swissperiences.ch
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-white/40">
            © 2024–2026 Swissperiences. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
