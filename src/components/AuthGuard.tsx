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
                    // Check Member access - query by auth_user_id first, fallback to email
                    // RLS policy allows SELECT by auth_user_id OR email match
                    console.log("🔍 [AuthGuard] Verifying membership status in DB...");
                    const { data: memberData, error } = await supabase
                        .from('members')
                        .select('membership_status, auth_user_id')
                        .or(`auth_user_id.eq.${session.user.id},email.eq.${session.user.email}`)
                        .maybeSingle();

                    if (error) console.error("⚠️ [AuthGuard] DB Error:", error);
                    console.log("📊 [AuthGuard] Member Data:", memberData);

                    // If member exists but auth_user_id is not linked, link it now
                    if (memberData && !memberData.auth_user_id) {
                        console.log("🔗 [AuthGuard] Linking auth_user_id to existing member record...");
                        await supabase
                            .from('members')
                            .update({ auth_user_id: session.user.id })
                            .eq('email', session.user.email);
                    }

                    if (!memberData || memberData.membership_status !== 'active') {
                        console.log("⚠️ [AuthGuard] Not active. Checking application status...");
                        const { data: application } = await supabase
                            .from('membership_applications')
                            .select('*')
                            .eq('email', session.user.email)
                            .maybeSingle();

                        console.log("📄 [AuthGuard] Application Data:", application);

                        if (application?.status === 'approved') {
                            console.log("🚑 [AuthGuard] Auto-healing: Application approved but member missing. Creating member...");
                            const { error: createError } = await supabase
                                .from('members')
                                .insert({
                                    email: application.email,
                                    full_name: application.full_name,
                                    city: application.city,
                                    country: application.country,
                                    membership_tier: 'founding',
                                    membership_status: 'active',
                                    auth_user_id: session.user.id
                                });

                            if (!createError) {
                                console.log("✅ [AuthGuard] Member created! Refreshing...");
                                navigate(0);
                                return;
                            } else {
                                console.error("❌ [AuthGuard] Failed to auto-heal:", createError);
                                // If insert failed due to duplicate email, try updating auth_user_id
                                if (createError.code === '23505') {
                                    console.log("🔄 [AuthGuard] Duplicate found. Updating existing record with auth_user_id...");
                                    const { error: updateError } = await supabase
                                        .from('members')
                                        .update({ auth_user_id: session.user.id })
                                        .eq('email', session.user.email);
                                    if (!updateError) {
                                        console.log("✅ [AuthGuard] Updated auth_user_id! Refreshing...");
                                        navigate(0);
                                        return;
                                    } else {
                                        console.error("❌ [AuthGuard] Failed to update auth_user_id:", updateError);
                                    }
                                }
                            }
                        }

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
