"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { SeedProduct } from "@/lib/sample-data";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  { label: "💐 Tulip Bouquets", query: "tulip" },
  { label: "🧸 Plushies & Bunnies", query: "bunny" },
  { label: "👜 Daisy Bags", query: "tote" },
  { label: "🌻 Sunflower Coasters", query: "sunflower" },
  { label: "🥑 Cute Keychains", query: "keychain" },
  { label: "👒 Bucket Hats", query: "hat" },
];

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Load products once for instant client-side search
  useEffect(() => {
    let isCancelled = false;
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products?limit=100");
        if (res.ok && !isCancelled) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setProducts(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load products for search", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    if (isOpen && products.length === 0) {
      fetchProducts();
    }
    return () => {
      isCancelled = true;
    };
  }, [isOpen, products.length]);

  // Filter matching products
  const searchResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCat = p.categorySlug?.toLowerCase().includes(q);
      return matchName || matchDesc || matchCat;
    }).slice(0, 6); // Top 6 quick results
  }, [query, products]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  const handleFullSearch = (searchQuery: string) => {
    onClose();
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      handleFullSearch(query);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-start bg-black/40 backdrop-blur-xs p-3 pt-6 sm:p-6 sm:pt-16 animate-in fade-in duration-200">
          {/* Backdrop Click to close */}
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-[#ECE2D2] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Search Input Header */}
            <div className="p-4 border-b border-stone-100 flex items-center gap-3 bg-[#FAF6EF]/50">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search bouquets, plushies, totes..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full border border-stone-200 bg-white text-sm text-brand-text placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-600 transition"
                    aria-label="Clear search query"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="text-xs font-semibold text-stone-600 hover:text-brand-primary px-2 py-1.5 transition shrink-0"
              >
                Cancel
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* If no query yet: Show Trending Quick Picks */}
              {!query.trim() && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                    <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                    <span>Popular Searches</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setQuery(item.query);
                          handleFullSearch(item.query);
                        }}
                        className="rounded-full bg-[#FAF3EA] border border-[#ECE2D2] px-3.5 py-1.5 text-xs font-semibold text-brand-text hover:border-brand-primary hover:bg-[#FAECE8] hover:text-brand-primary transition cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Doorstep Hand-Delivery & Studio Pickup</span>
                    <button
                      onClick={() => handleFullSearch("")}
                      className="text-brand-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Browse All</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* If query has matches: Show Results List */}
              {query.trim() && searchResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                    <span>Matching Handmade Pieces</span>
                    <button
                      onClick={() => handleFullSearch(query)}
                      className="text-brand-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View all {searchResults.length}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {searchResults.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.slug)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF6EF] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-[#FAF1EA] shrink-0 border border-stone-200">
                            {prod.images && prod.images.length > 0 ? (
                              <Image
                                src={prod.images[0]}
                                alt={prod.name}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-105 transition"
                                sizes="48px"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-lg">
                                🧶
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-heading text-sm font-bold text-brand-text truncate group-hover:text-brand-primary transition">
                              {prod.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-extrabold text-brand-primary">
                                {formatINR(prod.price || 0)}
                              </span>
                              {prod.stockType === "READY_TO_SHIP" ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                                  <ShieldCheck className="h-2.5 w-2.5" />
                                  Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-md">
                                  <Clock className="h-2.5 w-2.5" />
                                  Made to order
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleFullSearch(query)}
                    className="w-full mt-2 py-2.5 text-center text-xs font-bold text-brand-primary bg-[#FAF1EA] hover:bg-[#FAECE8] rounded-xl transition"
                  >
                    Search all results for &ldquo;{query}&rdquo; →
                  </button>
                </div>
              )}

              {/* If query has NO matches: Friendly empty state */}
              {query.trim() && searchResults.length === 0 && !isLoading && (
                <div className="py-8 text-center space-y-2">
                  <span className="text-3xl">🧶</span>
                  <p className="font-heading text-sm font-bold text-brand-text">
                    No creations found for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Nitika also takes bespoke custom orders! Have something specific in mind?
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/919770124355?text=${encodeURIComponent(
                        `Hi Nitika! I searched for "${query}" on The Crochet Diaryy. Can you crochet a custom piece like this?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F8EE] text-[#1FA952] border border-[#25D366]/40 px-4 py-2 text-xs font-bold hover:bg-[#25D366] hover:text-white transition"
                    >
                      Ask Nitika on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
