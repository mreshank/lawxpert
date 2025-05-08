import { Language } from "@/contexts/LanguageContext";

type TranslationKey = 
  | 'home' 
  | 'aiAssistant' 
  | 'findLawyers' 
  | 'documents' 
  | 'legalResources'
  | 'dashboard'
  | 'login'
  | 'signup'
  | 'profile'
  | 'adminDashboard'
  | 'logout';

const translations: Record<TranslationKey, Record<Language, string>> = {
  home: {
    en: 'Home',
    hi: 'होम',
    hinglish: 'Home'
  },
  aiAssistant: {
    en: 'AI Assistant',
    hi: 'एआई सहायक',
    hinglish: 'AI Assistant'
  },
  findLawyers: {
    en: 'Find Lawyers',
    hi: 'वकील खोजें',
    hinglish: 'Vakil Search'
  },
  documents: {
    en: 'Documents',
    hi: 'दस्तावेज़',
    hinglish: 'Documents'
  },
  legalResources: {
    en: 'Legal Resources',
    hi: 'कानूनी संसाधन',
    hinglish: 'Legal Resources'
  },
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    hinglish: 'Dashboard'
  },
  login: {
    en: 'Login',
    hi: 'लॉगिन',
    hinglish: 'Login'
  },
  signup: {
    en: 'Sign Up',
    hi: 'साइन अप',
    hinglish: 'Sign Up'
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफाइल',
    hinglish: 'Profile'
  },
  adminDashboard: {
    en: 'Admin Dashboard',
    hi: 'व्यवस्थापक डैशबोर्ड',
    hinglish: 'Admin Dashboard'
  },
  logout: {
    en: 'Log Out',
    hi: 'लॉग आउट',
    hinglish: 'Logout'
  }
};

export const translate = (key: TranslationKey, language: Language): string => {
  return translations[key][language] || translations[key]['en'];
};

export default translate; 