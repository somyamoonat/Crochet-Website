import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  sampleProducts,
  sampleCategories,
  SeedProduct,
  SeedCategory,
} from "@/lib/sample-data";
import {
  FallbackOrder,
  updateFallbackOrder,
  getAllFallbackOrders,
} from "@/lib/fallback-orders";
import {
  CITY_NAME,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  WHATSAPP_NUMBER,
  FOUNDER_NAME,
} from "@/lib/constants";

export interface AdminProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number | null;
  compareAtPrice?: number | null;
  categorySlug: string;
  images: string[];
  stockType: "READY_TO_SHIP" | "MADE_TO_ORDER";
  stockQty?: number | null;
  leadTimeDays?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
  variants?: {
    id?: string;
    name: string;
    value: string;
    priceDelta?: number;
    stockQty?: number | null;
  }[];
}

export interface AdminCategoryInput {
  name: string;
  slug?: string;
  description: string;
  image?: string;
}

export interface StoreSettings {
  cityName: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  whatsappNumber: string;
  founderName: string;
  studioAddressNote: string;
}

const defaultSettings: StoreSettings = {
  cityName: CITY_NAME,
  deliveryFee: DELIVERY_FEE,
  freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  whatsappNumber: WHATSAPP_NUMBER,
  founderName: FOUNDER_NAME,
  studioAddressNote: "Station Road Studio, Madhya Pradesh - 457001",
};

/* =========================================================================
   PERSISTENT JSON STORAGE FOR LOCAL DEV & PERSISTENCE ACROSS RESTARTS
   ========================================================================= */

const PRODUCTS_FILE = path.join(process.cwd(), ".products-store.json");
const CATEGORIES_FILE = path.join(process.cwd(), ".categories-store.json");
const SETTINGS_FILE = path.join(process.cwd(), ".settings-store.json");

function loadFileStore<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (parsed !== undefined && parsed !== null) return parsed;
    }
  } catch (err) {
    console.warn(`Could not read ${filePath}:`, err);
  }
  const defaultVal = JSON.parse(JSON.stringify(fallback));
  try {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), "utf-8");
  } catch {
    // ignore
  }
  return defaultVal;
}

function saveFileStore<T>(filePath: string, data: T) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`Could not write ${filePath}:`, err);
  }
}


function getLocalProducts(): SeedProduct[] {
  return loadFileStore<SeedProduct[]>(PRODUCTS_FILE, sampleProducts);
}

function setLocalProducts(products: SeedProduct[]) {
  saveFileStore(PRODUCTS_FILE, products);
}

function getLocalCategories(): SeedCategory[] {
  return loadFileStore<SeedCategory[]>(CATEGORIES_FILE, sampleCategories);
}

function setLocalCategories(categories: SeedCategory[]) {
  saveFileStore(CATEGORIES_FILE, categories);
}

/* =========================================================================
   SETTINGS
   ========================================================================= */

export async function getStoreSettings(): Promise<StoreSettings> {
  return loadFileStore<StoreSettings>(SETTINGS_FILE, defaultSettings);
}

export async function updateStoreSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = {
    ...current,
    ...updates,
  };
  saveFileStore(SETTINGS_FILE, updated);
  return updated;
}

/* =========================================================================
   CATEGORIES CRUD
   ========================================================================= */

export async function getAdminCategories(): Promise<SeedCategory[]> {
  try {
    const dbPromise = prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    const dbCategories = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (dbCategories && dbCategories.length > 0) {
      return dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        image: c.image || "https://placehold.co/600x600/FAF1EA/D98E73?text=Category",
      }));
    }
  } catch (err) {
    console.warn("DB unreachable in getAdminCategories, using local file store:", err);
  }

  return getLocalCategories();
}

export async function createAdminCategory(input: AdminCategoryInput): Promise<SeedCategory> {
  const slug =
    input.slug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  const id = `cat_${Date.now()}`;
  const newCat: SeedCategory = {
    id,
    name: input.name,
    slug,
    description: input.description,
    image: input.image || "https://placehold.co/600x600/FAF1EA/D98E73?text=Category",
  };

  try {
    const dbPromise = prisma.category.create({
      data: {
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        image: newCat.image,
      },
    });
    const dbCat = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);
    if (dbCat) {
      newCat.id = dbCat.id;
    }
  } catch (err) {
    console.warn("DB unreachable in createAdminCategory, saving to local store:", err);
  }

  const categories = getLocalCategories();
  categories.unshift(newCat);
  setLocalCategories(categories);
  return newCat;
}

export async function updateAdminCategory(
  id: string,
  input: Partial<AdminCategoryInput>
): Promise<SeedCategory | null> {
  try {
    const dbPromise = prisma.category.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        image: input.image,
      },
    });
    await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);
  } catch (err) {
    console.warn("DB unreachable in updateAdminCategory, updating local store:", err);
  }

  const list = getLocalCategories();
  const idx = list.findIndex((c) => c.id === id || c.slug === id);
  if (idx !== -1) {
    list[idx] = {
      ...list[idx],
      name: input.name ?? list[idx].name,
      slug: input.slug ?? list[idx].slug,
      description: input.description ?? list[idx].description,
      image: input.image ?? list[idx].image,
    };
    setLocalCategories(list);
    return list[idx];
  }
  return null;
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  try {
    const dbPromise = prisma.category.delete({ where: { id } });
    await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);
  } catch (err) {
    console.warn("DB unreachable in deleteAdminCategory, deleting from local store:", err);
  }

  const list = getLocalCategories();
  const prevLen = list.length;
  const filtered = list.filter((c) => c.id !== id && c.slug !== id);
  setLocalCategories(filtered);
  return filtered.length < prevLen;
}

/* =========================================================================
   PRODUCTS CRUD
   ========================================================================= */

export async function getAdminProducts(): Promise<SeedProduct[]> {
  try {
    const dbPromise = prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const dbProducts = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
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
        variants: p.variants.map((v) => ({
          name: v.name,
          value: v.value,
          priceDelta: v.priceDelta,
          stockQty: v.stockQty ?? undefined,
        })),
      }));
    }
  } catch (err) {
    console.warn("DB unreachable in getAdminProducts, using local file store:", err);
  }

  return getLocalProducts();
}

export async function getAdminProductById(id: string): Promise<SeedProduct | null> {
  try {
    const dbPromise = prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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
      return {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        description: dbProduct.description,
        price: dbProduct.price,
        compareAtPrice: dbProduct.compareAtPrice,
        categorySlug: dbProduct.category?.slug || "",
        images: dbProduct.images,
        stockType: dbProduct.stockType as "READY_TO_SHIP" | "MADE_TO_ORDER",
        stockQty: dbProduct.stockQty,
        leadTimeDays: dbProduct.leadTimeDays,
        isFeatured: dbProduct.isFeatured,
        isActive: dbProduct.isActive,
        variants: dbProduct.variants.map((v) => ({
          name: v.name,
          value: v.value,
          priceDelta: v.priceDelta,
          stockQty: v.stockQty ?? undefined,
        })),
      };
    }
  } catch (err) {
    console.warn("DB unreachable in getAdminProductById, checking local store:", err);
  }

  const list = getLocalProducts();
  return list.find((p) => p.id === id || p.slug === id) || null;
}

export async function createAdminProduct(input: AdminProductInput): Promise<SeedProduct> {
  const slug =
    input.slug?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    input.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  const id = `prod_${Date.now()}`;
  const newProduct: SeedProduct = {
    id,
    name: input.name,
    slug,
    description: input.description,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    categorySlug: input.categorySlug,
    images: input.images.length > 0 ? input.images : ["https://placehold.co/600x600/FAF1EA/D98E73?text=Product"],
    stockType: input.stockType,
    stockQty: input.stockType === "READY_TO_SHIP" ? input.stockQty ?? 0 : null,
    leadTimeDays: input.stockType === "MADE_TO_ORDER" ? input.leadTimeDays ?? 7 : null,
    isFeatured: !!input.isFeatured,
    isActive: input.isActive ?? true,
    variants: (input.variants || []).map((v) => ({
      name: v.name,
      value: v.value,
      priceDelta: v.priceDelta || 0,
      stockQty: v.stockQty ?? undefined,
    })),
  };

  try {
    const category = await prisma.category.findUnique({
      where: { slug: input.categorySlug },
    });

    if (category) {
      const dbPromise = prisma.product.create({
        data: {
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          price: newProduct.price ?? 0,
          compareAtPrice: newProduct.compareAtPrice,
          categoryId: category.id,
          images: newProduct.images,
          stockType: newProduct.stockType,
          stockQty: newProduct.stockQty,
          leadTimeDays: newProduct.leadTimeDays,
          isFeatured: newProduct.isFeatured,
          isActive: newProduct.isActive,
          variants: {
            create: (newProduct.variants || []).map((v) => ({
              name: v.name,
              value: v.value,
              priceDelta: v.priceDelta || 0,
              stockQty: v.stockQty ?? null,
            })),
          },
        },
      });
      const dbProd = await Promise.race([
        dbPromise.catch(() => null),
        new Promise<null>((res) => setTimeout(() => res(null), 1200)),
      ]);
      if (dbProd) {
        newProduct.id = dbProd.id;
      }
    }
  } catch (err) {
    console.warn("DB unreachable in createAdminProduct, saving to local store:", err);
  }

  const list = getLocalProducts();
  list.unshift(newProduct);
  setLocalProducts(list);
  return newProduct;
}

export async function updateAdminProduct(
  id: string,
  input: Partial<AdminProductInput>
): Promise<SeedProduct | null> {
  try {
    const category = input.categorySlug
      ? await prisma.category.findUnique({ where: { slug: input.categorySlug } })
      : null;

    const dbPromise = prisma.product.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        price: input.price !== undefined ? (input.price ?? 0) : undefined,
        compareAtPrice: input.compareAtPrice,
        categoryId: category ? category.id : undefined,
        images: input.images,
        stockType: input.stockType,
        stockQty: input.stockType === "READY_TO_SHIP" ? input.stockQty : null,
        leadTimeDays: input.stockType === "MADE_TO_ORDER" ? input.leadTimeDays : null,
        isFeatured: input.isFeatured,
        isActive: input.isActive,
      },
      include: { category: true, variants: true },
    });

    await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);
  } catch (err) {
    console.warn("DB unreachable in updateAdminProduct, updating local store:", err);
  }

  const list = getLocalProducts();
  const idx = list.findIndex((p) => p.id === id || p.slug === id);
  if (idx !== -1) {
    const current = list[idx];
    const updatedStockType = input.stockType ?? current.stockType;
    list[idx] = {
      ...current,
      name: input.name ?? current.name,
      slug: input.slug ?? current.slug,
      description: input.description ?? current.description,
      price: input.price !== undefined ? input.price : current.price,
      compareAtPrice: input.compareAtPrice !== undefined ? input.compareAtPrice : current.compareAtPrice,
      categorySlug: input.categorySlug ?? current.categorySlug,
      images: input.images ?? current.images,
      stockType: updatedStockType,
      stockQty: updatedStockType === "READY_TO_SHIP" ? input.stockQty ?? current.stockQty : null,
      leadTimeDays: updatedStockType === "MADE_TO_ORDER" ? input.leadTimeDays ?? current.leadTimeDays : null,
      isFeatured: input.isFeatured !== undefined ? input.isFeatured : current.isFeatured,
      isActive: input.isActive !== undefined ? input.isActive : current.isActive,
      variants: input.variants
        ? input.variants.map((v) => ({
            name: v.name,
            value: v.value,
            priceDelta: v.priceDelta || 0,
            stockQty: v.stockQty ?? undefined,
          }))
        : current.variants,
    };
    setLocalProducts(list);
    return list[idx];
  }
  return null;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  try {
    const dbPromise = prisma.product.delete({ where: { id } });
    await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);
  } catch (err) {
    console.warn("DB unreachable in deleteAdminProduct, deleting from local store:", err);
  }

  const list = getLocalProducts();
  const prev = list.length;
  const filtered = list.filter((p) => p.id !== id && p.slug !== id);
  setLocalProducts(filtered);
  return filtered.length < prev;
}

/* =========================================================================
   ORDERS & METRICS
   ========================================================================= */

export async function getAdminOrdersList(filters?: {
  status?: string;
  paymentStatus?: string;
}): Promise<FallbackOrder[]> {
  let list: FallbackOrder[] = [];

  try {
    const dbPromise = prisma.order.findMany({
      where: {
        ...(filters?.status && filters.status !== "ALL" ? { status: filters.status as OrderStatus } : {}),
        ...(filters?.paymentStatus && filters.paymentStatus !== "ALL" ? { paymentStatus: filters.paymentStatus as PaymentStatus } : {}),
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const dbOrders = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (dbOrders && Array.isArray(dbOrders)) {
      list = dbOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        userId: o.userId,
        guestName: o.guestName,
        guestPhone: o.guestPhone,
        guestEmail: o.guestEmail,
        status: o.status as FallbackOrder["status"],
        deliveryType: o.deliveryType as FallbackOrder["deliveryType"],
        addressDetails: null,
        subtotal: o.subtotal,
        deliveryFee: o.deliveryFee,
        total: o.total,
        paymentMethod: o.paymentMethod as FallbackOrder["paymentMethod"],
        paymentStatus: o.paymentStatus as FallbackOrder["paymentStatus"],
        razorpayOrderId: o.razorpayOrderId,
        razorpayPaymentId: o.razorpayPaymentId,
        notes: o.notes,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          orderId: i.orderId,
          productId: i.productId,
          nameSnapshot: i.nameSnapshot,
          priceSnapshot: i.priceSnapshot,
          quantity: i.quantity,
          imageSnapshot: i.imageSnapshot,
        })),
      }));
    }
  } catch (err) {
    console.warn("DB unreachable in getAdminOrdersList, using fallback store:", err);
  }

  // Merge any orders recorded in the persistent local store
  const fallbackList = getAllFallbackOrders();
  const existingOrderNumbers = new Set(list.map((o) => o.orderNumber.toLowerCase()));
  const unmerged = fallbackList.filter((f) => !existingOrderNumbers.has(f.orderNumber.toLowerCase()));

  let combined = [...unmerged, ...list];

  if (filters?.status && filters.status !== "ALL") {
    combined = combined.filter((o) => o.status === filters.status);
  }
  if (filters?.paymentStatus && filters.paymentStatus !== "ALL") {
    combined = combined.filter((o) => o.paymentStatus === filters.paymentStatus);
  }

  // Sort newest first
  combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return combined;
}

export async function updateAdminOrderStatus(
  id: string,
  status: FallbackOrder["status"],
  notes?: string
): Promise<FallbackOrder | null> {
  try {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    if (updated) {
      return updateFallbackOrder(id, { status, notes }) || null;
    }
  } catch (err) {
    console.warn("DB unreachable in updateAdminOrderStatus, updating fallback store:", err);
  }

  return updateFallbackOrder(id, { status, notes }) || null;
}

export async function getDashboardMetrics(): Promise<{
  todayNewOrdersCount: number;
  todayNewOrders: FallbackOrder[];
  thisMonthRevenue: number;
  totalOrdersCount: number;
  lowStockProducts: SeedProduct[];
}> {
  const allOrders = await getAdminOrdersList();
  const allProducts = await getAdminProducts();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayOrders = allOrders.filter(
    (o) => new Date(o.createdAt) >= startOfToday
  );

  const thisMonthPaidOrders = allOrders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    return (
      orderDate >= startOfMonth &&
      (o.paymentStatus === "PAID" || o.status === "CONFIRMED" || o.status === "DELIVERED")
    );
  });

  const thisMonthRevenue = thisMonthPaidOrders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  // Low stock products: READY_TO_SHIP with stockQty <= 3
  const lowStockProducts = allProducts.filter(
    (p) =>
      p.isActive &&
      p.stockType === "READY_TO_SHIP" &&
      p.stockQty !== null &&
      p.stockQty !== undefined &&
      p.stockQty <= 3
  );

  return {
    todayNewOrdersCount: todayOrders.length,
    todayNewOrders: todayOrders,
    thisMonthRevenue,
    totalOrdersCount: allOrders.length,
    lowStockProducts,
  };
}
