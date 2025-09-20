"use client";

import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useProduct, useUpdateURL } from "./product-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { getOptimizedImageUrl, productImageConfig } from "@/lib/image-utils";
import { GridTileImage } from "@/components/grid/tile";

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
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-2">🌸</div>
            <p className="text-gray-500 dark:text-gray-400">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && images[imageIndex].src ? (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            src={images[imageIndex].src}
            alt={images[imageIndex].altText || 'Product image'}
            priority={true}
            onError={(e) => {
              console.error('Image failed to load:', images[imageIndex].src);
              console.error('Error:', e);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <div className="text-4xl mb-2">🌸</div>
              <p className="text-gray-500 dark:text-gray-400">Image not available</p>
            </div>
          </div>
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <button
                formAction={() => {
                  const newState = updateImage(previousImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Previous product image"
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => {
                  const newState = updateImage(nextImageIndex.toString());
                  updateURL(newState);
                }}
                aria-label="Next product image"
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
      {images.length > 1 ? (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;
            return (
              <li key={image.src} className="h-20 w-20">
                <button
                  formAction={() => {
                    const newState = updateImage(index.toString());
                    updateURL(newState);
                  }}
                  aria-label="Select product image"
                  className="h-full w-full"
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    active={isActive}
                    width={80}
                    height={80}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}
