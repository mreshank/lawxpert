import { Language } from "@/contexts/LanguageContext";

// Translation cache to avoid redundant API calls
type CacheKey = `${string}-${Language}-${Language}`;
const translationCache = new Map<CacheKey, string>();

/**
 * Public instances of LibreTranslate
 * If one fails, we can try the others
 */
const LIBRE_TRANSLATE_ENDPOINTS = [
  'https://libretranslate.de/translate',
  'https://translate.argosopentech.com/translate',
  'https://translate.terraprint.co/translate',
];

/**
 * Map our app languages to ISO language codes used by translation APIs
 */
const languageToISO: Record<Language, string> = {
  en: 'en',
  hi: 'hi',
  hinglish: 'en', // Default to English for Hinglish as most APIs don't support it
};

/**
 * Translates text using LibreTranslate API
 * 
 * @param text Text to translate
 * @param sourceLang Source language
 * @param targetLang Target language
 * @returns Translated text or original text if translation fails
 */
export const translateText = async (
  text: string,
  sourceLang: Language,
  targetLang: Language
): Promise<string> => {
  // Don't translate if languages are the same
  if (sourceLang === targetLang) return text;
  
  // Special handling for Hinglish (not supported by translation APIs)
  if (targetLang === 'hinglish') {
    // For Hinglish, we'll mix Hindi and English
    // For proper implementation, you might need a custom solution
    // This is a simple approximation
    if (sourceLang === 'en') {
      const hindiText = await translateText(text, 'en', 'hi');
      const words = text.split(' ');
      const hindiWords = hindiText.split(' ');
      
      // Mix English and Hindi words
      return words.map((word, index) => 
        index % 2 === 0 ? hindiWords[index] || word : word
      ).join(' ');
    }
    return text;
  }
  
  // Check cache first
  const cacheKey: CacheKey = `${text}-${sourceLang}-${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  // Convert to ISO language codes
  const sourceISO = languageToISO[sourceLang];
  const targetISO = languageToISO[targetLang];
  
  // Try each endpoint until one works
  for (const endpoint of LIBRE_TRANSLATE_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          source: sourceISO,
          target: targetISO,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      if (data.translatedText) {
        // Cache the result
        translationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }
    } catch (error) {
      console.warn(`Translation failed with endpoint ${endpoint}:`, error);
      // Continue to the next endpoint
    }
  }
  
  console.warn(`All translation endpoints failed for "${text}"`);
  return text; // Return original text if all endpoints fail
};

/**
 * Detect language of text using LibreTranslate API
 * 
 * @param text Text to detect language
 * @returns Detected language code or null if detection fails
 */
export const detectLanguage = async (text: string): Promise<string | null> => {
  for (const baseEndpoint of LIBRE_TRANSLATE_ENDPOINTS) {
    const endpoint = baseEndpoint.replace('/translate', '/detect');
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          q: text,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      if (data && data.length > 0 && data[0].language) {
        return data[0].language;
      }
    } catch (error) {
      console.warn(`Language detection failed with endpoint ${endpoint}:`, error);
      // Continue to the next endpoint
    }
  }
  
  return null;
};

/**
 * Clear the translation cache
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

export default {
  translateText,
  detectLanguage,
  clearTranslationCache,
}; 