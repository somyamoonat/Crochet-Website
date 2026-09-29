import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { ShopView } from "@/components/product/shop-view";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-store";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getAdminCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | The Crochet Diaryy",
      robots: { index: false, follow: false },
    };
  }

  const title = `${category.name} | The Crochet Diaryy`;
  const description = `${category.description} Handcrafted in Ratlam with premium hypoallergenic cotton yarn.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/shop/${categorySlug}`,
      siteName: "The Crochet Diaryy",
      images: [
        {
          url: category.image || "/images/hero-showcase.jpg",
          width: 800,
          height: 800,
          alt: `${category.name} collection — The Crochet Diaryy`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [category.image || "/images/hero-showcase.jpg"],
    },
    alternates: {
      canonical: `/shop/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const [categories, products] = await Promise.all([
    getAdminCategories(),
    getAdminProducts(),
  ]);

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <ShopView
          initialCategorySlug={category.slug}
          categoryDetails={category}
          initialProducts={products}
          initialCategories={categories}
        />
      </main>
      <StoreFooter />
    </div>
  );
}
