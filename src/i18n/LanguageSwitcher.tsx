import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (langCode: string) => {
    // Update i18next language
    i18n.changeLanguage(langCode);

    // Update URL to reflect language
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(en|pt|fr|es)/, '');
    const newPath = `/${langCode}${pathWithoutLang || ''}`;

    navigate(newPath);
  };

  const currentLang = i18n.language || 'en';

  return (
    <div className="flex gap-1.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`
            text-xl transition-all duration-200 hover:scale-110
            ${
              currentLang === lang.code
                ? 'opacity-100 ring-2 ring-white/40 rounded-full px-1'
                : 'opacity-50 hover:opacity-100'
            }
          `}
          title={lang.name}
          aria-label={`Switch to ${lang.name}`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
