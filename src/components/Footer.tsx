import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import NewsletterForm from './NewsletterForm';
import { useAuth } from '@/hooks/use-auth';

export default function Footer() {
  const { t } = useTranslation('common');
  const { isLoggedIn } = useAuth();

  return (
    <footer className="relative border-t border-white/5 bg-black py-24 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">

          {/* BRAND */}
          <div className="lg:col-span-5">
            <span className="text-3xl font-serif italic text-white/95 lowercase tracking-tight block mb-8">
              {t('footer.tagline', 'swissperiences')}
            </span>
            <p className="text-white/40 font-light text-sm leading-relaxed max-w-sm mb-8">
              {t('footer.description', 'Curating silence in a noisy world. We craft bespoke alpine journeys for those who seek to disconnect in order to reconnect.')}
            </p>

            <div className="flex gap-6 text-white/30">
              <a href="https://instagram.com/swissperiences" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase text-[10px] tracking-widest">Instagram</a>
              <a href="https://linkedin.com/company/swissperiences" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase text-[10px] tracking-widest">LinkedIn</a>
            </div>
          </div>

          {/* SPACER */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* LINKS */}
          <div className="lg:col-span-2">
            <h4 className="text-xs text-white uppercase tracking-[0.2em] mb-8 font-bold text-switz-red">Explore</h4>
            <div className="flex flex-col gap-4 text-white/40">
              <Link to="/" className="text-xs hover:text-white transition-colors uppercase tracking-wide">Home</Link>
              <Link to="/journals" className="text-xs hover:text-white transition-colors uppercase tracking-wide">Journals</Link>
              <Link to="/#upcoming-retreats" className="text-xs hover:text-white transition-colors uppercase tracking-wide">Retreats</Link>
              <Link to="/for-teams" className="text-xs hover:text-white transition-colors uppercase tracking-wide">For Teams</Link>
              <Link to={isLoggedIn ? "/members" : "/login"} className="text-xs hover:text-white transition-colors uppercase tracking-wide">
                {isLoggedIn ? "My Account" : "Members"}
              </Link>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="lg:col-span-3">
            <h4 className="text-xs text-white uppercase tracking-[0.2em] mb-8 font-bold text-switz-red">The List</h4>
            <p className="text-white/40 font-light text-xs leading-relaxed mb-6">
              Join our private list for early access to seasonal intakes and journal updates.
            </p>
            <NewsletterForm />
          </div>

        </div>


        {/* BOTTOM */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] text-white/20 tracking-widest uppercase">
          <p>{t('footer.copyright', '© 2026 Swissperiences • Geneva, Switzerland')}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/40 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
