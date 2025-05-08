import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";
import DocumentGenerator from "@/components/DocumentGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Chat = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 hidden sm:block">
            <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
              LegalConnect AI Assistant
            </h1>
            <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
              Ask legal questions, generate documents, or <Link to="/lawyers" className="text-blue-600 hover:underline">find a lawyer</Link> for personalized legal assistance
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
              
              {/* Lawyer marketplace promo banner */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4 border border-blue-100 dark:border-blue-800">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">Need personalized legal help?</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Connect with experienced lawyers in our marketplace</p>
                  </div>
                  <Link 
                    to="/lawyers" 
                    className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Find a Lawyer
                    <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
