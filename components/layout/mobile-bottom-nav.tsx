"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { Home, Sparkles, Search, ShoppingBag, MessageCircle } from "lucide-react";
import { MobileSearchModal } from "@/components/layout/mobile-search-modal";

const WHATSAPP_NAV_URL =
  "https://wa.me/919770124355?text=Hi%20Nitika!%20I'm%20browsing%20The%20Crochet%20Diaryy%20and%20had%20a%20question%20%F0%9F%A7%B6";

export function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // HIDE CONDITIONS:
  // 1. Admin dashboard (needs standard admin controls)
  // 2. Checkout & Payment flows (must be 100% distraction-free)
  // 3. Product pages (StickyProductBar takes precedence to avoid duplicate bottom bars)
  if (
    !pathname ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/product/")
  ) {
    return null;
  }

  const isHomeActive = pathname === "/";
  const isShopActive = pathname.startsWith("/shop");

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECE2D2] shadow-[0_-4px_20px_rgba(43,36,32,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+6px)] pt-1.5 transition-transform duration-200"
      >
        <div className="max-w-md mx-auto px-4 flex items-center justify-around">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 ${
              isHomeActive
                ? "text-brand-primary font-bold"
                : "text-stone-500 hover:text-brand-primary"
            }`}
          >
            <div className="relative">
              <Home className={`h-5 w-5 ${isHomeActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {isHomeActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
          </Link>

          {/* 2. Shop */}
          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition duration-150 ${
              isShopActive
                ? "text-brand-primary font-bold"
                : "text-stone-500 hover:text-brand-primary"
            }`}
          >
            <div className="relative">
              <Sparkles className={`h-5 w-5 ${isShopActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {isShopActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Shop</span>
          </Link>

          {/* 3. Search */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-500 hover:text-brand-primary transition duration-150 cursor-pointer"
            aria-label="Search creations"
          >
            <Search className="h-5 w-5 stroke-[1.8]" />
            <span className="text-[10px] mt-1 tracking-tight">Search</span>
          </button>

          {/* 4. Basket */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-500 hover:text-brand-primary transition duration-150 cursor-pointer"
            aria-label={`Open shopping basket with ${totalItems} items`}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-brand-primary text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs animate-in zoom-in">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Basket</span>
          </button>

          {/* 5. WhatsApp */}
          <a
            href={WHATSAPP_NAV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-stone-500 hover:text-[#1fa952] transition duration-150"
            aria-label="Chat with Nitika on WhatsApp"
          >
            <div className="relative">
              <MessageCircle className="h-5 w-5 text-[#25D366] fill-[#25D366]/20 stroke-[2]" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight text-[#1fa952] font-semibold">Chat</span>
          </a>
        </div>
      </nav>

      {/* Global Search Modal Overlay */}
      <MobileSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
