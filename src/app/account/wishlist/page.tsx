'use client';

import { useState, useEffect } from 'react';
import { useCustomer } from '@/components/customer/customer-context';
import { useWishlist } from '@/components/product/wishlist-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/shopify/types';
import ProductCard from '@/components/product/product-card';
import { getWishlistProducts } from './actions';

export default function WishlistPage() {
  const { state } = useCustomer();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      router.push('/');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  // Load wishlist products
  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlistItems.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        // Get wishlist products using server action
        const filteredProducts = await getWishlistProducts(wishlistItems);
        setWishlistProducts(filteredProducts);
      } catch (error) {
        console.error('Failed to load wishlist products:', error);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlistItems]);

  if (state.isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {wishlistProducts.length > 0 
                ? `${wishlistProducts.length} item${wishlistProducts.length === 1 ? '' : 's'} saved`
                : "Save your favorite flowers for later"
              }
            </p>
          </div>
          {wishlistProducts.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                wishlistItems.forEach(handle => removeFromWishlist(handle));
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlistProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Start adding your favorite flowers to your wishlist by clicking the heart icon on any product.
            </p>
            
            <Button asChild size="lg">
              <Link href="/search">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product.handle}
              product={product}
              showQuickActions={true}
              className="animate-fadeIn"
            />
          ))}
        </div>
      )}
    </div>
  );
}
