import React, { createContext, useState, useContext } from 'react';
import { User } from '../types';
import { navigate } from '../router';

// Internal type for the mock DB, including the password.
interface UserWithPassword extends User {
  password?: string;
}

// TODO Backend: Replace MOCK_USERS with POST /api/auth/login and POST /api/auth/register
// TODO Backend: Store JWT in httpOnly cookie, refresh on page load
// 1. A mock user database is now managed directly within the context.
const MOCK_USERS: UserWithPassword[] = [
  { 
    id: 'u1', name: 'Thabo Moeng', email: 'thabo@email.com', password: 'password123', role: 'buyer', 
    address: { street: '123 Main Road', city: 'Gaborone', country: 'Botswana' },
    emailVerified: false,
    phone: { number: '72 123 456', verified: true },
    identity: { nationality: 'Motswana', dateOfBirth: '1990-05-15', idType: 'Omang', idNumber: '••••••••123' }
  },
  { 
    id: 'u2', name: 'Kagiso Dlamini', email: 'kagiso@email.com', password: 'password123', role: 'seller', vendorId: 'v2',
    emailVerified: true,
    phone: { number: '71 987 654', verified: true },
    bankDetails: { bankName: 'FNB Botswana', accountHolder: 'Kagiso Dlamini', accountNumber: '62801234567', branchCode: '282067' },
    mobileMoneyDetails: { provider: 'Orange Money', name: 'K Dlamini', number: '72000111' }
  },
  // Users for the demo login buttons
  { 
    id: 'user1', name: 'Thrifty Gabs', email: 'seller@kulture.com', password: 'password', role: 'seller', vendorId: 'v1',
    emailVerified: true,
    bankDetails: { bankName: 'Stanbic Bank', accountHolder: 'Thrifty Gabs Store', accountNumber: '9060001234567', branchCode: '062167' }
  },
  { id: 'user2', name: 'Pula Buyer', email: 'buyer@kulture.com', password: 'password', role: 'buyer', emailVerified: true },
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'buyer' | 'seller') => Promise<void>;
  logout: () => void;
  updateUser: (updatedDetails: Partial<User>) => Promise<void>;
  completeSellerOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usersDB, setUsersDB] = useState<UserWithPassword[]>(MOCK_USERS);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Simulate network delay

    const foundUser = usersDB.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    setIsLoading(false);
    if (foundUser) {
      const { password: _, ...safeUser } = foundUser; // Strip password for security
      setUser(safeUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string, role: 'buyer' | 'seller' = 'buyer') => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const existingUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      setIsLoading(false);
      throw new Error('An account with this email already exists.');
    }

    const newUser: UserWithPassword = {
      id: 'u' + Date.now(),
      name,
      email,
      password,
      role,
      emailVerified: false,
    };
    
    // Add the new user to our in-memory DB
    setUsersDB(prev => [...prev, newUser]);
    
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser); // Automatically log in the new user
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  const updateUser = async (updatedDetails: Partial<User>) => {
    if (!user) throw new Error("Not authenticated");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate network delay

    // Update the "database"
    setUsersDB(prevDb => prevDb.map(dbUser => 
        dbUser.id === user.id ? { ...dbUser, ...updatedDetails } : dbUser
    ));

    // Update the live user state
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedDetails } : null);
    setIsLoading(false);
  };

  const completeSellerOnboarding = async () => {
    if (!user) return;
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate network delay

    const vendorId = user.vendorId || 'v' + Date.now();
    const updatedUser = { ...user, role: 'seller' as const, vendorId };

    setUsersDB(prevDb => prevDb.map(dbUser => 
        dbUser.id === user.id ? { ...dbUser, role: 'seller' as const, vendorId } : dbUser
    ));
    
    setUser(updatedUser);
    setIsLoading(false);
  };
  
  const value = { user, isLoading, login, register, logout, updateUser, completeSellerOnboarding };

  // App is always ready to render, no initial loading from storage.
  return (
    <AuthContext.Provider value={value}>
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