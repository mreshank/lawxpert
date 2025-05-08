# LegalConnect Localization System

This document explains how to use the localization system in LegalConnect to make your components and pages multilingual.

## Available Languages

The application supports three languages:
- English (en)
- Hindi (hi)
- Hinglish (हE) - a mix of Hindi and English

## Translation Methods

The app supports two types of translations:

1. **Static Translation**: For UI elements and predefined text using a dictionary (`translations.ts`)
2. **Dynamic Translation**: For arbitrary content using the API translation service

## Static Translations

### 1. Using the TranslatedText Component

The easiest way to add translations for UI elements is to use the `TranslatedText` component:

```jsx
import TranslatedText from "@/components/TranslatedText";

// Basic usage
<TranslatedText textKey="home" />

// With custom element type
<TranslatedText textKey="home" as="h1" />

// With CSS classes
<TranslatedText textKey="home" className="text-lg font-bold" />

// With fallback content if key is not found
<TranslatedText textKey="someKey">
  Fallback content
</TranslatedText>
```

### 2. Using the useTranslation Hook

For more control over static translations:

```jsx
import { useTranslation } from "@/hooks/useTranslation";

const MyComponent = () => {
  const { t, format, tf } = useTranslation();
  
  // Basic translation
  const homeText = t('home');
  
  // Format with placeholders
  const formattedText = format("Hello, {0}! You have {1} messages.", "User", 5);
  
  // Translate and format in one step
  const translatedAndFormatted = tf('welcomeMessage', "User");
  
  return (
    <div>
      <h1>{homeText}</h1>
      <p>{formattedText}</p>
      <p>{translatedAndFormatted}</p>
    </div>
  );
};
```

## Dynamic Translation (API-Based)

For dynamic content that isn't predefined in your translations, use the API-based translation:

### 1. Using the DynamicTranslation Component

```jsx
import DynamicTranslation from "@/components/DynamicTranslation";

// Basic usage
<DynamicTranslation>
  This text will be translated dynamically using the API
</DynamicTranslation>

// Specifying source language
<DynamicTranslation sourceLang="hi">
  यह हिंदी में एक वाक्य है
</DynamicTranslation>

// Show both original and translated text
<DynamicTranslation showOriginal>
  This will show both original and translated versions
</DynamicTranslation>

// Customize rendering with element type and classes
<DynamicTranslation 
  as="p" 
  className="text-lg font-bold"
>
  Custom styled paragraph that gets translated
</DynamicTranslation>
```

### 2. Translating Dynamic Text Programmatically

For more complex scenarios, you can use the translation API directly:

```jsx
import { useTranslation } from "@/hooks/useTranslation";

const MyComponent = () => {
  const { translateDynamic, detectLanguage } = useTranslation();
  const [translatedText, setTranslatedText] = useState("");
  
  const handleTranslate = async (text) => {
    // Optionally detect language
    const detectedLang = await detectLanguage(text);
    
    // Translate the text
    const result = await translateDynamic(text, detectedLang || 'en');
    setTranslatedText(result);
  };
  
  return (
    <div>
      <textarea onChange={(e) => handleTranslate(e.target.value)} />
      <div>{translatedText}</div>
    </div>
  );
};
```

## Adding New Translation Keys

1. Go to `src/utils/translations.ts`
2. Add your new key to the `TranslationKey` type
3. Add translations for all languages in the `translations` object

Example:

```typescript
export type TranslationKey = 
  | 'home'
  | 'yourNewKey'  // Add your key here
  // ... other keys

const translations: Record<TranslationKey, Record<Language, string>> = {
  // ... existing translations
  
  yourNewKey: {
    en: 'Your English text',
    hi: 'आपका हिंदी पाठ',  
    hinglish: 'Your Hinglish text'
  }
};
```

## Accessing Current Language

You can access or change the current language using the `useLanguage` hook:

```jsx
import { useLanguage } from "@/contexts/LanguageContext";

const MyComponent = () => {
  const { language, setLanguage, cycleLanguage } = useLanguage();
  
  return (
    <div>
      <p>Current language: {language}</p>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
      <button onClick={cycleLanguage}>Cycle Language</button>
    </div>
  );
};
```

## Translation Service API Details

The application uses the LibreTranslate API (an open-source translation API) for dynamic translations:

- Multiple public endpoints are used for reliability
- Translations are cached to minimize API calls
- Fallbacks are in place for service disruptions
- Special handling is implemented for Hinglish

If you want to use a different translation service, you can modify the implementation in `services/translationService.ts`.

## Tips for Effective Localization

1. Use `TranslatedText` for UI elements and static content
2. Use `DynamicTranslation` for user-generated content or dynamic text
3. Keep translations concise and clear
4. Consider text expansion when translating (some languages may require more space)
5. Test your UI in all supported languages
6. For dynamic content with variables, use the format function

## Troubleshooting

If a translation is not showing up:
1. Check if the key is properly defined in `translations.ts` (for static translations)
2. Check your network connection (for dynamic translations)
3. Look at the browser console for API errors
4. If using DynamicTranslation, ensure the text is passed as a string 