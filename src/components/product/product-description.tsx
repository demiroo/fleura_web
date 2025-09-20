"use client";

import { Product } from "@/lib/shopify/types";
import Price from "../price";
import VariantSelector from "./variant-selector";
import { AddToCart } from "../cart/add-to-cart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "./wishlist-provider";

export function ProductDescription({ product }: { product: Product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const maxPrice = product.priceRange.maxVariantPrice.amount;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const isOnSale = parseFloat(maxPrice) > parseFloat(minPrice);
  const discountPercentage = isOnSale 
    ? Math.round(((parseFloat(maxPrice) - parseFloat(minPrice)) / parseFloat(maxPrice)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Product Title & Price */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2">
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
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleWishlist(product)}
              className={isInWishlist(product.handle) ? "text-red-500" : ""}
            >
              <Heart 
                className={`h-4 w-4 ${isInWishlist(product.handle) ? "fill-current" : ""}`} 
              />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="text-3xl font-bold">
              <Price
                amount={minPrice}
                currencyCode={product.priceRange.minVariantPrice.currencyCode}
                className="text-foreground"
              />
            </div>
            {isOnSale && (
              <div className="text-lg text-muted-foreground line-through">
                <Price
                  amount={maxPrice}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
            )}
            {isOnSale && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}% OFF
              </Badge>
            )}
          </div>
          
          {/* Availability */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">In stock and ready to ship</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Tags */}
      {product.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Collections</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Variant Selector */}
      <div className="space-y-4">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      <Separator />

      {/* Add to Cart */}
      <div className="space-y-4">
        <AddToCart product={product} />
        
        {/* Trust Signals */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                Secure checkout • Free shipping over €50 • 7-day freshness guarantee
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Description */}
      <div className="space-y-2">
        <h3 className="font-medium">Description</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.description || 
            "Beautiful fresh flowers, carefully selected and arranged by our expert florists. Perfect for any occasion."
          }
        </p>
      </div>
    </div>
  );
}
