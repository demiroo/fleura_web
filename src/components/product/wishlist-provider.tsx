"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/lib/shopify/types";

interface WishlistContextType {
  wishlistItems: string[]; // Array of product handles
  isLoaded: boolean; // Whether wishlist has been loaded from localStorage
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productHandle: string) => void;
  isInWishlist: (productHandle: string) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("fleura-wishlist");
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save wishlist to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("fleura-wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      if (!prev.includes(product.handle)) {
        return [...prev, product.handle];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productHandle: string) => {
    setWishlistItems(prev => prev.filter(handle => handle !== productHandle));
  };

  const isInWishlist = (productHandle: string) => {
    return wishlistItems.includes(productHandle);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.handle)) {
      removeFromWishlist(product.handle);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isLoaded,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
