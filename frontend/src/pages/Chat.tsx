import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ChatInterface from "@/components/ChatInterface";
import DocumentGenerator from "@/components/DocumentGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const Chat = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { language, cycleLanguage } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/chat' } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  // Language code display
  const getLanguageCode = () => {
    switch(language) {
      case 'hi': return 'हि';
      case 'hinglish': return 'HiEn';
      default: return 'EN';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 hidden sm:flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-lawxpert-navy dark:text-white">
                {language === 'en' 
                  ? "LegalConnect AI Assistant"
                  : language === 'hi'
                    ? "कानूनी सहायक AI"
                    : "LegalConnect AI Assistant"}
              </h1>
              <p className="text-lawxpert-slate dark:text-gray-300 mt-2">
                {language === 'en' 
                  ? <>Ask legal questions, generate documents, or <Link to="/lawyers" className="text-blue-600 hover:underline">find a lawyer</Link> for personalized legal assistance</>
                  : language === 'hi'
                    ? <>कानूनी प्रश्न पूछें, दस्तावेज़ तैयार करें, या व्यक्तिगत कानूनी सहायता के लिए <Link to="/lawyers" className="text-blue-600 hover:underline">वकील खोजें</Link></>
                    : <>Legal questions poochen, documents generate karen, ya personalized legal help ke liye <Link to="/lawyers" className="text-blue-600 hover:underline">lawyer dhundhen</Link></>}
              </p>
            </div>
            
            <Button 
              onClick={cycleLanguage}
              variant="outline" 
              className="h-10 px-4 font-medium"
            >
              {getLanguageCode()}
            </Button>
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
                {language === 'en' ? "Back to Assistant" : language === 'hi' ? "सहायक पर वापस जाएं" : "Assistant par wapas jayen"}
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
                    <h3 className="font-medium text-blue-800 dark:text-blue-300">
                      {language === 'en' 
                        ? "Need personalized legal help?"
                        : language === 'hi'
                          ? "व्यक्तिगत कानूनी सहायता चाहिए?"
                          : "Personalized legal help chahiye?"}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      {language === 'en' 
                        ? "Connect with experienced lawyers in our marketplace"
                        : language === 'hi'
                          ? "हमारे मार्केटप्लेस में अनुभवी वकीलों से जुड़ें"
                          : "Hamare marketplace mein experienced lawyers se connect karein"}
                    </p>
                  </div>
                  <Link 
                    to="/lawyers" 
                    className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    {language === 'en' 
                      ? "Find a Lawyer"
                      : language === 'hi'
                        ? "वकील खोजें"
                        : "Lawyer Dhundhen"}
                    <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Disclaimer */}
              <div className="text-center text-xs text-gray-500 border-t pt-4">
                {language === 'en' 
                  ? "Disclaimer: The information provided is for general informational purposes only and not legal advice. Always consult with a qualified lawyer for your specific situation."
                  : language === 'hi'
                    ? "अस्वीकरण: प्रदान की गई जानकारी केवल सामान्य जानकारी के लिए है और कानूनी सलाह नहीं है। हमेशा अपनी विशिष्ट स्थिति के लिए एक योग्य वकील से परामर्श करें।"
                    : "Disclaimer: Di gayi jaankari sirf general information ke liye hai aur legal advice nahi hai. Apni specific situation ke liye hamesha qualified lawyer se consult karein."}
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
