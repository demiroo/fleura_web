"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useProduct, useUpdateURL } from "./product-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getOptimizedImageUrl, productImageConfig } from "@/lib/image-utils";

export default function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const [isZoomed, setIsZoomed] = useState(false);
  const imageIndex = state.image ? parseInt(state.image) : 0;

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square w-full overflow-hidden">
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <div className="text-center">
            <div className="text-4xl mb-2">🌸</div>
            <p className="text-muted-foreground">No images available</p>
          </div>
        </div>
      </Card>
    );
  }

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const currentImage = images[imageIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative aspect-square w-full overflow-hidden bg-muted">
        <div 
          className="relative h-full w-full cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          {currentImage && currentImage.src ? (
            <Image
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={getOptimizedImageUrl(currentImage.src, {
                width: 800,
                height: 800,
                quality: 90
              })}
              alt={currentImage.altText || 'Product image'}
              priority={imageIndex === 0}
              placeholder="blur"
              blurDataURL={productImageConfig.card.placeholder}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🌸</div>
                <p className="text-muted-foreground">Image not available</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                const newImageIndex = previousImageIndex.toString();
                updateImage(newImageIndex);
                updateURL(newImageIndex);
              }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                const newImageIndex = nextImageIndex.toString();
                updateImage(newImageIndex);
                updateURL(newImageIndex);
              }}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom Icon */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsZoomed(true)}
        >
          <ZoomInIcon className="h-4 w-4" />
        </Button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {imageIndex + 1} / {images.length}
          </div>
        )}
      </Card>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            
            return (
              <button
                key={image.src}
                onClick={() => {
                  updateImage(index.toString());
                  updateURL(index.toString());
                }}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                  isActive ? 'border-primary' : 'border-border hover:border-muted-foreground'
                }`}
              >
                <Image
                  src={getOptimizedImageUrl(image.src, {
                    width: 100,
                    height: 100,
                    quality: 75
                  })}
                  alt={image.altText || `Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={productImageConfig.thumbnail.placeholder}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0">
          <VisuallyHidden>
            <DialogTitle>Product Image Zoom</DialogTitle>
          </VisuallyHidden>
          <div className="relative aspect-square w-full">
            {currentImage && (
              <Image
                src={getOptimizedImageUrl(currentImage.src, {
                  width: 1200,
                  height: 1200,
                  quality: 95
                })}
                alt={currentImage.altText || 'Product image zoomed'}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
