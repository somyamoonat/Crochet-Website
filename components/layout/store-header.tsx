"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ShoppingBag, User, Menu, X, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function StoreHeader() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: session } = useSession();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on resize to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#EBE3D5] bg-[#FBF6EF]/90 backdrop-blur-md">
        {/* Subtle top announcement bar */}
        <div className="bg-[#D98E73] text-white text-[11px] font-medium py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <span>✨ Handcrafted with Love • Doorstep Delivery Available</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Self-Pickup Available</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Made to Order Keepsakes</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-stone-200/80 bg-white/70 text-stone-700 hover:border-brand-primary hover:text-brand-primary transition cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo & Tagline */}
            <Link href="/" className="flex flex-col group">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-brand-text group-hover:text-brand-primary transition">
                🧶 The Crochet Diaryy
              </span>
              <span className="font-handwriting text-sm text-brand-primary -mt-1">
                Handcrafted with Love
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
            <Link href="/shop" className="text-brand-primary font-bold hover:underline transition underline-offset-4">
              Shop Boutique
            </Link>
            <Link href="/about" className="hover:text-brand-primary transition">
              Our Story
            </Link>
            <Link href="/faq" className="hover:text-brand-primary transition">
              FAQs
            </Link>
            <Link href="/contact" className="hover:text-brand-primary transition">
              Contact
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account / Login */}
            <Link
              href={session?.user ? "/account" : "/login"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200/80 bg-white/70 text-xs font-semibold text-stone-700 hover:border-brand-primary hover:text-brand-primary transition"
              aria-label="User Account"
            >
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {session?.user ? (session.user.name?.split(" ")[0] || "Account") : "Sign In"}
              </span>
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center h-10 w-10 rounded-full bg-brand-text text-white hover:bg-brand-primary transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
              aria-label={`Open Cart (${mounted ? totalItems : 0} items)`}
            >
              <ShoppingBag className="h-4 w-4" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FBF6EF] shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAE1D3] bg-[#FAF4EC] px-4 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3 font-medium text-stone-800">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EAE1D3] text-brand-primary font-bold shadow-2xs"
              >
                <span>🛍️ Explore Shop Boutique</span>
                <span className="text-xs">&rarr;</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/70 border border-[#EAE1D3] hover:bg-white text-stone-800 transition"
              >
                🧶 Meet Nitika (Our Story)
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/70 border border-[#EAE1D3] hover:bg-white text-stone-800 transition"
              >
                ❓ FAQs &amp; Crochet Care Guide
              </Link>
              <Link
                href="/policies"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/70 border border-[#EAE1D3] hover:bg-white text-stone-800 transition"
              >
                📜 Delivery &amp; Return Policies
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/70 border border-[#EAE1D3] hover:bg-white text-stone-800 transition"
              >
                💌 Contact &amp; Custom Orders
              </Link>
              <Link
                href={session?.user ? "/account" : "/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/70 border border-[#EAE1D3] hover:bg-white text-stone-800 transition flex items-center justify-between"
              >
                <span>👤 {session?.user ? "My Orders & Account" : "Sign In to Account"}</span>
                <span className="text-xs text-stone-400">&rarr;</span>
              </Link>
            </nav>

            {/* Quick Contact Buttons for Instagram Visitors */}
            <div className="pt-5 mt-4 border-t border-stone-200/80 space-y-2">
              <a
                href="https://wa.me/919770124355?text=Hi%20Nitika!%20I'm%20visiting%20from%20Instagram."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#E8F8EE] border border-[#25D366]/40 text-[#1FA952] text-xs font-bold transition hover:bg-[#d8f4e2]"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>Chat with Nitika on WhatsApp</span>
              </a>

              <a
                href="https://instagram.com/the_crochetdiaryy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-[#FAF1EA] border border-brand-primary/40 text-brand-primary text-xs font-bold transition hover:bg-[#f5e3d7]"
              >
                <InstagramIcon className="h-4 w-4" />
                <span>Follow @the_crochetdiaryy</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
