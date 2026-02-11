import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { LogOut, MapPin, Calendar, Mail, MessageCircle, BookOpen, ArrowRight, Clock, X } from "lucide-react";
import { BookingCalendar } from "@/components/BookingCalendar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { journals } from "@/data/journals";
import { toast } from "sonner";

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

interface Booking {
    id: string;
    sanctuary_id: string | null;
    experience_type: string | null;
    check_in: string | null;
    check_out: string | null;
    preferred_date: string | null;
    guests: number;
    status: string;
    total_nights: number | null;
    created_at: string;
}

const bookingLabels: Record<string, string> = {
    villars: "The Villars Loft",
    road_journey: "Alps Road Journey",
    guided_hike: "Guided Alpine Hike",
    cinematic_memories: "Cinematic Memories",
    private_chef: "Private Chef",
};

const statusStyles: Record<string, string> = {
    inquiry: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    completed: "bg-white/10 text-white/40 border-white/10",
};

const Members = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('home');
    const [member, setMember] = useState<Member | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingState, setBookingState] = useState<{ isOpen: boolean; sanctuary: string }>({
        isOpen: false,
        sanctuary: ""
    });
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (member?.id) loadBookings();
    }, [member?.id]);

    const loadProfile = async () => {
        try {
            // AuthGuard already verified auth + active membership.
            // We only need the profile data here.
            const { data: { user } } = await supabase.auth.getUser();
            const { data: memberData } = await supabase.rpc('get_member_profile');

            if (!memberData) {
                navigate('/login');
                return;
            }

            const m = memberData as Record<string, any>;
            setMember({
                id: m.id || '',
                full_name: m.full_name || '',
                email: m.email || user?.email || '',
                avatar_url: m.avatar_url || user?.user_metadata?.avatar_url || null,
                city: m.city || '',
                country: m.country || '',
                membership_tier: m.membership_tier || 'founding',
                membership_status: m.membership_status || 'active',
                joined_at: m.joined_at || new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error loading member profile:', error);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const loadBookings = async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setBookings(data as Booking[]);
    };

    const cancelBooking = async (bookingId: string) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);
        if (error) {
            toast.error('Failed to cancel booking.');
        } else {
            toast.success('Booking cancelled.');
            loadBookings();
        }
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
            <Navigation />

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
                        {new Date().getHours() < 12 ? t('members.greeting.morning') : new Date().getHours() < 18 ? t('members.greeting.afternoon') : t('members.greeting.evening')}, {member.full_name.split(' ')[0]}.
                    </h1>
                    <p className="text-white/60 font-light max-w-xl">
                        {t('members.subtitle')}
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

                {/* Book Now CTA */}
                <div className="mb-16">
                    <Link
                        to="/members/book"
                        className="group flex items-center justify-between bg-gradient-to-r from-switz-red/10 to-transparent border border-switz-red/20 hover:border-switz-red/40 rounded-sm p-5 sm:p-8 transition-all duration-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-switz-red/10 flex items-center justify-center text-switz-red group-hover:bg-switz-red group-hover:text-white transition-all duration-500">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-serif text-lg sm:text-xl">Book a Sanctuary or Experience</h3>
                                <p className="text-white/40 text-xs sm:text-sm mt-1">Request availability for stays and curated alpine experiences.</p>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-white/20 group-hover:text-switz-red transition-colors shrink-0 hidden sm:block" />
                    </Link>
                </div>

                {/* My Bookings */}
                {bookings.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <h2 className="text-2xl font-serif text-white">My Bookings</h2>
                            <Link to="/members/book" className="text-switz-red text-xs uppercase tracking-widest hover:text-white transition-colors hidden sm:block">
                                New Booking →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {bookings.map((b) => {
                                const label = b.sanctuary_id
                                    ? bookingLabels[b.sanctuary_id] || b.sanctuary_id
                                    : bookingLabels[b.experience_type || ''] || b.experience_type || 'Booking';
                                const dateStr = b.check_in
                                    ? `${new Date(b.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — ${new Date(b.check_out!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}${b.total_nights ? ` (${b.total_nights} nights)` : ''}`
                                    : b.preferred_date
                                        ? new Date(b.preferred_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : '';
                                const canCancel = (b.status === 'inquiry' || b.status === 'confirmed') &&
                                    (b.check_in ? new Date(b.check_in) > new Date(Date.now() + 7 * 86400000) : true);

                                return (
                                    <div key={b.id} className="bg-white/5 border border-white/10 rounded-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 shrink-0">
                                                {b.sanctuary_id ? <MapPin size={16} /> : <Clock size={16} />}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-white text-sm font-medium truncate">{label}</h4>
                                                <p className="text-white/40 text-xs mt-0.5">{dateStr} &middot; {b.guests} {b.guests === 1 ? 'guest' : 'guests'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${statusStyles[b.status] || 'bg-white/5 text-white/40 border-white/10'}`}>
                                                {b.status}
                                            </span>
                                            {canCancel && (
                                                <button
                                                    onClick={() => cancelBooking(b.id)}
                                                    className="text-white/20 hover:text-red-400 transition-colors"
                                                    title="Cancel booking"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Sanctuaries */}
                <div className="mb-16">
                    <h2 className="text-2xl font-serif text-white mb-8">{t('members.sanctuaries')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Villars */}
                        <Link to="/sanctuaries/villars" className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/10 hover:border-white/20 transition-colors block">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src="/images/villars-hero.jpg"
                                    alt="The Villars Loft"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-6">
                                <span className="text-switz-red text-[10px] uppercase tracking-widest">Available</span>
                                <h3 className="text-xl font-serif text-white mt-2 mb-2">The Villars Loft</h3>
                                <p className="text-white/60 text-sm mb-4">Villars-sur-Ollon, Switzerland</p>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <span className="text-white/40 text-sm">From CHF 1,200/night</span>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBookingState({ isOpen: true, sanctuary: "The Villars Loft" }); }}
                                        className="text-switz-red text-xs uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        View Dates →
                                    </button>
                                </div>
                            </div>
                        </Link>

                        {/* Verbier - Coming Soon */}
                        <div className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/5">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img
                                    src="/images/mountain-sunset.jpg"
                                    alt="Verbier, Valais"
                                    className="w-full h-full object-cover opacity-40 grayscale"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white/50 text-xs uppercase tracking-[0.3em] border border-white/20 px-4 py-2 backdrop-blur-sm">Coming 2027</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-white/30 text-[10px] uppercase tracking-widest">Coming 2027</span>
                                <h3 className="text-xl font-serif text-white/50 mt-2 mb-2">Verbier</h3>
                                <p className="text-white/30 text-sm mb-4">Valais, Switzerland</p>
                            </div>
                        </div>

                        {/* Zermatt - Coming Soon */}
                        <div className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/5">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img
                                    src="/images/zermatt-drone-poster.jpg"
                                    alt="Zermatt, Matterhorn"
                                    className="w-full h-full object-cover opacity-40 grayscale"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white/50 text-xs uppercase tracking-[0.3em] border border-white/20 px-4 py-2 backdrop-blur-sm">Coming 2028</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-white/30 text-[10px] uppercase tracking-widest">Coming 2028</span>
                                <h3 className="text-xl font-serif text-white/50 mt-2 mb-2">Zermatt</h3>
                                <p className="text-white/30 text-sm mb-4">Matterhorn, Switzerland</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experiences */}
                <div className="mb-16">
                    <h2 className="text-2xl font-serif text-white mb-8">{t('members.experiences')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { name: 'Road Journey', price: 'From CHF 850', desc: 'Private luxury SUV tours', href: '/experiences/road-journey', image: '/images/alpine-road-villars.jpg' },
                            { name: 'Cinematic Memories', price: 'CHF 600', desc: 'Professional documentation', href: '/experiences/cinematic-memories', image: '/images/drone/lake-brienz-aerial.jpg' },
                            { name: 'Private Chef', price: 'From CHF 400', desc: 'In-chalet dining', href: '/experiences/private-chef', image: '/images/loft/IMG_8759.jpg' },
                            { name: 'Guided Hikes', price: 'From CHF 300', desc: 'Expert mountain guides', href: '/experiences/guided-hikes', image: '/images/host-hiking.jpg' },
                        ].map((exp) => {
                            const CardContent = (
                                <>
                                    <div className="aspect-[16/9] overflow-hidden rounded-sm mb-4 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
                                        <img src={exp.image} alt={exp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <h4 className="text-white font-serif mb-2">{exp.name}</h4>
                                    <p className="text-white/40 text-xs mb-4">{exp.desc}</p>
                                    <span className="text-switz-red text-sm">{exp.price}</span>
                                    {exp.href && (
                                        <span className="block text-white/30 text-[10px] uppercase tracking-widest mt-3">{t('members.viewDetails')}</span>
                                    )}
                                </>
                            );
                            return exp.href ? (
                                <Link key={exp.name} to={exp.href} className="group bg-white/5 border border-white/10 p-4 sm:p-6 rounded-sm hover:border-white/20 transition-colors block overflow-hidden">
                                    {CardContent}
                                </Link>
                            ) : (
                                <div key={exp.name} className="group bg-white/5 border border-white/10 p-4 sm:p-6 rounded-sm overflow-hidden">
                                    {CardContent}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Guest Journals */}
                <div className="mb-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif text-white">{t('members.journals')}</h2>
                            <p className="text-white/40 text-sm mt-2">{t('members.journalsDesc')}</p>
                        </div>
                        <Link to="/journals" className="text-switz-red text-xs uppercase tracking-widest hover:text-white transition-colors hidden sm:block">
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {journals.map((journal) => (
                            <Link
                                key={journal.id}
                                to={`/journals/${journal.slug}`}
                                className="group relative overflow-hidden rounded-sm bg-white/5 border border-white/10 hover:border-white/20 transition-colors block"
                            >
                                <div className="aspect-[16/9] overflow-hidden">
                                    <img
                                        src={journal.coverImage}
                                        alt={journal.guests}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                        style={{ objectPosition: journal.coverPosition?.replace('object-', '') || 'center' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.2em] block mb-2">{journal.date}</span>
                                    <h3 className="text-white font-serif text-xl mb-1">{journal.guests}</h3>
                                    <p className="text-white/50 text-xs italic">{journal.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="border-t border-white/5 pt-16">
                    <div className="max-w-xl">
                        <h2 className="text-2xl font-serif text-white mb-4">{t('members.readyToBook')}</h2>
                        <p className="text-white/60 font-light mb-8">
                            {t('members.readyToBookDesc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/41787002202?text=Hi%2C%20I'd%20like%20to%20inquire%20about%20availability."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-white text-black px-6 sm:px-8 py-4 text-xs sm:text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors w-full sm:w-auto text-center"
                            >
                                <MessageCircle size={16} className="shrink-0" />
                                WhatsApp
                            </a>
                            <a
                                href="mailto:hello@swissperiences.ch?subject=Booking Inquiry"
                                className="inline-flex items-center justify-center gap-3 border border-white/20 text-white px-6 sm:px-8 py-4 text-xs sm:text-sm uppercase tracking-widest font-medium hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
                            >
                                <Mail size={16} className="shrink-0" />
                                Email
                            </a>
                        </div>
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

        </div>
    );
};

export default Members;
