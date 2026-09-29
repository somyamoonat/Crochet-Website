import { PrismaClient, Role, StockType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sampleCategories, sampleProducts } from "../lib/sample-data";

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log("🌱 Starting The Crochet Diaryy database seeding...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@thecrochetdiaryy.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      phone: "+919770124355",
    },
    create: {
      email: adminEmail,
      name: "Nitika Tanted (Founder & Admin)",
      passwordHash,
      role: Role.ADMIN,
      phone: "+919770124355",
    },
  });

  console.log(`✅ Admin seeded: ${admin.email} (Role: ${admin.role})`);

  // 2. Seed Categories
  const categoryMap = new Map<string, string>();

  for (const cat of sampleCategories) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      },
    });
    categoryMap.set(cat.slug, upserted.id);
  }

  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // 3. Seed Products & Variants
  let seededProductsCount = 0;
  for (const prod of sampleProducts) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug not found for product: ${prod.name}`);
      continue;
    }

    const upsertedProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        price: prod.price ?? 0,
        compareAtPrice: prod.compareAtPrice,
        categoryId,
        images: prod.images,
        stockType: prod.stockType as StockType,
        stockQty: prod.stockQty,
        leadTimeDays: prod.leadTimeDays,
        isFeatured: prod.isFeatured,
        isActive: prod.isActive,
      },
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price ?? 0,
        compareAtPrice: prod.compareAtPrice,
        categoryId,
        images: prod.images,
        stockType: prod.stockType as StockType,
        stockQty: prod.stockQty,
        leadTimeDays: prod.leadTimeDays,
        isFeatured: prod.isFeatured,
        isActive: prod.isActive,
      },
    });

    // Seed Variants if any
    if (prod.variants && prod.variants.length > 0) {
      // Clear existing variants on re-seed
      await prisma.productVariant.deleteMany({
        where: { productId: upsertedProduct.id },
      });

      for (const variant of prod.variants) {
        await prisma.productVariant.create({
          data: {
            productId: upsertedProduct.id,
            name: variant.name,
            value: variant.value,
            priceDelta: variant.priceDelta ?? 0,
            stockQty: variant.stockQty,
          },
        });
      }
    }

    seededProductsCount++;
  }

  console.log(`✅ Seeded ${seededProductsCount} sample products with variants.`);
  console.log("✨ Database seed completed successfully!");
}

if (require.main === module) {
  seedDatabase()
    .catch((error) => {
      console.error("❌ Seeding error:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
