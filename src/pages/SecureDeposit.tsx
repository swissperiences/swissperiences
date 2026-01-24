import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function SecureDeposit() {
    const [email, setEmail] = useState("");
    const [intent, setIntent] = useState("");
    const [tier, setTier] = useState("");
    const [marketingOptIn, setMarketingOptIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Auto-fill email from URL if present (from Waitlist success flow)
    useState(() => {
        const params = new URLSearchParams(window.location.search);
        const urlEmail = params.get('email');
        const urlIntent = params.get('intent');
        const urlTier = params.get('tier');

        if (urlEmail) setEmail(urlEmail);
        if (urlIntent) setIntent(urlIntent);
        if (urlTier) setTier(urlTier);
    });

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    intent,
                    tier, // passing as product name context
                    marketing_opt_in: marketingOptIn
                }),
            });

            let data;
            try {
                const text = await response.text();
                data = JSON.parse(text);
            } catch {
                if (import.meta.env.DEV) {
                    toast({
                        title: "Dev Mode: Checkout Simulation",
                        description: "API unreachable on localhost. Redirecting...",
                        duration: 3000,
                    });
                    setTimeout(() => { window.location.href = "/?payment=success"; }, 1000);
                    return;
                }
                throw new Error("Invalid server response");
            }

            if (!response.ok) {
                throw new Error(data.error || "Failed to initiate payment");
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error: unknown) {
            const err = error as Error;
            toast({
                title: "Access Denied",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#111] to-[#0a0a0a]"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="text-center mb-12">
                    <span className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Swissperiences Private
                    </span>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                        Secure Your Place
                    </h1>
                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-xs mx-auto">
                        Confirm your attendance for the Spring 2026 Intake with a secure deposit.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleDeposit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-white/50 uppercase tracking-wider ml-1">
                                Email Address used in Application
                            </label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/20 h-12 focus:border-white/30 transition-all"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="pt-2 space-y-4">
                            <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                <input
                                    type="checkbox"
                                    id="marketing-deposit"
                                    checked={marketingOptIn}
                                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 border-white/20 bg-white/5 rounded-sm focus:ring-white/20 accent-[#D8B58A]"
                                />
                                <label htmlFor="marketing-deposit" className="text-[10px] text-white/50 uppercase tracking-widest font-light cursor-pointer select-none leading-relaxed">
                                    I would like to receive exclusive travel updates and mountain sanctuary discoveries from Swissperiences.
                                </label>
                            </div>

                            <div className="flex justify-between items-center text-sm pt-2">
                                <span className="text-white/70">Deposit Amount</span>
                                <span className="text-xl font-light text-white">
                                    {tier.includes('£') || tier.toLowerCase().includes('gbp') ? '£' : 'CHF'} 500.00
                                </span>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-xl text-xs uppercase tracking-widest font-medium transition-all duration-500"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Proceed to Payment <ArrowRight size={14} />
                                    </span>
                                )}
                            </Button>
                            <p className="text-[9px] text-center text-white/20 tracking-widest uppercase font-light">
                                You can unsubscribe at any time.
                            </p>
                        </div>
                    </form>

                    <div className="mt-6 flex flex-col items-center justify-center gap-2 text-[10px] text-white/30">
                        <div className="flex items-center gap-2">
                            <Lock size={10} />
                            <span>Encrypted Transaction via Stripe</span>
                        </div>
                        <p className="mt-2">
                            By proceeding, you agree to our <a href="/terms" className="text-white/50 hover:text-white underline">Terms & Conditions</a>.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
