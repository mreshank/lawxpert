import React, { ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import translate from '@/utils/translations';
import { TranslationKey } from '@/utils/translations';

interface TranslatedTextProps {
  textKey: TranslationKey;
  children?: ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Component that automatically translates text based on the current language
 * Falls back to the children prop if the key is not found in translations
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  textKey, 
  children, 
  className = '',
  as: Component = 'span'
}) => {
  const { language } = useLanguage();
  const translatedText = translate(textKey, language);
  
  return (
    <Component className={className}>
      {translatedText || children}
    </Component>
  );
};

export default TranslatedText; 