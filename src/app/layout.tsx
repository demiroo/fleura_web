import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { CartModalProvider } from "@/components/cart/cart-modal-manager";
import { CustomerProvider } from "@/components/customer/customer-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { QuickViewProvider } from "@/components/product/quick-view-provider";
import { WishlistProvider } from "@/components/product/wishlist-provider";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import type { Cart } from "@/lib/shopify/types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleura - Pempelfort Düsseldorf",
  description: "Discover beautiful, fresh flowers for every occasion. Premium flower arrangements, bouquets, and plants delivered with care.",
  metadataBase: new URL('http://localhost:3000'),
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  
  // Load cart directly instead of using Promise
  let initialCart: Cart | undefined = undefined;
  try {
    initialCart = await getCart(cartId);
  } catch (error) {
    console.error('Failed to get cart:', error);
    initialCart = undefined;
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomerProvider>
            <CartProvider initialCart={initialCart}>
              <CartModalProvider>
                <WishlistProvider>
                  <QuickViewProvider>
                    <div className="relative flex min-h-screen flex-col">
                      <Navbar />
                      <main className="flex-1">
                        {children}
                      </main>
                      <Footer />
                    </div>
                    <Toaster />
                  </QuickViewProvider>
                </WishlistProvider>
              </CartModalProvider>
            </CartProvider>
          </CustomerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
