import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { Users, Check, X, Mail, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Application {
    id: string;
    full_name: string;
    email: string;
    city: string | null;
    country: string | null;
    reason: string | null;
    referral_source: string | null;
    status: string;
    created_at: string;
}

const Admin = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('membership_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error: any) {
            console.error('Error fetching applications:', error.message);
            toast.error("Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected', app: Application) => {
        try {
            // 1. Update Application Status
            const { error: updateError } = await supabase
                .from('membership_applications')
                .update({ status: newStatus, reviewed_at: new Date().toISOString() })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. If approved, create a Member record
            if (newStatus === 'approved') {
                // We attempt to create the member. 
                // Note: Realistically, we need the auth_user_id here.
                // For this demo, we'll try to insert and assume the user is already in auth.users
                // If it fails due to FKEY, it's because the lead hasn't logged in yet (manual application)
                const { error: memberError } = await supabase
                    .from('members')
                    .insert({
                        email: app.email,
                        full_name: app.full_name,
                        city: app.city,
                        country: app.country,
                        membership_tier: 'member',
                        membership_status: 'active',
                        auth_user_id: id // Reusing the application ID if it's a social lead, or this might fail
                    });

                if (memberError) {
                    console.warn('Member record not created automatically:', memberError.message);
                    toast.info("Application approved. Lead needs to sign in to complete profile.");
                } else {
                    toast.success("Member access granted automatically.");

                    // 3. Send Approval Email
                    try {
                        console.log('Sending approval email to:', app.email);
                        const { error: emailError } = await supabase.functions.invoke('send-approval-email', {
                            body: { email: app.email, fullName: app.full_name }
                        });

                        if (emailError) {
                            console.error('Failed to send email:', emailError);
                            toast.error("Approved, but failed to send email.");
                        } else {
                            toast.success("Approval email sent.");
                        }
                    } catch (err) {
                        console.error('Error invoking email function:', err);
                    }
                }
            } else {
                toast.success(`Application ${newStatus}`);
            }

            setApplications(apps => apps.map(appItem =>
                appItem.id === id ? { ...appItem, status: newStatus } : appItem
            ));
        } catch (error: any) {
            console.error('Error updating status:', error.message);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <SEO title="Lead Management | Admin" description="Manage Swissperiences membership applications." />

            {/* Navigation / Header */}
            <nav className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-switz-red flex items-center justify-center font-bold text-xs">A</div>
                    <div>
                        <h1 className="text-sm font-medium tracking-widest uppercase">Admin Dashboard</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Swissperiences Sanctuary Management</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <button
                        onClick={async () => {
                            const { error } = await supabase.from('membership_applications').insert({
                                full_name: "Test Member",
                                email: `test-${Math.floor(Math.random() * 1000)}@example.com`,
                                status: 'pending',
                                referral_source: 'automation-test'
                            });
                            if (!error) {
                                toast.success("Test lead created");
                                fetchApplications();
                            }
                        }}
                        className="text-xs uppercase tracking-widest text-switz-red hover:text-white transition-colors"
                    >
                        Create Test Lead
                    </button>
                    <a href="/" className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">Site View</a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 lg:p-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">
                            Operations
                        </span>
                        <h2 className="text-4xl font-serif">Membership Applications</h2>
                        <p className="text-white/40 mt-2 font-light">Directing the future community of the Alpine Sanctuary.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-none flex items-center gap-3">
                            <Users className="w-4 h-4 text-white/40" />
                            <span className="text-xl font-medium">{applications.length}</span>
                            <span className="text-[10px] uppercase tracking-widest text-white/40">Total Leads</span>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="h-64 border border-dashed border-white/10 flex flex-col items-center justify-center text-white/20">
                        <Users className="w-12 h-12 mb-4 opacity-10" />
                        <p className="uppercase tracking-[0.2em] text-xs">No applications found</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app.id} className="group bg-neutral-950 border border-white/5 p-8 flex flex-col lg:flex-row justify-between gap-8 hover:border-white/20 transition-all duration-500">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-start justify-between lg:justify-start lg:gap-6">
                                        <div>
                                            <h3 className="text-xl font-serif mb-1">{app.full_name}</h3>
                                            <div className="flex items-center gap-2 text-white/40 text-sm">
                                                <Mail className="w-3 h-3" />
                                                <span>{app.email}</span>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 text-[9px] uppercase tracking-widest font-bold self-start mt-1 ${app.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                            app.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-switz-red/10 text-switz-red animate-pulse'
                                            }`}>
                                            {app.status || 'pending'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs tracking-widest uppercase">
                                        <div className="space-y-1">
                                            <span className="text-white/20 block text-[9px]">Location</span>
                                            <div className="flex items-center gap-1.5 text-white/60">
                                                <MapPin className="w-3 h-3 opacity-30" />
                                                <span>{app.city && app.country ? `${app.city}, ${app.country}` : 'Remote'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-white/20 block text-[9px]">Source</span>
                                            <div className="text-white/60">{app.referral_source || 'Direct'}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-white/20 block text-[9px]">Date</span>
                                            <div className="flex items-center gap-1.5 text-white/60">
                                                <Calendar className="w-3 h-3 opacity-30" />
                                                <span>{format(new Date(app.created_at), 'MMM dd, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {app.reason && (
                                        <div className="bg-white/[0.02] p-4 border-l border-white/10">
                                            <span className="text-white/20 block text-[9px] uppercase tracking-widest mb-2 font-bold">Motivation</span>
                                            <p className="text-white/60 font-light italic leading-relaxed text-sm">
                                                "{app.reason}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex lg:flex-col justify-end gap-3 lg:w-48">
                                    {app.status === 'pending' || !app.status ? (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'approved', app)}
                                                className="flex-1 bg-white text-black text-[10px] py-3 uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
                                            >
                                                <Check className="w-3 h-3" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'rejected', app)}
                                                className="flex-1 border border-white/10 text-white/60 text-[10px] py-3 uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:text-white transition-all"
                                            >
                                                <X className="w-3 h-3" /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="w-full border border-white/5 text-white/20 text-[10px] py-3 uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-default"
                                        >
                                            <Check className="w-3 h-3 opacity-20" /> Processed
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="mt-24 p-12 border-t border-white/5 text-center">
                <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Handcrafted for Swissperiences Excellence</p>
            </footer>
        </div>
    );
};

export default Admin;
