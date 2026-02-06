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
                console.log("🔒 [AuthGuard] Checking session...");
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    console.log("❌ [AuthGuard] No session found. Redirecting to /request-access");
                    // Only redirect if we are not already there to avoid loop (though /request-access is public usually)
                    // But AuthGuard wraps protected routes. 
                    // If we are WRAPPING /request-access with AuthGuard, that's a bug.
                    // Assuming AuthGuard is only for protected routes:
                    navigate("/request-access", { state: { from: location } });
                    return;
                }

                console.log("✅ [AuthGuard] Session found for:", session.user.email);

                // Check Admin access
                if (requireAdmin) {
                    const adminEmails = ['cv@lux-sanctuary.com', 'admin@swissperiences.com', 'cauehvidal@gmail.com'];
                    if (!adminEmails.includes(session.user.email || "")) {
                        console.warn("⛔ [AuthGuard] Admin required but email not in allowlist.");
                        navigate("/en");
                        return;
                    }
                } else {
                    // Check Member access
                    console.log("🔍 [AuthGuard] Verifying membership status in DB...");
                    const { data: memberData, error } = await supabase
                        .from('members')
                        .select('membership_status')
                        .eq('email', session.user.email)
                        .maybeSingle();

                    if (error) console.error("⚠️ [AuthGuard] DB Error:", error);
                    console.log("📊 [AuthGuard] Member Data:", memberData);

                    if (!memberData || memberData.membership_status !== 'active') {
                        console.log("⚠️ [AuthGuard] Not active. Checking application status...");
                        const { data: application } = await supabase
                            .from('membership_applications')
                            .select('status')
                            .eq('email', session.user.email)
                            .maybeSingle();

                        console.log("📄 [AuthGuard] Application Data:", application);

                        if (application?.status === 'pending') {
                            navigate("/pending-approval");
                            return;
                        } else {
                            navigate("/request-access");
                            return;
                        }
                    }
                }

                console.log("🔓 [AuthGuard] Access granted!");
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
