import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { Product } from '../types';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('kk-wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kk-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev; // Already in wishlist
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };
  
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted,
    wishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};