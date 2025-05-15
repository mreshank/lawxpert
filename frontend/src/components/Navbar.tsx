import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
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
import scaleImg from "@/assets/images/icon.png";

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

const LawScaleIcon = (props) => (
  <svg
    width={props.size || 32}
    height={props.size || 32}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 3v18" />
    <path d="M5 21h14" />
    <path d="M3 7h18" />
    <path d="M6 7c0 3.5-3 6-3 6s3 2.5 3 6" />
    <path d="M18 7c0 3.5 3 6 3 6s-3 2.5-3 6" />
    <circle cx="12" cy="7" r="2" />
  </svg>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b fixed--x w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center">
              <div className="bg-blue-600 w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-2">
                {/* <LawScaleIcon size={32} /> */}
                <img src={scaleImg} alt="Law Scale" width={32} height={32} className="w-full h-full rounded" />
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

              {/* {user && ( */}
                <Link
                  to="/chat"
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
                >
                  <TranslatedText textKey="aiAssistant" />
                </Link>
              {/* )} */}
              <Link
                to="/lawyers"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="findLawyers" />
              </Link>

              <Link
                to="/legal-documentation"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="legalResources" />
              </Link>
              <Link
                to="/analyze"
                className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
              >
                <TranslatedText textKey="analyzeDocument" />
              </Link>
              
              {/* {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600"
                >
                  <TranslatedText textKey="dashboard" />
                </Link>
              )} */}
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

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">{user?.user?.firstName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <TranslatedText textKey="logout" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <TranslatedText textKey="login" />
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <TranslatedText textKey="signup" />
                </Link>
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
            to="/lawyers"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="findLawyers" />
          </Link>

          <Link
            to="/legal-documentation"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="legalResources" />
          </Link>
          <Link
            to="/analyze"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="analyzeDocument" />
          </Link>
          <Link
            to="/documents"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <TranslatedText textKey="documents" />
          </Link>
          {user && (
            <Link
              to="/chat"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <TranslatedText textKey="aiAssistant" />
            </Link>
          )}
          {user && (
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <TranslatedText textKey="dashboard" />
            </Link>
          )}

          {user ? (
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
                  handleLogout();
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
