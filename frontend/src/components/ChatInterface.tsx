import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChatMessage from "./ChatMessage";
import { Send, Mic, MicOff, File } from "lucide-react";
import { toast } from "sonner";
import aiService, { ChatMessage as ChatMessageType } from "@/services/aiService";

// Initial chat history with welcome message
const initialChatHistory: ChatMessageType[] = [
  {
    role: "assistant",
    content: "Hello! I'm your LawXpert legal assistant. How can I help you with your legal queries today?",
    timestamp: new Date(),
  },
];

interface ChatInterfaceProps {
  compact?: boolean;
}

const ChatInterface = ({ compact = false }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialChatHistory);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("english");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      // Get only the last 10 messages to avoid token limits
      const recentMessages = [...messages.slice(-10), userMessage];
      
      // Get AI response
      const response = await aiService.chatCompletion(recentMessages);
      
      const assistantMessage: ChatMessageType = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

  const handleDocumentSelect = (docType: string) => {
    // In a real app, this would open a form with fields for the selected document
    toast.info(`${docType} document generation form would open here`);
  };

  return (
    <div className="chat-container bg-white dark:bg-gray-900 border rounded-lg shadow-lg h-full">
      <Tabs defaultValue="chat" className="w-full h-full flex flex-col">
        {!compact && (
          <div className="border-b px-4 py-2 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
                  LX
                </div>
                <h3 className="font-medium text-gray-800">LawXpert AI Assistant</h3>
              </div>
              
              <div className="flex items-center">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <div className="ml-4">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिन्दी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      
        <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
          <div className={`chat-messages bg-gray-50 dark:bg-gray-800/20 overflow-y-auto flex-1 p-4 ${compact ? 'h-[190px]' : ''}`}>
            {compact ? (
              // Show only last 3 messages in compact mode
              messages.slice(-3).map((message, index) => (
                <ChatMessage 
                  key={index}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                  compact={compact}
                />
              ))
            ) : (
              // Show all messages in full mode
              messages.map((message, index) => (
                <ChatMessage 
                  key={index}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                />
              ))
            )}
            
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
          
          <form onSubmit={handleSendMessage} className="chat-input-container bg-white border-t p-4">
            <div className="flex space-x-2">
              {!compact && (
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={isListening ? "bg-red-100 text-red-500 border-red-200" : ""}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
              )}
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask a legal question...`}
                disabled={isLoading}
                className="flex-1"
              />
              
              <Button 
                type="submit"
                variant="default" 
                size="icon"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={18} />
              </Button>
            </div>
            {!compact && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                This is not a substitute for professional legal advice. Consult a lawyer for legal matters.
              </div>
            )}
          </form>
        </TabsContent>
        
        <TabsContent value="documents" className="flex-1 m-0 p-6 overflow-auto bg-gray-50">
          <h3 className="text-lg font-medium mb-4 text-gray-800">Generate Legal Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["FIR (First Information Report)", "RTI Application", "Legal Notice", "Affidavit"].map((doc) => (
              <Button
                key={doc}
                variant="outline"
                className="h-auto py-6 justify-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white"
                onClick={() => handleDocumentSelect(doc)}
              >
                <File size={24} className="text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-800">{doc}</div>
                  <div className="text-xs text-gray-500">Fill a form to generate a document</div>
                </div>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatInterface;
