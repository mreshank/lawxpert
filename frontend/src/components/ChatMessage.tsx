import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { toast } from "sonner";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: Date;
  compact?: boolean;
}

const ChatMessage = ({ content, role, timestamp = new Date(), compact = false }: ChatMessageProps) => {
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

  // Truncate content if in compact mode
  const displayContent = compact && content.length > 120 
    ? content.substring(0, 120) + "..."
    : content;

  return (
    <div className={cn(
      "flex flex-col max-w-[85%] md:max-w-[70%] rounded-lg mb-3",
      compact ? "p-3" : "p-4 mb-4",
      isUser 
        ? "bg-lawxpert-navy text-white self-end rounded-br-none" 
        : "bg-white dark:bg-lawxpert-dark border dark:border-gray-700 self-start rounded-tl-none text-gray-800 dark:text-gray-100"
    )}>
      <div className="flex justify-between items-center mb-1">
        <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
          {isUser ? "You" : "LawXpert Assistant"}
        </span>
        <span className={cn("opacity-70", compact ? "text-[10px]" : "text-xs")}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <div className={cn("prose max-w-none", 
        compact ? "prose-xs" : "prose-sm", 
        isUser ? "prose-invert" : ""
      )}>
        {displayContent}
      </div>
      
      {!isUser && !compact && (
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
