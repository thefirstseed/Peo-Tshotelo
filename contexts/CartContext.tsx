import React, { createContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product } from '../types';

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

  // Load cart from localStorage on initial render
  useEffect(() => {
    // TODO Backend: Load cart from GET /api/cart on mount
    try {
      const savedCart = localStorage.getItem('kk-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCartItems([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // TODO Backend: Sync cart to database after each change
    localStorage.setItem('kk-cart', JSON.stringify(cartItems));
  }, [cartItems]);

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