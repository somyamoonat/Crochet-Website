"use client";

import React, { useRef } from "react";
import { SeedCategory } from "@/lib/sample-data";

interface CategoryPillsProps {
  categories: SeedCategory[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  className?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  all: "✨",
  "amigurumi-toys": "🧸",
  "bags-pouches": "👜",
  "home-decor": "💐",
  "apparel-accessories": "👒",
  "keychains-gifting": "🥑",
};

export function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory,
  className = "",
}: CategoryPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const allItems = [
    {
      id: "all",
      slug: "all",
      name: "All Creations",
      icon: "✨",
    },
    ...categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      icon: CATEGORY_ICONS[c.slug] || "🧶",
    })),
  ];

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 touch-pan-x ${className}`}
      role="tablist"
      aria-label="Filter by category"
    >
      {allItems.map((cat) => {
        const isSelected = selectedCategory === cat.slug;

        return (
          <button
            key={cat.slug}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat.slug)}
            className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer active:scale-95 ${
              isSelected
                ? "bg-brand-primary text-white shadow-xs ring-2 ring-brand-primary/20 scale-[1.02]"
                : "border border-stone-200/90 bg-white text-stone-700 hover:border-brand-primary/40 hover:bg-[#FAF6EF]/70 hover:text-brand-primary shadow-2xs"
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
