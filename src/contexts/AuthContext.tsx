
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "citizen" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    
    if (token) {
      // In a real app, we would validate the token with the backend
      // For demo purposes, we'll just set a mock user
      setUser({
        id: "123",
        name: "Demo User",
        email: "demo@example.com",
        role: "citizen", // Default role
      });
      
      // Check if it's the admin account
      if (localStorage.getItem("isAdmin") === "true") {
        setUser({
          id: "999",
          name: "Admin User",
          email: "admin@lawxpert.com",
          role: "admin",
        });
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success) {
        // For demo: if it's the admin email, set admin role
        const isAdmin = email.toLowerCase() === "admin@lawxpert.com";
        
        if (isAdmin) {
          localStorage.setItem("isAdmin", "true");
          setUser({
            id: "999",
            name: "Admin User",
            email,
            role: "admin",
          });
        } else {
          localStorage.setItem("isAdmin", "false");
          setUser({
            id: "123",
            name: "Demo User",
            email,
            role: "citizen",
          });
        }
        
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.register({ name, email, password });
      
      if (response.success) {
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
