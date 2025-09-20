"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Product } from "@/lib/shopify/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Price from "@/components/price";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { useQuickView } from "./quick-view-provider";
import { useWishlist } from "./wishlist-provider";
import { useCart } from "@/components/cart/cart-context";
import { getOptimizedImageUrl, productImageConfig } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { addItem } from "@/components/cart/actions";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
  showQuickActions?: boolean;
}

export default function ProductCard({ 
  product, 
  className, 
  priority = false,
  showQuickActions = true 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { openQuickView } = useQuickView();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addCartItem } = useCart();
  const { toast } = useToast();

  const maxPrice = product.priceRange.maxVariantPrice.amount;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const isOnSale = parseFloat(maxPrice) > parseFloat(minPrice);
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(maxPrice) - parseFloat(minPrice)) / parseFloat(maxPrice)) * 100)
    : 0;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const wasInWishlist = isInWishlist(product.handle);
    toggleWishlist(product);
    
    // Show feedback toast
    toast({
      title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: wasInWishlist 
        ? `${product.title} has been removed from your wishlist.`
        : `${product.title} has been added to your wishlist.`,
      duration: 2000,
    });
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add the first available variant to cart
    const defaultVariant = product.variants[0];
    if (defaultVariant) {
      // Add to cart optimistically for immediate UI feedback
      addCartItem(defaultVariant, product);
      
      // Show success toast
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
        duration: 3000,
      });

      // Also call the server action for persistence
      try {
        await addItem(null, defaultVariant.id);
      } catch (error) {
        console.error("Failed to add item to cart on server:", error);
        // Could show an error toast here if needed
        toast({
          title: "Warning",
          description: "Item added locally but may not persist. Please refresh and try again.",
          duration: 5000,
        });
      }
    }
  };

  return (
    <Card 
      className={clsx(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1",
        "border-border/50 hover:border-primary/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted/20">
          {/* Sale Badge */}
          {isOnSale && (
            <Badge 
              variant="destructive" 
              className="absolute top-3 left-3 z-10 text-xs font-semibold"
            >
              -{discountPercentage}%
            </Badge>
          )}

          {/* Wishlist Button */}
          {showQuickActions && (
            <Button
              variant="ghost"
              size="icon"
              className={clsx(
                "absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-200",
                "opacity-0 group-hover:opacity-100 hover:bg-background hover:scale-110",
                isInWishlist(product.handle) && "opacity-100 text-red-500"
              )}
              onClick={handleWishlist}
            >
              <Heart 
                className={clsx("h-4 w-4", isInWishlist(product.handle) && "fill-current")} 
              />
            </Button>
          )}

          {/* Product Image */}
          <div className="relative h-full w-full">
            {product.featuredImage?.url && (
              <Image
                src={getOptimizedImageUrl(product.featuredImage.url, {
                  width: productImageConfig.card.width,
                  height: productImageConfig.card.height,
                  quality: productImageConfig.card.quality
                })}
                alt={product.title}
                fill
                priority={priority}
                placeholder="blur"
                blurDataURL={productImageConfig.card.placeholder}
                className={clsx(
                  "object-cover transition-all duration-500",
                  "group-hover:scale-105",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            )}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60" />
            )}
          </div>

          {/* Quick Actions Overlay */}
          {showQuickActions && (
            <div 
              className={clsx(
                "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-all duration-300",
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <Button
                variant="secondary"
                size="sm"
                className="h-8 px-3 text-xs font-medium bg-background/90 hover:bg-background backdrop-blur-sm"
                onClick={handleQuickView}
              >
                <Eye className="h-3 w-3 mr-1" />
                Quick View
              </Button>
              
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3 text-xs font-medium bg-primary hover:bg-primary/90"
                onClick={handleQuickAdd}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Product Title */}
          <h3 className="font-medium text-sm leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating (placeholder for future implementation) */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={clsx(
                    "h-3 w-3",
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                  )} 
                />
              ))}
            </div>
            <span>(24)</span>
          </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <Price
                amount={minPrice}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                className="font-semibold text-foreground"
              />
              {isOnSale && (
                <Price
                  amount={maxPrice}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  className="text-xs text-muted-foreground line-through"
                />
              )}
            </div>

          {/* Product Tags/Categories (if available) */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs px-2 py-0 h-5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}

// Skeleton component for loading states
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={clsx("overflow-hidden", className)}>
      <div className="aspect-square bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        <div className="flex gap-1">
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
