import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const ActivateMembership = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [applicationEmail, setApplicationEmail] = useState<string>("");

    const token = searchParams.get('token');

    useEffect(() => {
        validateToken();
    }, [token]);

    const validateToken = async () => {
        if (!token) {
            setIsValidToken(false);
            setIsLoading(false);
            return;
        }

        try {
            // Check if token exists and is not expired or used
            const { data, error } = await supabase
                .from('approval_tokens')
                .select('*, membership_applications(*)')
                .eq('token', token)
                .single();

            if (error || !data) {
                setIsValidToken(false);
            } else if (data.used_at) {
                toast.error("This activation link has already been used.");
                setIsValidToken(false);
            } else if (new Date(data.expires_at) < new Date()) {
                toast.error("This activation link has expired.");
                setIsValidToken(false);
            } else {
                setIsValidToken(true);
                setApplicationEmail(data.membership_applications?.email || "");
            }
        } catch (error) {
            console.error('Error validating token:', error);
            setIsValidToken(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/activate-membership/callback?token=${token}`,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            });

            if (error) throw error;
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            toast.error("Failed to sign in. Please try again.");
        }
    };

    const handleAppleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'apple',
                options: {
                    redirectTo: `${window.location.origin}/activate-membership/callback?token=${token}`
                }
            });

            if (error) throw error;
        } catch (error: any) {
            console.error('Error signing in with Apple:', error);
            toast.error("Failed to sign in. Please try again.");
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/60 text-sm">Validating your invitation...</div>
            </div>
        );
    }

    // Invalid or expired token
    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <SEO title="Invalid Link | Swissperiences" />
                <div className="max-w-md text-center">
                    <h1 className="text-3xl font-serif text-white mb-6">Invalid Link</h1>
                    <p className="text-white/60 font-light leading-relaxed mb-8">
                        This activation link is invalid, expired, or has already been used.
                        If you believe this is an error, please contact us.
                    </p>
                    <a
                        href="mailto:hello@swissperiences.ch"
                        className="text-switz-red hover:text-white transition-colors text-sm"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        );
    }

    // Valid token - show sign up options
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <SEO title="Activate Membership | Swissperiences" />

            <div className="max-w-md w-full text-center">
                <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    Welcome to Swissperiences
                </h1>

                <p className="text-white/60 font-light leading-relaxed mb-2">
                    Your application has been approved.
                </p>
                <p className="text-white/60 font-light leading-relaxed mb-12">
                    Create your account to access our collection of alpine sanctuaries.
                </p>

                <div className="space-y-4">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 px-6 hover:bg-white/90 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm uppercase tracking-widest font-medium">Continue with Google</span>
                    </button>

                    {/* Apple Sign In */}
                    <button
                        onClick={handleAppleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white/10 text-white py-4 px-6 border border-white/20 hover:bg-white/20 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        <span className="text-sm uppercase tracking-widest font-medium">Continue with Apple</span>
                    </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-white/30 text-xs">
                        By creating an account, you agree to our{' '}
                        <a href="/terms" className="text-white/50 hover:text-white transition-colors">Terms</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ActivateMembership;
