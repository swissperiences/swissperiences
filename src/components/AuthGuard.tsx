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
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    navigate("/login", { state: { from: location } });
                    return;
                }

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
                    const { data, error } = await supabase.rpc('get_or_create_member');

                    if (error) {
                        console.error("⚠️ [AuthGuard] RPC Error:", error);
                        navigate("/request-access");
                        return;
                    }

                    const result = data as { status: string; member?: { membership_status: string } };

                    switch (result.status) {
                        case 'found':
                        case 'created':
                            if (result.member?.membership_status === 'active') {
                                setIsLoading(false);
                                return;
                            }
                            navigate("/request-access");
                            return;

                        case 'pending':
                            navigate("/pending-approval");
                            return;

                        case 'no_application':
                            navigate("/request-access");
                            return;

                        default:
                            navigate("/request-access");
                            return;
                    }
                }

                // Admin path reaches here
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
