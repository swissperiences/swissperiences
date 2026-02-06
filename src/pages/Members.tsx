import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { LogOut, MapPin, Calendar, Mail } from "lucide-react";
import { BookingCalendar } from "@/components/BookingCalendar";

interface Member {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
    city: string;
    country: string;
    membership_tier: string;
    membership_status: string;
    joined_at: string;
}

const Members = () => {
    const navigate = useNavigate();
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingState, setBookingState] = useState<{ isOpen: boolean; sanctuary: string }>({
        isOpen: false,
        sanctuary: ""
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/request-access');
                return;
            }

            // Use RPC to ensure member exists and auth_user_id is linked
            const { data: rpcResult } = await supabase.rpc('get_or_create_member');
            const result = rpcResult as { status: string; member?: any } | null;

            if (!result || (result.status !== 'found' && result.status !== 'created')) {
                navigate('/request-access');
                return;
            }

            // Now fetch full member data (auth_user_id is guaranteed to be linked)
            const { data: memberData, error } = await supabase
                .from('members')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (error || !memberData) {
                navigate('/request-access');
                return;
            }

            setMember(memberData);
        } catch (error) {
            console.error('Error checking auth:', error);
            navigate('/request-access');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/60 text-sm">Loading...</div>
            </div>
        );
    }

    if (!member) return null;

    return (
        <div className="min-h-screen bg-black">
            <SEO title="Member Area | Swissperiences" />

            {/* Header */}
            <header className="border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="text-white font-serif text-xl">Swissperiences</a>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            {member.avatar_url ? (
                                <img
                                    src={member.avatar_url}
                                    alt={member.full_name}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-sm">
                                    {member.full_name.charAt(0)}
                                </div>
                            )}
                            <span className="text-white/80 text-sm">{member.full_name}</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="text-white/40 hover:text-white transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* Welcome Section */}
                <div className="mb-16">
                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">
                        Member Area
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Welcome back, {member.full_name.split(' ')[0]}.
                    </h1>
                    <p className="text-white/60 font-light max-w-xl">
                        Access our collection of curated alpine sanctuaries and exclusive experiences.
                    </p>
                </div>

                {/* Membership Card */}
                <div className="mb-16">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm p-8 max-w-md">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                                    {member.membership_tier} Member
                                </span>
                                <h3 className="text-xl font-serif text-white">{member.full_name}</h3>
                            </div>
                            <div className="text-right">
                                <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded-full ${member.membership_status === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-white/10 text-white/40'
                                    }`}>
                                    {member.membership_status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-white/60">
                                <Mail size={14} />
                                <span>{member.email}</span>
                            </div>
                            {(member.city || member.country) && (
                                <div className="flex items-center gap-3 text-white/60">
                                    <MapPin size={14} />
                                    <span>{member.city}{member.country ? `, ${member.country}` : ''}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-white/60">
                                <Calendar size={14} />
                                <span>Member since {new Date(member.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sanctuaries */}
                <div className="mb-16">
                    <h2 className="text-2xl font-serif text-white mb-8">The Sanctuaries</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Villars */}
                        <div className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src="/images/villars-hero.jpg"
                                    alt="The Alpine Sanctuary"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-switz-red text-[10px] uppercase tracking-widest">Available</span>
                                <h3 className="text-xl font-serif text-white mt-2 mb-2">The Alpine Sanctuary</h3>
                                <p className="text-white/60 text-sm mb-4">Villars-sur-Ollon, Switzerland</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/40 text-sm">From CHF 1,200/night</span>
                                    <button
                                        onClick={() => setBookingState({ isOpen: true, sanctuary: "The Alpine Sanctuary" })}
                                        className="text-switz-red text-xs uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        View Dates →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Norway - Coming Soon */}
                        <div className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/5 opacity-60">
                            <div className="aspect-[4/3] overflow-hidden bg-white/5 flex items-center justify-center">
                                <span className="text-white/20 text-sm">Image Coming Soon</span>
                            </div>
                            <div className="p-6">
                                <span className="text-white/30 text-[10px] uppercase tracking-widest">Coming 2027</span>
                                <h3 className="text-xl font-serif text-white/50 mt-2 mb-2">Fjord Haven</h3>
                                <p className="text-white/30 text-sm mb-4">Norway</p>
                            </div>
                        </div>

                        {/* Patagonia - Coming Soon */}
                        <div className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/5 opacity-60">
                            <div className="aspect-[4/3] overflow-hidden bg-white/5 flex items-center justify-center">
                                <span className="text-white/20 text-sm">Image Coming Soon</span>
                            </div>
                            <div className="p-6">
                                <span className="text-white/30 text-[10px] uppercase tracking-widest">Coming 2028</span>
                                <h3 className="text-xl font-serif text-white/50 mt-2 mb-2">Patagonia Retreat</h3>
                                <p className="text-white/30 text-sm mb-4">Argentina</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experiences */}
                <div className="mb-16">
                    <h2 className="text-2xl font-serif text-white mb-8">Experiences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Road Journey', price: 'From CHF 850', desc: 'Private Range Rover tours' },
                            { name: 'Cinematic Memories', price: 'CHF 600', desc: 'Professional documentation' },
                            { name: 'Private Chef', price: 'From CHF 400', desc: 'In-chalet dining' },
                            { name: 'Guided Hikes', price: 'From CHF 300', desc: 'Expert mountain guides' },
                        ].map((exp) => (
                            <div key={exp.name} className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                                <h4 className="text-white font-serif mb-2">{exp.name}</h4>
                                <p className="text-white/40 text-xs mb-4">{exp.desc}</p>
                                <span className="text-switz-red text-sm">{exp.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="border-t border-white/5 pt-16">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-serif text-white mb-4">Ready to book?</h2>
                        <p className="text-white/60 font-light mb-8">
                            Contact us directly to arrange your next escape. We'll handle every detail.
                        </p>
                        <a
                            href="mailto:hello@swissperiences.ch?subject=Booking Inquiry"
                            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors"
                        >
                            <Mail size={16} />
                            Inquire About Availability
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-white/30 text-xs">
                    <span>© 2026 Swissperiences</span>
                    <div className="flex gap-6">
                        <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </footer>

            <BookingCalendar
                sanctuaryName={bookingState.sanctuary}
                isOpen={bookingState.isOpen}
                onClose={() => setBookingState({ ...bookingState, isOpen: false })}
            />
        </div>
    );
};

export default Members;
