"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  Store,
  ChevronDown,
  ShoppingBag,
  User,
  LogOut,
  ExternalLink,
} from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <header className="border-b border-stone-200/90 bg-white/95 px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <Link href="/admin" className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
            🧶 The Crochet Diaryy
          </Link>

          {/* Founder Portal Interactive Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-[11px] font-semibold tracking-wide text-brand-secondary bg-[#EBF2EA] hover:bg-[#DEEBDC] px-3 py-1 rounded-full border border-[#D1E0CE] transition flex items-center gap-1.5 cursor-pointer shadow-2xs select-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span>Founder Portal</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-brand-secondary transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header Info */}
                <div className="px-4 py-2.5 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-brand-text">
                      Nitika&apos;s Studio
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Founder Active
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">Control panel &amp; storefront switch</p>
                </div>

                {/* Switch to Storefront Options */}
                <div className="p-1.5 space-y-0.5">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
                    Switch to Storefront
                  </span>

                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-brand-text hover:bg-[#FAF1EA] hover:text-brand-primary transition group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#FAF1EA] text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition shrink-0">
                      <Store className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold flex items-center justify-between">
                        <span>Visit Storefront</span>
                        <ExternalLink className="h-3 w-3 text-stone-400 opacity-60 group-hover:opacity-100 transition" />
                      </div>
                      <p className="text-[10px] text-stone-500 truncate font-normal">Customer home page</p>
                    </div>
                  </Link>

                  <Link
                    href="/shop"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-brand-text hover:bg-[#FAF1EA] hover:text-brand-primary transition group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#FAF1EA] text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition shrink-0">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold flex items-center justify-between">
                        <span>Browse Shop Catalog</span>
                        <ExternalLink className="h-3 w-3 text-stone-400 opacity-60 group-hover:opacity-100 transition" />
                      </div>
                      <p className="text-[10px] text-stone-500 truncate font-normal">Full customer catalog</p>
                    </div>
                  </Link>

                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-brand-text hover:bg-[#FAF1EA] hover:text-brand-primary transition group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#FAF1EA] text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold">Customer Account View</div>
                      <p className="text-[10px] text-stone-500 truncate font-normal">Your user profile &amp; order history</p>
                    </div>
                  </Link>
                </div>

                <div className="my-1 border-t border-stone-100" />

                {/* Admin Management Shortcuts */}
                <div className="p-1.5 space-y-0.5">
                  <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-stone-400 uppercase block">
                    Admin Navigation
                  </span>

                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-stone-500" />
                    <span>Dashboard Overview</span>
                  </Link>

                  <Link
                    href="/admin/products"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    <Package className="h-3.5 w-3.5 text-stone-500" />
                    <span>Products Inventory</span>
                  </Link>

                  <Link
                    href="/admin/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 text-stone-500" />
                    <span>Orders Management</span>
                  </Link>

                  <Link
                    href="/admin/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    <Settings className="h-3.5 w-3.5 text-stone-500" />
                    <span>Store Settings &amp; Delivery</span>
                  </Link>
                </div>

                <div className="my-1 border-t border-stone-100" />

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out of Founder Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto text-xs sm:text-sm font-medium pb-1 sm:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                  isActive
                    ? "bg-[#FAF1EA] text-brand-primary font-bold shadow-2xs"
                    : "text-stone-600 hover:text-brand-primary hover:bg-stone-100/70"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-brand-primary hover:bg-brand-primary/10 transition ml-2 border border-brand-primary/20 whitespace-nowrap"
          >
            <Store className="h-4 w-4" />
            <span>Storefront</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
