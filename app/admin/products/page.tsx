"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container, Card, Button } from "@/components/ui";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  Package,
  Star,
  EyeOff,
} from "lucide-react";
import { SeedProduct } from "@/lib/sample-data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<"ALL" | "READY_TO_SHIP" | "MADE_TO_ORDER">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product.");
    } finally {
      setDeletingId(null);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.categorySlug))).filter(Boolean);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStock = stockFilter === "ALL" || p.stockType === stockFilter;
    const matchesCategory = categoryFilter === "ALL" || p.categorySlug === categoryFilter;
    return matchesSearch && matchesStock && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="xl" className="space-y-6">
          {/* Header & New Product CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 text-brand-primary" />
                <span className="font-handwriting text-2xl text-brand-primary">Catalog</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
                Products Inventory
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Manage your handmade crochet items, prices, photo galleries, and stock availability.
              </p>
            </div>

            <Link href="/admin/products/new">
              <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                Add New Product
              </Button>
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="rounded-3xl border border-[#ECE2D2] bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-[#FAF6EF]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/-/g, " ")}
                  </option>
                ))}
              </select>

              {/* Stock Filter Pills */}
              <div className="flex items-center rounded-2xl bg-[#FAF1EA] p-1 border border-stone-200/60 overflow-x-auto">
                {(["ALL", "READY_TO_SHIP", "MADE_TO_ORDER"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStockFilter(tab)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      stockFilter === tab
                        ? "bg-white text-brand-text shadow-2xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    {tab === "ALL" ? "All Types" : tab === "READY_TO_SHIP" ? "Ready to Ship" : "Made to Order"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products List (Mobile Cards + Desktop Rows) */}
          {loading ? (
            <div className="p-16 text-center text-stone-400 text-sm">Loading products catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <Card className="p-12 text-center space-y-4 border border-[#ECE2D2] bg-white rounded-3xl">
              <div className="mx-auto h-14 w-14 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                <Package className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text">No products match your filters</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search query or add a brand new handcrafted item.
              </p>
              <Link href="/admin/products/new">
                <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  Create New Product
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((p) => {
                const coverImage = p.images?.[0] || "https://placehold.co/600x600/FAF1EA/D98E73?text=Product";
                const isReady = p.stockType === "READY_TO_SHIP";
                const isLow = isReady && p.stockQty !== null && p.stockQty !== undefined && p.stockQty <= 3;

                return (
                  <Card
                    key={p.id}
                    className="p-4 sm:p-5 border border-[#ECE2D2] bg-white rounded-2xl hover:shadow-xs transition space-y-3 sm:space-y-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <Image
                            src={coverImage}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-heading text-sm sm:text-base font-bold text-brand-text truncate">
                              {p.name}
                            </h3>
                            {p.isFeatured && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5">
                                <Star className="h-2.5 w-2.5 fill-current" />
                                Featured
                              </span>
                            )}
                            {!p.isActive && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-0.5">
                                <EyeOff className="h-2.5 w-2.5" />
                                Hidden
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <span className="capitalize">{p.categorySlug.replace(/-/g, " ")}</span>
                            <span>•</span>
                            <span className="font-semibold text-brand-text">
                              {p.price ? `₹${p.price.toLocaleString("en-IN")}` : "Custom Price"}
                            </span>
                            {p.compareAtPrice && (
                              <span className="line-through text-stone-400">
                                ₹{p.compareAtPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Stock status badge */}
                      <div className="flex items-center sm:justify-center gap-2">
                        {isReady ? (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              isLow
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-[#EBF2EA] text-[#3B4D36] border-[#D1E0CE]"
                            }`}
                          >
                            <Sparkles className="h-3 w-3" />
                            {p.stockQty === 0
                              ? "Sold Out"
                              : `${p.stockQty} In Stock ${isLow ? "(Low)" : ""}`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAECE8] text-[#9E5740] border-[#F2D7D0]">
                            <Clock className="h-3 w-3" />
                            Made to Order ({p.leadTimeDays || 7}d)
                          </span>
                        )}

                        {p.variants && p.variants.length > 0 && (
                          <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                            {p.variants.length} {p.variants.length === 1 ? "var" : "vars"}
                          </span>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <Link href={`/admin/products/${encodeURIComponent(p.id)}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-bold"
                            leftIcon={<Edit2 className="h-3 w-3" />}
                          >
                            Edit
                          </Button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
