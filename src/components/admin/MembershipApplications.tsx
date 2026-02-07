import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Clock, Mail, User, MapPin, MessageSquare, Loader2 } from "lucide-react";

interface Application {
    id: string;
    full_name: string;
    email: string;
    city: string;
    country: string;
    reason: string;
    referral_source: string;
    referral_detail: string;
    status: 'pending' | 'approved' | 'rejected' | 'waitlist';
    admin_notes: string;
    created_at: string;
    reviewed_at: string;
}

export function MembershipApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);

    const sendApprovalEmail = async (app: Application) => {
        setSendingEmail(app.id);
        try {
            const { data, error } = await supabase.functions.invoke('send-approval-email', {
                body: {
                    applicationId: app.id,
                    email: app.email,
                    fullName: app.full_name
                }
            });

            if (error) throw error;

            toast.success(`Welcome email sent to ${app.email}`);
        } catch (error) {
            console.error('Error sending approval email:', error);
            toast.error('Failed to send welcome email. Please try again.');
        } finally {
            setSendingEmail(null);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data, error } = await supabase
                .from('membership_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: Application['status']) => {
        // Optimistic update
        setApplications(prev =>
            prev.map(app =>
                app.id === id
                    ? { ...app, status: newStatus, reviewed_at: new Date().toISOString() }
                    : app
            )
        );

        try {
            const { error } = await supabase
                .from('membership_applications')
                .update({
                    status: newStatus,
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: (await supabase.auth.getUser()).data.user?.email || 'admin'
                })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Application ${newStatus}`);

            // If approved, send welcome email with activation link
            if (newStatus === 'approved') {
                const app = applications.find(a => a.id === id);
                if (app) {
                    sendApprovalEmail(app);
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
            // Revert on error
            fetchApplications();
        }
    };

    const getStatusBadge = (status: Application['status']) => {
        const styles = {
            pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
            waitlist: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        };

        return (
            <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const pendingCount = applications.filter(a => a.status === 'pending').length;
    const approvedCount = applications.filter(a => a.status === 'approved').length;

    if (isLoading) {
        return (
            <div className="p-12 text-center text-white/30 animate-pulse">
                Loading applications...
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/5 text-white">
                    <CardContent className="pt-6">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Total Applications</span>
                        <span className="text-3xl font-serif italic">{applications.length}</span>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5 border-amber-500/10 text-white">
                    <CardContent className="pt-6">
                        <span className="text-[10px] uppercase tracking-widest text-amber-400/60 mb-2 block">Pending Review</span>
                        <span className="text-3xl font-serif italic text-amber-400">{pendingCount}</span>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/10 text-white">
                    <CardContent className="pt-6">
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 mb-2 block">Approved</span>
                        <span className="text-3xl font-serif italic text-emerald-400">{approvedCount}</span>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/5 text-white">
                    <CardContent className="pt-6">
                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2 block">Conversion Rate</span>
                        <span className="text-3xl font-serif italic">
                            {applications.length > 0 ? Math.round((approvedCount / applications.length) * 100) : 0}%
                        </span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Applications Table */}
                <div className="lg:col-span-2">
                    <Card className="bg-white/5 border-white/5 text-white overflow-hidden">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="font-serif italic text-xl">Membership Applications</CardTitle>
                            <CardDescription className="text-white/40 text-xs">
                                Review and approve access requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {applications.length === 0 ? (
                                <div className="p-12 text-center text-white/30">
                                    No applications yet. Share your Request Access page.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-white/5">
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Status</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Applicant</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Location</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Source</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40">Date</TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-widest text-white/40 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map((app) => (
                                            <TableRow
                                                key={app.id}
                                                className={`border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${selectedApp?.id === app.id ? 'bg-white/10' : ''}`}
                                                onClick={() => setSelectedApp(app)}
                                            >
                                                <TableCell>{getStatusBadge(app.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">{app.full_name}</span>
                                                        <span className="text-[10px] text-white/40">{app.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white/60 text-xs">
                                                    {app.city}{app.country ? `, ${app.country}` : ''}
                                                </TableCell>
                                                <TableCell className="text-white/40 text-xs capitalize">
                                                    {app.referral_source || '-'}
                                                </TableCell>
                                                <TableCell className="text-white/40 text-[10px] font-mono">
                                                    {new Date(app.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {app.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateStatus(app.id, 'approved');
                                                                    }}
                                                                    disabled={sendingEmail === app.id}
                                                                    className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors disabled:opacity-50"
                                                                    title="Approve"
                                                                >
                                                                    {sendingEmail === app.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateStatus(app.id, 'waitlist');
                                                                    }}
                                                                    className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded transition-colors"
                                                                    title="Waitlist"
                                                                >
                                                                    <Clock size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateStatus(app.id, 'rejected');
                                                                    }}
                                                                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                                                    title="Reject"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                        {app.status === 'approved' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    sendApprovalEmail(app);
                                                                }}
                                                                disabled={sendingEmail === app.id}
                                                                className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded transition-colors disabled:opacity-50"
                                                                title="Resend activation email"
                                                            >
                                                                {sendingEmail === app.id ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-1">
                    <Card className="bg-white/5 border-white/5 text-white sticky top-8">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="font-serif italic text-lg">Application Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {selectedApp ? (
                                <div className="space-y-6">
                                    {/* Applicant Info */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User size={16} className="text-white/40 mt-1" />
                                            <div>
                                                <p className="text-white font-medium">{selectedApp.full_name}</p>
                                                <p className="text-white/40 text-xs">{getStatusBadge(selectedApp.status)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail size={16} className="text-white/40 mt-1" />
                                            <a
                                                href={`mailto:${selectedApp.email}`}
                                                className="text-switz-red text-sm hover:underline"
                                            >
                                                {selectedApp.email}
                                            </a>
                                        </div>

                                        {(selectedApp.city || selectedApp.country) && (
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-white/40 mt-1" />
                                                <p className="text-white/70 text-sm">
                                                    {selectedApp.city}{selectedApp.country ? `, ${selectedApp.country}` : ''}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reason */}
                                    {selectedApp.reason && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-white/40">
                                                <MessageSquare size={14} />
                                                <span className="text-[10px] uppercase tracking-widest">What brought them here</span>
                                            </div>
                                            <p className="text-white/80 text-sm leading-relaxed bg-white/5 p-4 rounded-sm border border-white/5 italic">
                                                "{selectedApp.reason}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Referral */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] uppercase tracking-widest text-white/40">Referral Source</span>
                                        <p className="text-white/70 text-sm capitalize">
                                            {selectedApp.referral_source || 'Not specified'}
                                            {selectedApp.referral_detail && ` — ${selectedApp.referral_detail}`}
                                        </p>
                                    </div>

                                    {/* Dates */}
                                    <div className="space-y-2 pt-4 border-t border-white/5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-white/40">Applied</span>
                                            <span className="text-white/60 font-mono">
                                                {new Date(selectedApp.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        {selectedApp.reviewed_at && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-white/40">Reviewed</span>
                                                <span className="text-white/60 font-mono">
                                                    {new Date(selectedApp.reviewed_at).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Actions */}
                                    {selectedApp.status === 'pending' && (
                                        <div className="pt-4 space-y-2">
                                            <button
                                                onClick={() => updateStatus(selectedApp.id, 'approved')}
                                                disabled={sendingEmail === selectedApp.id}
                                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 text-xs uppercase tracking-widest font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {sendingEmail === selectedApp.id ? (
                                                    <>
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Approve & Send Welcome Email'
                                                )}
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => updateStatus(selectedApp.id, 'waitlist')}
                                                    className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 py-2 text-xs uppercase tracking-widest transition-colors"
                                                >
                                                    Waitlist
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 text-xs uppercase tracking-widest transition-colors"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedApp.status === 'approved' && (
                                        <div className="pt-4">
                                            <button
                                                onClick={() => sendApprovalEmail(selectedApp)}
                                                disabled={sendingEmail === selectedApp.id}
                                                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 text-xs uppercase tracking-widest font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {sendingEmail === selectedApp.id ? (
                                                    <>
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Mail size={14} />
                                                        Resend Activation Email
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-white/30 text-sm text-center py-8">
                                    Select an application to view details
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
