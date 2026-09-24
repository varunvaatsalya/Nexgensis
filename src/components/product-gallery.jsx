"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function ProductGallery({
  images = [],
  thumbnail = "",
  title = "Product Image",
  discountPercentage = 0,
}) {
  // Consolidate images into a unique list
  const allImages = React.useMemo(() => {
    const list = [];
    if (thumbnail) list.push(thumbnail);
    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list.length > 0 ? list : [thumbnail || ""];
  }, [images, thumbnail]);

  const [selectedImage, setSelectedImage] = useState(allImages[0] || "");

  useEffect(() => {
    if (allImages.length > 0) {
      setSelectedImage(allImages[0]);
    }
  }, [allImages]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border/80 bg-muted/20 p-6 flex items-center justify-center shadow-xs">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain p-4 transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="text-sm font-medium text-muted-foreground">
            No image available
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-destructive text-destructive-foreground font-bold text-xs px-2.5 py-1 shadow-sm">
              Save {Math.round(discountPercentage)}%
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation Row */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((img, idx) => {
            const isSelected = img === selectedImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative size-18 shrink-0 overflow-hidden rounded-2xl border-2 bg-muted/20 p-1 transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 scale-100"
                    : "border-border/70 hover:border-border opacity-70 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="72px"
                  className="object-contain p-1"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
