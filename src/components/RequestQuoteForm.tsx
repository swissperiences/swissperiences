import { useState, FormEvent } from "react";

const interestOptions = [
  { value: "", label: "Select your interest" },
  { value: "alpine-reset", label: "The Alpine Reset — 3 nights" },
  { value: "winter-escape", label: "The Winter Escape — 4 nights" },
  { value: "cinematic-weekend", label: "The Cinematic Weekend — 2 nights" },
  { value: "grand-tour", label: "The Grand Tour — 5 nights" },
  { value: "custom", label: "Something custom" },
];

export default function RequestQuoteForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return;
    if (!email) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/send-waitlist-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: name || null,
          tier: "Homepage Quote",
          intent: interest || "general",
          message: message || null,
          newsletter_opt_in: true,
          language: navigator.language?.startsWith("pt") ? "pt" : "en",
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="request-quote" className="py-24 md:py-32 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-6">
            Request Received
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white/80 mb-4">
            We'll be in touch within 48 hours.
          </h3>
          <p className="text-white/40 text-base font-light">
            We've received your request with complete discretion. Check your inbox for a confirmation.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="request-quote" className="py-24 md:py-32 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-6">
            Start a Conversation
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-4">
            Request a Quote
          </h2>
          <p className="text-white/40 text-base font-light max-w-md mx-auto">
            Tell us what you're looking for. No commitment, no rush — just a quiet conversation about your ideal stay.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot */}
          <div className="overflow-hidden h-0 opacity-0 pointer-events-none" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quote-name" className="text-[10px] uppercase tracking-[0.2em] text-white/30 block mb-2">
                Name
              </label>
              <input
                id="quote-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                className="w-full bg-transparent border-b border-white/10 pb-3 text-white/80 text-sm placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="quote-email" className="text-[10px] uppercase tracking-[0.2em] text-white/30 block mb-2">
                Email <span className="text-white/20">*</span>
              </label>
              <input
                id="quote-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-white/10 pb-3 text-white/80 text-sm placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quote-interest" className="text-[10px] uppercase tracking-[0.2em] text-white/30 block mb-2">
              I'm interested in
            </label>
            <select
              id="quote-interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 pb-3 text-white/80 text-sm focus:border-white/30 focus:outline-none transition-colors appearance-none cursor-pointer [&>option]:bg-[#111] [&>option]:text-white"
            >
              {interestOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quote-message" className="text-[10px] uppercase tracking-[0.2em] text-white/30 block mb-2">
              Message <span className="text-white/15">optional</span>
            </label>
            <textarea
              id="quote-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Dates, solo or with company, anything you'd like us to know..."
              className="w-full bg-transparent border-b border-white/10 pb-3 text-white/80 text-sm placeholder:text-white/20 focus:border-white/30 focus:outline-none transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400/80">
              Something went wrong. Please try again or email us directly at hello@swissperiences.ch
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto px-12 py-4 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
