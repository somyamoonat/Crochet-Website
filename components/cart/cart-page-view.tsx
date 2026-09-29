"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import {
  Container,
  Card,
  Button,
  StitchDivider,
} from "@/components/ui";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Sparkles,
  RotateCcw,
  MessageCircle,
} from "lucide-react";

export function CartPageView() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    hasMadeToOrder,
    maxLeadTimeDays,
  } = useCartStore();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-16">
        <Container size="lg">
          <div className="h-64 rounded-3xl bg-white/60 animate-pulse border border-stone-200" />
        </Container>
      </div>
    );
  }

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const containsMadeToOrder = hasMadeToOrder();
  const leadDays = maxLeadTimeDays() || 4;

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24">
        <Container size="md">
          <div className="rounded-3xl border border-dashed border-[#E3D8C8] bg-white/80 p-8 sm:p-14 text-center space-y-6 shadow-xs">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF1EA] text-brand-primary">
              <ShoppingBag className="h-10 w-10 text-brand-primary/60" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
                Your basket is empty
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Looks like you haven&apos;t added any handmade crochet pieces yet. Discover our cute amigurumi plushies, tote bags, and floral decor!
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/shop">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="shadow-md"
                >
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/#categories">
                <Button variant="outline" size="lg">
                  Browse Categories
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-center gap-6 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-secondary" />
                Doorstep Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                100% Handcrafted
              </span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <Container size="xl" className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ECE2D2] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-handwriting text-2xl text-brand-primary font-bold">
                Your Shopping Bag
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-brand-text">
              Review Your Basket
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              You have <strong>{totalItems}</strong> {totalItems === 1 ? "item" : "items"} in your order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-brand-primary transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear Basket</span>
            </button>
          </div>
        </div>

        {/* Made to Order Advisory Banner */}
        {containsMadeToOrder && (
          <div className="rounded-3xl border border-[#F2D7D0] bg-[#FAECE8] p-5 sm:p-6 text-stone-800 shadow-xs flex flex-col sm:flex-row items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-xs">
              <Clock className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-base font-bold text-[#9E5740]">
                Contains Made-to-Order Pieces
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Your order includes custom, freshly hand-crocheted item(s). Nitika will begin stitching them immediately once your order is confirmed. Please allow approximately <strong>{leadDays} business days</strong> for crafting before doorstep delivery or studio pickup.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Grid: Line Items + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Line Items (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl border border-[#ECE2D2] bg-white divide-y divide-[#ECE2D2] overflow-hidden shadow-xs">
              {items.map((item) => {
                const displayName = item.name || item.title || "Crochet Piece";
                const isMadeToOrder = item.stockType === "MADE_TO_ORDER";

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:bg-[#FAF6EF]/40"
                  >
                    {/* Image & Main Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <Link
                        href={`/product/${item.productId}`}
                        className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border border-stone-200 bg-[#FAF1EA]"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={displayName}
                            fill
                            sizes="96px"
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🧶
                          </div>
                        )}
                      </Link>

                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-heading text-sm sm:text-base font-bold text-brand-text hover:text-brand-primary transition block truncate"
                        >
                          {displayName}
                        </Link>

                        {/* Variant and Stock Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          {item.variant && (
                            <span className="rounded-md bg-[#FAF1EA] px-2 py-0.5 text-xs font-semibold text-brand-primary">
                              {item.variant}
                            </span>
                          )}
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              isMadeToOrder
                                ? "bg-[#FAECE8] text-[#9E5740]"
                                : "bg-[#EBF2EA] text-[#3B4D36]"
                            }`}
                          >
                            {isMadeToOrder
                              ? `Made to Order (${item.leadTimeDays || 4}d)`
                              : "Ready to Ship"}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 font-medium">
                          Unit Price: {formatINR(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {/* Quantity Controller */}
                      <div className="flex items-center rounded-full border border-stone-200 bg-[#FAF6EF]/60 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-full bg-white hover:bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold transition shadow-2xs cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-brand-text">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full bg-white hover:bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold transition shadow-2xs cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[70px]">
                        <span className="font-heading text-sm sm:text-base font-bold text-brand-text">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition cursor-pointer"
                        aria-label={`Remove ${displayName} from cart`}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Notice strip */}
            <div className="rounded-2xl border border-stone-200/80 bg-white/70 p-4 flex items-center gap-3 text-xs text-stone-600">
              <MapPin className="h-5 w-5 text-brand-secondary shrink-0" />
              <span>
                <strong>Local Deliveries:</strong> Personal doorstep delivery or free self-pickup at Nitika&apos;s home studio.
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary (lg:col-span-4) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <Card className="p-6 border border-[#ECE2D2] shadow-xs space-y-6">
              <h3 className="font-heading text-lg font-bold text-brand-text pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal ({totalItems})</span>
                  <span className="font-semibold text-brand-text">{formatINR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    Delivery
                    <span className="text-[10px] text-brand-secondary font-bold uppercase">(Local)</span>
                  </span>
                  <span className="font-bold text-emerald-700">Free</span>
                </div>

                {containsMadeToOrder && (
                  <div className="flex justify-between text-xs text-[#9E5740] bg-[#FAECE8] p-2.5 rounded-xl font-medium">
                    <span>Est. Making Time:</span>
                    <span>~{leadDays} business days</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-heading text-base font-bold text-brand-text">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="font-heading text-2xl font-extrabold text-brand-text">
                      {formatINR(subtotal)}
                    </span>
                    <p className="text-[10px] text-stone-400">All local taxes included</p>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <div className="space-y-3 pt-2">
                <Link href="/checkout" className="block w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-md hover:shadow-lg py-4 text-base font-bold"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-center text-[11px] text-stone-500">
                  No login required • Guest checkout supported
                </p>
              </div>

              {/* Trust Details in Summary */}
              <div className="space-y-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-primary" />
                  <span>UPI, Cards &amp; Cash on Handover</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-secondary" />
                  <span>Freshly handmade keepsakes</span>
                </div>
              </div>
            </Card>

            {/* Need Customization / Questions WhatsApp Card */}
            <div className="rounded-3xl border border-stone-200 bg-white p-5 space-y-3 shadow-xs">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-text">
                Questions about your order?
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Need to add special gift packaging or custom colors? Chat with Nitika directly on WhatsApp:
              </p>
              <a
                href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20have%20a%20question%20about%20my%20crochet%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#E8F8EE] text-[#1FA952] py-2.5 px-4 text-xs font-bold hover:bg-[#25D366] hover:text-white transition duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </aside>
        </div>

        <StitchDivider variant="loops" color="primary" />
      </Container>
    </div>
  );
}
