// client/src/context/LanguageContext.jsx
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी (Hindi)', flag: '🇮🇳' }
];

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  languages: LANGUAGES
});

export function LanguageProvider({ children }) {
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language && i18n.language.startsWith('hi') ? 'hi' : 'en';

  const setLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContext.Provider
      value={{
        language: currentLanguage,
        setLanguage,
        t,
        languages: LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
