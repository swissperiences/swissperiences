import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { newsletterSignup } from "@/lib/newsletter";

/**
 * Unified Auth Callback
 *
 * After Google OAuth, this page checks membership status and routes:
 *   - Active member  → /members
 *   - Pending application → /pending-approval
 *   - No application → auto-creates application from Google profile → /pending-approval
 *
 * This means every Google sign-in is implicitly an application.
 * The admin reviews and approves/rejects from the dashboard.
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            // Wait for Supabase to process the OAuth callback
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("❌ [AuthCallback] No user after OAuth:", authError);
                setError("Authentication failed. Please try again.");
                return;
            }

            // Check membership status
            const { data, error: rpcError } = await supabase.rpc("get_or_create_member");

            if (rpcError) {
                console.error("❌ [AuthCallback] RPC error:", rpcError);
                navigate("/members", { replace: true });
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
                    // Auto-create application from Google profile data.
                    // This eliminates the need for a separate form and ensures
                    // the application email always matches the Google login email.
                    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
                    const email = user.email || "";

                    const { error: insertError } = await supabase
                        .from("membership_applications")
                        .insert({
                            full_name: fullName,
                            email: email,
                            referral_source: "google_oauth",
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
            setError("Something went wrong. Please try again.");
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
                <SEO title="Error | Swissperiences" />
                <div className="max-w-md text-center">
                    <h1 className="text-2xl font-serif text-white mb-4">Something went wrong</h1>
                    <p className="text-white/60 font-light mb-8">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/login"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                        >
                            Try Again
                        </a>
                        <a
                            href="/"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                        >
                            Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <SEO title="Redirecting... | Swissperiences" />
            <div className="text-center">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/40 text-xs uppercase tracking-[0.2em]">One moment...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
