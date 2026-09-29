"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/product-skeleton";
import { CategoryPills } from "@/components/product/category-pills";
import {
  Container,
  Card,
  Button,
  Input,
  StitchDivider,
} from "@/components/ui";
import { sampleCategories, sampleProducts, SeedCategory, SeedProduct } from "@/lib/sample-data";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  ShoppingBag,
  Search,
  Filter,
} from "lucide-react";

export interface ShopViewProps {
  initialCategorySlug?: string;
  categoryDetails?: SeedCategory;
  initialProducts?: SeedProduct[];
  initialCategories?: SeedCategory[];
}

export function ShopView({
  initialCategorySlug,
  categoryDetails,
  initialProducts,
  initialCategories,
}: ShopViewProps) {
  const router = useRouter();

  // Dynamic Products and Categories State
  const [products, setProducts] = React.useState<SeedProduct[]>(
    initialProducts || sampleProducts
  );
  const [categories, setCategories] = React.useState<SeedCategory[]>(
    initialCategories || sampleCategories
  );

  // Sync state if server props update
  React.useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
  }, [initialProducts]);

  React.useEffect(() => {
    if (initialCategories) setCategories(initialCategories);
  }, [initialCategories]);

  // Fetch freshest data from /api/products and /api/categories on mount
  React.useEffect(() => {
    let isCancelled = false;
    async function loadFresh() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=100"),
          fetch("/api/categories"),
        ]);
        if (prodRes.ok && !isCancelled) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.data)) {
            setProducts(prodData.data);
          }
        }
        if (catRes.ok && !isCancelled) {
          const catData = await catRes.json();
          if (catData.success && Array.isArray(catData.data)) {
            setCategories(catData.data);
          }
        }
      } catch {
        // use initial
      }
    }
    loadFresh();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Filter States
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    initialCategorySlug || "all"
  );
  const [stockType, setStockType] = React.useState<"ALL" | "READY_TO_SHIP" | "MADE_TO_ORDER">("ALL");
  const [minPrice, setMinPrice] = React.useState<string>("");
  const [maxPrice, setMaxPrice] = React.useState<string>("");
  const [sort, setSort] = React.useState<string>("newest");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false);

  // Loading state for filter switches
  const [isLoading, setIsLoading] = React.useState(false);
  const isFirstRender = React.useRef(true);

  // Sync if initialCategorySlug changes via route
  React.useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  // Brief smooth skeleton loading indicator when switching category, stock, or sort
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [selectedCategory, stockType, sort]);

  // Count active filters
  const activeFiltersCount =
    (selectedCategory !== (initialCategorySlug || "all") ? 1 : 0) +
    (stockType !== "ALL" ? 1 : 0) +
    (minPrice !== "" ? 1 : 0) +
    (maxPrice !== "" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory(initialCategorySlug || "all");
    setStockType("ALL");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setSort("newest");
  };

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
        return false;
      }

      // Stock type filter
      if (stockType !== "ALL" && product.stockType !== stockType) {
        return false;
      }

      // Min Price
      if (minPrice !== "") {
        const min = parseFloat(minPrice);
        const prodPrice = product.price ?? 0;
        if (!isNaN(min) && prodPrice < min) {
          return false;
        }
      }

      // Max Price
      if (maxPrice !== "") {
        const max = parseFloat(maxPrice);
        const prodPrice = product.price ?? 0;
        if (!isNaN(max) && prodPrice > max) {
          return false;
        }
      }

      // Search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      if (sort === "price-asc") return priceA - priceB;
      if (sort === "price-desc") return priceB - priceA;
      // Default: newest
      return 0;
    });
  }, [products, selectedCategory, stockType, minPrice, maxPrice, searchQuery, sort]);

  // Quick price pills helper
  const handleQuickPrice = (min: number | null, max: number | null) => {
    setMinPrice(min !== null ? min.toString() : "");
    setMaxPrice(max !== null ? max.toString() : "");
  };

  // Category change handler (syncs URL if on category page)
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (initialCategorySlug) {
      if (slug === "all") {
        router.push("/shop");
      } else {
        router.push(`/shop/${slug}`);
      }
    }
  };

  return (
    <div className="py-8 md:py-12">
      <Container size="xl" className="space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="font-handwriting text-2xl sm:text-3xl text-brand-primary font-bold">
              {categoryDetails ? "Curated Collection" : "Handcrafted with Love"}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-brand-text">
            {categoryDetails ? categoryDetails.name : "Shop All Creations"}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {categoryDetails
              ? categoryDetails.description
              : "Discover one-of-a-kind crochet treasures handcrafted by Nitika Tanted. Doorstep hand-delivery & custom orders welcome."}
          </p>
        </div>

        {/* Top Control Bar: Search, Mobile Filter Toggle, Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-3xl border border-[#E9DFD0] bg-white p-3 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search crochet plushies, bags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="py-2 text-xs sm:text-sm rounded-full"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* Mobile Filter Sheet Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 bg-[#FAF3EA] text-xs font-semibold text-brand-text hover:border-brand-primary transition"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand-primary" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Control */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border border-stone-300 bg-white px-4 py-2 pr-8 text-xs font-semibold text-brand-text hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
                aria-label="Sort products"
              >
                <option value="newest">✨ Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Horizontal Swipeable Category Navigation Pills */}
        <div className="pt-1">
          <CategoryPills
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        </div>

        {/* Active Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Active filters:</span>

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EBF2EA] text-[#3B4D36] border border-[#D1E0CE] font-medium">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => handleCategoryChange("all")} className="hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {stockType !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAECE8] text-[#9E5740] border border-[#F2D7D0] font-medium">
                Type: {stockType === "READY_TO_SHIP" ? "Ready to Ship" : "Made to Order"}
                <button onClick={() => setStockType("ALL")} className="hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(minPrice !== "" || maxPrice !== "") && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-medium">
                Price: ₹{minPrice || "0"} – ₹{maxPrice || "Any"}
                <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery("")} className="hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-primary hover:underline font-semibold ml-2 inline-flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Clear all
            </button>
          </div>
        )}

        {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (lg+) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <Card className="p-6 space-y-6 border border-[#E9DFD0] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-brand-primary" />
                  <h3 className="font-heading text-base font-bold text-brand-text">Filter Products</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-stone-400 hover:text-brand-primary transition"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div className="space-y-2.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Category
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedCategory === "all"
                        ? "bg-[#FAF1EA] text-brand-primary font-bold"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter((p) => p.categorySlug === cat.slug).length;
                    const isSelected = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                          isSelected
                            ? "bg-[#FAF1EA] text-brand-primary font-bold"
                            : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono ml-2">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Stock Type Filter */}
              <div className="space-y-2.5 pt-4 border-t border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Availability / Stock Type
                </span>
                <div className="space-y-1.5">
                  {[
                    { label: "All Availability", value: "ALL" },
                    { label: "Ready to Ship (In Stock)", value: "READY_TO_SHIP" },
                    { label: "Made to Order (Handmade)", value: "MADE_TO_ORDER" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-brand-text"
                    >
                      <input
                        type="radio"
                        name="stockTypeDesktop"
                        checked={stockType === option.value}
                        onChange={() => setStockType(option.value as "ALL" | "READY_TO_SHIP" | "MADE_TO_ORDER")}
                        className="text-brand-primary focus:ring-brand-primary h-3.5 w-3.5"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Price Range Filter */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Price Range (₹)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min ₹"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="py-1.5 px-3 text-xs rounded-xl"
                  />
                  <Input
                    placeholder="Max ₹"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="py-1.5 px-3 text-xs rounded-xl"
                  />
                </div>

                {/* Quick Price Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => handleQuickPrice(null, 500)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#FAF1EA] text-[11px] text-stone-600 transition"
                  >
                    Under ₹500
                  </button>
                  <button
                    onClick={() => handleQuickPrice(500, 1000)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#FAF1EA] text-[11px] text-stone-600 transition"
                  >
                    ₹500 - ₹1K
                  </button>
                  <button
                    onClick={() => handleQuickPrice(1000, null)}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#FAF1EA] text-[11px] text-stone-600 transition"
                  >
                    ₹1K+
                  </button>
                </div>
              </div>
            </Card>
          </aside>

          {/* Product Grid Area (lg:col-span-9) */}
          <section className="lg:col-span-9 space-y-6">
            {/* Products Count Indicator */}
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>
                Showing <strong className="text-brand-text font-bold">{filteredProducts.length}</strong> items
              </span>
              <span className="text-[11px] text-brand-secondary font-medium">
                📍 Doorstep Hand-Delivery
              </span>
            </div>

            {/* Loading Skeleton State */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="rounded-3xl border border-dashed border-[#E0D5C5] bg-white/70 p-12 text-center space-y-4 max-w-md mx-auto my-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-[#FAF3EA] flex items-center justify-center text-stone-400">
                  <ShoppingBag className="h-8 w-8 text-brand-primary/60" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-xl font-bold text-brand-text">
                    No products match your filters
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Try adjusting your category, price range, or availability filters to discover other handcrafted pieces.
                  </p>
                </div>
                <Button variant="primary" size="md" onClick={handleResetFilters} leftIcon={<RotateCcw className="h-4 w-4" />}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 sm:gap-6">
                {filteredProducts.map((product) => {
                  const category = categories.find((c) => c.slug === product.categorySlug);
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      images={product.images}
                      stockType={product.stockType}
                      leadTimeDays={product.leadTimeDays}
                      categoryName={category?.name}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Mobile Slide-Over Filter Drawer / Sheet */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs lg:hidden">
            <div className="flex h-full w-full max-w-xs sm:max-w-sm flex-col bg-white shadow-2xl">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-brand-primary" />
                  <h3 className="font-heading text-lg font-bold text-brand-text">Filters</h3>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Category
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        selectedCategory === "all" ? "bg-[#FAF1EA] text-brand-primary font-bold" : "text-stone-700"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                          selectedCategory === cat.slug ? "bg-[#FAF1EA] text-brand-primary font-bold" : "text-stone-700"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Type */}
                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Stock Type
                  </span>
                  <div className="space-y-2">
                    {[
                      { label: "All Availability", value: "ALL" },
                      { label: "Ready to Ship (In Stock)", value: "READY_TO_SHIP" },
                      { label: "Made to Order (Handmade)", value: "MADE_TO_ORDER" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-xs text-stone-700">
                        <input
                          type="radio"
                          name="mobileStock"
                          checked={stockType === opt.value}
                          onChange={() => setStockType(opt.value as "ALL" | "READY_TO_SHIP" | "MADE_TO_ORDER")}
                          className="text-brand-primary"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                    Price Range (₹)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min ₹"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="py-1.5 text-xs"
                    />
                    <Input
                      placeholder="Max ₹"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-stone-200 p-4 space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  View {filteredProducts.length} Results
                </Button>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-stone-500"
                    onClick={handleResetFilters}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <StitchDivider variant="loops" color="primary" />
      </Container>
    </div>
  );
}
