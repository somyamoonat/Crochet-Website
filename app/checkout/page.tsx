import React from "react";
import { Metadata } from "next";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | The Crochet Diaryy",
  description:
    "Complete your handcrafted crochet order with convenient doorstep delivery or studio pickup.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <CheckoutForm />
      </main>
      <StoreFooter />
    </div>
  );
}
