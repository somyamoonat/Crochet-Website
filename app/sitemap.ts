import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { sampleCategories } from "@/lib/sample-data";
import { getBaseUrl } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // Static marketing and informational routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic Categories
  let categorySlugs: string[] = sampleCategories.map((c) => c.slug);
  try {
    const dbCategories = await prisma.category.findMany({ select: { slug: true } });
    if (dbCategories.length > 0) {
      categorySlugs = Array.from(new Set([...categorySlugs, ...dbCategories.map((c) => c.slug)]));
    }
  } catch (err) {
    console.warn("Sitemap: Database categories fallback to sample data:", err);
  }

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Products
  let productsList: { slug: string; lastModified?: Date }[] = [];

  try {
    const dbProducts = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, createdAt: true },
    });
    productsList = dbProducts.map((p) => ({
      slug: p.slug,
      lastModified: p.createdAt,
    }));
  } catch (err) {
    console.warn("Sitemap: Database products query:", err);
  }

  const productRoutes: MetadataRoute.Sitemap = productsList.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.lastModified || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
