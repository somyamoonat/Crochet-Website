import { prisma } from "@/lib/prisma";
import {
  SeedProduct,
  SeedCategory,
  SeedVariant,
} from "@/lib/sample-data";
import {
  getAdminProductById,
  getAdminProducts,
  getAdminCategories,
} from "@/lib/admin-store";

export interface FormattedProductVariant {
  id: string;
  name: string;
  value: string;
  priceDelta: number;
  stockQty?: number | null;
}

export interface FormattedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  compareAtPrice?: number | null;
  categorySlug: string;
  categoryName?: string;
  category?: SeedCategory;
  images: string[];
  stockType: "READY_TO_SHIP" | "MADE_TO_ORDER";
  stockQty?: number | null;
  leadTimeDays?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  isCustom?: boolean;
  variants: FormattedProductVariant[];
}

export async function getProductBySlug(slug: string): Promise<{
  product: FormattedProduct | null;
  relatedProducts: SeedProduct[];
}> {
  try {
    const dbPromise = prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: true,
      },
    });

    const dbProduct = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (dbProduct) {
      const formatted: FormattedProduct = {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        price: dbProduct.price,
        compareAtPrice: dbProduct.compareAtPrice,
        categorySlug: dbProduct.category?.slug || "",
        categoryName: dbProduct.category?.name,
        images: dbProduct.images,
        stockType: dbProduct.stockType as "READY_TO_SHIP" | "MADE_TO_ORDER",
        stockQty: dbProduct.stockQty,
        leadTimeDays: dbProduct.leadTimeDays,
        isFeatured: dbProduct.isFeatured,
        isActive: dbProduct.isActive,
        variants: dbProduct.variants.map((v) => ({
          id: v.id,
          name: v.name,
          value: v.value,
          priceDelta: v.priceDelta,
          stockQty: v.stockQty,
        })),
      };

      // Fetch related products
      const dbRelatedPromise = prisma.product.findMany({
        where: {
          categoryId: dbProduct.categoryId,
          id: { not: dbProduct.id },
          isActive: true,
        },
        include: { category: true },
        take: 4,
      });

      const dbRelated = await Promise.race([
        dbRelatedPromise.catch(() => []),
        new Promise<never[]>((res) => setTimeout(() => res([]), 1200)),
      ]);

      const related: SeedProduct[] = (dbRelated || []).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        categorySlug: p.category?.slug || "",
        images: p.images,
        stockType: p.stockType as "READY_TO_SHIP" | "MADE_TO_ORDER",
        stockQty: p.stockQty,
        leadTimeDays: p.leadTimeDays,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
      }));

      return { product: formatted, relatedProducts: related };
    }
  } catch (error) {
    console.warn(`Database unreachable in getProductBySlug for "${slug}", checking persistent store:`, error);
  }

  // Fallback to persistent admin store
  const sample = await getAdminProductById(slug);
  if (!sample) {
    return { product: null, relatedProducts: [] };
  }

  const allCategories = await getAdminCategories();
  const category = allCategories.find((c) => c.slug === sample.categorySlug);

  const formatted: FormattedProduct = {
    id: sample.id,
    name: sample.name,
    slug: sample.slug,
    description: sample.description,
    price: sample.price ?? null,
    compareAtPrice: sample.compareAtPrice,
    categorySlug: sample.categorySlug,
    categoryName: category?.name,
    category,
    images: sample.images,
    stockType: sample.stockType,
    stockQty: sample.stockQty,
    leadTimeDays: sample.leadTimeDays,
    isFeatured: sample.isFeatured,
    isActive: sample.isActive,
    isCustom: sample.isCustom,
    variants: (sample.variants || []).map((v: SeedVariant, idx: number) => ({
      id: `${sample.id}-var-${idx}`,
      name: v.name,
      value: v.value,
      priceDelta: v.priceDelta || 0,
      stockQty: v.stockQty,
    })),
  };

  // Find 4 related products from persistent store
  const allProducts = await getAdminProducts();
  let related = allProducts.filter(
    (p) => p.categorySlug === sample.categorySlug && p.slug !== sample.slug && p.isActive
  );

  if (related.length < 4) {
    const others = allProducts.filter(
      (p) => p.categorySlug !== sample.categorySlug && p.slug !== sample.slug && p.isActive
    );
    related = [...related, ...others].slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  return { product: formatted, relatedProducts: related };
}
