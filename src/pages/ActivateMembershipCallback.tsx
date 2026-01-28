import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ActivateMembershipCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

    const token = searchParams.get('token');

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            // Get the current user from the OAuth callback
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error('Failed to authenticate');
            }

            if (!token) {
                throw new Error('Missing activation token');
            }

            // Get the token and associated application
            const { data: tokenData, error: tokenError } = await supabase
                .from('approval_tokens')
                .select('*, membership_applications(*)')
                .eq('token', token)
                .single();

            if (tokenError || !tokenData) {
                throw new Error('Invalid activation token');
            }

            if (tokenData.used_at) {
                throw new Error('Token already used');
            }

            const application = tokenData.membership_applications;

            // Create the member record
            const { error: memberError } = await supabase
                .from('members')
                .insert({
                    auth_user_id: user.id,
                    application_id: application.id,
                    full_name: application.full_name,
                    email: user.email || application.email,
                    avatar_url: user.user_metadata?.avatar_url,
                    city: application.city,
                    country: application.country,
                    membership_tier: 'founding',
                    membership_status: 'active'
                });

            if (memberError) {
                // Check if member already exists
                if (memberError.code === '23505') {
                    // Member already exists, just mark token as used and redirect
                    console.log('Member already exists, proceeding...');
                } else {
                    throw memberError;
                }
            }

            // Mark the token as used
            await supabase
                .from('approval_tokens')
                .update({ used_at: new Date().toISOString() })
                .eq('id', tokenData.id);

            setStatus('success');
            toast.success('Welcome to Swissperiences!');

            // Redirect to member area after a brief delay
            setTimeout(() => {
                navigate('/members');
            }, 2000);

        } catch (error: any) {
            console.error('Error in activation callback:', error);
            setStatus('error');
            toast.error(error.message || 'Activation failed');
        }
    };

    if (status === 'processing') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-white/60 text-sm">Setting up your membership...</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-serif text-white mb-4">You're In</h1>
                    <p className="text-white/60 font-light mb-8">
                        Welcome to Swissperiences. Redirecting you to your member area...
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="max-w-md text-center">
                <h1 className="text-3xl font-serif text-white mb-4">Something Went Wrong</h1>
                <p className="text-white/60 font-light mb-8">
                    We couldn't complete your membership activation.
                    Please try again or contact support.
                </p>
                <div className="space-x-4">
                    <a
                        href={`/activate-membership?token=${token}`}
                        className="text-switz-red hover:text-white transition-colors text-sm"
                    >
                        Try Again
                    </a>
                    <a
                        href="mailto:hello@swissperiences.ch"
                        className="text-white/40 hover:text-white transition-colors text-sm"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ActivateMembershipCallback;
