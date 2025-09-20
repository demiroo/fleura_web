"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/shopify/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Price from "@/components/price";
import { ShoppingCart, ExternalLink, Star } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { getOptimizedImageUrl, productImageConfig } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import { addItem } from "@/components/cart/actions";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addCartItem } = useCart();
  const { toast } = useToast();

  if (!product) return null;

  const maxPrice = product.priceRange.maxVariantPrice.amount;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const isOnSale = parseFloat(maxPrice) > parseFloat(minPrice);
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(maxPrice) - parseFloat(minPrice)) / parseFloat(maxPrice)) * 100)
    : 0;

  const images = product.images.length > 0 ? product.images : [product.featuredImage].filter(Boolean);

  const handleQuickAdd = async () => {
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
      
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold mb-2">
                {product.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Quick view of {product.title}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {isOnSale && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {images[selectedImageIndex] && (
                <Image
                  src={getOptimizedImageUrl(images[selectedImageIndex].url, {
                    width: productImageConfig.modal.width,
                    height: productImageConfig.modal.height,
                    quality: productImageConfig.modal.quality
                  })}
                  alt={images[selectedImageIndex].altText || product.title}
                  fill
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL={productImageConfig.modal.placeholder}
                />
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <Image
                      src={getOptimizedImageUrl(image.url, {
                        width: productImageConfig.thumbnail.width,
                        height: productImageConfig.thumbnail.height,
                        quality: productImageConfig.thumbnail.quality
                      })}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={productImageConfig.thumbnail.placeholder}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(24 reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Price
                  amount={minPrice}
                  currencyCode={product.priceRange.minVariantPrice.currencyCode}
                  className="text-2xl font-bold"
                />
                {isOnSale && (
                  <Price
                    amount={maxPrice}
                    currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    className="text-lg text-muted-foreground line-through"
                  />
                )}
              </div>
              {isOnSale && (
                <p className="text-sm text-green-600 font-medium">
                  You save {discountPercentage}%
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {product.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 6).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleQuickAdd}
                className="w-full" 
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="w-full" 
                size="lg"
              >
                <Link href={`/product/${product.handle}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Details
                </Link>
              </Button>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">In Stock - Ready to Ship</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
