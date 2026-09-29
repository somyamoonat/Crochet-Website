import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminProductById, getAdminCategories } from "@/lib/admin-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const dbPromise = prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
      },
    });

    const product = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (product) {
      return NextResponse.json({
        success: true,
        source: "database",
        data: product,
      });
    }
  } catch (error) {
    console.warn(`Database unavailable for /api/products/${slug}, using persistent store:`, error);
  }

  // Fallback to persistent admin store
  const fallback = await getAdminProductById(slug);
  if (!fallback) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  const allCategories = await getAdminCategories();
  const category = allCategories.find((c) => c.slug === fallback.categorySlug);

  return NextResponse.json({
    success: true,
    source: "persistent_store",
    data: {
      ...fallback,
      category,
      variants: fallback.variants || [],
    },
  });
}
