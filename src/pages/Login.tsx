import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const siteUrl = import.meta.env.VITE_SITE_URL || 'https://swissperiences.ch';
            const redirectUrl = `${siteUrl}/auth/callback?flow=login`;

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error('Login error:', error.message);
            toast.error("Failed to sign in. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <SEO
                title="Member Login | Swissperiences"
                description="Sign in to access your Swissperiences member area."
            />

            <div className="max-w-sm w-full text-center">
                <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">
                    Member Access
                </span>

                <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    Welcome back.
                </h1>

                <p className="text-white/60 font-light leading-relaxed mb-12">
                    Sign in to access your sanctuaries and exclusive experiences.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full bg-transparent border border-white/10 text-white py-4 rounded-none flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white/5 transition-all disabled:opacity-50"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {isLoading ? "Connecting..." : "Continue with Google"}
                </button>

                <div className="w-16 h-px bg-white/20 mx-auto my-12" />

                <p className="text-white/40 text-sm mb-4">
                    Not a member yet?
                </p>
                <a
                    href="/request-access"
                    className="text-white/60 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                >
                    Request Access →
                </a>

                <div className="mt-16">
                    <a
                        href="/"
                        className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                    >
                        &larr; Back to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
