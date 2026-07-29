import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { Lock, ArrowRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { newsletterSignup } from "@/lib/newsletter";

interface MembershipGateProps {
    children: React.ReactNode;
    /** Optional: override the CTA title */
    title?: string;
    /** Optional: override the CTA subtitle */
    subtitle?: string;
}

export default function MembershipGate({ children, title, subtitle }: MembershipGateProps) {
    const { isLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    if (isLoggedIn) return <>{children}</>;

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const data = await newsletterSignup(email);

            setIsSubscribed(true);
            if (data?.already_subscribed) {
                toast.success("You're already on the list.");
            } else {
                toast.success("Welcome to the inner circle.");
            }
            setEmail("");
        } catch (error) {
            console.error("Newsletter error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-32 px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto"
            >
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                    <Lock size={24} className="text-white/40" />
                </div>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">
                    {title || "Members Only"}
                </h2>
                <p className="text-white/50 font-light mb-12 max-w-lg mx-auto">
                    {subtitle || "This content is available exclusively to Swissperiences members. Apply for membership to access full details, availability, and exclusive pricing."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/request-access"
                        className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                    >
                        Become a Member
                    </Link>
                    <Link
                        to="/login"
                        className="inline-block border border-white/20 text-white/60 px-12 py-5 uppercase tracking-[0.25em] text-xs font-bold hover:border-glacier-500/40 hover:text-white hover:bg-white/5 transition-all duration-500"
                    >
                        Sign In
                    </Link>
                </div>

                {/* Newsletter alternative */}
                <div className="mt-16 pt-12 border-t border-white/5">
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-6">
                        Not ready to apply?
                    </p>
                    {isSubscribed ? (
                        <div className="flex items-center justify-center gap-2 text-switz-red text-sm tracking-widest uppercase animate-fade-in">
                            <Check size={16} />
                            <span>You're on the list</span>
                        </div>
                    ) : (
                        <form onSubmit={handleNewsletterSubmit} className="relative max-w-sm mx-auto">
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Join our private list"
                                    required
                                    disabled={isLoading}
                                    className="w-full bg-transparent border-b border-white/20 py-3 pr-12 text-sm text-white text-center placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors rounded-none disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-glacier-400 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <ArrowRight size={16} />
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
