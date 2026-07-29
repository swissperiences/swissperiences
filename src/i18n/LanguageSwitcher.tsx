import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';



export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);

    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|pt)/, '');
    const newPath = `/${langCode}${pathWithoutLang || ''}`;

    navigate(newPath);
  };

  const currentLang = i18n.language || 'en';

  return (
    <div className="flex items-center gap-1 select-none">
      <button
        onClick={() => changeLanguage('en')}
        className={`
          text-xs uppercase font-light tracking-[0.1em]
           transition-all duration-300
          ${currentLang === 'en' ? 'text-white' : 'text-white/40 hover:text-white/70'}
        `}
      >
        EN
      </button>

      <span className="text-white/20 text-xs mx-1 font-light">|</span>

      <button
        onClick={() => changeLanguage('pt')}
        className={`
          text-xs uppercase font-light tracking-[0.1em]
           transition-all duration-300
          ${currentLang === 'pt' ? 'text-white' : 'text-white/40 hover:text-white/70'}
        `}
      >
        PT
      </button>
    </div>
  );
}
