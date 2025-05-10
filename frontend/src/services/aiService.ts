import { toast } from "sonner";
import { Language } from "@/contexts/LanguageContext";

// OpenRouter API configuration
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
// Use Vite's environment variable format (must be prefixed with VITE_)
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";

// Check if we have a valid API key
const hasValidApiKey = (): boolean => {
  return API_KEY && API_KEY.startsWith('sk-or-v1-') && API_KEY.length > 20;
};

console.log("API_KEY : ", API_KEY);

// Define message type
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface LegalReference {
  type: 'statute' | 'case';
  ref: string;
  url: string;
}

// Legal keywords to detect if a question is legal-related
const legalKeywords = [
  "law", "legal", "court", "rights", "constitution", "section", "act", "ipc", "crpc", 
  "plaintiff", "defendant", "advocate", "judge", "lawyer", "petition", "case", "filing",
  "crime", "criminal", "civil", "contract", "property", "divorce", "marriage", "litigation",
  "bail", "arrest", "penalty", "fine", "imprisonment", "appeal", "justice", "complaint",
  "hit", "accident", "car", "vehicle", "damage", "injury", "compensation", "fir", "police",
  "domestic", "violence", "inheritance", "will", "testament", "tenant", "landlord", "rent"
];

// Define error type for better type safety
export interface ApiError {
  error?: {
    message?: string;
    code?: number;
  };
  name?: string;
  message?: string;
}

// Network status check
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Determine if a question is legal-related
export const isLegalQuestion = (text: string): boolean => {
  const textLower = text.toLowerCase();
  return legalKeywords.some(keyword => textLower.includes(keyword));
};

// Extract legal references from a text
export const extractLegalReferences = (text: string): LegalReference[] => {
  const references: LegalReference[] = [];
  
  // Pattern to match legal references like "Section 123 of XYZ Act"
  const sectionPattern = /(?:Section|Sec\.|S\.)\s+(\d+(?:\([a-zA-Z0-9]\))?)\s+(?:of\s+the\s+)?([\w\s]+(?:Act|Code))/gi;
  // Pattern to match case citations like "ABC vs XYZ (2020)"
  const casePattern = /([A-Za-z\s]+)\s+(?:v\.|vs\.?|versus)\s+([A-Za-z\s]+)(?:\s+\((\d{4})\))?/gi;
  
  let match;
  
  // Extract section references
  while ((match = sectionPattern.exec(text)) !== null) {
    references.push({
      type: 'statute',
      ref: `Section ${match[1]} of ${match[2]}`,
      url: "#" // Placeholder URL
    });
  }
  
  // Extract case references
  while ((match = casePattern.exec(text)) !== null) {
    if (match[3]) { // If year is present
      references.push({
        type: 'case',
        ref: `${match[1].trim()} vs ${match[2].trim()} (${match[3]})`,
        url: "#" // Placeholder URL
      });
    }
  }
  
  return references;
};

// Get system prompt based on language and query type
const getSystemPrompt = (language: Language, isCommonQuery: boolean): string => {
  if (isCommonQuery) {
    return `You are a helpful legal assistant trained according to the law of India.
    The user's selected language is ${language}, so respond in ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish' : 'English'}.
    Provide a comprehensive answer to this common legal question.
    Cite specific laws, sections, or precedents when relevant.
    Explain complex legal concepts in simple terms.
    Format your response in plain text only - do not use markdown, code blocks, or any special formatting.
    Use clear headings, bullet points, and numbered lists where appropriate, but write them in plain text.`;
  } else {
    return `You are a helpful legal assistant trained according to the law of India.
    The user's selected language is ${language}, so respond in ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish' : 'English'}.
    ONLY answer if the user's question relates to law, rules, legal rights, or legal action.
    Otherwise, politely explain that you're only trained to answer legal questions.
    When answering:
    1. Cite specific laws, sections, or precedents when relevant
    2. Explain complex legal concepts in simple terms
    3. Clarify that your answers are informational only and not legal advice
    4. Be respectful of the Indian legal system and its processes
    5. Format your response in plain text only - do not use markdown, code blocks, or any special formatting
    6. Use clear headings, bullet points, and numbered lists where appropriate, but write them in plain text`;
  }
};

// Get error message based on language
const getErrorMessage = (error: ApiError | null, language: Language): string => {
  // Network connectivity issues
  if (!isOnline()) {
    return language === 'en' 
      ? "You appear to be offline. Please check your internet connection and try again."
      : language === 'hi'
      ? "आप ऑफलाइन दिख रहे हैं। कृपया अपने इंटरनेट कनेक्शन की जांच करें और पुनः प्रयास करें।"
      : "Aap offline lag rahe hain. Apna internet connection check karein aur dobara try karein.";
  }

  // Authentication errors
  if (error?.error?.code === 401 || error?.message?.includes('auth') || error?.message?.includes('credentials')) {
    return language === 'en' 
      ? "Authentication failed. Please contact support with error code: AUTH-401."
      : language === 'hi'
      ? "प्रमाणीकरण विफल। कृपया समर्थन से संपर्क करें, त्रुटि कोड: AUTH-401।"
      : "Authentication fail ho gaya. Support se contact karein, error code: AUTH-401.";
  }

  // Timeout errors
  if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
    return language === 'en' 
      ? "Request timed out. The server took too long to respond."
      : language === 'hi'
      ? "अनुरोध का समय समाप्त हो गया। सर्वर को प्रतिक्रिया देने में बहुत समय लगा।"
      : "Request timeout ho gaya. Server ko response dene mein bahut time lag gaya.";
  }

  // API key errors
  if (error?.message?.includes('API key')) {
    return language === 'en' 
      ? "Authentication error. Please contact support with error code: API-KEY."
      : language === 'hi'
      ? "प्रमाणीकरण त्रुटि। कृपया सहायता से संपर्क करें, त्रुटि कोड: API-KEY।"
      : "Authentication error. Support se contact karein, error code: API-KEY.";
  }

  // Generic error
  return language === 'en' 
    ? "An error occurred. Please try again later."
    : language === 'hi'
    ? "एक त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।"
    : "Ek error hua hai. Baad mein dobara try karein.";
};

export const aiService = {
  chatCompletion: async (messages: ChatMessage[], language: Language = 'en', isCommonQuery: boolean = false): Promise<string> => {
    try {
      // Check if online first
      if (!isOnline()) {
        const errorMessage = getErrorMessage(null, language);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Check if we have a valid API key before making the request
      if (!hasValidApiKey()) {
        const apiKeyErrorMsg = language === 'en' 
          ? "API key not configured. Please add your OpenRouter API key to the environment variables."
          : language === 'hi'
          ? "API कुंजी कॉन्फ़िगर नहीं की गई है। कृपया अपनी OpenRouter API कुंजी को पर्यावरण चर में जोड़ें।"
          : "API key configure nahi ki gayi hai. Apni OpenRouter API key environment variables mein add karein.";
        
        toast.error(apiKeyErrorMsg);
        throw new Error(apiKeyErrorMsg);
      }

      // Get the last user message to check if it's legal related
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      const isLegal = lastUserMessage ? isLegalQuestion(lastUserMessage.content) : true;
      
      // Get system prompt
      const systemPrompt = getSystemPrompt(language, isCommonQuery);
      
      // Format messages for the API (only use last 6 messages to keep context manageable)
      const recentMessages = messages.slice(-6);
      
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...recentMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      // Add a hint if the question is not legal-related
      if (lastUserMessage && !isLegal) {
        formattedMessages.push({ 
          role: "system", 
          content: `The user's question doesn't appear to be about legal matters. Kindly redirect them to ask about Indian laws or legal procedures. Respond in ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish' : 'English'}.`
        });
      }
      
      // Set up timeout for fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const requestBody = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "LawXpert Legal Assistant"
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-prover-v2:free", // Using the same model as your Python code
            messages: formattedMessages,
            max_tokens: 1000
          }),
          signal: controller.signal
        }

        console.log("requestBody : ", requestBody);
        
        const response = await fetch(API_URL, requestBody);

        console.log("response : ", response);
      
        clearTimeout(timeoutId); // Clear the timeout
        
        if (!response.ok) {
          const error = await response.json() as ApiError;
          const errorMessage = getErrorMessage(error, language);
          toast.error(errorMessage);
          throw new Error(error.error?.message || "Failed to get response from AI");
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (fetchError: unknown) {
        // Handle abort (timeout) errors
        if ((fetchError as { name?: string }).name === 'AbortError') {
          const timeoutMessage = getErrorMessage({ name: 'TimeoutError' }, language);
          toast.error(timeoutMessage);
          throw new Error(timeoutMessage);
        }
        throw fetchError;
      }
    } catch (error: unknown) {
      console.error("AI service error:", error);
      
      // Get appropriate error message
      const errorMessage = getErrorMessage(error as ApiError, language);
      
      // Only show toast if it hasn't been shown already (like in network check)
      if (!(error as Error).message || (error as Error).message !== errorMessage) {
        toast.error(errorMessage);
      }
      
      // Provide a fallback response for network errors
      if (!isOnline()) {
        return language === 'en' 
          ? "I'm unable to provide a response right now as your device appears to be offline. Please check your internet connection and try again."
          : language === 'hi'
          ? "मैं अभी आपको जवाब नहीं दे पा रहा हूं क्योंकि आपका डिवाइस ऑफलाइन दिख रहा है। कृपया अपने इंटरनेट कनेक्शन की जांच करें और पुनः प्रयास करें।"
          : "Main abhi aapko jawab nahi de pa raha hoon kyunki aapka device offline lag raha hai. Apna internet connection check karein aur dobara try karein.";
      }
      
      throw error;
    }
  }
};

export default aiService;
