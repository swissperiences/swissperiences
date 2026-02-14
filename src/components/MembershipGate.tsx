import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

interface MembershipGateProps {
    children: React.ReactNode;
    /** Optional: override the CTA title */
    title?: string;
    /** Optional: override the CTA subtitle */
    subtitle?: string;
}

export default function MembershipGate({ children, title, subtitle }: MembershipGateProps) {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) return <>{children}</>;

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
                        className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                    >
                        Become a Member
                    </Link>
                    <Link
                        to="/login"
                        className="inline-block border border-white/20 text-white/60 px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:border-white/40 hover:text-white transition-all duration-500"
                    >
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
