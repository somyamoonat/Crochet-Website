import { revalidatePath } from "next/cache";

export function revalidateStoreCatalog(options?: {
  productSlug?: string;
  categorySlug?: string;
}) {
  try {
    // 1. Revalidate static and dynamic catalog pages
    revalidatePath("/", "page");
    revalidatePath("/shop", "page");
    revalidatePath("/shop/[category]", "page");
    revalidatePath("/product/[slug]", "page");

    // 2. Specific slug/category paths if provided
    if (options?.categorySlug) {
      revalidatePath(`/shop/${options.categorySlug}`, "page");
    }

    if (options?.productSlug) {
      revalidatePath(`/product/${options.productSlug}`, "page");
      revalidatePath(`/products/${options.productSlug}`, "page");
      revalidatePath(`/api/products/${options.productSlug}`);
    }

    // 3. API routes consumed by client components
    revalidatePath("/api/products");
    revalidatePath("/api/products/[slug]");
    revalidatePath("/api/categories");
    revalidatePath("/api/admin/products");
    revalidatePath("/api/admin/categories");
    revalidatePath("/api/admin/metrics");
  } catch (err) {
    console.warn("revalidateStoreCatalog encountered error:", err);
  }
}
