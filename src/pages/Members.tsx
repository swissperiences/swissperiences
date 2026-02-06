import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { LogOut, MapPin, Calendar, Mail } from "lucide-react";
import { BookingCalendar } from "@/components/BookingCalendar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";

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
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
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
                navigate('/login');
                return;
            }

            // Get full member profile via RPC (bypasses RLS)
            const { data: memberData, error } = await supabase.rpc('get_member_profile');

            if (error || !memberData) {
                navigate('/login');
                return;
            }

            const m = memberData as Record<string, any>;
            setMember({
                id: m.id || '',
                full_name: m.full_name || '',
                email: m.email || user.email || '',
                avatar_url: m.avatar_url || user.user_metadata?.avatar_url || null,
                city: m.city || '',
                country: m.country || '',
                membership_tier: m.membership_tier || 'founding',
                membership_status: m.membership_status || 'active',
                joined_at: m.joined_at || new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error checking auth:', error);
            navigate('/login');
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

            {/* Site Navigation */}
            <Navigation onWaitlistClick={() => setIsWaitlistOpen(true)} />

            {/* Member bar — below the floating nav */}
            <div className="pt-24 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {member.avatar_url ? (
                            <img
                                src={member.avatar_url}
                                alt={member.full_name}
                                className="w-7 h-7 rounded-full shrink-0"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs shrink-0">
                                {member.full_name.charAt(0)}
                            </div>
                        )}
                        <span className="text-white/60 text-xs uppercase tracking-widest truncate">{member.full_name}</span>
                        <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 hidden sm:inline ${member.membership_status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/10 text-white/40'
                            }`}>
                            {member.membership_tier}
                        </span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-white/30 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-widest shrink-0"
                        title="Sign Out"
                    >
                        <LogOut size={14} />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
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
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-sm p-5 sm:p-8 max-w-md">
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
                            <div className="flex items-center gap-3 text-white/60 min-w-0">
                                <Mail size={14} className="shrink-0" />
                                <span className="truncate">{member.email}</span>
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
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                            className="inline-flex items-center justify-center gap-3 bg-white text-black px-6 sm:px-8 py-4 text-xs sm:text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors w-full sm:w-auto text-center"
                        >
                            <Mail size={16} className="shrink-0" />
                            Inquire About Availability
                        </a>
                    </div>
                </div>
            </main>

            {/* Site Footer */}
            <Footer />

            <BookingCalendar
                sanctuaryName={bookingState.sanctuary}
                isOpen={bookingState.isOpen}
                onClose={() => setBookingState({ ...bookingState, isOpen: false })}
            />

            <WaitlistModal
                open={isWaitlistOpen}
                onOpenChange={setIsWaitlistOpen}
            />
        </div>
    );
};

export default Members;
