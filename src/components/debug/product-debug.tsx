import { Image } from "@/lib/shopify/types";

interface ProductDebugProps {
  product: {
    id: string;
    title: string;
    images: Image[];
    featuredImage?: Image;
  };
}

export default function ProductDebug({ product }: ProductDebugProps) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800 mb-4">
      <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">🐛 Debug Info</h3>
      <div className="text-sm space-y-2 text-yellow-700 dark:text-yellow-300">
        <p><strong>Product ID:</strong> {product.id}</p>
        <p><strong>Title:</strong> {product.title}</p>
        <p><strong>Images Array Length:</strong> {product.images?.length || 0}</p>
        <p><strong>Featured Image:</strong> {product.featuredImage ? 'Present' : 'Missing'}</p>
        
        {product.featuredImage && (
          <div className="mt-2">
            <p><strong>Featured Image URL:</strong></p>
            <p className="break-all text-xs bg-white dark:bg-gray-800 p-1 rounded">{product.featuredImage.url}</p>
          </div>
        )}
        
        {product.images && product.images.length > 0 && (
          <div className="mt-2">
            <p><strong>All Image URLs:</strong></p>
            {product.images.map((img, idx) => (
              <div key={idx} className="text-xs bg-white dark:bg-gray-800 p-1 rounded mb-1">
                <p><strong>Image {idx + 1}:</strong></p>
                <p className="break-all">URL: {img.url}</p>
                <p>Alt: {img.altText || 'No alt text'}</p>
                <p>Dimensions: {img.width} x {img.height}</p>
              </div>
            ))}
          </div>
        )}

        {(!product.images || product.images.length === 0) && (
          <p className="text-red-600 dark:text-red-400">⚠️ No images found in product data!</p>
        )}
      </div>
    </div>
  );
}



