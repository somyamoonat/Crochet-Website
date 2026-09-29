"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  Store,
} from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

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
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <Link href="/admin" className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
            🧶 The Crochet Diaryy
          </Link>
          <span className="text-[11px] font-semibold tracking-wide text-brand-secondary bg-[#EBF2EA] px-2 py-0.5 rounded-full border border-[#D1E0CE]">
            Founder Portal
          </span>
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
