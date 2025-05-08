
import { Link } from "react-router-dom";

const Footer = () => {
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
              AI-powered legal assistance. Empowering citizens with accessible legal information and resources through artificial intelligence.
            </p>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-gray-400 uppercase text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link>
              </li>
              <li>
                <Link to="/glossary" className="text-gray-600 hover:text-blue-600">Legal Glossary</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-gray-400 uppercase text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-600 hover:text-blue-600">Legal Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 LawXpert. All rights reserved.
          </p>
          <p className="text-center text-gray-400 text-sm mt-2">
            LawXpert is not a law firm and does not provide legal advice. The information provided is for general informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
