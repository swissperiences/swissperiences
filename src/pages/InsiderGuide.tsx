import { useState } from "react";
import { Loader2, ArrowRight, Check, MapPin, Mountain, Gem, Star } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { newsletterSignup } from "@/lib/newsletter";

const GUIDE_PDF_URL = "/insider-guide.pdf";

const highlights = [
    { icon: MapPin, label: "30+ hidden gems across 7 cantons" },
    { icon: Mountain, label: "Insider tips from locals, not guidebooks" },
    { icon: Gem, label: "Secret spots most tourists never find" },
    { icon: Star, label: "Seasonal recommendations & timing" },
];

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

            // Send the guide email
            try {
                await fetch("/api/send-guide-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
            } catch {
                // Non-blocking — they still get the download link
            }

            setIsSuccess(true);
            toast.success("Check your email — your guide is on the way!");
        } catch (error: any) {
            if (error?.message?.includes("already_subscribed")) {
                setIsSuccess(true);
                toast.success("Welcome back! Here's your guide.");
            } else {
                // Still show success — the signup might have worked, and they get the direct download
                setIsSuccess(true);
                toast.success("Your guide is ready!");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <SEO
                title="Free Swiss Insider Guide — Swissperiences"
                description="Download our free guide with 30+ hidden gems in Switzerland. Insider tips, secret spots, and local recommendations that most tourists never find."
                path="/insider-guide"
            />

            <div className="min-h-screen bg-black text-white">
                {/* Hero */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glacier-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-glacier-500/3 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

                    <div className="relative z-10 max-w-2xl mx-auto px-6 py-24 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs tracking-[0.2em] uppercase text-white/50 mb-10">
                            <span className="w-1.5 h-1.5 bg-glacier-500 rounded-full" />
                            Free Guide
                        </div>

                        {/* Title */}
                        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
                            The Swiss
                            <br />
                            <span className="text-glacier-400">Insider Guide</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-white/50 font-light leading-relaxed max-w-lg mx-auto mb-12">
                            30+ hidden gems, insider tips, and local secrets that most tourists will never find in Switzerland.
                        </p>

                        {/* Highlights */}
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-12">
                            {highlights.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-start gap-3 text-left"
                                >
                                    <Icon size={16} className="text-glacier-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-white/60 leading-snug">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Form or Success */}
                        {!isSuccess ? (
                            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email"
                                        required
                                        disabled={isLoading}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <>
                                                Get it
                                                <ArrowRight size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-white/25 mt-3">
                                    Free download. You'll also join our travel community newsletter.
                                </p>
                            </form>
                        ) : (
                            <div className="max-w-sm mx-auto animate-fade-in">
                                <div className="flex items-center justify-center gap-2 text-glacier-400 mb-6">
                                    <Check size={20} />
                                    <span className="text-sm font-medium tracking-wide uppercase">You're in</span>
                                </div>
                                <a
                                    href={GUIDE_PDF_URL}
                                    download
                                    className="inline-flex items-center gap-2 bg-glacier-500 hover:bg-glacier-600 text-white px-8 py-4 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Download Your Guide
                                    <ArrowRight size={14} />
                                </a>
                                <p className="text-xs text-white/30 mt-4">
                                    We also sent a copy to your email.
                                </p>
                            </div>
                        )}

                        {/* Social proof */}
                        <div className="mt-16 pt-8 border-t border-white/5">
                            <p className="text-xs text-white/25 tracking-wide uppercase mb-2">Curated by</p>
                            <p className="text-sm text-white/40">
                                Swissperiences — private Swiss travel community
                            </p>
                        </div>
                    </div>
                </section>

                {/* Preview section */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-3xl font-semibold text-center mb-4">
                            What's inside
                        </h2>
                        <p className="text-white/40 text-center mb-12 max-w-lg mx-auto">
                            A curated selection of Switzerland's best-kept secrets, organized by region.
                        </p>

                        <div className="space-y-6">
                            {[
                                { region: "Bern", gem: "Blausee — a crystal-clear lake hidden in the Kander Valley" },
                                { region: "Valais", gem: "Bisse de Clavau — vineyard trail through UNESCO terraces" },
                                { region: "Central Switzerland", gem: "Rütli Meadow — the birthplace of Switzerland, by boat only" },
                                { region: "Geneva", gem: "Carouge — the bohemian Italian quarter nobody talks about" },
                                { region: "Graubünden", gem: "Caumasee — turquoise lake fed by underground springs" },
                                { region: "Ticino", gem: "Corippo — population 12, Switzerland's smallest village" },
                                { region: "Jura", gem: "Creux du Van — a 160m rock amphitheater with wild ibex" },
                                { region: "Zürich", gem: "Hürlimann Spa — rooftop thermal pool over the skyline" },
                            ].map(({ region, gem }, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/5"
                                >
                                    <span className="text-glacier-500/40 font-serif text-2xl font-bold leading-none mt-0.5 w-8 text-right flex-shrink-0">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">{region}</span>
                                        <p className="text-sm text-white/70 leading-relaxed">{gem}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-center gap-2 py-4 text-white/20 text-sm">
                                <span>+ 22 more gems inside the guide</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                {!isSuccess && (
                    <section className="py-20 px-6 border-t border-white/5">
                        <div className="max-w-sm mx-auto text-center">
                            <h3 className="font-serif text-2xl font-semibold mb-4">
                                Ready to discover the real Switzerland?
                            </h3>
                            <form onSubmit={handleSubmit} className="mt-8">
                                <div className="flex gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email"
                                        required
                                        disabled={isLoading}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-glacier-500 hover:bg-glacier-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <>
                                                Get it
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
                <footer className="py-8 px-6 border-t border-white/5 text-center">
                    <a href="/" className="text-xs text-white/20 tracking-[0.3em] uppercase hover:text-white/40 transition-colors">
                        swissperiences.ch
                    </a>
                </footer>
            </div>
        </>
    );
};

export default InsiderGuide;
