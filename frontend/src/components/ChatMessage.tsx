import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, ThumbsDown, Copy, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { extractLegalReferences, LegalReference } from "@/services/aiService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { parseMarkdown, attachCopyButtonListeners } from "@/utils/markdownParser";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: Date;
  compact?: boolean;
}

const ChatMessage = ({ content, role, timestamp = new Date(), compact = false }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  const [references, setReferences] = useState<LegalReference[]>([]);
  const markdownRef = useRef<HTMLDivElement>(null);
  
  // Extract legal references when assistant responds
  useEffect(() => {
    if (role === "assistant") {
      const extractedRefs = extractLegalReferences(content);
      setReferences(extractedRefs);
    }
  }, [content, role]);
  
  // Attach event listeners to copy buttons after rendering
  useEffect(() => {
    if (markdownRef.current && role === "assistant") {
      attachCopyButtonListeners(markdownRef.current);
    }
  }, [content, role]);
  
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

  // Pre-process content to clean up empty lines and whitespace
  const cleanContent = displayContent
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ consecutive newlines with just 2
    .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
    .replace(/\n +/g, '\n'); // Remove leading spaces on each line

  return (
    <div className={cn(
      "flex flex-col w-full rounded-lg mb-2",
      compact ? "p-2" : "p-2.5 mb-2.5",
      isUser 
        ? "bg-lawxpert-navy text-white self-end rounded-br-none" 
        : "bg-white dark:bg-lawxpert-dark border dark:border-gray-700 self-start rounded-tl-none text-gray-800 dark:text-gray-100"
    )}>
      <div className="flex justify-between items-center mb-0.5">
        <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
          {isUser ? "You" : "LawXpert Assistant"}
        </span>
        <span className={cn("opacity-70", compact ? "text-[10px]" : "text-xs")}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {isUser ? (
        <div className={cn(
          "prose max-w-none px-2 overflow-auto", 
          compact ? "prose-xs" : "prose-sm", 
          isUser ? "prose-invert" : "",
          "leading-relaxed"
        )}>
          {cleanContent}
        </div>
      ) : (
        <div 
          ref={markdownRef}
          className={cn(
            "prose max-w-none px-2 overflow-auto", 
            compact ? "prose-xs" : "prose-sm",
            "markdown-content dark:prose-invert"
          )}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(cleanContent) }}
        />
      )}
      
      {/* Legal references section */}
      {!isUser && references.length > 0 && !compact && (
        <Collapsible className="mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen size={14} className="text-blue-600 mr-1.5" />
            <CollapsibleTrigger className="text-xs font-medium text-blue-600 hover:underline">
              Legal References ({references.length})
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-1">
            <ul className="text-xs space-y-0.5">
              {references.map((ref, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 mt-1 mr-1.5 bg-blue-600 rounded-full"></span>
                  <span>{ref.ref}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {!isUser && !compact && (
        <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-5 w-5", feedback === "liked" ? "text-green-500" : "")}
              onClick={() => handleFeedback("liked")}
            >
              <ThumbsUp size={12} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-5 w-5", feedback === "disliked" ? "text-red-500" : "")}
              onClick={() => handleFeedback("disliked")}
            >
              <ThumbsDown size={12} />
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCopy}>
              <Copy size={12} />
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Download size={12} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
