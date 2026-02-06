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
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    navigate("/request-access", { state: { from: location } });
                    return;
                }

                // Check Admin access
                if (requireAdmin) {
                    const adminEmails = ['cv@lux-sanctuary.com', 'admin@swissperiences.com', 'cauehvidal@gmail.com']; // Authorized admins
                    if (!adminEmails.includes(session.user.email || "")) {
                        navigate("/en"); // Not an admin
                        return;
                    }
                } else {
                    // Check Member access - Query DB directly to avoid stale session issues
                    // We check if a member record exists and is active for this email
                    const { data: memberData, error } = await supabase
                        .from('members')
                        .select('membership_status')
                        .eq('email', session.user.email)
                        .maybeSingle();

                    // If no member record, or status is not active, check applications
                    if (!memberData || memberData.membership_status !== 'active') {
                        // Check if they have a pending application
                        const { data: application } = await supabase
                            .from('membership_applications')
                            .select('status')
                            .eq('email', session.user.email)
                            .maybeSingle();

                        if (application?.status === 'pending') {
                            navigate("/pending-approval");
                            return;
                        } else {
                            // No application or rejected or unknown state
                            navigate("/request-access");
                            return;
                        }
                    }
                    // If memberData exists and is active, they are good to go!
                }

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
