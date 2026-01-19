import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'es', label: 'ES', name: 'Español' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);

    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|pt|fr|es)/, '');
    const newPath = `/${langCode}${pathWithoutLang || ''}`;

    navigate(newPath);
  };

  const currentLang = i18n.language || 'en';

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang, index) => (
        <div key={lang.code} className="flex items-center">
          <button
            onClick={() => changeLanguage(lang.code)}
            className={`
              relative text-xs uppercase font-medium tracking-[0.15em]
              transition-all duration-300 ease-out px-2 py-1
              ${
                currentLang === lang.code
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }
            `}
            title={lang.name}
            aria-label={`Switch to ${lang.name}`}
          >
            {lang.label}
            {/* Active indicator - elegant underline */}
            {currentLang === lang.code && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/60" />
            )}
          </button>
          {/* Separator */}
          {index < languages.length - 1 && (
            <span className="text-white/20 text-xs">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
