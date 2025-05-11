import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { AuthResponse, RegisterData } from '../services/authService';
import axios from 'axios';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: AuthResponse = {
  token: 'mock-token',
  user: {
    id: '1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    role: 'user'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(mockUser);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    setUser(mockUser);
  };

  const register = async (data: RegisterData) => {
    setUser(mockUser);
  };

  const logout = () => {
    setUser(mockUser);
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
