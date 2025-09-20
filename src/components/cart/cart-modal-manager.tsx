"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

interface CartModalContextType {
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
  isOpening: boolean;
}

const CartModalContext = createContext<CartModalContextType | undefined>(undefined);

export function CartModalProvider({ children }: { children: ReactNode }) {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const isOpeningRef = useRef(false);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openCartModal = () => {
    // Prevent multiple rapid opens
    if (isOpeningRef.current || isCartModalOpen) {
      return;
    }

    isOpeningRef.current = true;
    
    // Clear any existing timeout
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }

    // Small delay to debounce multiple calls
    openTimeoutRef.current = setTimeout(() => {
      if (isOpeningRef.current && !isCartModalOpen) {
        setIsCartModalOpen(true);
      }
      // Reset flag after a brief delay
      setTimeout(() => {
        isOpeningRef.current = false;
      }, 500);
    }, 100);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
    isOpeningRef.current = false;
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
  };

  return (
    <CartModalContext.Provider
      value={{
        isCartModalOpen,
        openCartModal,
        closeCartModal,
        isOpening: isOpeningRef.current,
      }}
    >
      {children}
    </CartModalContext.Provider>
  );
}

export function useCartModal() {
  const context = useContext(CartModalContext);
  if (!context) {
    throw new Error("useCartModal must be used within a CartModalProvider");
  }
  return context;
}
