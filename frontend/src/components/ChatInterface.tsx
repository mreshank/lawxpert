import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChatMessage from "./ChatMessage";
import { Send, Mic, MicOff, File } from "lucide-react";
import { toast } from "sonner";
import aiService, {
  ChatMessage as ChatMessageType,
  isLegalQuestion,
} from "@/services/aiService";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "@/utils/translations";

// Legal resource categories
const legalResources = {
  "Criminal Law": {
    "Indian Penal Code":
      "https://www.indiacode.nic.in/bitstream/123456789/15289/1/ipc_act.pdf",
    "Code of Criminal Procedure":
      "https://www.indiacode.nic.in/bitstream/123456789/15272/1/the_code_of_criminal_procedure%2C_1973.pdf",
    "Evidence Act":
      "https://www.indiacode.nic.in/bitstream/123456789/15351/1/iea_1872.pdf",
  },
  "Civil Law": {
    "Civil Procedure Code":
      "https://legislative.gov.in/sites/default/files/A1908-05.pdf",
    "Contract Act":
      "https://legislative.gov.in/sites/default/files/A1872-09.pdf",
    "Specific Relief Act":
      "https://legislative.gov.in/sites/default/files/A1963-47.pdf",
  },
  "Family Law": {
    "Hindu Marriage Act":
      "https://legislative.gov.in/sites/default/files/A1955-25.pdf",
    "Special Marriage Act":
      "https://legislative.gov.in/sites/default/files/A1954-43.pdf",
    "Muslim Personal Law":
      "https://legislative.gov.in/sites/default/files/A1937-26.pdf",
  },
  "Property Law": {
    "Transfer of Property Act":
      "https://legislative.gov.in/sites/default/files/A1882-04.pdf",
    "Registration Act":
      "https://legislative.gov.in/sites/default/files/A1908-16.pdf",
    "Easements Act":
      "https://legislative.gov.in/sites/default/files/A1882-05.pdf",
  },
  "Constitutional Law": {
    "Constitution of India":
      "https://legislative.gov.in/sites/default/files/COI.pdf",
    "Representation of People Act":
      "https://legislative.gov.in/sites/default/files/A1951-43.pdf",
    "Right to Information Act":
      "https://legislative.gov.in/sites/default/files/A2005-22.pdf",
  },
};

// Common legal queries for quick access
const commonLegalQueries = [
  {
    en: "What are my rights if arrested?",
    hi: "गिरफ्तारी पर मेरे क्या अधिकार हैं?",
    hinglish: "Arrest hone par mere kya rights hain?",
  },
  {
    en: "How to file an FIR?",
    hi: "FIR कैसे दर्ज करें?",
    hinglish: "FIR kaise file karen?",
  },
  {
    en: "Rights in case of domestic violence",
    hi: "घरेलू हिंसा के मामले में अधिकार",
    hinglish: "Domestic violence ke case mein adhikar",
  },
  {
    en: "Property inheritance laws",
    hi: "संपत्ति विरासत कानून",
    hinglish: "Property inheritance ke kanoon",
  },
  {
    en: "Motor vehicle accident compensation",
    hi: "मोटर वाहन दुर्घटना मुआवजा",
    hinglish: "Motor vehicle accident ka muavza",
  },
];

// Initial chat history with welcome message
const getInitialChatHistory = (
  language: "en" | "hi" | "hinglish"
): ChatMessageType[] => {
  const welcomeMessages = {
    en: "Hello! I'm your LawXpert legal assistant. How can I help you with your legal queries today?",
    hi: "नमस्ते! मैं आपका लॉएक्सपर्ट कानूनी सहायक हूं। आज मैं आपके कानूनी प्रश्नों में कैसे मदद कर सकता हूं?",
    hinglish:
      "Hello! Main aapka LawXpert legal assistant hoon. Aaj main aapke legal queries mein kaise help kar sakta hoon?",
  };

  return [
    {
      role: "assistant",
      content: welcomeMessages[language],
      timestamp: new Date(),
    },
  ];
};

interface ChatInterfaceProps {
  compact?: boolean;
}

const ChatInterface = ({ compact = false }: ChatInterfaceProps) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessageType[]>(() =>
    getInitialChatHistory(language)
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef<boolean>(false);

  // Update welcome message when language changes
  useEffect(() => {
    // Skip the effect on first render since we already initialized with the correct language
    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages(getInitialChatHistory(language));
    }
  }, [language]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  // Check if the API key is configured in the environment
  const isApiKeyConfigured = (): boolean => {
    return !!import.meta.env.VITE_OPENROUTER_API_KEY;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: ChatMessageType = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if API key is configured
      if (!isApiKeyConfigured()) {
        const apiKeyMessage =
          language === "en"
            ? "⚠️ OpenRouter API key not configured. For this demo to work, you need to provide your own API key in the environment variables. Check the README file for setup instructions."
            : language === "hi"
            ? "⚠️ OpenRouter API कुंजी कॉन्फ़िगर नहीं की गई है। इस डेमो के काम करने के लिए, आपको पर्यावरण चर में अपनी API कुंजी प्रदान करनी होगी। सेटअप निर्देश के लिए README फ़ाइल देखें।"
            : "⚠️ OpenRouter API key configure nahi ki gayi hai. Is demo ke kaam karne ke liye, aapko environment variables mein apni API key provide karni hogi. Setup instructions ke liye README file check karein.";

        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: apiKeyMessage,
            timestamp: new Date(),
          },
        ]);

        setIsLoading(false);
        return;
      }

      // Check network status
      if (!navigator.onLine) {
        // Add offline message to the chat
        const offlineMessage =
          language === "en"
            ? "I'm unable to provide a response right now as your device appears to be offline. Please check your internet connection and try again."
            : language === "hi"
            ? "मैं अभी आपको जवाब नहीं दे पा रहा हूं क्योंकि आपका डिवाइस ऑफलाइन दिख रहा है। कृपया अपने इंटरनेट कनेक्शन की जांच करें और पुनः प्रयास करें।"
            : "Main abhi aapko jawab nahi de pa raha hoon kyunki aapka device offline lag raha hai. Apna internet connection check karein aur dobara try karein.";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: offlineMessage,
            timestamp: new Date(),
          },
        ]);

        setIsLoading(false);
        return;
      }

      // Get only the last 10 messages to avoid token limits
      const recentMessages = [...messages.slice(-10), userMessage];

      // Determine if this is a common query (for improved handling)
      const isCommon = commonLegalQueries.some(
        (q) => q[language].toLowerCase() === inputMessage.toLowerCase()
      );

      try {
        // Get AI response
        const response = await aiService.chatCompletion(
          recentMessages,
          language,
          isCommon
        );

        const assistantMessage: ChatMessageType = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: unknown) {
        console.error("Chat error:", error);

        // If we have a specific error message from the AI service
        if (error instanceof Error && error.message) {
          // Add error message as a system message
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: error.message,
              timestamp: new Date(),
            },
          ]);
        } else {
          // Generic error message
          const errorMessage =
            language === "en"
              ? "Sorry, I couldn't process your request. Please try again later."
              : language === "hi"
              ? "क्षमा करें, मैं आपके अनुरोध को प्रोसेस नहीं कर सका। कृपया बाद में पुनः प्रयास करें।"
              : "Sorry, main aapke request ko process nahi kar saka. Please baad mein dobara try karein.";

          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: errorMessage,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommonQuery = async (query: string) => {
    setInputMessage(query);

    // Add a small delay to show the user what was selected
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  const toggleVoiceInput = () => {
    // In a real app, this would use the Web Speech API
    setIsListening(!isListening);
    if (!isListening) {
      toast.info("Voice input would be enabled in the final app");
    } else {
      toast.info("Voice input stopped");
    }
  };

  const handleNewChat = () => {
    setMessages(getInitialChatHistory(language));
  };

  const handleDocumentSelect = (docType: string) => {
    // In a real app, this would open a form with fields for the selected document
    toast.info(`${docType} document generation form would open here`);
  };

  return (
    <div className="chat-container bg-white dark:bg-gray-900 border rounded-lg shadow-lg h-full">
      <Tabs
        defaultValue="chat"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        {!compact && (
          <div className="border-b px-4 py-2 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
                  LX
                </div>
                <h3 className="font-medium text-gray-800">
                  LawXpert AI Assistant
                </h3>
              </div>

              <div className="flex items-center">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewChat}
                    className="mr-2"
                  >
                    New Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <TabsContent
          value="chat"
          className="flex-1 flex flex-col m-0 overflow-hidden"
        >
          <div
            className={`chat-messages bg-gray-50 dark:bg-gray-800/20 overflow-y-auto flex-1 p-4 ${
              compact ? "h-[250px]" : ""
            }`}
          >
            {compact
              ? // Show only last 3 messages in compact mode
                messages
                  .slice(-3)
                  .map((message, index) => (
                    <ChatMessage
                      key={index}
                      content={message.content}
                      role={message.role}
                      timestamp={message.timestamp}
                      compact={compact}
                    />
                  ))
              : // Show all messages in full mode
                messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    content={message.content}
                    role={message.role}
                    timestamp={message.timestamp}
                  />
                ))}

            {isLoading && (
              <div className="self-start bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg rounded-tl-none p-4 max-w-[85%] md:max-w-[70%] ml-4 mt-4">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Common queries section */}
          {!compact && messages.length <= 2 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-t border-blue-100">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Common Legal Questions:
              </div>
              <div className="flex flex-wrap gap-2">
                {commonLegalQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCommonQuery(query[language])}
                    className="text-xs bg-white"
                  >
                    {query[language]}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className={`chat-input-container bg-white border-t ${
              compact ? "p-2" : "p-4"
            }`}
          >
            <div className="flex space-x-2">
              {!compact && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={
                    isListening ? "bg-red-100 text-red-500 border-red-200" : ""
                  }
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
              )}

              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Ask a legal question..."
                    : language === "hi"
                    ? "कानूनी प्रश्न पूछें..."
                    : "Legal question poochen..."
                }
                disabled={isLoading}
                className={`flex-1 ${compact ? "h-9 text-sm" : ""}`}
              />

              <Button
                type="submit"
                variant="default"
                size={compact ? "sm" : "icon"}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={compact ? 16 : 18} />
              </Button>
            </div>
            {!compact && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                {language === "en"
                  ? "This is not a substitute for professional legal advice. Consult a lawyer for legal matters."
                  : language === "hi"
                  ? "यह पेशेवर कानूनी सलाह का विकल्प नहीं है। कानूनी मामलों के लिए एक वकील से परामर्श करें।"
                  : "Yeh professional legal advice ka substitute nahi hai. Legal matters ke liye lawyer se consult karen."}
              </div>
            )}
          </form>
        </TabsContent>

        <TabsContent
          value="documents"
          className="flex-1 m-0 p-6 overflow-auto bg-gray-50"
        >
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            {language === "en"
              ? "Generate Legal Documents"
              : language === "hi"
              ? "कानूनी दस्तावेज़ तैयार करें"
              : "Legal Documents Generate Karen"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                en: "FIR (First Information Report)",
                hi: "प्रथम सूचना रिपोर्ट (FIR)",
                hinglish: "FIR (First Information Report)",
              },
              {
                en: "RTI Application",
                hi: "आरटीआई आवेदन",
                hinglish: "RTI Application",
              },
              {
                en: "Legal Notice",
                hi: "कानूनी नोटिस",
                hinglish: "Legal Notice",
              },
              { en: "Affidavit", hi: "शपथ पत्र", hinglish: "Affidavit" },
            ].map((doc) => (
              <Button
                key={doc[language]}
                variant="outline"
                className="h-auto py-6 justify-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white"
                onClick={() => handleDocumentSelect(doc[language])}
              >
                <File size={24} className="text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-800">
                    {doc[language]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === "en"
                      ? "Fill a form to generate a document"
                      : language === "hi"
                      ? "दस्तावेज़ तैयार करने के लिए फॉर्म भरें"
                      : "Document generate karne ke liye form bharen"}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent
          value="resources"
          className="flex-1 m-0 p-6 overflow-auto bg-gray-50"
        >
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            {language === "en"
              ? "Legal Resources"
              : language === "hi"
              ? "कानूनी संसाधन"
              : "Legal Resources"}
          </h3>

          {Object.entries(legalResources).map(([category, resources]) => (
            <div key={category} className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-2">
                {category}
              </h4>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <ul className="space-y-2">
                  {Object.entries(resources).map(([name, url]) => (
                    <li key={name}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 00-1 1v5a1 1 0 102 0v-5a1 1 0 00-1-1zm4-1a1 1 0 10-2 0v6a1 1 0 102 0V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatInterface;
