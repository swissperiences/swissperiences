import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="relative border-t border-white/5 bg-black h-[200px] flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full text-center">
        {/* Multilingual Disclaimer */}
        <p className="text-[10px] md:text-xs text-white/40 tracking-[0.3em] uppercase mb-6 font-light">
          Multilingual Service (EN/PT/ES). Each experience is curated individually.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 text-white/30">
          <Link to="/" className="text-[10px] hover:text-white/60 transition-colors uppercase tracking-widest">Home</Link>
          <Link to="/journals" className="text-[10px] hover:text-white/60 transition-colors uppercase tracking-widest">Journals</Link>
          <Link to="/privacy" className="text-[10px] hover:text-white/60 transition-colors uppercase tracking-widest">Privacy</Link>
          <Link to="/terms" className="text-[10px] hover:text-white/60 transition-colors uppercase tracking-widest">Terms</Link>
        </div>

        {/* Copyright */}
        <p className="text-[9px] text-white/20 tracking-widest uppercase">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
