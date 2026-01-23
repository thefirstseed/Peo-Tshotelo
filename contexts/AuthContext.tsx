import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../api/api';
import { navigate } from '../router';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for a saved session on initial load
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem('kk-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse saved user", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await api.login(email, password);
    sessionStorage.setItem('kk-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logout = () => {
    sessionStorage.removeItem('kk-user');
    setUser(null);
    navigate('/login');
  };
  
  const value = { user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};