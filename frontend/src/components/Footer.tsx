import { Link } from "react-router-dom";
import TranslatedText from "@/components/TranslatedText";
import DynamicTranslation from "@/components/DynamicTranslation";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const { tf } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo and description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-2">
                LX
              </div>
              <span className="text-gray-800 text-xl font-bold">
                LawXpert
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              <DynamicTranslation>
                AI-powered legal assistance. Empowering citizens with accessible legal information and resources through artificial intelligence.
              </DynamicTranslation>
            </p>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-gray-600 uppercase text-sm font-semibold mb-4">
              <TranslatedText textKey="footer_resources" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_about" />
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_faq" />
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_glossary" />
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_contact" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-gray-600 uppercase text-sm font-semibold mb-4">
              <TranslatedText textKey="footer_legal" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_privacy" />
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_terms" />
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-blue-600">
                  <TranslatedText textKey="footer_disclaimer" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-8">
          <p className="text-center text-gray-500 text-sm">
            {tf('footer_copyright', currentYear)}
          </p>
          <p className="text-center text-gray-600 text-sm mt-2">
            <TranslatedText textKey="footer_disclaimer_text" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
