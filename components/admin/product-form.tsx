"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Textarea, Select } from "@/components/ui";
import { CloudinaryUploadWidget } from "@/components/admin/cloudinary-upload-widget";
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Layers,
} from "lucide-react";
import { SeedCategory } from "@/lib/sample-data";

interface ProductVariantFormItem {
  id?: string;
  name: string;
  value: string;
  priceDelta?: number;
  stockQty?: number | null;
}

interface ProductFormInitialData {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number | null;
  compareAtPrice?: number | null;
  categorySlug?: string;
  images?: string[];
  stockType?: "READY_TO_SHIP" | "MADE_TO_ORDER";
  stockQty?: number | null;
  leadTimeDays?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
  variants?: ProductVariantFormItem[];
}

interface ProductFormProps {
  initialData?: ProductFormInitialData;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<SeedCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState<string>(initialData?.price !== undefined && initialData?.price !== null ? String(initialData.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState<string>(initialData?.compareAtPrice ? String(initialData.compareAtPrice) : "");
  const [categorySlug, setCategorySlug] = useState(initialData?.categorySlug || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [stockType, setStockType] = useState<"READY_TO_SHIP" | "MADE_TO_ORDER">(initialData?.stockType || "READY_TO_SHIP");
  const [stockQty, setStockQty] = useState<string>(initialData?.stockQty !== undefined && initialData?.stockQty !== null ? String(initialData.stockQty) : "5");
  const [leadTimeDays, setLeadTimeDays] = useState<string>(initialData?.leadTimeDays ? String(initialData.leadTimeDays) : "7");
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true);
  const [variants, setVariants] = useState<ProductVariantFormItem[]>(initialData?.variants || []);

  useEffect(() => {
    let isCancelled = false;

    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const res = await fetch("/api/admin/categories");
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data.success && Array.isArray(data.categories)) {
            setCategories(data.categories);
            if (!categorySlug && data.categories.length > 0) {
              setCategorySlug(data.categories[0].slug);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (!isCancelled) setLoadingCategories(false);
      }
    }

    loadCategories();
    return () => {
      isCancelled = true;
    };
  }, [categorySlug]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        name: "Color",
        value: "",
        priceDelta: 0,
        stockQty: stockType === "READY_TO_SHIP" ? 5 : undefined,
      },
    ]);
  };

  const handleUpdateVariant = (index: number, updates: Partial<ProductVariantFormItem>) => {
    const next = [...variants];
    next[index] = { ...next[index], ...updates };
    setVariants(next);
  };

  const handleRemoveVariant = (index: number) => {
    const next = [...variants];
    next.splice(index, 1);
    setVariants(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }

    if (!categorySlug) {
      setErrorMessage("Please select a category.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        price: price ? Number(price) : null,
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        categorySlug,
        images,
        stockType,
        stockQty: stockType === "READY_TO_SHIP" ? Number(stockQty) || 0 : null,
        leadTimeDays: stockType === "MADE_TO_ORDER" ? Number(leadTimeDays) || 7 : null,
        isFeatured,
        isActive,
        variants: variants.filter((v) => v.value.trim() !== ""),
      };

      const endpoint = isEdit && initialData?.id
        ? `/api/admin/products/${encodeURIComponent(initialData.id)}`
        : "/api/admin/products";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error saving product";
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Top Bar with Back and Save button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-primary transition"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to All Products
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="ghost" size="md">
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={submitting}
            disabled={submitting}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {isEdit ? "Update Product" : "Publish Product"}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic Info, Images, Variants (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-5">
            <h2 className="font-heading text-lg font-bold text-brand-text">
              Product Details
            </h2>

            <div className="space-y-4">
              <Input
                label="Product Name *"
                placeholder="e.g. Classic Daisy Charm Tote Bag"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="URL Slug (Optional)"
                  placeholder="e.g. daisy-charm-tote-bag"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  helperText="Leave empty to automatically generate from name"
                />

                <Select
                  label="Category *"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c.slug,
                  }))}
                  disabled={loadingCategories}
                />
              </div>

              <Textarea
                label="Full Description"
                placeholder="Describe yarn material, dimensions, care instructions, and what makes it special..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </Card>

          {/* Card 2: Cloudinary & Product Photos */}
          <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-text">
                  Product Photos
                </h2>
                <p className="text-xs text-stone-500">
                  Upload multiple photos. The first image will be used as the store cover. Drag to reorder.
                </p>
              </div>
            </div>

            <CloudinaryUploadWidget
              images={images}
              onChange={(newImages) => setImages(newImages)}
            />
          </Card>

          {/* Card 3: Variants (Color/Size options) */}
          <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                  <Layers className="h-5 w-5 text-brand-primary" />
                  Product Variants (Optional)
                </h2>
                <p className="text-xs text-stone-500">
                  Add color or size variations for this piece (e.g. Lavender, Blush Pink, Beige).
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Option
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-xs text-stone-400 italic bg-[#FAF6EF] p-4 rounded-2xl border border-stone-200/60 text-center">
                No variants added yet. This product has a single standard option.
              </p>
            ) : (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 sm:gap-3 p-3.5 rounded-2xl bg-[#FAF6EF] border border-stone-200/80 items-center"
                  >
                    <div className="col-span-4 sm:col-span-3">
                      <Input
                        label="Option Type"
                        placeholder="Color or Size"
                        value={v.name}
                        onChange={(e) =>
                          handleUpdateVariant(idx, { name: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-4">
                      <Input
                        label="Value"
                        placeholder="e.g. Oatmeal Beige"
                        value={v.value}
                        onChange={(e) =>
                          handleUpdateVariant(idx, { value: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-3">
                      <Input
                        label="Price +/-"
                        type="number"
                        placeholder="0"
                        value={String(v.priceDelta)}
                        onChange={(e) =>
                          handleUpdateVariant(idx, {
                            priceDelta: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                        title="Remove variant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Pricing, Inventory & Status (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Pricing */}
          <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-brand-text">Pricing</h2>

            <div className="space-y-3">
              <Input
                label="Price (₹ INR)"
                type="number"
                placeholder="e.g. 1499"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                helperText="Leave empty to mark as Custom Price (WhatsApp Enquiry)"
              />

              <Input
                label="Compare at Price (Strikethrough)"
                type="number"
                placeholder="e.g. 1799"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                helperText="Shown struck through as an original price"
              />
            </div>
          </Card>

          {/* Card: Stock Type & Inventory */}
          <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-brand-text">
              Inventory & Fulfillment
            </h2>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-stone-700 block">
                Fulfillment Type
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStockType("READY_TO_SHIP")}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                    stockType === "READY_TO_SHIP"
                      ? "border-brand-primary bg-[#FAF1EA] ring-2 ring-brand-primary/20"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-[#4A5D45]" />
                  <span className="text-xs font-bold text-brand-text">Ready to Ship</span>
                  <span className="text-[10px] text-stone-500">In stock</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStockType("MADE_TO_ORDER")}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                    stockType === "MADE_TO_ORDER"
                      ? "border-brand-primary bg-[#FAF1EA] ring-2 ring-brand-primary/20"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <Clock className="h-4 w-4 text-brand-primary" />
                  <span className="text-xs font-bold text-brand-text">Made to Order</span>
                  <span className="text-[10px] text-stone-500">Crafted on order</span>
                </button>
              </div>

              {stockType === "READY_TO_SHIP" ? (
                <Input
                  label="Units in Stock *"
                  type="number"
                  placeholder="e.g. 5"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  helperText="Quantities &le; 3 will show a low stock alert on your dashboard."
                  required
                />
              ) : (
                <Input
                  label="Lead Time (Days to Handcraft) *"
                  type="number"
                  placeholder="e.g. 7"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  helperText="Shown to customer on product page and in checkout timeline."
                  required
                />
              )}
            </div>
          </Card>

          {/* Card: Visibility & Badges */}
          <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
            <h2 className="font-heading text-lg font-bold text-brand-text">Visibility</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-[#FAF6EF] border border-stone-200/80">
                <div>
                  <span className="text-xs font-bold text-brand-text block">
                    Featured Product
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Feature on homepage grid
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-[#FAF6EF] border border-stone-200/80">
                <div>
                  <span className="text-xs font-bold text-brand-text block">
                    Active in Storefront
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Visible to customers
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 accent-brand-primary rounded cursor-pointer"
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
