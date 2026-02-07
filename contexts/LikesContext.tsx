import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';

interface LikesContextType {
  likedItems: Product[];
  addToLikes: (product: Product) => void;
  removeFromLikes: (productId: string) => void;
  isLiked: (productId: string) => boolean;
  likesCount: number;
}

export const LikesContext = createContext<LikesContextType | undefined>(undefined);

export const LikesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<Product[]>([]);
  const { user } = useAuth();

  // Load likes from localStorage when user logs in or page loads
  useEffect(() => {
    // This effect ensures that liked items are correctly managed when the user logs in or out.
    // By first clearing the state, we prevent the previous user's likes from persisting
    // during the transition to a new user session.
    
    // Always reset state on user change to prevent data leakage between sessions.
    setLikedItems([]);

    if (user) {
      try {
        const savedLikes = localStorage.getItem(`kk-likes-${user.id}`);
        if (savedLikes) {
          setLikedItems(JSON.parse(savedLikes));
        }
      } catch (error) {
        console.error("Failed to parse likes from localStorage for user:", user.id, error);
        // State is already cleared, so we are safe.
      }
    }
  }, [user]);

  // Save likes to localStorage whenever they change for the logged-in user
  useEffect(() => {
    if (user) {
      localStorage.setItem(`kk-likes-${user.id}`, JSON.stringify(likedItems));
    }
  }, [likedItems, user]);

  const addToLikes = (product: Product) => {
    setLikedItems(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev; // Already in list
      }
      return [...prev, product];
    });
  };

  const removeFromLikes = (productId: string) => {
    setLikedItems(prev => prev.filter(item => item.id !== productId));
  };

  const isLiked = (productId: string) => {
    return likedItems.some(item => item.id === productId);
  };
  
  const likesCount = useMemo(() => likedItems.length, [likedItems]);

  const value = {
    likedItems,
    addToLikes,
    removeFromLikes,
    isLiked,
    likesCount
  };

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
};