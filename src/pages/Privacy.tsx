import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
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
          Privacy & Cookies
        </h1>
        <p className="text-white/40 text-sm mb-12">
          Last updated: December 2024
        </p>

        <div className="space-y-12">
          {/* Privacy Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Your Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              Swissperiences respects your privacy. We believe in transparency and keeping things simple.
            </p>
          </section>

          {/* Cookies Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Cookies We Use</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              This website uses only strictly necessary cookies required for basic functionality, 
              such as page navigation and form submissions.
            </p>
            <p className="text-white/70 leading-relaxed">
              We do not use advertising cookies, tracking pixels, or third-party marketing tools.
            </p>
          </section>

          {/* Data Sharing Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Your Data</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              No personal data is sold or shared with third parties.
            </p>
            <p className="text-white/70 leading-relaxed">
              If you join the waitlist, your email is stored securely and used only for 
              Swissperiences communications. You can request removal at any time by contacting us.
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Questions?</h2>
            <p className="text-white/70 leading-relaxed">
              For any privacy-related inquiries, please contact us at{" "}
              <a 
                href="mailto:contact@swissperiences.ch" 
                className="text-white hover:underline focus:outline-none focus:underline"
              >
                contact@swissperiences.ch
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
