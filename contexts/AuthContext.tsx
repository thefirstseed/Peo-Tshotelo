import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../src/lib/supabase';
import { navigate } from '../router';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: 'buyer' | 'seller') => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        // If seller, get vendor ID
        let vendorId;
        if (profile.role === 'seller') {
          const { data: vendor } = await supabase
            .from('vendors')
            .select('id')
            .eq('owner_id', userId)
            .single();
          vendorId = vendor?.id;
        }

        setUser({
          id: userId,
          name: profile.full_name || email.split('@')[0],
          email: email,
          role: profile.role,
          vendorId: vendorId
        });
      } else {
        // Fallback if profile doesn't exist yet (race condition on signup)
        setUser({
          id: userId,
          name: email.split('@')[0],
          email: email,
          role: 'buyer'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, fullName: string, role: 'buyer' | 'seller') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });
    if (error) throw error;
    
    // If email confirmation is enabled, session will be null
    return { session: data.session, user: data.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const value = { user, isLoading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
