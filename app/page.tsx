import React from "react";
import { Metadata } from "next";
import { getAdminProducts, getAdminCategories } from "@/lib/admin-store";
import { HomeView } from "@/components/home/home-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "The Crochet Diaryy | Handcrafted Crochet Gifts & Decor",
  description:
    "Handmade crochet plushies, daisy tote bags, tulip bouquets, and bespoke crochet pieces crafted with love by Nitika Tanted.",
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return <HomeView initialProducts={products} initialCategories={categories} />;
}
