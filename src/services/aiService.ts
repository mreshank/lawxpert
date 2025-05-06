
import { toast } from "sonner";

// OpenRouter API configuration
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

// Define message type
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export const aiService = {
  chatCompletion: async (messages: ChatMessage[]): Promise<string> => {
    try {
      const systemPrompt = "You are LawXpert, an AI legal assistant specialized in Indian law. Provide accurate, helpful, and clear guidance on legal matters in India. When responding to queries, cite relevant laws, precedents, or legal provisions when applicable. If a question is outside your expertise or requires specific legal advice that only a qualified lawyer should provide, make this clear in your response. Respond in the same language as the user's query.";
      
      // Format messages for the API
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "LawXpert Legal Assistant"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku", // Using a good model for legal reasoning
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1024
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to get response from AI");
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI service error:", error);
      toast.error("Failed to get AI response. Please try again.");
      throw error;
    }
  }
};

export default aiService;
