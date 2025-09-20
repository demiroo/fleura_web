import { RelatedProductGrid } from "@/components/product/product-grid";
import Gallery from "@/components/product/gallery-modern";
import { ProductProvider } from "@/components/product/product-context";
import { ProductDescription } from "@/components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import { Image } from "@/lib/shopify/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductTabs } from "@/components/product/product-tabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return notFound();
  
  return (
    <ProductProvider>
      <div className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <Breadcrumbs product={product} />
          </div>
        </div>

        {/* Main Product Section */}
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Product Gallery */}
            <div className="lg:col-span-7">
              <div className="sticky top-4">
                <Suspense
                  fallback={
                    <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
                  }
                >
                  <Gallery
                    images={product.images.slice(0, 8).map((image: Image) => ({
                      src: image.url,
                      altText: image.altText,
                    }))}
                  />
                </Suspense>
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                <Suspense fallback={
                  <div className="space-y-4">
                    <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                }>
                  <ProductDescription product={product} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div className="mt-16">
            <ProductFeatures />
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <ProductTabs product={product} />
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <RelatedPRoducts id={product.id} />
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}

async function RelatedPRoducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">You might also like</h2>
        <p className="text-muted-foreground">Discover more beautiful flowers selected just for you</p>
      </div>
      <RelatedProductGrid products={relatedProducts} />
    </section>
  );
}
