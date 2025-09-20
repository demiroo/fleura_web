"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/lib/shopify/types";
import QuickViewModal from "./quick-view-modal";

interface QuickViewContextType {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isOpen: boolean;
  product: Product | null;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openQuickView = (product: Product) => {
    setProduct(product);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setTimeout(() => setProduct(null), 300); // Delay to allow animation
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView, isOpen, product }}>
      {children}
      <QuickViewModal 
        product={product} 
        isOpen={isOpen} 
        onClose={closeQuickView} 
      />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return context;
}
