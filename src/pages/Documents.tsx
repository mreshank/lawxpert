
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentGenerator from "@/components/DocumentGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";

const Documents = () => {
  const [selectedDocumentType, setSelectedDocumentType] = useState("FIR (First Information Report)");
  
  const documentTypes = [
    "FIR (First Information Report)",
    "RTI Application",
    "Legal Notice",
    "Affidavit"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
              Legal Document Generator
            </h1>
            <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
              Generate professionally formatted legal documents in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-medium mb-4">Document Types</h2>
                
                <div className="space-y-2">
                  {documentTypes.map((docType) => (
                    <button
                      key={docType}
                      onClick={() => setSelectedDocumentType(docType)}
                      className={`w-full text-left px-4 py-3 rounded-md flex items-center transition ${
                        selectedDocumentType === docType
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      <span>{docType}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-xl font-medium mb-4">Need Help?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Not sure which document you need? Chat with our AI assistant for guidance.
                </p>
                <a 
                  href="/chat" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-center transition-colors"
                >
                  Chat with Assistant
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <DocumentGenerator documentType={selectedDocumentType} />
            </div>
          </div>
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Documents;
