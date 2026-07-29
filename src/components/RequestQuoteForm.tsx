import { useState, useEffect, FormEvent } from "react";
import { useTranslation } from "react-i18next";

const interestOptions = [
  { value: "alpine-reset", label: "The Alpine Reset — 3 nights" },
  { value: "winter-escape", label: "The Winter Escape — 4 nights" },
  { value: "cinematic-weekend", label: "The Cinematic Weekend — 2 nights" },
  { value: "grand-tour", label: "The Grand Tour — 5 nights" },
];

interface Props {
  initialInterest?: string;
  /** Accepted for the Packages modal; closing is handled by the modal wrapper itself. */
  onClose?: () => void;
  /** When true, the section chrome (eyebrow/heading/support) is omitted so the parent section can own it. */
  embedded?: boolean;
}

export default function RequestQuoteForm({ initialInterest = "", embedded = false }: Props) {
  const { t, i18n } = useTranslation("home");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(initialInterest);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Keep the select in sync when a journey CTA elsewhere on the page presets the interest.
  useEffect(() => {
    if (initialInterest) setInterest(initialInterest);
  }, [initialInterest]);

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
          language: i18n.language?.startsWith("pt") ? "pt" : "en",
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
      <section id="request-quote" className={embedded ? "" : "py-24 md:py-32 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5"}>
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/45 block mb-6">
            {t("quoteForm.successEyebrow")}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white/80 mb-4">
            {t("quoteForm.successHeading")}
          </h3>
          <p className="text-white/45 text-base font-light">
            {t("quoteForm.successBody")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="request-quote" className={embedded ? "scroll-mt-16" : "py-24 md:py-32 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5 scroll-mt-16"}>
      <div className="max-w-xl mx-auto">
        {!embedded && (
          <div className="text-center mb-12">
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/45 block mb-6">
              {t("quoteForm.eyebrow")}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-4">
              {t("quoteForm.heading")}
            </h2>
            <p className="text-white/45 text-base font-light max-w-md mx-auto">
              {t("quoteForm.support")}
            </p>
          </div>
        )}

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
              <label htmlFor="quote-name" className="text-xs uppercase tracking-[0.2em] text-white/55 block mb-2">
                {t("quoteForm.name")}
              </label>
              <input
                id="quote-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("quoteForm.namePlaceholder")}
                className="w-full h-11 bg-transparent border-b border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:border-glacier-500/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="quote-email" className="text-xs uppercase tracking-[0.2em] text-white/55 block mb-2">
                {t("quoteForm.email")} <span className="text-white/30">*</span>
              </label>
              <input
                id="quote-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("quoteForm.emailPlaceholder")}
                className="w-full h-11 bg-transparent border-b border-white/10 text-white/80 text-sm placeholder:text-white/30 focus:border-glacier-500/40 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quote-interest" className="text-xs uppercase tracking-[0.2em] text-white/55 block mb-2">
              {t("quoteForm.interest")}
            </label>
            <select
              id="quote-interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full h-11 bg-transparent border-b border-white/10 text-white/80 text-sm focus:border-glacier-500/40 focus:outline-none transition-colors appearance-none cursor-pointer [&>option]:bg-[#111] [&>option]:text-white"
            >
              <option value="">{t("quoteForm.interestDefault")}</option>
              {interestOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="custom">{t("quoteForm.interestCustom")}</option>
            </select>
          </div>

          <div>
            <label htmlFor="quote-message" className="text-xs uppercase tracking-[0.2em] text-white/55 block mb-2">
              {t("quoteForm.message")} <span className="text-white/30">{t("quoteForm.messageOptional")}</span>
            </label>
            <textarea
              id="quote-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder={t("quoteForm.messagePlaceholder")}
              className="w-full bg-transparent border-b border-white/10 pb-3 text-white/80 text-sm placeholder:text-white/30 focus:border-glacier-500/40 focus:outline-none transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400/80" role="alert">
              {t("quoteForm.error")}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full sm:w-auto px-12 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "sending" ? t("quoteForm.sending") : t("quoteForm.submit")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
