import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// SVG Icons
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ScaleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M8 7l4-4 4 4M8 21l4-4 4 4M3 9h18M7 13l-4-4 4-4M21 13l-4-4 4-4"></path>
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // This would come from auth context in the real implementation

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-blue-600 w-10 h-10 rounded flex items-center justify-center text-white font-bold mr-2">
                <ScaleIcon />
              </div>
              <span className="text-gray-800 text-xl font-bold">
                LegalConnect
              </span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/" className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600">
                Home
              </Link>
              <Link to="/chat" className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600">
                AI Assistant
              </Link>
              <Link to="/lawyers" className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600">
                Find Lawyers
              </Link>
              <Link to="/documents" className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600">
                Documents
              </Link>
              <Link to="/dashboard" className="text-gray-800 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-blue-600">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <SunIcon />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-gray-600">
              <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="text-sm">🌐</span>
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
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/admin" className="w-full">Admin Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button className="w-full text-left" onClick={() => setIsLoggedIn(false)}>
                      Log Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild className="border-gray-300">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/register">Sign Up</Link>
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
              {isOpen ? (
                <XIcon />
              ) : (
                <MenuIcon />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-white shadow-lg`}>
        <div className="pt-2 pb-4 space-y-1">
          <Link
            to="/"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/chat"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            AI Assistant
          </Link>
          <Link
            to="/lawyers"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Find Lawyers
          </Link>
          <Link
            to="/documents"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Documents
          </Link>
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/admin"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsOpen(false);
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-blue-600 bg-gray-50 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
