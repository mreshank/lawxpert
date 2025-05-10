import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, ThumbsUp, ThumbsDown, Copy, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { extractLegalReferences, LegalReference } from "@/services/aiService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  timestamp?: Date;
  compact?: boolean;
}

const ChatMessage = ({ content, role, timestamp = new Date(), compact = false }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<"liked" | "disliked" | null>(null);
  const [references, setReferences] = useState<LegalReference[]>([]);
  const [formattedContent, setFormattedContent] = useState<string>(content);
  
  // Extract legal references when assistant responds
  useEffect(() => {
    if (role === "assistant") {
      const extractedRefs = extractLegalReferences(content);
      setReferences(extractedRefs);
    }
  }, [content, role]);
  
  // Format the content to display as rich text (handling special formatting)
  useEffect(() => {
    if (role === "assistant" || role === "system") {
      // Complete overhaul of the markdown processing to ensure all content is covered
      
      // First, we'll split the content into sections to handle them appropriately
      const sections = content.split(/\n{2,}/); // Split by 2+ newlines to get paragraphs
      const processedSections = [];
      
      // Process each section independently
      for (const section of sections) {
        // Skip empty sections
        if (!section.trim()) continue;
        
        // Handle main title (first line)
        if (processedSections.length === 0 && section.startsWith("How to")) {
          processedSections.push(`<h2 class="text-xl font-bold text-lawxpert-navy dark:text-lawxpert-gold mb-3">${section}</h2>`);
          continue;
        }
        
        // Handle section headers with hash marks
        if (section.startsWith("####")) {
          const headerText = section.replace(/^####\s+/, '').trim();
          
          if (headerText.includes("Steps to File an FIR")) {
            processedSections.push(`<h3 class="text-lg font-bold text-blue-700 dark:text-lawxpert-gold mt-4 mb-3">Steps to File an FIR</h3>`);
          } else if (headerText.includes("Key Rights and Considerations")) {
            processedSections.push(`<h3 class="text-lg font-bold text-blue-700 dark:text-lawxpert-gold mt-4 mb-3">Key Rights and Considerations</h3>`);
          } else {
            processedSections.push(`<h4 class="font-semibold text-base mt-3 mb-2">${headerText}</h4>`);
          }
          continue;
        }
        
        // Handle "Refusal to Register FIR" section
        if (section.startsWith("- Refusal to Register FIR:")) {
          const lines = section.split('\n');
          let formattedRefusal = '<div class="ml-4 mt-3 mb-2">';
          
          // Process each line
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith("- Refusal to Register FIR:")) {
              const text = line.replace(/^- /, '');
              formattedRefusal += `<div class="font-semibold text-blue-700 mb-1">${text}</div>`;
            } else if (line.startsWith("  - ")) {
              // Nested bullet points
              const bulletText = line.replace(/^[ ]{2}- /, '');
              formattedRefusal += `<div class="ml-6 flex items-start mt-1"><span class="mr-2 text-blue-600">•</span><span>${bulletText}</span></div>`;
            }
          }
          
          formattedRefusal += '</div>';
          processedSections.push(formattedRefusal);
          continue;
        }
        
        // Handle "IMPORTANT" notes
        if (section.includes("**IMPORTANT**:")) {
          const formattedNote = section
            .replace(/\*\*IMPORTANT\*\*:/g, 
              '<div class="mt-4 p-2 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 rounded">' +
              '<span class="font-bold text-yellow-700 dark:text-yellow-400">IMPORTANT:</span>')
            .replace(/under Section (\d+)/g, 'under <span class="text-blue-600 font-medium">Section $1</span>')
            .replace(/(Indian Penal Code)/g, '<span class="text-blue-600 font-medium">$1</span>') +
            '</div>';
          
          processedSections.push(formattedNote);
          continue;
        }
        
        // Handle indented code block specifically for Zero FIR
        if (section.trim().startsWith("    Zero FIR:")) {
          // Split the section into lines to handle each line of the indented block
          const lines = section.split('\n');
          let formattedZeroFIR = '<div class="ml-6 p-2 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-blue-600 mt-2 mb-3">';
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith("Zero FIR:")) {
              formattedZeroFIR += `<div class="font-semibold text-blue-700 dark:text-blue-400">${trimmedLine}</div>`;
            } else if (trimmedLine) {
              formattedZeroFIR += `<div class="text-gray-700 dark:text-gray-300 mt-1">${trimmedLine}</div>`;
            }
          }
          
          formattedZeroFIR += '</div>';
          processedSections.push(formattedZeroFIR);
          continue;
        }
        
        // Handle numbered steps with explanations
        if (/^\d+\.\s/.test(section)) {
          const stepNumber = section.match(/^(\d+)\./)[1];
          const stepTitle = section.split('\n')[0].replace(/^\d+\.\s+/, '').trim();
          
          // Build the step with appropriate styling
          let formattedStep = `<div class="mt-3 mb-1"><span class="font-semibold text-blue-600">${stepNumber}.</span> <span class="font-semibold">${stepTitle}</span></div>`;
          
          // Handle explanation text (lines starting with colon)
          const lines = section.split('\n');
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith(':')) {
              // Add explanatory text with proper styling
              const explanation = line.substring(1).trim();
              formattedStep += `<div class="ml-4 text-gray-700 dark:text-gray-300 my-1">${explanation}</div>`;
            } else if (line.startsWith('-')) {
              // Handle details section headers
              if (line.includes("Details to Include:")) {
                formattedStep += `<div class="mt-2 font-semibold text-blue-700 dark:text-lawxpert-gold">Details to Include:</div>`;
              } else {
                // Handle bullet points
                const bulletText = line.substring(1).trim();
                formattedStep += `<div class="ml-6 flex items-start"><span class="mr-2 mt-1.5">•</span><span>${bulletText}</span></div>`;
              }
            }
          }
          
          processedSections.push(formattedStep);
          continue;
        }
        
        // Handle "Understanding an FIR" section
        if (section.startsWith("Understanding an FIR")) {
          const lines = section.split('\n');
          let formattedSection = `<h4 class="font-semibold text-blue-700 mt-3 mb-1">${lines[0]}</h4>`;
          
          // Process the description text
          if (lines.length > 1) {
            const descText = lines.slice(1).join(' ');
            formattedSection += `<div class="my-2">${descText}</div>`;
          }
          
          processedSections.push(formattedSection);
          continue;
        }
        
        // Default handling for other sections - wrap in paragraph
        processedSections.push(`<p class="my-2">${section}</p>`);
      }
      
      // Join all processed sections
      let processedContent = processedSections.join('');
      
      // Additional processing for any remaining markdown elements
      processedContent = processedContent
        // Handle bold text with **
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Handle emphasis with *
        .replace(/\*(.*?)\*/g, '<em>$1</em>')

        // Handle key phrases often used in legal explanations
        .replace(/(Section \d+(?:\([a-zA-Z0-9]\))?)/g, '<span class="text-blue-600 font-medium">$1</span>')
        .replace(/(Code of Criminal Procedure|Indian Penal Code|Constitution of India|CrPC|IPC)/g, 
                 '<span class="text-blue-600 font-medium">$1</span>');
      
      setFormattedContent(processedContent);
    } else {
      setFormattedContent(content);
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
    : formattedContent;

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
        <div className={cn("prose max-w-none", 
          compact ? "prose-xs" : "prose-sm", 
          isUser ? "prose-invert" : ""
        )}>
          {content}
        </div>
      ) : (
        <div 
          className={cn("prose max-w-none", 
            compact ? "prose-xs" : "prose-sm",
            "formatted-content"
          )}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
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
