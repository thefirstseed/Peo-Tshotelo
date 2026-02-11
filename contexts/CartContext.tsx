import React, { createContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from '../hooks/useAuth';

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load/clear cart based on user session
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    
    try {
      const userCartKey = `kk-cart-${user.id}`;
      const savedCart = localStorage.getItem(userCartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]); // Ensure cart is empty if no saved data for this user
      }
    } catch (error) {
      console.error(`Failed to parse cart for user ${user.id}`, error);
      setCartItems([]);
    }
  }, [user]);

  // Save cart to localStorage whenever it changes, but only for the logged-in user
  useEffect(() => {
    if (user) {
      const userCartKey = `kk-cart-${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product: Product, size?: string) => {
    setCartItems(prev => {
      const cartItemId = size ? `${product.id}-${size}` : product.id;
      const existingItem = prev.find(item => item.id === cartItemId);

      if (existingItem) {
        // Item with same product and size exists, just increase quantity
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: cartItemId,
          product,
          quantity: 1,
          size,
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const { totalItems, totalPrice } = useMemo(() => {
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const priceTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { totalItems: itemsCount, totalPrice: priceTotal };
  }, [cartItems]);

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};