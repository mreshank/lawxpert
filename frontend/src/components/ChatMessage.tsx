import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, ThumbsDown, Copy, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { extractLegalReferences, LegalReference } from "@/services/aiService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Markdown from 'markdown-to-jsx';

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: Date;
  compact?: boolean;
}

const ChatMessage = ({ content, role, timestamp = new Date(), compact = false }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  const [references, setReferences] = useState<LegalReference[]>([]);
  
  // Extract legal references when assistant responds
  useEffect(() => {
    if (role === "assistant") {
      const extractedRefs = extractLegalReferences(content);
      setReferences(extractedRefs);
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
      
      {isUser ? (
        <div className={cn("prose max-w-none overflow-auto ", 
          compact ? "prose-xs" : "prose-sm", 
          isUser ? "prose-invert" : ""
        )}>
          {content}
        </div>
      ) : (
        <div className={cn("prose max-w-none overflow-auto ", 
          compact ? "prose-xs" : "prose-sm",
          "markdown-content"
        )}>
          <Markdown
            options={{
              overrides: {
                h1: {
                  component: (props: any) => <h1 className="text-2xl font-bold text-lawxpert-navy dark:text-lawxpert-gold mt-6 mb-4" {...props} />,
                },
                h2: {
                  component: (props: any) => <h2 className="text-xl font-bold text-lawxpert-navy dark:text-lawxpert-gold mt-5 mb-3" {...props} />,
                },
                h3: {
                  component: (props: any) => <h3 className="text-lg font-bold text-lawxpert-navy dark:text-lawxpert-gold mt-4 mb-2" {...props} />,
                },
                ul: {
                  component: (props: any) => <ul className="list-disc ml-4 my-2" {...props} />,
                },
                ol: {
                  component: (props: any) => <ol className="list-decimal ml-4 my-2" {...props} />,
                },
                li: {
                  component: (props: any) => <li className="my-1" {...props} />,
                },
                p: {
                  component: (props: any) => <p className="my-2" {...props} />,
                },
                blockquote: {
                  component: (props: any) => <blockquote className="border-l-4 border-lawxpert-navy dark:border-lawxpert-gold pl-4 my-4 italic" {...props} />,
                },
                code: {
                  component: (props: any) => <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
                },
              },
            }}
          >
            {displayContent}
          </Markdown>
        </div>
      )}
      
      {/* Legal references section */}
      {!isUser && references.length > 0 && !compact && (
        <Collapsible className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen size={16} className="text-blue-600 mr-2" />
            <CollapsibleTrigger className="text-sm font-medium text-blue-600 hover:underline">
              Legal References ({references.length})
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            <ul className="text-sm space-y-1">
              {references.map((ref, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-blue-600 rounded-full"></span>
                  <span>{ref.ref}</span>
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
      
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
