import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { Loader2 } from "lucide-react";

/**
 * Unified Sign In page
 *
 * Two auth methods:
 * 1. Google OAuth (primary) — redirects to /auth/callback
 * 2. Email/Password (secondary, discrete) — signs in directly, then routes by membership
 *
 * If user is already signed in, redirect immediately.
 */

type EmailMode = "sign-in" | "sign-up";

const Login = () => {
    const navigate = useNavigate();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [emailMode, setEmailMode] = useState<EmailMode>("sign-in");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [checkInbox, setCheckInbox] = useState(false);

    // If already signed in, route by membership status
    useEffect(() => {
        const checkExistingSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await routeByMembership();
            }
        };
        checkExistingSession();
    }, [navigate]);

    /**
     * Shared routing logic — checks membership status and navigates.
     * Used after both Google OAuth redirect and Email/Password sign-in.
     */
    const routeByMembership = async () => {
        const { data, error } = await supabase.rpc("get_or_create_member");
        const result = data as { status: string; member?: { membership_status: string } } | null;

        if (import.meta.env.DEV) {
            console.log("[routeByMembership]", JSON.stringify(result), error?.message);
        }

        if (result?.status === "found" || result?.status === "created") {
            if (result?.member?.membership_status === "active") {
                navigate("/members", { replace: true });
                return;
            }
            // Member exists but not active — treat as pending
            navigate("/pending-approval", { replace: true });
            return;
        }
        if (result?.status === "pending") {
            navigate("/pending-approval", { replace: true });
            return;
        }
        // no_application or anything else — check for any application
        navigate("/request-access", { replace: true });
    };

    // ── Google OAuth ────────────────────────────────────────────
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            const siteUrl = import.meta.env.VITE_SITE_URL || "https://swissperiences.ch";
            const redirectUrl = `${siteUrl}/auth/callback`;

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: redirectUrl },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Login error:", error.message);
            toast.error("Failed to sign in. Please try again.");
            setIsGoogleLoading(false);
        }
    };

    // ── Email/Password Sign In ──────────────────────────────────
    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsEmailLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                if (error.message?.includes("Invalid login credentials")) {
                    toast.error("Invalid email or password.");
                } else if (error.message?.includes("Email not confirmed")) {
                    toast.error("Please confirm your email first. Check your inbox.");
                } else {
                    toast.error(error.message || "Sign in failed.");
                }
                return;
            }

            // Signed in — route by membership
            await routeByMembership();
        } catch (err: any) {
            console.error("Email sign-in error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsEmailLoading(false);
        }
    };

    // ── Email/Password Sign Up ──────────────────────────────────
    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsEmailLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${import.meta.env.VITE_SITE_URL || "https://swissperiences.ch"}/auth/callback`,
                },
            });

            if (error) {
                if (error.message?.includes("already registered")) {
                    toast.error("This email is already registered. Try signing in instead.");
                    setEmailMode("sign-in");
                } else if (error.message?.includes("signups are disabled")) {
                    toast.error("Email registration is currently disabled. Please use Google sign-in.");
                } else {
                    toast.error(error.message || "Registration failed.");
                }
                return;
            }

            // If Supabase requires email confirmation, user won't have a session yet.
            // If confirmations are disabled, user is signed in immediately.
            if (data.session) {
                // Signed in immediately — route through callback flow
                navigate("/auth/callback", { replace: true });
            } else {
                // Email confirmation required
                setCheckInbox(true);
            }
        } catch (err: any) {
            console.error("Email sign-up error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsEmailLoading(false);
        }
    };

    // ── "Check your inbox" state ────────────────────────────────
    if (checkInbox) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
                <SEO title="Check Your Email | Swissperiences" />
                <div className="max-w-sm w-full text-center">
                    <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">
                        Almost There
                    </span>

                    <h1 className="text-3xl font-serif text-white mb-4">
                        Check your inbox.
                    </h1>

                    <p className="text-white/50 font-light leading-relaxed mb-4">
                        We've sent a confirmation link to
                    </p>
                    <p className="text-white/80 font-medium text-sm mb-8">
                        {email}
                    </p>
                    <p className="text-white/40 text-xs leading-relaxed mb-12">
                        Click the link in the email to activate your account.
                        Once confirmed, you'll be directed to complete your application.
                    </p>

                    <button
                        onClick={() => { setCheckInbox(false); setEmailMode("sign-in"); setPassword(""); }}
                        className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                    >
                        &larr; Back to Sign In
                    </button>
                </div>
            </div>
        );
    }

    // ── Main Login UI ───────────────────────────────────────────
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <SEO
                title="Sign In | Swissperiences"
                description="Sign in to access your Swissperiences membership or apply for access."
            />

            <div className="max-w-sm w-full text-center">
                <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">
                    Swissperiences
                </span>

                <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    Welcome.
                </h1>

                <p className="text-white/60 font-light leading-relaxed mb-12">
                    Sign in to access your member area or begin your application.
                </p>

                {/* Google OAuth — primary */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isEmailLoading}
                    className="w-full bg-transparent border border-white/10 text-white py-4 rounded-none flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white/5 transition-all disabled:opacity-50"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    {isGoogleLoading ? "Connecting..." : "Continue with Google"}
                </button>

                {/* Divider + Email toggle */}
                <div className="my-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/5" />
                    <button
                        onClick={() => setShowEmail(!showEmail)}
                        className="text-white/40 hover:text-white/60 transition-colors text-[10px] uppercase tracking-[0.2em] whitespace-nowrap"
                    >
                        {showEmail ? "Hide" : "Or sign in with email"}
                    </button>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Email/Password form — expandable */}
                {showEmail && (
                    <form
                        onSubmit={emailMode === "sign-in" ? handleEmailSignIn : handleEmailSignUp}
                        className="space-y-4 animate-fade-in"
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            disabled={isEmailLoading}
                            autoComplete="email"
                            className="w-full bg-transparent border border-white/10 text-white py-3.5 px-4 text-sm placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors disabled:opacity-50"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            disabled={isEmailLoading}
                            autoComplete={emailMode === "sign-in" ? "current-password" : "new-password"}
                            minLength={6}
                            className="w-full bg-transparent border border-white/10 text-white py-3.5 px-4 text-sm placeholder:text-white/30 focus:outline-none focus:border-glacier-500/50 transition-colors disabled:opacity-50"
                        />

                        <button
                            type="submit"
                            disabled={isEmailLoading || isGoogleLoading}
                            className="w-full bg-white text-black py-4 text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isEmailLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : emailMode === "sign-in" ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setEmailMode(emailMode === "sign-in" ? "sign-up" : "sign-in")}
                            className="text-white/40 hover:text-white/60 transition-colors text-[10px] uppercase tracking-[0.15em] mt-2"
                        >
                            {emailMode === "sign-in"
                                ? "Don't have an account? Create one"
                                : "Already have an account? Sign in"
                            }
                        </button>
                    </form>
                )}

                <div className={showEmail ? "mt-10" : "mt-8"}>
                    <a
                        href="/"
                        className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                    >
                        &larr; Back to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
