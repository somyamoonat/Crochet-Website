import React from "react";
import { Metadata } from "next";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { CartPageView } from "@/components/cart/cart-page-view";

export const metadata: Metadata = {
  title: "Shopping Basket | The Crochet Diaryy",
  description:
    "Review your handcrafted crochet treasures, customize quantities, and proceed to secure checkout with convenient delivery options.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <CartPageView />
      </main>
      <StoreFooter />
    </div>
  );
}
