
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";
import DocumentGenerator from "@/components/DocumentGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Chat = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
              LawXpert Legal Assistant
            </h1>
            <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
              Ask legal questions or generate documents to help with your legal matters
            </p>
          </div>
          
          {selectedDocument ? (
            <div>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="mb-6 text-lawxpert-navy dark:text-lawxpert-gold flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Assistant
              </button>
              <DocumentGenerator documentType={selectedDocument} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <ChatInterface />
            </div>
          )}
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Chat;
