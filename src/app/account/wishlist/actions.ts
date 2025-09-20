"use server";

import { getProducts } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";

export async function getWishlistProducts(productHandles: string[]): Promise<Product[]> {
  if (productHandles.length === 0) {
    return [];
  }

  try {
    // Get all products and filter by wishlist handles
    const allProducts = await getProducts({});
    const filteredProducts = allProducts.filter(product => 
      productHandles.includes(product.handle)
    );
    return filteredProducts;
  } catch (error) {
    console.error('Failed to load wishlist products:', error);
    return [];
  }
}
