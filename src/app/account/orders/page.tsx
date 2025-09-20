'use client';

import { useState, useEffect } from 'react';
import { useCustomer } from '@/components/customer/customer-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, ExternalLink, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OrdersPage() {
  const { state, loadOrders } = useCustomer();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      router.push('/');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  useEffect(() => {
    if (state.isAuthenticated) {
      loadOrdersData();
    }
  }, [state.isAuthenticated]);

  const loadOrdersData = async () => {
    setIsLoading(true);
    try {
      await loadOrders();
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'refunded':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getFulfillmentBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'fulfilled':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'unfulfilled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (state.isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Order History
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          View and track all your orders
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      )}

      {/* Orders List */}
      {!isLoading && (
        <div className="space-y-6">
          {state.orders.length > 0 ? (
            state.orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.processedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end space-y-2">
                      <p className="text-lg font-semibold">
                        {(() => {
                          const price = order.totalPrice || order.currentTotalPrice;
                          return price ? `${price.currencyCode} ${price.amount}` : 'Price unavailable';
                        })()}
                      </p>
                      <div className="flex space-x-2">
                        {order.financialStatus && (
                          <Badge variant={getStatusBadgeVariant(order.financialStatus)}>
                            {order.financialStatus}
                          </Badge>
                        )}
                        {order.fulfillmentStatus && (
                          <Badge variant={getFulfillmentBadgeVariant(order.fulfillmentStatus)}>
                            {order.fulfillmentStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-4">
                    {(Array.isArray(order.lineItems) ? order.lineItems : []).slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {item.variant?.image && (
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.variant.image.url}
                              alt={item.variant.image.altText}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              {item.variant.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {item.originalTotalPrice ? 
                              `${item.originalTotalPrice.currencyCode} ${item.originalTotalPrice.amount}` : 
                              'Price unavailable'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {(Array.isArray(order.lineItems) ? order.lineItems : []).length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        + {(Array.isArray(order.lineItems) ? order.lineItems : []).length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6 pt-4 border-t">
                    {order.statusUrl && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={order.statusUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Order Status
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    
                    {/* Reorder Button */}
                    <Button variant="outline" size="sm" className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Reorder Items
                    </Button>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                        Shipping Address
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                        {order.shippingAddress.address1}<br />
                        {order.shippingAddress.address2 && (
                          <>{order.shippingAddress.address2}<br /></>
                        )}
                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.zip}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-500 mb-6">
                        When you place orders, they&apos;ll appear here
                </p>
                <Button asChild>
                  <Link href="/search">
                    <Package className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
