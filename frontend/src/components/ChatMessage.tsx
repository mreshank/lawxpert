import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, ThumbsDown, Copy, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { extractLegalReferences, LegalReference } from "@/services/aiService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';

// Import Prism language components
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';

// Import Prism CSS theme
import 'prismjs/themes/prism-tomorrow.css';

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: Date;
  compact?: boolean;
}

const ChatMessage = ({ content, role, timestamp = new Date(), compact = false }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  const [references, setReferences] = useState<LegalReference[]>([]);
  const codeRef = useRef<HTMLDivElement>(null);
  
  // Apply syntax highlighting after component updates
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightAllUnder(codeRef.current);
    }
  }, [content]);
  
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
      "flex flex-col w-full rounded-lg mb-3",
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
        <div className={cn("prose max-w-none overflow-auto", 
          compact ? "prose-xs" : "prose-sm", 
          isUser ? "prose-invert" : ""
        )}>
          {displayContent}
        </div>
      ) : (
        <div 
          ref={codeRef}
          className={cn(
            "prose max-w-none overflow-auto", 
            compact ? "prose-xs" : "prose-sm",
            "markdown-content dark:prose-invert"
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-6 mb-4 text-lawxpert-navy dark:text-lawxpert-gold" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-3 text-lawxpert-navy dark:text-lawxpert-gold" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-bold mt-4 mb-2 text-lawxpert-navy dark:text-lawxpert-gold" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 my-4 italic text-gray-600 dark:text-gray-300" {...props} />,
              table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700" {...props} /></div>,
              thead: ({ node, ...props }) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
              tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-300 dark:divide-gray-700" {...props} />,
              tr: ({ node, ...props }) => <tr className="hover:bg-gray-50 dark:hover:bg-gray-900" {...props} />,
              th: ({ node, ...props }) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-medium" {...props} />,
              td: ({ node, ...props }) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2" {...props} />,
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                return !inline ? (
                  <div className="relative my-4">
                    {language && (
                      <div className="absolute top-0 right-0 bg-gray-700 text-gray-200 rounded-bl px-2 py-1 text-xs font-mono z-10">
                        {language}
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                        toast.success("Code copied to clipboard", {
                          duration: 2000,
                          position: "top-right"
                        });
                      }}
                      className="absolute top-0 right-16 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded px-2 py-1 text-xs font-mono z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Copy
                    </button>
                    <pre className={cn(
                      "p-4 pb-3 pt-5 rounded-md bg-gray-900 text-gray-100 overflow-x-auto text-xs sm:text-sm font-mono group",
                      language && "mt-0"
                    )}>
                      <code className={`language-${language || 'text'}`} {...props}>
                        {String(children).replace(/\n$/, '')}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {displayContent}
          </ReactMarkdown>
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
