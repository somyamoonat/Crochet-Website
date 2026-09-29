"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { ShoppingBag, X, Plus, Minus, Trash2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    hasMadeToOrder,
    maxLeadTimeDays,
  } = useCartStore();

  if (!isOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const containsMadeToOrder = hasMadeToOrder();
  const leadDays = maxLeadTimeDays() || 4;

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="flex h-full w-full max-w-md flex-col bg-[#FBF6EF] shadow-2xl border-l border-[#EBE3D5]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#EBE3D5] bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAECE8] text-brand-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-brand-text">
                Your Basket ({totalItems})
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">Doorstep Hand-Delivery Available</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            aria-label="Close basket"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body: Line Items or Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4 space-y-4">
              <div className="h-20 w-20 rounded-full bg-[#FAF1EA] flex items-center justify-center text-stone-400">
                <ShoppingBag className="h-10 w-10 text-brand-primary/50" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-bold text-brand-text">
                  Your basket is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Explore our cozy collection of handmade amigurumi, floral decor, and bespoke crochet accessories.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleNavigate("/shop")}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Made to Order Advisory Note */}
              {containsMadeToOrder && (
                <div className="rounded-2xl border border-[#F2D7D0] bg-[#FAECE8] p-3 text-xs text-stone-700 flex items-start gap-2.5 shadow-2xs">
                  <Clock className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#9E5740]">Contains Made-to-Order Pieces</p>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                      These treasures will take a little longer as Nitika will handcraft them fresh just for your order (approx. <strong>{leadDays} days</strong> creation time).
                    </p>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const displayName = item.name || item.title || "Crochet Treasure";
                  const isItemMadeToOrder = item.stockType === "MADE_TO_ORDER";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-2xl border border-[#ECE2D2] bg-white p-3 shadow-xs transition hover:border-brand-primary/30"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#FAF1EA] border border-stone-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={displayName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs">
                            🧶
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-brand-text truncate">
                          {displayName}
                        </h4>

                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {item.variant && (
                            <span className="rounded-md bg-[#FAF1EA] px-2 py-0.5 text-[10px] font-semibold text-brand-primary">
                              {item.variant}
                            </span>
                          )}
                          {isItemMadeToOrder && (
                            <span className="rounded-md bg-[#FAECE8] px-1.5 py-0.5 text-[9px] font-medium text-[#9E5740]">
                              Made to Order
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-brand-primary font-bold mt-1">
                          {formatINR(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5 text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-red-500 p-1.5 transition rounded-full hover:bg-red-50 cursor-pointer self-start"
                        aria-label={`Remove ${displayName} from cart`}
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Subtotal and CTAs */}
        {items.length > 0 && (
          <div className="border-t border-[#EBE3D5] bg-white p-5 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-base font-bold text-brand-text">
                <span>Subtotal</span>
                <span>{formatINR(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Taxes included. Free studio pickup & local delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleNavigate("/cart")}
                className="w-full"
              >
                View Full Cart
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleNavigate("/checkout")}
                className="w-full shadow-md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
