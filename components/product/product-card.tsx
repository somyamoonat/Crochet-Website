"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { ShoppingBag, ArrowRight, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  id: string;
  name?: string;
  title?: string;
  slug: string;
  price?: number | null;
  compareAtPrice?: number | null;
  salePrice?: number | null;
  image?: string;
  images?: string[];
  stockType?: "READY_TO_SHIP" | "MADE_TO_ORDER" | string;
  leadTimeDays?: number | null;
  categoryName?: string;
}

export function ProductCard({
  id,
  name,
  title,
  slug,
  price,
  compareAtPrice,
  salePrice,
  image,
  images,
  stockType = "READY_TO_SHIP",
  leadTimeDays,
  categoryName,
}: ProductCardProps) {
  const router = useRouter();
  const productName = name || title || "Crochet Treasure";
  const displayImage = image || (images && images.length > 0 ? images[0] : null);
  const originalPrice = compareAtPrice ?? salePrice;

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isInCart = mounted && cartItems.some((item) => item.productId === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${id}-standard`,
      productId: id,
      variantId: null,
      name: productName,
      title: productName,
      price: price || 0,
      image: displayImage || undefined,
      stockType: stockType as "READY_TO_SHIP" | "MADE_TO_ORDER",
      leadTimeDays: leadTimeDays,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${id}-standard`,
      productId: id,
      variantId: null,
      name: productName,
      title: productName,
      price: price || 0,
      image: displayImage || undefined,
      stockType: stockType as "READY_TO_SHIP" | "MADE_TO_ORDER",
      leadTimeDays: leadTimeDays,
    });

    router.push("/checkout");
  };

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/checkout");
  };

  const isReady = stockType === "READY_TO_SHIP";

  return (
    <div className="group relative flex flex-col rounded-2xl sm:rounded-3xl border border-[#E9DFD0] bg-white p-2.5 sm:p-3.5 shadow-[0_4px_20px_-4px_rgba(43,36,32,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-[0_12px_32px_-8px_rgba(43,36,32,0.12)]">
      {/* Product Image & Badges */}
      <Link
        href={`/product/${slug}`}
        className="relative block aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F6EFE6]"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            unoptimized={displayImage.startsWith("data:") || displayImage.includes("placehold.co")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400 font-handwriting text-base sm:text-xl">
            🧶 Handcrafted
          </div>
        )}

        {/* Stock Badge Overlay */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1">
          <Badge
            variant={isReady ? "Ready to Ship" : "Made to Order"}
            className="shadow-xs backdrop-blur-xs text-[9px] sm:text-[11px] py-0.5 px-1.5 sm:px-2 font-medium"
          >
            {isReady ? "Ready to Ship" : leadTimeDays ? `Made to Order (${leadTimeDays}d)` : "Made to Order"}
          </Badge>
        </div>
      </Link>

      {/* Product Details */}
      <div className="mt-2 sm:mt-3 flex flex-1 flex-col justify-between space-y-1.5 sm:space-y-2">
        <div>
          {categoryName && (
            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-brand-primary line-clamp-1">
              {categoryName}
            </p>
          )}
          <Link href={`/product/${slug}`}>
            <h3 className="font-heading text-xs sm:text-sm md:text-base font-bold text-brand-text line-clamp-1 group-hover:text-brand-primary transition-colors">
              {productName}
            </h3>
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 sm:gap-1.5">
          {price && price > 0 ? (
            <>
              <span className="font-heading text-sm sm:text-base md:text-lg font-bold text-brand-text">
                {formatINR(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  {formatINR(originalPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="font-heading text-xs sm:text-sm font-bold text-brand-primary">
              Custom / Bespoke
            </span>
          )}
        </div>

        {/* Action Buttons: Add to Basket & Buy Now / Proceed to Checkout */}
        <div className="pt-2 border-t border-stone-100">
          {!price || price <= 0 ? (
            <Link
              href={`/product/${slug}`}
              className="w-full flex items-center justify-center gap-1 rounded-xl bg-[#FAECE8] hover:bg-brand-primary text-[#9E5740] hover:text-white py-1.5 px-2 text-xs font-semibold transition border border-[#F2D7D0] hover:border-brand-primary shadow-xs"
            >
              <span>Custom Quote</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : isInCart ? (
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2 px-2 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl border border-brand-primary/50 text-brand-primary hover:bg-[#FAF1EA] active:scale-95 text-[11px] font-semibold transition cursor-pointer"
                title="Add to Basket"
              >
                <ShoppingBag className="h-3 w-3 shrink-0" />
                <span className="truncate">Add<span className="hidden sm:inline"> to Basket</span></span>
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl bg-brand-primary hover:bg-[#c4795f] active:scale-95 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                title="Buy Now"
              >
                <Zap className="h-3 w-3 shrink-0 fill-current" />
                <span className="truncate">Buy Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
