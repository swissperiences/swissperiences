/**
 * MembersLayout — Alpine Silence design wrapper
 *
 * Scoped design system for the post-login members area:
 * - Newsreader (serif headlines) + Manrope (sans body)
 * - 0px border radius everywhere
 * - Tonal surface layering (no borders)
 * - Glassmorphic sidebar nav (desktop) / top bar (mobile)
 *
 * Uses MemberProfileProvider to load profile once for all child pages.
 */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MemberProfileProvider, useMemberProfile } from "@/hooks/useMemberProfile";
import { LogOut, Compass, LayoutDashboard, User, Menu, X, CalendarDays } from "lucide-react";

interface MembersLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/members", icon: LayoutDashboard },
  { label: "Curations", href: "/members/explore", icon: Compass },
  { label: "Book", href: "/members/book", icon: CalendarDays },
  { label: "Profile", href: "/members/profile", icon: User },
];

function MembersLayoutInner({ children }: MembersLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { member } = useMemberProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isActive = (href: string) => {
    if (href === "/members") return location.pathname === "/members";
    return location.pathname.startsWith(href);
  };

  const firstName = member?.full_name?.split(" ")[0] || "";

  return (
    <div className="alpine-silence min-h-screen bg-[#131313] text-[#E2E2E2] font-[Manrope,sans-serif]">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col py-12 px-6 bg-[#131313] z-40">
        {/* Brand */}
        <div className="mb-16">
          <Link to="/members" className="block">
            <span className="text-lg font-light tracking-[0.25em] text-white font-[Newsreader,serif] uppercase">
              Swissperiences
            </span>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mt-1.5 font-[Manrope,sans-serif]">
              Member Area
            </p>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active
                    ? "text-white border-l-2 border-white font-semibold"
                    : "text-white/40 hover:text-white hover:bg-[#1F1F1F] border-l-2 border-transparent"
                }`}
              >
                <item.icon size={18} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Member footer */}
        <div className="pt-6 border-t border-[#1F1F1F]">
          <div className="flex items-center gap-3 mb-4">
            {member?.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={firstName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white/60 text-xs font-[Newsreader,serif]">
                {firstName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{firstName}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">
                {member?.membership_tier}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] uppercase tracking-[0.2em] transition-colors w-full px-1 py-2"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#131313]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/members" className="block">
            <span className="text-sm font-light tracking-[0.25em] text-white font-[Newsreader,serif] uppercase">
              Swissperiences
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <nav className="px-5 pb-6 space-y-1 bg-[#131313]/95 backdrop-blur-xl">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
                    active
                      ? "text-white bg-[#1F1F1F]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <item.icon size={16} strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors w-full"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        )}
      </header>

      {/* ── Main content ── */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

export default function MembersLayout({ children }: MembersLayoutProps) {
  return (
    <MemberProfileProvider>
      <MembersLayoutInner>{children}</MembersLayoutInner>
    </MemberProfileProvider>
  );
}
