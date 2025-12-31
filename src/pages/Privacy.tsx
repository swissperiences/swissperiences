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
          Last updated: December 2025
        </p>

        <div className="space-y-12">
          {/* Privacy Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Your Privacy</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Swissperiences respects your privacy. We believe in transparency and keeping things simple.
            </p>
            <p className="text-white/70 leading-relaxed">
              This privacy policy is compliant with the Swiss Federal Act on Data Protection (FADP)
              and the EU General Data Protection Regulation (GDPR).
            </p>
          </section>

          {/* Analytics Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Website Analytics</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We use <a href="https://plausible.io" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Plausible Analytics</a>,
              a privacy-first web analytics tool that does not use cookies and does not collect any personal data.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              Plausible is fully compliant with GDPR, CCPA, and PECR. All site measurement is carried out
              absolutely anonymously. We measure only aggregated metrics such as page views, referral sources,
              and geographic regions—without tracking individual visitors.
            </p>
            <p className="text-white/70 leading-relaxed">
              <strong>No consent banner is required</strong> because Plausible does not track you across websites,
              does not use cookies, and does not collect personal data. Learn more about{" "}
              <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                Plausible's data policy
              </a>.
            </p>
          </section>

          {/* Cookies Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Cookies</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              This website does not use cookies for tracking or marketing purposes.
            </p>
            <p className="text-white/70 leading-relaxed">
              We may use strictly necessary technical cookies in the future for essential functions
              such as user authentication. These technical cookies do not require consent under GDPR
              and Swiss data protection law.
            </p>
          </section>

          {/* Data Collection Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Data We Collect</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We only collect data that you explicitly provide to us through:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-2 mb-4">
              <li><strong>Waitlist signups:</strong> Your email address</li>
              <li><strong>Corporate inquiry forms:</strong> Company name, contact name, email, team size, and message</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              This information is stored securely and used exclusively for Swissperiences communications.
              We do not sell, rent, or share your personal data with third parties.
            </p>
          </section>

          {/* Your Rights Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Under Swiss FADP and GDPR, you have the right to:
            </p>
            <ul className="list-disc list-inside text-white/70 leading-relaxed space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Request data portability</li>
            </ul>
            <p className="text-white/70 leading-relaxed">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:hello@swissperiences.ch"
                className="text-white hover:underline focus:outline-none focus:underline"
              >
                hello@swissperiences.ch
              </a>
            </p>
          </section>

          {/* Data Security Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Data Security</h2>
            <p className="text-white/70 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              data against unauthorized access, alteration, disclosure, or destruction. All data is
              transmitted over secure HTTPS connections and stored using industry-standard encryption.
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-medium mb-4">Questions?</h2>
            <p className="text-white/70 leading-relaxed">
              For any privacy-related inquiries or to exercise your data protection rights,
              please contact us at{" "}
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
