"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export interface ProductGalleryProps {
  images: string[];
  productName: string;
  stockType: "READY_TO_SHIP" | "MADE_TO_ORDER" | string;
  leadTimeDays?: number | null;
  stockQty?: number | null;
}

export function ProductGallery({
  images,
  productName,
  stockType,
  leadTimeDays,
  stockQty,
}: ProductGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["https://placehold.co/800x800/FAF1EA/D98E73?text=Handcrafted+Crochet"];
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const activeImage = safeImages[selectedImageIndex] || safeImages[0];
  const isReady = stockType === "READY_TO_SHIP";

  return (
    <div className="space-y-4">
      {/* Main Feature Image Card */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[#ECE2D2] bg-[#FAF5EE] shadow-[0_8px_30px_-6px_rgba(43,36,32,0.08)]">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 550px"
          className="object-cover transition-all duration-300 ease-out"
          unoptimized={activeImage.startsWith("data:") || activeImage.includes("placehold.co")}
        />

        {/* Stock Badge Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <Badge
            variant={isReady ? "Ready to Ship" : "Made to Order"}
            className="shadow-sm backdrop-blur-xs text-xs py-1 px-3 font-semibold"
          >
            {isReady
              ? stockQty && stockQty <= 3
                ? `Ready to Ship • Only ${stockQty} left!`
                : "Ready to Ship"
              : leadTimeDays
              ? `Made to Order (${leadTimeDays}d lead)`
              : "Made to Order"}
          </Badge>
        </div>

        {/* Handmade Tag in bottom-right */}
        <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-brand-text border border-stone-200/80 shadow-xs">
          🧶 100% Handcrafted
        </div>
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
          {safeImages.map((img, index) => {
            const isSelected = selectedImageIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-brand-primary ring-2 ring-brand-primary/20 shadow-md scale-102"
                    : "border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-300"
                }`}
                aria-label={`View photo ${index + 1} of ${productName}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="90px"
                  className="object-cover"
                  unoptimized={img.startsWith("data:") || img.includes("placehold.co")}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
