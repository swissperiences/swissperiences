import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export default function SecureDeposit() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
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

                        <div className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/70">Deposit Amount</span>
                                <span className="text-xl font-light text-white">CHF 500.00</span>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                        </div>

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
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/30">
                        <Lock size={10} />
                        <span>Encrypted Transaction via Stripe</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
