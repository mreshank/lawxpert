import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import useTranslation from "@/hooks/useTranslation";
import TranslatedText from "@/components/TranslatedText";

// SVG Icons
const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ScaleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18M8 7l4-4 4 4M8 21l4-4 4 4M3 9h18M7 13l-4-4 4-4M21 13l-4-4 4-4"></path>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, cycleLanguage } = useLanguage();
  const { t } = useTranslation();

  const getLanguageLabel = () => {
    switch (language) {
      case "en":
        return "EN";
      case "hi":
        return "हि";
      case "hinglish":
        return "हE";
    }
  };

  // This would come from auth context in the real implementation

  return (
    <nav className="bg-white shadow-sm border-b fixed--x w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center">
              <div className="bg-blue-600 w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-2">
                <ScaleIcon />
              </div>
              <span className="text-gray-800 text-xl font-bold">
                LegalConnect
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="max-md:hidden md:flex ml-10 space-x-4 flex-1">
              <Link
                to="/"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="home" />
              </Link>
              <Link
                to="/chat"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="aiAssistant" />
              </Link>
              <Link
                to="/lawyers"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="findLawyers" />
              </Link>
              <Link
                to="/documents"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="documents" />
              </Link>
              <Link
                to="/legal-documentation"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="legalResources" />
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="dashboard" />
              </Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="max-md:hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <SunIcon />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600"
              onClick={cycleLanguage}
              title={`Switch to ${
                language === "en"
                  ? "Hindi"
                  : language === "hi"
                  ? "Hinglish"
                  : "English"
              }`}
            >
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {getLanguageLabel()}
                </span>
              </div>
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">
                      <TranslatedText textKey="profile" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/admin" className="w-full">
                      <TranslatedText textKey="adminDashboard" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      className="w-full text-left"
                      onClick={() => setIsLoggedIn(false)}
                    >
                      <TranslatedText textKey="logout" />
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild className="border-gray-300">
                  <Link to="/login">
                    <TranslatedText textKey="login" />
                  </Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/register">
                    <TranslatedText textKey="signup" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              {isOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-lg relative`}
      >
        <div className="pt-2 pb-4 space-y-1--x absolute top-0 left-0 w-full bg-white/50 backdrop-blur-md shadow-lg">
          <Link
            to="/"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="home" />
          </Link>
          <Link
            to="/chat"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="aiAssistant" />
          </Link>
          <Link
            to="/lawyers"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="findLawyers" />
          </Link>
          <Link
            to="/documents"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="documents" />
          </Link>
          <Link
            to="/legal-documentation"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="legalResources" />
          </Link>
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="dashboard" />
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <TranslatedText textKey="profile" />
              </Link>
              <Link
                to="/admin"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <TranslatedText textKey="adminDashboard" />
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsOpen(false);
                }}
              >
                <TranslatedText textKey="logout" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <TranslatedText textKey="login" />
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <TranslatedText textKey="signup" />
              </Link>
            </>
          )}
        </div>
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
