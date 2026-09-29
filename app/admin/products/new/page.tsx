import React from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="xl" className="space-y-6">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
              Add New Crochet Product
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Create a new handcrafted piece for the store. Upload multiple photos, set lead times, and define color variants.
            </p>
          </div>

          <ProductForm isEdit={false} />
        </Container>
      </main>
    </div>
  );
}
