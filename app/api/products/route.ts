import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminProducts, getAdminCategories } from "@/lib/admin-store";
import { StockType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const categorySlug = searchParams.get("category");
  const stockType = searchParams.get("stockType");
  const isFeatured = searchParams.get("featured");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
  const skip = (page - 1) * limit;

  try {
    // 1. Build Prisma query filter
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (stockType && Object.values(StockType).includes(stockType as StockType)) {
      where.stockType = stockType as StockType;
    }

    if (isFeatured !== null && isFeatured !== undefined && isFeatured !== "") {
      where.isFeatured = isFeatured === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "name-asc") orderBy = { name: "asc" };

    const dbQueryPromise = Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          variants: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const result = await Promise.race([
      dbQueryPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (result && Array.isArray(result[0]) && result[0].length > 0) {
      const [dbProducts, total] = result;
      return NextResponse.json({
        success: true,
        source: "database",
        data: dbProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      });
    }
  } catch (error) {
    console.warn("Database unavailable for /api/products, using persistent admin store:", error);
  }

  // Fallback to live persistent admin store
  const allProducts = await getAdminProducts();
  const allCategories = await getAdminCategories();

  let filtered = [...allProducts].filter((p) => p.isActive);

  if (categorySlug) {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }

  if (stockType) {
    filtered = filtered.filter((p) => p.stockType === stockType);
  }

  if (isFeatured !== null && isFeatured !== undefined && isFeatured !== "") {
    filtered = filtered.filter((p) => p.isFeatured === (isFeatured === "true"));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  } else if (sort === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  // Attach category object for seamless frontend consumption
  const enrichedProducts = paginated.map((p) => {
    const category = allCategories.find((c) => c.slug === p.categorySlug);
    return {
      ...p,
      category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    };
  });

  return NextResponse.json({
    success: true,
    source: "sample_fallback",
    data: enrichedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}
