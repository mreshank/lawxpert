
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Send } from "lucide-react";
import { toast } from "sonner";

interface DocumentGeneratorProps {
  documentType: string;
}

const DocumentGenerator = ({ documentType }: DocumentGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({});
  
  // Dynamic form fields based on document type
  const getFormFields = () => {
    switch(documentType) {
      case "FIR (First Information Report)":
        return [
          { name: "complainantName", label: "Complainant's Name", type: "text" },
          { name: "incidentDate", label: "Date of Incident", type: "date" },
          { name: "incidentLocation", label: "Location of Incident", type: "text" },
          { name: "incidentDetails", label: "Incident Details", type: "textarea" },
        ];
      case "RTI Application":
        return [
          { name: "applicantName", label: "Applicant's Name", type: "text" },
          { name: "publicAuthority", label: "Public Authority Name", type: "text" },
          { name: "informationSought", label: "Information Sought", type: "textarea" },
        ];
      case "Legal Notice":
        return [
          { name: "senderName", label: "Sender's Name", type: "text" },
          { name: "recipientName", label: "Recipient's Name", type: "text" },
          { name: "recipientAddress", label: "Recipient's Address", type: "textarea" },
          { name: "disputeDetails", label: "Details of Dispute", type: "textarea" },
        ];
      case "Affidavit":
        return [
          { name: "deponentName", label: "Deponent's Name", type: "text" },
          { name: "deponentAddress", label: "Deponent's Address", type: "text" },
          { name: "affidavitPurpose", label: "Purpose of Affidavit", type: "text" },
          { name: "affidavitContent", label: "Content of Declaration", type: "textarea" },
        ];
      default:
        return [];
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would call the backend API to generate document
      // For demo, we'll simulate a response after a delay
      setTimeout(() => {
        setGeneratedContent(
          `This is a placeholder for the generated ${documentType} document. In a complete app, this would contain the properly formatted legal document with all the provided information integrated.`
        );
        toast.success("Document generated successfully");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to generate document. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;
    
    // Create a blob from the content
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    const fileName = `${documentType.toLowerCase().replace(/\s+/g, "-")}.txt`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Document downloaded successfully");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generate {documentType}</CardTitle>
        <CardDescription>
          Fill in the required information to generate your document
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!generatedContent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {getFormFields().map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea 
                    id={field.name}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required
                  />
                ) : (
                  <Input 
                    id={field.name}
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required
                  />
                )}
              </div>
            ))}
            <Button 
              type="submit" 
              className="w-full bg-lawxpert-navy hover:bg-lawxpert-navy/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Generating Document...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Document
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <pre className="whitespace-pre-wrap">{generatedContent}</pre>
            </div>
            <Button 
              onClick={handleDownload}
              className="w-full bg-lawxpert-navy hover:bg-lawxpert-navy/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Document
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground text-center">
        This document is generated for informational purposes only and may need review by a legal professional.
      </CardFooter>
    </Card>
  );
};

export default DocumentGenerator;
