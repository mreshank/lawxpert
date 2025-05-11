import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { AuthResponse } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setUser(user);
    setIsAdmin(authService.isAdmin());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response);
    setIsAdmin(authService.isAdmin());
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password });
    setUser(response);
    setIsAdmin(authService.isAdmin());
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
