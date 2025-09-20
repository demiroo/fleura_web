/**
 * Image utilities for enhanced loading experience
 */

// Generate a simple blur placeholder data URL
export function generateBlurDataURL(
  width: number = 40,
  height: number = 40,
  color: string = "rgb(229, 231, 235)" // neutral-200 equivalent
): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.5" />
          <stop offset="50%" style="stop-color:${color};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.5" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Generate shimmer effect placeholder
export function generateShimmerDataURL(
  width: number = 40,
  height: number = 40
): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(243, 244, 246);stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgb(255, 255, 255);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(243, 244, 246);stop-opacity:1" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-200 0;200 0;-200 0"
            dur="2s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)" />
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Product image optimization configurations
export const productImageConfig = {
  // Product card sizes
  card: {
    width: 400,
    height: 400,
    quality: 80,
    placeholder: generateShimmerDataURL(400, 400)
  },
  // Thumbnail sizes
  thumbnail: {
    width: 100,
    height: 100,
    quality: 75,
    placeholder: generateBlurDataURL(100, 100)
  },
  // Quick view modal sizes
  modal: {
    width: 600,
    height: 600,
    quality: 85,
    placeholder: generateShimmerDataURL(600, 600)
  }
};

// Helper to get optimized image URL with Shopify transformations
export function getOptimizedImageUrl(
  originalUrl: string,
  { width, height, quality = 80 }: { width: number; height: number; quality?: number }
): string {
  if (!originalUrl) return '';
  
  // Check if it's a Shopify CDN URL
  if (originalUrl.includes('cdn.shopify.com')) {
    // Remove existing transformations
    const baseUrl = originalUrl.split('?')[0];
    
    // Add new transformations
    return `${baseUrl}?width=${width}&height=${height}&crop=center&quality=${quality}`;
  }
  
  // For non-Shopify URLs, return as-is
  return originalUrl;
}
