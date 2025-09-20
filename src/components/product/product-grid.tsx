"use client";

import { Product } from "@/lib/shopify/types";
import ProductCard, { ProductCardSkeleton } from "./product-card";
import clsx from "clsx";

interface ProductGridProps {
  products: Product[];
  className?: string;
  loading?: boolean;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  showQuickActions?: boolean;
}

export default function ProductGrid({ 
  products, 
  className, 
  loading = false,
  columns = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4
  },
  showQuickActions = true 
}: ProductGridProps) {
  const gridClasses = clsx(
    "grid gap-4 sm:gap-6",
    {
      [`grid-cols-${columns.default}`]: columns.default,
      [`sm:grid-cols-${columns.sm}`]: columns.sm,
      [`md:grid-cols-${columns.md}`]: columns.md,
      [`lg:grid-cols-${columns.lg}`]: columns.lg,
      [`xl:grid-cols-${columns.xl}`]: columns.xl,
    },
    className
  );

  if (loading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌸</div>
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Try browsing our collections instead.</p>
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <ProductCard
          key={product.handle}
          product={product}
          priority={index < 4} // Prioritize first 4 images for LCP
          showQuickActions={showQuickActions}
          className="animate-fadeIn"
        />
      ))}
    </div>
  );
}

// Grid variants for different layouts
export function FeaturedProductGrid({ products, className }: { 
  products: Product[]; 
  className?: string; 
}) {
  return (
    <ProductGrid 
      products={products}
      className={className}
      columns={{
        default: 1,
        sm: 2,
        lg: 3
      }}
      showQuickActions={true}
    />
  );
}

export function RelatedProductGrid({ products, className }: { 
  products: Product[]; 
  className?: string; 
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {products.map((product, index) => (
        <div 
          key={product.handle} 
          className="flex-none w-64 sm:w-72"
        >
          <ProductCard
            product={product}
            priority={index < 2}
            showQuickActions={false}
            className="h-full"
          />
        </div>
      ))}
    </div>
  );
}
