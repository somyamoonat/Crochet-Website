import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminCategories, getAdminProducts } from "@/lib/admin-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dbPromise = prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const dbCategories = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (dbCategories && dbCategories.length > 0) {
      return NextResponse.json({
        success: true,
        source: "database",
        data: dbCategories,
        count: dbCategories.length,
      });
    }
  } catch (error) {
    console.warn("Database unavailable for /api/categories, using persistent store:", error);
  }

  // Graceful fallback to persistent categories and products
  const [categories, products] = await Promise.all([
    getAdminCategories(),
    getAdminProducts(),
  ]);

  const fallbackCategories = categories.map((cat) => ({
    ...cat,
    _count: {
      products: products.filter((p) => p.categorySlug === cat.slug).length,
    },
  }));

  return NextResponse.json({
    success: true,
    source: "persistent_store",
    data: fallbackCategories,
    count: fallbackCategories.length,
  });
}
