import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { newsletterSignup } from "@/lib/newsletter";

/**
 * Unified Auth Callback
 *
 * Uses onAuthStateChange to reliably detect the session after OAuth redirect.
 * This is more robust than a single getUser() call — it listens for the
 * SIGNED_IN event and only then proceeds with membership routing.
 *
 * Routing logic:
 *   - Active member  → /members
 *   - Pending application → /pending-approval
 *   - No application → auto-creates from profile → /pending-approval
 *
 * Safety: 8-second timeout shows a recovery button instead of a dead screen.
 */

type CallbackState = "listening" | "processing" | "error" | "timeout";

const TIMEOUT_MS = 8000;

const AuthCallback = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<CallbackState>("listening");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const processedRef = useRef(false);

    useEffect(() => {
        // Safety timeout — if no auth event fires within 8s, show recovery UI
        const timeout = setTimeout(() => {
            if (!processedRef.current) {
                setState("timeout");
            }
        }, TIMEOUT_MS);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // Only act on SIGNED_IN (or INITIAL_SESSION with a valid session)
                // and only process once
                if (processedRef.current) return;

                if (
                    (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
                    session?.user
                ) {
                    processedRef.current = true;
                    clearTimeout(timeout);
                    await handleAuthenticated(session.user);
                }
            }
        );

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const handleAuthenticated = async (user: { id: string; email?: string; user_metadata?: Record<string, any> }) => {
        setState("processing");

        try {
            const { data, error: rpcError } = await supabase.rpc("get_or_create_member");

            if (rpcError) {
                console.error("❌ [AuthCallback] RPC error:", rpcError);
                // Don't fallback to /members (AuthGuard would fail too → redirect loop)
                navigate("/pending-approval", { replace: true });
                return;
            }

            const result = data as { status: string; member?: { membership_status: string } } | null;

            if (!result) {
                navigate("/request-access", { replace: true });
                return;
            }

            switch (result.status) {
                case "found":
                case "created":
                    if (result.member?.membership_status === "active") {
                        navigate("/members", { replace: true });
                        return;
                    }
                    navigate("/pending-approval", { replace: true });
                    return;

                case "pending":
                    navigate("/pending-approval", { replace: true });
                    return;

                case "no_application": {
                    // Auto-create application from profile data
                    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
                    const email = user.email || "";
                    const isOAuth = !!user.user_metadata?.full_name || !!user.user_metadata?.avatar_url;
                    const referral = isOAuth ? "google_oauth" : "email";

                    // RLS requires full_name <> '' — for email signups without a name,
                    // use the email prefix as a placeholder
                    const safeName = fullName || email.split("@")[0] || "Member";

                    const { error: insertError } = await supabase
                        .from("membership_applications")
                        .insert({
                            full_name: safeName,
                            email: email,
                            referral_source: referral,
                            status: "pending",
                        });

                    if (insertError) {
                        // Duplicate = already applied with this email, just continue
                        if (
                            insertError.code !== "23505" &&
                            !insertError.message?.includes("duplicate") &&
                            !insertError.details?.includes("already exists")
                        ) {
                            console.error("❌ [AuthCallback] Auto-apply insert error:", insertError);
                        }
                    }

                    // Also add to Resend newsletter audience (fire-and-forget)
                    newsletterSignup(email)
                        .catch((err) => console.warn("⚠️ [AuthCallback] Newsletter signup failed:", err));

                    navigate("/pending-approval", { replace: true });
                    return;
                }

                default:
                    navigate("/request-access", { replace: true });
                    return;
            }
        } catch (err: any) {
            console.error("❌ [AuthCallback] Unexpected error:", err);
            setErrorMessage("Something went wrong. Please try again.");
            setState("error");
        }
    };

    const handleRetry = async () => {
        processedRef.current = false;
        setState("listening");
        setErrorMessage(null);

        // Try a direct getUser() as fallback — the session may already be in localStorage
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                processedRef.current = true;
                await handleAuthenticated(user);
                return;
            }
        } catch {
            // ignore, will fall through to timeout again
        }

        // Re-arm the timeout
        setTimeout(() => {
            if (!processedRef.current) {
                setState("timeout");
            }
        }, TIMEOUT_MS);
    };

    // ── Listening / Processing: elegant loading state ──────────────
    if (state === "listening" || state === "processing") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <SEO title="Redirecting... | Swissperiences" />
                <div className="text-center">
                    <div className="w-6 h-6 border-2 border-white/10 border-t-switz-red rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-white/50 text-xs uppercase tracking-[0.25em] mb-2">
                        {state === "listening"
                            ? "Authenticating your access..."
                            : "Preparing your experience..."
                        }
                    </p>
                    <span className="text-white/15 text-[10px] uppercase tracking-[0.2em]">
                        Swissperiences
                    </span>
                </div>
            </div>
        );
    }

    // ── Timeout: session not detected — show recovery button ──────
    if (state === "timeout") {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
                <SEO title="Authentication | Swissperiences" />
                <div className="max-w-md text-center">
                    <div className="w-16 h-px bg-white/10 mx-auto mb-10" />
                    <h1 className="text-2xl font-serif text-white mb-4">
                        Taking longer than expected.
                    </h1>
                    <p className="text-white/40 font-light text-sm mb-10 leading-relaxed">
                        We couldn't detect your session automatically.
                        This can happen on slow connections. Try again below.
                    </p>
                    <button
                        onClick={handleRetry}
                        className="w-full max-w-xs mx-auto bg-white text-black py-4 text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 mb-4"
                    >
                        Retry Authentication
                    </button>
                    <div className="flex gap-6 justify-center mt-8">
                        <a
                            href="/login"
                            className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.15em]"
                        >
                            Sign In Again
                        </a>
                        <a
                            href="/"
                            className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.15em]"
                        >
                            Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ── Error: something went wrong ───────────────────────────────
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <SEO title="Error | Swissperiences" />
            <div className="max-w-md text-center">
                <div className="w-16 h-px bg-switz-red/30 mx-auto mb-10" />
                <h1 className="text-2xl font-serif text-white mb-4">Something went wrong.</h1>
                <p className="text-white/40 font-light text-sm mb-10 leading-relaxed">
                    {errorMessage || "An unexpected error occurred during authentication."}
                </p>
                <button
                    onClick={handleRetry}
                    className="w-full max-w-xs mx-auto bg-white text-black py-4 text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 mb-4"
                >
                    Try Again
                </button>
                <div className="flex gap-6 justify-center mt-8">
                    <a
                        href="/login"
                        className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.15em]"
                    >
                        Sign In Again
                    </a>
                    <a
                        href="/"
                        className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-[0.15em]"
                    >
                        Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AuthCallback;
