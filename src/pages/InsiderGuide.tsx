import { useState } from "react";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { newsletterSignup } from "@/lib/newsletter";

const GUIDE_PDF_URL = "/insider-guide.pdf";

const InsiderGuide = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await newsletterSignup(email);
            try {
                await fetch("/api/send-guide-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
            } catch {
                // Non-blocking
            }
            setIsSuccess(true);
            toast.success("Check your email.");
        } catch (error: any) {
            setIsSuccess(true);
            toast.success(
                error?.message?.includes("already_subscribed")
                    ? "Welcome back."
                    : "Your guide is ready."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="The Swiss Insider Guide — Swissperiences"
                description="Places we keep to ourselves. A free guide to the Switzerland that doesn't show up on Google."
                path="/insider-guide"
            />

            <div className="min-h-screen bg-black text-white">
                {/* Hero — full viewport */}
                <section className="relative min-h-screen flex items-end overflow-hidden">
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/images/lake-geneva/lavaux-vineyards-sunset.jpeg')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

                    <div className="relative z-10 max-w-xl mx-auto px-6 pb-20 pt-40 w-full">
                        {/* Brand */}
                        <p className="text-[11px] tracking-[0.35em] uppercase text-white/40 mb-8">
                            Swissperiences
                        </p>

                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-5">
                            The Swiss<br />Insider Guide
                        </h1>

                        <p className="text-base sm:text-lg text-white/50 font-light leading-relaxed mb-3">
                            Places we keep to ourselves.
                        </p>

                        <div className="w-10 h-[2px] bg-glacier-500 mb-10" />

                        {/* Form or Success */}
                        {!isSuccess ? (
                            <div>
                                <p className="text-sm text-white/40 mb-5 max-w-xs">
                                    Eight places in Switzerland that don't show up on Google.
                                    Insider tips you'd only get from a local friend.
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex gap-3 max-w-sm">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email"
                                            required
                                            disabled={isLoading}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors disabled:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                        >
                                            {isLoading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <>
                                                    Send it
                                                    <ArrowRight size={14} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-white/20 mt-3">
                                        Free. You'll also join our community.
                                    </p>
                                </form>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="flex items-center gap-2 text-glacier-400 mb-5">
                                    <Check size={18} />
                                    <span className="text-sm font-medium tracking-wide uppercase">You're in</span>
                                </div>
                                <a
                                    href={GUIDE_PDF_URL}
                                    download
                                    className="inline-flex items-center gap-2 bg-glacier-500 hover:bg-glacier-600 text-white px-8 py-4 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Download the Guide
                                    <ArrowRight size={14} />
                                </a>
                                <p className="text-[11px] text-white/25 mt-4">
                                    We also sent a copy to your email.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Preview — what's inside, minimal */}
                <section className="py-24 px-6 border-t border-white/5">
                    <div className="max-w-lg mx-auto">
                        <p className="text-[11px] tracking-[0.3em] uppercase text-glacier-500/60 mb-6">
                            Inside the guide
                        </p>

                        <div className="space-y-5">
                            {[
                                "The wine trail nobody rushes",
                                "A village with a population of 12",
                                "36 degrees above the city",
                                "The amphitheatre glaciers carved",
                                "Fifteen metres of clarity",
                                "Turin, transplanted",
                                "Where Switzerland was born",
                                "The lake that floats",
                            ].map((title, i) => (
                                <div
                                    key={i}
                                    className="flex items-baseline gap-4"
                                >
                                    <span className="text-glacier-500/30 font-serif text-lg font-bold w-7 text-right flex-shrink-0">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-sm text-white/50 font-light">{title}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <p className="text-xs text-white/20 italic">
                                "What stood out most was the silence."
                            </p>
                            <p className="text-[10px] text-glacier-500/40 mt-1">
                                — Ale & Alex, guests
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA — only if not already submitted */}
                {!isSuccess && (
                    <section className="py-20 px-6 border-t border-white/5">
                        <div className="max-w-sm mx-auto text-center">
                            <p className="font-serif text-2xl font-semibold mb-2">
                                This guide is a door.
                            </p>
                            <p className="font-serif text-xl text-white/40 mb-8">
                                Not the room.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email"
                                        required
                                        disabled={isLoading}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <>
                                                Send it
                                                <ArrowRight size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="py-10 px-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-glacier-500/30 mb-2">Find us.</p>
                    <a href="/" className="text-[11px] text-white/20 tracking-[0.3em] uppercase hover:text-white/40 transition-colors">
                        swissperiences.ch
                    </a>
                </footer>
            </div>
        </>
    );
};

export default InsiderGuide;
