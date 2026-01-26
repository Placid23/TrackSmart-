'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { CartItem, VendorItem } from '@/lib/types';

interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: VendorItem, vendorName: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tracksmart_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from local storage', error);
    }
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to local storage', error);
    }
  };

  const addItem = useCallback((item: VendorItem, vendorName: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.name && cartItem.vendorName === vendorName);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map(cartItem =>
          cartItem.id === item.name && cartItem.vendorName === vendorName
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        const newItem: CartItem = {
          id: item.name,
          name: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl,
          vendorName,
        };
        updatedItems = [...prevItems, newItem];
      }
      updateLocalStorage(updatedItems);
      return updatedItems;
    });

    toast({
      title: 'Added to Cart',
      description: `${item.name} has been added to your cart.`,
    });
    setCartOpen(true);
  }, [toast]);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.reduce((acc, item) => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
      updateLocalStorage(updatedItems);
      return updatedItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    updateLocalStorage([]);
  }, []);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart, totalItems, cartTotal, isCartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}
