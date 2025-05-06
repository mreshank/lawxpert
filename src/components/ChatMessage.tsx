
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { toast } from "sonner";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: Date;
}

const ChatMessage = ({ content, role, timestamp = new Date() }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  
  const isUser = role === "user";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };
  
  const handleFeedback = (type: "liked" | "disliked") => {
    setFeedback(type);
    toast.success(`Thank you for your feedback`);
    // In a real app, we would send this to the backend
  };

  return (
    <div className={cn(
      "flex flex-col max-w-[85%] md:max-w-[70%] rounded-lg p-4 mb-4",
      isUser 
        ? "bg-lawxpert-navy text-white self-end rounded-br-none" 
        : "bg-white dark:bg-lawxpert-dark border dark:border-gray-700 self-start rounded-tl-none text-gray-800 dark:text-gray-100"
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-sm">
          {isUser ? "You" : "LawXpert Assistant"}
        </span>
        <span className="text-xs opacity-70">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <div className={cn("prose prose-sm max-w-none", isUser ? "prose-invert" : "")}>
        {content}
      </div>
      
      {!isUser && (
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-7 w-7", feedback === "liked" ? "text-green-500" : "")}
              onClick={() => handleFeedback("liked")}
            >
              <ThumbsUp size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-7 w-7", feedback === "disliked" ? "text-red-500" : "")}
              onClick={() => handleFeedback("disliked")}
            >
              <ThumbsDown size={16} />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              <Copy size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Download size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
