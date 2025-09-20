"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Info, Truck, Heart } from "lucide-react";
import Prose from "@/components/prose";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: Info },
    { id: "care", label: "Care Instructions", icon: Heart },
    { id: "reviews", label: "Reviews", icon: MessageCircle },
    { id: "shipping", label: "Shipping", icon: Truck },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 rounded-xl bg-muted p-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <Card>
        <CardContent className="p-6">
          {activeTab === "description" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Description</h3>
              {product.descriptionHtml ? (
                <Prose
                  className="text-muted-foreground"
                  html={product.descriptionHtml}
                />
              ) : (
                <p className="text-muted-foreground">
                  Beautiful fresh flowers, carefully selected and arranged by our expert florists.
                  Perfect for any occasion, these premium blooms will bring joy and elegance to your space.
                </p>
              )}
              
              {product.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "care" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Care Instructions</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Fresh Water</p>
                    <p className="text-sm text-muted-foreground">
                      Change the water every 2-3 days and trim stems at an angle
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Cool Location</p>
                    <p className="text-sm text-muted-foreground">
                      Keep away from direct sunlight and heat sources
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Remove Wilted Leaves</p>
                    <p className="text-sm text-muted-foreground">
                      Remove any wilted or damaged petals and leaves regularly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(24 reviews)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold">M{review}</span>
                        </div>
                        <span className="font-medium text-sm">Customer {review}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${
                              i < 5 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Beautiful flowers, exactly as pictured! They lasted over a week and brought so much joy to our home.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipping Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Delivery</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Express Delivery</span>
                  <span className="font-medium">Next business day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Same Day Delivery</span>
                  <span className="font-medium">Within 4 hours</span>
                </div>
                <div className="border-t border-border pt-3 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Free shipping on orders over €50. Our flowers are carefully packaged 
                    to ensure they arrive fresh and beautiful.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
