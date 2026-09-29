"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { FormattedProduct, FormattedProductVariant } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Check,
  MapPin,
  ShieldCheck,
  Truck,
  MessageCircle,
  Clock,
  Sparkles,
  Info,
  ArrowRight,
  Zap,
} from "lucide-react";

export interface ProductDetailsProps {
  product: FormattedProduct;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Variant selection
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<FormattedProductVariant | null>(
    hasVariants ? product.variants[0] : null
  );

  // Quantity selection
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Check if item is in cart
  const isInCart = mounted && cartItems.some((item) => item.productId === product.id);

  // Calculations
  const isCustomOrUnpriced =
    product.isCustom || !product.price || product.price <= 0;
  const basePrice = product.price || 0;
  const priceDelta = selectedVariant?.priceDelta || 0;
  const effectivePrice = Math.max(0, basePrice + priceDelta);
  const compareAtPrice = product.compareAtPrice
    ? product.compareAtPrice + priceDelta
    : null;

  const isReady = product.stockType === "READY_TO_SHIP";
  const stockQty = isReady ? (product.stockQty ?? 5) : null;
  const isLowStock = isReady && stockQty !== null && stockQty <= 5;
  const maxQty = isReady && stockQty ? Math.max(1, stockQty) : 10;

  // Add to cart handler
  const handleAddToCart = () => {
    if (isCustomOrUnpriced) return;

    addItem(
      {
        id: `${product.id}-${selectedVariant?.id || "standard"}`,
        productId: product.id,
        variantId: selectedVariant?.id || null,
        name: product.name,
        title: product.name,
        price: effectivePrice,
        image: product.images && product.images.length > 0 ? product.images[0] : undefined,
        variant: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
        variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
        stockType: product.stockType,
        leadTimeDays: product.leadTimeDays,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Buy now handler
  const handleBuyNow = () => {
    if (isCustomOrUnpriced) return;

    addItem(
      {
        id: `${product.id}-${selectedVariant?.id || "standard"}`,
        productId: product.id,
        variantId: selectedVariant?.id || null,
        name: product.name,
        title: product.name,
        price: effectivePrice,
        image: product.images && product.images.length > 0 ? product.images[0] : undefined,
        variant: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
        variantName: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
        stockType: product.stockType,
        leadTimeDays: product.leadTimeDays,
      },
      quantity
    );

    router.push("/checkout");
  };

  const handleProceedToCheckout = () => {
    router.push("/checkout");
  };

  // WhatsApp enquiry for custom / unpriced items
  const whatsappEnquiryUrl = `https://wa.me/919770124355?text=${encodeURIComponent(
    `Hi Nitika! I'm interested in the "${product.name}" handcrafted piece from The Crochet Diaryy. Could you please share more details and pricing?`
  )}`;

  return (
    <div className="space-y-6">
      {/* Category & Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {product.categorySlug && (
          <Link
            href={`/shop/${product.categorySlug}`}
            className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:underline"
          >
            {product.categoryName || product.categorySlug}
          </Link>
        )}

        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
          <span>Handmade with Love</span>
        </div>
      </div>

      {/* Product Title */}
      <div className="space-y-2">
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-text leading-snug">
          {product.name}
        </h1>

        {/* Stock Badge */}
        <div>
          {isReady ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF2EA] px-3.5 py-1 text-xs font-semibold text-[#3B4D36] border border-[#D1E0CE]">
              <span className="h-2 w-2 rounded-full bg-[#4A5D45] animate-pulse" />
              <span>
                {isLowStock
                  ? `Ready to Ship • Only ${stockQty} left in stock!`
                  : "Ready to Ship • In Stock"}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE8] px-3.5 py-1 text-xs font-semibold text-[#9E5740] border border-[#F2D7D0]">
              <Clock className="h-3.5 w-3.5 text-brand-primary" />
              <span>
                Made to Order — ships in {product.leadTimeDays || 4} days, handmade just for you
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Block */}
      <div className="border-y border-[#ECE2D2] py-4">
        {isCustomOrUnpriced ? (
          <div className="space-y-1">
            <span className="font-heading text-2xl font-bold text-brand-primary">
              Custom Quote on Request
            </span>
            <p className="text-xs text-stone-500">
              Pricing depends on customization, dimensions, and yarn choice.
            </p>
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-3xl font-extrabold text-brand-text">
              {formatINR(effectivePrice)}
            </span>

            {compareAtPrice && compareAtPrice > effectivePrice && (
              <>
                <span className="text-base text-stone-400 line-through">
                  {formatINR(compareAtPrice)}
                </span>
                <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                  Save {Math.round(((compareAtPrice - effectivePrice) / compareAtPrice) * 100)}%
                </span>
              </>
            )}

            <span className="text-xs text-stone-500 ml-auto font-medium">
              Tax included • Free local pickup
            </span>
          </div>
        )}
      </div>

      {/* Variant Selector (if present) */}
      {hasVariants && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-text uppercase tracking-wider">
              {product.variants[0]?.name || "Select Option"}:
            </span>
            {selectedVariant && (
              <span className="font-medium text-brand-primary">{selectedVariant.value}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isOutOfStock = v.stockQty !== undefined && v.stockQty !== null && v.stockQty <= 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => setSelectedVariant(v)}
                  className={`group relative flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isOutOfStock
                      ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through"
                      : isSelected
                      ? "border-brand-primary bg-[#FAF1EA] text-brand-primary shadow-xs ring-2 ring-brand-primary/20"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <span>{v.value}</span>
                  {v.priceDelta !== 0 && (
                    <span
                      className={`text-[11px] ${
                        isSelected ? "text-brand-primary" : "text-stone-500"
                      }`}
                    >
                      ({v.priceDelta > 0 ? `+${formatINR(v.priceDelta)}` : formatINR(v.priceDelta)})
                    </span>
                  )}
                  {isOutOfStock && <span className="text-[10px] text-red-500 ml-1">(Sold out)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector & Action Buttons */}
      <div className="space-y-4 pt-2">
        {isCustomOrUnpriced ? (
          /* Custom / Unpriced Piece -> WhatsApp CTA */
          <div className="space-y-3">
            <a
              href={whatsappEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1fa952] text-white py-3.5 px-6 text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition duration-200 cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Enquire on WhatsApp</span>
            </a>
            <p className="text-center text-xs text-stone-500">
              Nitika will confirm timeline, yarn colors, and answer any styling questions directly.
            </p>
          </div>
        ) : (
          /* Regular Priced Product -> Add to Basket & Buy Now or Proceed to Checkout */
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center justify-between sm:justify-start border border-stone-200 rounded-2xl bg-white px-3.5 py-2 shadow-xs shrink-0">
              <span className="text-xs text-stone-500 font-medium sm:hidden">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold text-stone-700 transition cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-6 text-center text-sm font-bold text-brand-text">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty}
                  className="h-8 w-8 rounded-full bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold text-stone-700 transition cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {isInCart ? (
              <div className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleProceedToCheckout}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-md hover:shadow-lg py-3.5 text-sm sm:text-base font-bold"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Proceed to Checkout
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 border-brand-primary text-brand-primary hover:bg-[#FAF1EA] shadow-xs py-3.5 text-sm sm:text-base font-bold"
                  leftIcon={
                    isAdded ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : (
                      <ShoppingBag className="h-5 w-5" />
                    )
                  }
                >
                  {isAdded ? "Added to Basket ✓" : "Add to Basket"}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1 shadow-md hover:shadow-lg py-3.5 text-sm sm:text-base font-bold"
                  rightIcon={<Zap className="h-5 w-5 fill-current" />}
                >
                  Buy Now • {formatINR(effectivePrice * quantity)}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="space-y-3 pt-4 border-t border-[#ECE2D2]">
        <h3 className="font-heading text-lg font-bold text-brand-text">About This Piece</h3>
        <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Care Instructions Block */}
      <div className="rounded-3xl border border-[#ECE2D2] bg-[#FAF3EA] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-brand-primary" />
          <h4 className="font-heading text-sm font-bold text-brand-text">
            Handmade Care Instructions
          </h4>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-primary">•</span>
            <span>Hand wash gently in cool water with mild liquid soap</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-primary">•</span>
            <span>Do not wring or twist; press water out gently with a towel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-primary">•</span>
            <span>Lay flat to dry in shade to preserve original shape</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-primary">•</span>
            <span>Avoid machine washing or tumble drying</span>
          </li>
        </ul>
      </div>

      {/* Small Trust Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-xs">
          <MapPin className="h-5 w-5 text-brand-secondary shrink-0" />
          <div>
            <p className="text-xs font-bold text-brand-text">Doorstep Delivery</p>
            <p className="text-[10px] text-stone-500">Fast & careful handover</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-xs">
          <ShieldCheck className="h-5 w-5 text-brand-primary shrink-0" />
          <div>
            <p className="text-xs font-bold text-brand-text">Secure Payments</p>
            <p className="text-[10px] text-stone-500">UPI, Cards &amp; Handover</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-xs">
          <Truck className="h-5 w-5 text-[#3B4D36] shrink-0" />
          <div>
            <p className="text-xs font-bold text-brand-text">Careful Packaging</p>
            <p className="text-[10px] text-stone-500">Gift-ready in tissue</p>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Product Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE2D2] px-4 py-2.5 shadow-[0_-4px_24px_rgba(43,36,32,0.08)] pb-[calc(env(safe-area-inset-bottom,0px)+8px)]">
        <div className="flex items-center justify-between gap-3">
          {/* Mini Thumbnail & Price */}
          <div className="flex items-center gap-2.5 min-w-0">
            {product.images && product.images.length > 0 && (
              <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-[#FAF1EA] shrink-0 border border-stone-200">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="44px"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-text truncate leading-tight">
                {product.name}
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-extrabold text-brand-primary">
                  {formatINR(effectivePrice)}
                </span>
                {compareAtPrice && compareAtPrice > effectivePrice && (
                  <span className="text-[10px] text-stone-400 line-through">
                    {formatINR(compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isCustomOrUnpriced ? (
              <a
                href={whatsappEnquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-[#25D366] text-white px-4 py-2 text-xs font-bold shadow-xs active:scale-95 transition"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Enquire</span>
              </a>
            ) : isInCart ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleProceedToCheckout}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2 px-4 shadow-sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Checkout
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-9 w-9 rounded-full border border-brand-primary text-brand-primary hover:bg-[#FAF1EA] flex items-center justify-center transition active:scale-95 shadow-2xs cursor-pointer"
                  aria-label="Add to Basket"
                >
                  {isAdded ? <Check className="h-4 w-4 stroke-[3]" /> : <ShoppingBag className="h-4 w-4" />}
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBuyNow}
                  className="font-bold text-xs py-2 px-3.5 shadow-sm active:scale-95"
                  rightIcon={<Zap className="h-3.5 w-3.5 fill-current" />}
                >
                  Buy Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
