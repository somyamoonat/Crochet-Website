import React from "react";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container } from "@/components/ui";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminProductById } from "@/lib/admin-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="xl" className="space-y-6">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
              Edit Product: {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Update pricing, inventory stock counts, Cloudinary photos, and variant options.
            </p>
          </div>

          <ProductForm initialData={product} isEdit={true} />
        </Container>
      </main>
    </div>
  );
}
