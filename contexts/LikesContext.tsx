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
    if (user) {
      try {
        const savedLikes = localStorage.getItem(`kk-likes-${user.id}`);
        if (savedLikes) {
          setLikedItems(JSON.parse(savedLikes));
        } else {
          setLikedItems([]); // No saved likes for this user
        }
      } catch (error) {
        console.error("Failed to parse likes from localStorage", error);
        setLikedItems([]);
      }
    } else {
      // Clear likes when user logs out
      setLikedItems([]);
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