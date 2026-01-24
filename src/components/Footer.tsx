import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="relative border-t border-white/5 bg-black py-24 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full text-center">
        {/* Branding Signature */}
        <div className="mb-20 flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-serif italic text-white/95 lowercase tracking-tight">
            {t('footer.tagline')}
          </span>
          <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-6 font-light max-w-sm mx-auto leading-relaxed">
            {t('footer.subtitle')}
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-12" />
        </div>

        {/* Multilingual Disclaimer */}
        <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mb-8 font-light">
          Multilingual Service (EN/PT/ES). Each experience is curated individually.
        </p>

        {/* Navigation Links */}
        {/* Navigation Links - Cleaned up to match request */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-12 text-white/30">
          <Link to="/" className="text-[10px] hover:text-white/60 transition-colors uppercase tracking-[0.2em]">Home</Link>
          <Link to="/journals" className="text-[10px] hover:text-white/60 transition-colors uppercase tracking-[0.2em]">Journals</Link>
        </div>

        {/* Copyright & Legal */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-[9px] text-white/20 tracking-widest uppercase">
          <p>{t('footer.copyright')}</p>
          <span className="hidden md:inline">•</span>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-white/40 transition-colors">Terms & Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
