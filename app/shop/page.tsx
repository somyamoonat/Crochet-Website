import React from "react";
import { Metadata } from "next";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { ShopView } from "@/components/product/shop-view";
import { getAdminProducts, getAdminCategories } from "@/lib/admin-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Shop Handcrafted Crochet | The Crochet Diaryy",
  description:
    "Explore our complete collection of handmade crochet treasures — plush amigurumi, daisy bags, bucket hats, and floral home decor.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <ShopView initialProducts={products} initialCategories={categories} />
      </main>
      <StoreFooter />
    </div>
  );
}
