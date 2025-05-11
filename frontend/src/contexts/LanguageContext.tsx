import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'hinglish';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  cycleLanguage: () => void;
  t: (key: string) => string;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.lawyers': 'Find Lawyers',
    'nav.documents': 'Documents',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'footer.rights': 'All rights reserved',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
  },
  hi: {
    'nav.home': 'होम',
    'nav.chat': 'चैट',
    'nav.lawyers': 'वकील खोजें',
    'nav.documents': 'दस्तावेज़',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.admin': 'एडमिन',
    'nav.login': 'लॉग इन',
    'nav.register': 'रजिस्टर',
    'nav.logout': 'लॉग आउट',
    'footer.rights': 'सर्वाधिकार सुरक्षित',
    'footer.terms': 'सेवा की शर्तें',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.contact': 'संपर्क करें',
  },
  hinglish: {
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.lawyers': 'Lawyer Dhundho',
    'nav.documents': 'Documents',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'footer.rights': 'Saare rights reserved',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const cycleLanguage = () => {
    setLanguage(prev => {
      if (prev === 'en') return 'hi';
      if (prev === 'hi') return 'hinglish';
      return 'en';
    });
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, cycleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 