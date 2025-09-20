'use client';

import { useCustomer } from '@/components/customer/customer-context';
import { useWishlist } from '@/components/product/wishlist-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, MapPin, Heart, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { state } = useCustomer();
  const { wishlistItems, isLoaded: wishlistLoaded } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated and initialization is complete
    if (!state.isAuthenticated && !state.isLoading && !state.isInitializing) {
      console.log('Account page: Redirecting to home - not authenticated', { 
        isAuthenticated: state.isAuthenticated, 
        isLoading: state.isLoading,
        isInitializing: state.isInitializing 
      });
      router.push('/');
    }
  }, [state.isAuthenticated, state.isLoading, state.isInitializing, router]);

  // Show loading while authentication is being checked or data is loading
  if (state.isLoading || state.isInitializing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading account...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!state.isAuthenticated) {
    return null;
  }

  const customer = state.customer!;

  // Debug logging
  console.log('Account page - wishlist items:', wishlistItems);
  console.log('Account page - addresses:', state.addresses);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {customer.firstName || 'there'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account and view your orders
        </p>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/account/profile">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Settings</div>
              <p className="text-xs text-muted-foreground">
                Update your personal information
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/account/orders">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <Package className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customer.numberOfOrders}</div>
              <p className="text-xs text-muted-foreground">
                Total orders placed
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/account/addresses">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Addresses</CardTitle>
              <MapPin className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{state.addresses.length}</div>
              <p className="text-xs text-muted-foreground">
                Saved addresses
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/account/wishlist">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
              <Heart className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {wishlistLoaded ? wishlistItems.length : "..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Saved items
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900 dark:text-white">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900 dark:text-white">
                {customer.firstName} {customer.lastName}
              </p>
            </div>
            {customer.phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900 dark:text-white">{customer.phone}</p>
              </div>
            )}
            <Button asChild className="w-full">
              <Link href="/account/profile">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.orders.length > 0 ? (
              <div className="space-y-3">
                {state.orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.processedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {order.totalPrice ? (
                          `${order.totalPrice.currencyCode} ${order.totalPrice.amount}`
                        ) : order.currentTotalPrice ? (
                          `${order.currentTotalPrice.currencyCode} ${order.currentTotalPrice.amount}`
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.financialStatus?.toLowerCase() || 'pending'}
                      </p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/account/orders">View All Orders</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Button asChild>
                  <Link href="/search">Start Shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
