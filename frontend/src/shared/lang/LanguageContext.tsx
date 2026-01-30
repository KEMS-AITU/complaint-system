import { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Language = 'ru' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useLocalStorage('app-language', 'en');

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    handleSetLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <LanguageContext.Provider
      value={{
        language: language as Language,
        setLanguage: handleSetLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};

