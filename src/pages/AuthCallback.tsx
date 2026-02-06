import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            const flow = searchParams.get("flow") || "login";
            console.log("🔄 [AuthCallback] Processing callback, flow:", flow);

            // Wait for Supabase to process the OAuth callback
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("❌ [AuthCallback] No user after OAuth:", authError);
                setError("Authentication failed. Please try again.");
                return;
            }

            console.log("✅ [AuthCallback] User authenticated:", user.email);

            if (flow === "apply") {
                // Application flow: create membership application from Google profile
                const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
                const email = user.email || "";

                console.log("📝 [AuthCallback] Creating application for:", email);

                const { error: insertError } = await supabase
                    .from("membership_applications")
                    .insert({
                        full_name: fullName,
                        email: email,
                        referral_source: "google_oauth",
                        status: "pending",
                    });

                if (insertError) {
                    // Duplicate application = already applied
                    if (
                        insertError.code === "23505" ||
                        insertError.message?.includes("duplicate") ||
                        insertError.details?.includes("already exists")
                    ) {
                        console.log("⚠️ [AuthCallback] Application already exists for:", email);
                        // Check if they're already approved
                        const { data: rpcData } = await supabase.rpc("get_or_create_member");
                        const result = rpcData as { status: string; member?: { membership_status: string } } | null;

                        if (result?.status === "found" || result?.status === "created") {
                            if (result?.member?.membership_status === "active") {
                                console.log("🔓 [AuthCallback] Already an active member, redirecting to /members");
                                navigate("/members", { replace: true });
                                return;
                            }
                        }
                        if (result?.status === "pending") {
                            navigate("/pending-approval", { replace: true });
                            return;
                        }
                        // Default: already applied, go to pending
                        navigate("/pending-approval", { replace: true });
                        return;
                    }
                    console.error("❌ [AuthCallback] Insert error:", insertError);
                    setError("Something went wrong creating your application. Please try again.");
                    return;
                }

                console.log("✅ [AuthCallback] Application created, redirecting to /pending-approval");
                navigate("/pending-approval", { replace: true });

            } else {
                // Login flow: go straight to members (AuthGuard handles the rest)
                console.log("🔑 [AuthCallback] Login flow, redirecting to /members");
                navigate("/members", { replace: true });
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
                            href="/request-access"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                        >
                            Apply
                        </a>
                        <a
                            href="/login"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                        >
                            Login
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
