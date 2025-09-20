import { getProducts, getProduct } from "@/lib/shopify";

export default async function DebugPage() {
  try {
    // Test getting all products
    const products = await getProducts({});
    console.log("Products fetched:", products.length);
    
    // Get first product for detailed inspection
    const firstProduct = products[0];
    
    return (
      <div className="container mx-auto p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">Shopify Debug Information</h1>
        
        <div className="space-y-6">
          <div className="bg-card p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Environment Check</h2>
            <ul className="space-y-1 text-sm">
              <li>Shopify Domain: {process.env.SHOPIFY_STORE_DOMAIN ? '✅ Set' : '❌ Missing'}</li>
              <li>Access Token: {process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}</li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">Products Found</h2>
            <p>Total products: {products.length}</p>
          </div>

          {firstProduct && (
            <div className="bg-card p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-2">First Product Details</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {firstProduct.title}</p>
                <p><strong>Handle:</strong> {firstProduct.handle}</p>
                <p><strong>Images:</strong> {firstProduct.images?.length || 0}</p>
                <p><strong>Featured Image:</strong> {firstProduct.featuredImage ? '✅ Present' : '❌ Missing'}</p>
                
                {firstProduct.images && firstProduct.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Image URLs:</h3>
                    <ul className="space-y-1">
                      {firstProduct.images.map((img, idx) => (
                        <li key={idx} className="break-all">
                          <strong>{idx + 1}:</strong> {img.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {firstProduct.featuredImage && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Featured Image:</h3>
                    <img 
                      src={firstProduct.featuredImage.url} 
                      alt={firstProduct.featuredImage.altText || 'Product image'}
                      className="max-w-xs rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-2">All Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded p-4">
                  <h3 className="font-medium">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.handle}</p>
                  <p className="text-sm">Images: {product.images?.length || 0}</p>
                  {product.featuredImage && (
                    <img 
                      src={product.featuredImage.url} 
                      alt={product.featuredImage.altText || 'Product'}
                      className="w-full h-32 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6 text-red-500">Debug Error</h1>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-200">
          <p className="text-red-700 dark:text-red-400">
            Error fetching products: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
}






