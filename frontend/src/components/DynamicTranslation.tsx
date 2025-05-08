import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/contexts/LanguageContext';

interface DynamicTranslationProps {
  children: string;
  sourceLang?: 'en' | 'hi';
  className?: string;
  as?: React.ElementType;
  fallback?: ReactNode;
  showOriginal?: boolean;
}

/**
 * Component for translating dynamic/arbitrary text using the translation API
 * Unlike TranslatedText, this doesn't use predefined keys but translates any text on-the-fly
 */
const DynamicTranslation: React.FC<DynamicTranslationProps> = ({
  children,
  sourceLang = 'en',
  className = '',
  as: Component = 'span',
  fallback = null,
  showOriginal = false,
}) => {
  const { language } = useLanguage();
  const { translateDynamic } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const translateText = async () => {
      if (!children || typeof children !== 'string') return;
      
      // No need to translate if the language is the same or it's already translated
      if (sourceLang === language || 
          (children === translatedText && language !== 'hinglish')) {
        setTranslatedText(children);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await translateDynamic(children, sourceLang);
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Translation error:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setTranslatedText(children); // Fallback to original text
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    translateText();
    
    return () => {
      isMounted = false;
    };
  }, [children, language, sourceLang, translateDynamic]);
  
  if (error && fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <Component className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
      {translatedText || children}
      {showOriginal && translatedText !== children && (
        <span className="text-gray-500 text-xs ml-2">({children})</span>
      )}
    </Component>
  );
};

export default DynamicTranslation; 