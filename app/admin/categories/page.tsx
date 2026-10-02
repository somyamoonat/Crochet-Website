"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container, Card, Button, Input, Textarea } from "@/components/ui";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { SeedCategory } from "@/lib/sample-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<SeedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SeedCategory | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("https://placehold.co/600x600/FAF1EA/D98E73?text=Category");
    setError(null);
    setShowAddForm(true);
  };

  const handleStartEdit = (cat: SeedCategory) => {
    setShowAddForm(false);
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        image: image.trim() || undefined,
      };

      if (editingCategory) {
        // Edit existing
        const res = await fetch(`/api/admin/categories/${encodeURIComponent(editingCategory.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories(categories.map((c) => (c.id === editingCategory.id ? data.category : c)));
          setEditingCategory(null);
        } else {
          throw new Error(data.error || "Failed to update category.");
        }
      } else {
        // Create new
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories([data.category, ...categories]);
          setShowAddForm(false);
        } else {
          throw new Error(data.error || "Failed to create category.");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error saving category.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: SeedCategory) => {
    if (!confirm(`Delete category "${cat.name}"? Products in this category may become uncategorized.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(cat.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== cat.id));
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error deleting category.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="xl" className="space-y-6">
          {/* Back to Dashboard Navigation */}
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-primary bg-white hover:bg-[#FAF1EA] px-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-2xs transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FolderTree className="h-5 w-5 text-brand-secondary" />
                <span className="font-handwriting text-2xl text-brand-primary">Collections</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
                Product Categories
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Organize your crochet pieces into clean shop categories for easy browsing.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleStartAdd}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add New Category
            </Button>
          </div>

          {/* Add / Edit Form Modal or Card */}
          {(showAddForm || editingCategory) && (
            <Card className="p-6 border border-brand-primary/30 bg-white rounded-3xl shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-primary" />
                  {editingCategory ? `Edit: ${editingCategory.name}` : "Create New Category"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingCategory(null);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Category Name *"
                    placeholder="e.g. Amigurumi & Toys"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingCategory && !slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    required
                  />

                  <Input
                    label="Slug (URL identifier)"
                    placeholder="e.g. amigurumi-toys"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    helperText="Leave blank to auto-generate"
                  />
                </div>

                <Textarea
                  label="Description"
                  placeholder="Short description shown at the top of category pages..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <Input
                  label="Category Cover Image URL"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCategory(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={saving}
                    disabled={saving}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    {editingCategory ? "Update Category" : "Save Category"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Categories Grid (Mobile-friendly Cards) */}
          {loading ? (
            <div className="p-16 text-center text-stone-400 text-sm">Loading categories...</div>
          ) : categories.length === 0 ? (
            <Card className="p-12 text-center space-y-3 border border-[#ECE2D2] bg-white rounded-3xl">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                <FolderTree className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text">No categories yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Create categories to organize your handcrafted pieces.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Card
                  key={cat.id}
                  className="p-5 border border-[#ECE2D2] bg-white rounded-2xl hover:shadow-xs transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-[#FAF1EA] shrink-0 border border-stone-200">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-brand-primary font-bold">
                            🧶
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-2 text-stone-500 hover:text-brand-primary hover:bg-stone-100 rounded-xl transition"
                          title="Edit category"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Delete category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading text-base font-bold text-brand-text">
                        {cat.name}
                      </h3>
                      <span className="font-mono text-[11px] text-stone-400 block">
                        slug: /{cat.slug}
                      </span>
                      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                        {cat.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                    <span>Store Collection</span>
                    <a
                      href={`/shop/${cat.slug}`}
                      target="_blank"
                      className="font-bold text-brand-primary hover:underline text-[11px]"
                    >
                      View in Shop &rarr;
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
