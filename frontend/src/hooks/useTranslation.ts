import { useLanguage } from '@/contexts/LanguageContext';
import translate, { TranslationKey } from '@/utils/translations';
import translationService from '@/services/translationService';
import { useState, useCallback } from 'react';

/**
 * Hook to easily access translations based on the current language
 * @returns Functions to translate text
 */
export const useTranslation = () => {
  const { language } = useLanguage();
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  
  /**
   * Translate a key based on the current language
   * Uses predefined translations from translations.ts
   * @param key - The translation key
   * @returns The translated text
   */
  const t = (key: TranslationKey): string => {
    return translate(key, language);
  };

  /**
   * Format a string with placeholders
   * @param text - The string with placeholders {0}, {1}, etc.
   * @param args - Values to replace the placeholders
   * @returns Formatted string with placeholders replaced by values
   */
  const format = (text: string, ...args: any[]): string => {
    return text.replace(/{(\d+)}/g, (match, index) => {
      return typeof args[index] !== 'undefined' ? args[index] : match;
    });
  };

  /**
   * Translate and format a string
   * @param key - The translation key
   * @param args - Values to replace placeholders in the translated string
   * @returns Translated and formatted string
   */
  const tf = (key: TranslationKey, ...args: any[]): string => {
    const translated = t(key);
    return format(translated, ...args);
  };

  /**
   * Translate dynamic text that isn't in the predefined translations
   * Uses the translation API service
   * @param text - Text to translate
   * @param sourceLang - Source language (defaults to 'en')
   * @returns Promise that resolves to the translated text
   */
  const translateDynamic = useCallback(
    async (text: string, sourceLang: 'en' | 'hi' = 'en'): Promise<string> => {
      // If we already have a cached translation, return it
      const cacheKey = `${text}-${sourceLang}-${language}`;
      if (dynamicTranslations[cacheKey]) {
        return dynamicTranslations[cacheKey];
      }

      try {
        // Call the translation service
        const translatedText = await translationService.translateText(
          text,
          sourceLang,
          language
        );
        
        // Update the cache
        setDynamicTranslations(prev => ({
          ...prev,
          [cacheKey]: translatedText
        }));
        
        return translatedText;
      } catch (error) {
        console.error('Translation failed:', error);
        return text; // Fallback to original text
      }
    },
    [language, dynamicTranslations]
  );
  
  /**
   * Detect the language of a text
   * @param text - Text to detect language for
   * @returns Promise that resolves to the detected language code or null
   */
  const detectLanguage = useCallback(async (text: string): Promise<string | null> => {
    try {
      return await translationService.detectLanguage(text);
    } catch (error) {
      console.error('Language detection failed:', error);
      return null;
    }
  }, []);

  return { 
    t, 
    format, 
    tf,
    translateDynamic,
    detectLanguage,
    language
  };
};

export default useTranslation; 