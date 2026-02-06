import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("🔒 [AuthGuard] Checking auth...");
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.log("❌ [AuthGuard] No valid session. Redirecting to /login");
                    navigate("/login", { state: { from: location } });
                    return;
                }

                console.log("✅ [AuthGuard] Authenticated user:", user.email);

                // Check Admin access
                if (requireAdmin) {
                    const adminEmails = ['cv@lux-sanctuary.com', 'admin@swissperiences.com', 'cauehvidal@gmail.com'];
                    if (!adminEmails.includes(user.email || "")) {
                        console.warn("⛔ [AuthGuard] Admin required but email not in allowlist.");
                        navigate("/en");
                        return;
                    }
                } else {
                    // Check Member access via RPC function (bypasses RLS issues)
                    console.log("🔍 [AuthGuard] Calling get_or_create_member RPC...");
                    const { data, error } = await supabase.rpc('get_or_create_member');

                    if (error) {
                        console.error("⚠️ [AuthGuard] RPC Error:", error);
                        navigate("/request-access");
                        return;
                    }

                    console.log("📊 [AuthGuard] RPC Result:", data);

                    const result = data as { status: string; member?: { membership_status: string } };

                    switch (result.status) {
                        case 'found':
                        case 'created':
                            if (result.member?.membership_status === 'active') {
                                console.log("🔓 [AuthGuard] Access granted!");
                                setIsLoading(false);
                                return;
                            }
                            console.log("⚠️ [AuthGuard] Member exists but not active:", result.member?.membership_status);
                            navigate("/request-access");
                            return;

                        case 'pending':
                            console.log("⏳ [AuthGuard] Application pending.");
                            navigate("/pending-approval");
                            return;

                        case 'no_application':
                            console.log("📝 [AuthGuard] No application found.");
                            navigate("/request-access");
                            return;

                        default:
                            console.log("❓ [AuthGuard] Unexpected status:", result.status);
                            navigate("/request-access");
                            return;
                    }
                }

                // Admin path reaches here
                console.log("🔓 [AuthGuard] Admin access granted!");
                setIsLoading(false);
            } catch (error) {
                console.error("Auth check failed:", error);
                navigate("/request-access");
            }
        };

        checkAuth();
    }, [navigate, location, requireAdmin]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
