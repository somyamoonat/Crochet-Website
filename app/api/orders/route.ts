import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  saveFallbackOrder,
  getAllFallbackOrders,
  getFallbackOrdersByUserId,
  FallbackOrder,
} from "@/lib/fallback-orders";
import { sendOrderConfirmationEmails } from "@/lib/email";
import { z } from "zod";

const createOrderSchema = z.object({
  name: z.string().min(2),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().min(10),
  deliveryType: z.enum(["DELIVERY", "PICKUP"]),
  paymentMethod: z.enum(["RAZORPAY", "PAY_ON_DELIVERY"]).default("RAZORPAY"),
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  notes: z.string().optional(),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().nullable().optional(),
      name: z.string(),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      image: z.string().optional(),
    })
  ).min(1, "Order must contain at least one item"),
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const isAdmin = (session.user as { role?: string }).role === "ADMIN";

    let dbOrders: FallbackOrder[] = [];

    // 1. Try PostgreSQL
    try {
      let dbUserId = userId;
      if (userEmail && !isAdmin) {
        try {
          const dbUser = await prisma.user.findFirst({
            where: {
              OR: [
                ...(userId ? [{ id: userId }] : []),
                { email: { equals: userEmail.trim(), mode: "insensitive" } },
              ],
            },
            select: { id: true },
          });
          if (dbUser) dbUserId = dbUser.id;
        } catch {
          // ignore
        }
      }

      const fetched = await prisma.order.findMany({
        where: isAdmin
          ? {}
          : {
              OR: [
                ...(userId ? [{ userId }] : []),
                ...(dbUserId && dbUserId !== userId ? [{ userId: dbUserId }] : []),
                ...(userEmail
                  ? [{ guestEmail: { equals: userEmail.trim(), mode: "insensitive" as const } }]
                  : []),
              ],
            },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (Array.isArray(fetched)) {
        dbOrders = fetched.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          userId: o.userId,
          guestName: o.guestName,
          guestPhone: o.guestPhone,
          guestEmail: o.guestEmail,
          status: o.status,
          deliveryType: o.deliveryType,
          subtotal: o.subtotal,
          deliveryFee: o.deliveryFee,
          total: o.total,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          razorpayOrderId: o.razorpayOrderId,
          razorpayPaymentId: o.razorpayPaymentId,
          notes: o.notes,
          createdAt: o.createdAt.toISOString(),
          items: o.items.map((i) => ({
            id: i.id,
            orderId: i.orderId,
            productId: i.productId,
            name: i.nameSnapshot,
            nameSnapshot: i.nameSnapshot,
            price: i.priceSnapshot,
            priceSnapshot: i.priceSnapshot,
            quantity: i.quantity,
            image: i.imageSnapshot,
            imageSnapshot: i.imageSnapshot,
          })),
        }));
      }
    } catch (dbError) {
      console.warn("Database unavailable in GET /api/orders, querying fallback only:", dbError);
    }

    // 2. Fallback in-memory/file list
    const fallbackList = isAdmin
      ? getAllFallbackOrders()
      : getFallbackOrdersByUserId(userId, userEmail);

    // Merge database orders with persistent fallback orders (deduplicated by orderNumber)
    const existingOrderNumbers = new Set(dbOrders.map((o) => o.orderNumber.toLowerCase()));
    const unmergedFallback = fallbackList
      .filter((f) => !existingOrderNumbers.has(f.orderNumber.toLowerCase()))
      .map((f) => ({
        ...f,
        items: f.items.map((i) => ({
          ...i,
          name: i.nameSnapshot,
          price: i.priceSnapshot,
          image: i.imageSnapshot,
        })),
      }));

    const combinedOrders = [...dbOrders, ...unmergedFallback].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      orders: combinedOrders,
      source: dbOrders.length > 0 ? "database+fallback" : "fallback",
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const parseResult = createOrderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const orderNumber = `CD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
    const initialStatus = data.paymentMethod === "PAY_ON_DELIVERY" ? "CONFIRMED" : "RECEIVED";
    const orderCustomerEmail = data.email?.trim() || session?.user?.email?.trim() || null;

    const addressJson = data.deliveryType === "DELIVERY"
      ? JSON.stringify({
          line1: data.line1,
          line2: data.line2,
          city: data.city || "Ratlam",
          pincode: data.pincode,
          customerNotes: data.notes || "",
        })
      : JSON.stringify({
          type: "PICKUP",
          note: "Self-Pickup at Nitika Tanted's Studio in Ratlam",
          customerNotes: data.notes || "",
        });

    // Helper to fire emails safely in background
    const triggerEmails = () => {
      sendOrderConfirmationEmails({
        orderNumber,
        customerName: data.name,
        customerEmail: orderCustomerEmail,
        customerPhone: data.phone,
        deliveryType: data.deliveryType,
        deliveryAddress: data.deliveryType === "DELIVERY"
          ? {
              line1: data.line1,
              line2: data.line2,
              city: data.city || "Ratlam",
              pincode: data.pincode,
            }
          : null,
        items: data.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          variant: i.variantId || null,
        })),
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "PAY_ON_DELIVERY" ? "PENDING" : "PENDING",
        customerNotes: data.notes || null,
      }).catch((err) => console.warn("Background email notification error:", err));
    };

    // 1. Try writing to PostgreSQL with timeout and safe foreign-key resolution
    try {
      // Safely resolve userId against PostgreSQL User table to prevent FK failure
      let resolvedUserId: string | null = null;
      if (session?.user) {
        try {
          const userConditions = [];
          if (session.user.id) userConditions.push({ id: session.user.id });
          if (session.user.email) {
            userConditions.push({
              email: { equals: session.user.email.trim(), mode: "insensitive" as const },
            });
          }
          if (userConditions.length > 0) {
            const dbUser = await prisma.user.findFirst({
              where: { OR: userConditions },
              select: { id: true },
            });
            if (dbUser) resolvedUserId = dbUser.id;
          }
        } catch (uErr) {
          console.warn("Could not resolve userId from DB:", uErr);
        }
      }

      // Safely resolve product and variant IDs to ensure Prisma doesn't fail foreign keys
      let dbProducts: Array<{ id: string; slug: string; variants: Array<{ id: string }> }> = [];
      try {
        dbProducts = await prisma.product.findMany({
          select: { id: true, slug: true, variants: { select: { id: true } } },
        });
      } catch (pErr) {
        console.warn("Could not pre-fetch products from DB:", pErr);
      }

      const productMap = new Map<string, { id: string; variantIds: Set<string> }>();
      for (const p of dbProducts) {
        const val = { id: p.id, variantIds: new Set(p.variants.map((v) => v.id)) };
        productMap.set(p.id, val);
        productMap.set(p.slug.toLowerCase(), val);
      }
      const defaultDbProductId = dbProducts[0]?.id;

      const orderItemsCreateData = data.items.map((item) => {
        let matched = productMap.get(item.productId);
        if (!matched && item.productId) {
          matched = productMap.get(item.productId.toLowerCase());
        }
        if (!matched && item.name) {
          for (const [key, val] of productMap.entries()) {
            if (item.name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(item.name.toLowerCase())) {
              matched = val;
              break;
            }
          }
        }
        const finalProductId = matched?.id || defaultDbProductId;
        const finalVariantId = (item.variantId && matched?.variantIds.has(item.variantId))
          ? item.variantId
          : null;

        return {
          productId: finalProductId!,
          variantId: finalVariantId,
          nameSnapshot: item.name,
          priceSnapshot: item.price,
          quantity: item.quantity,
          imageSnapshot: item.image || null,
        };
      });

      if (defaultDbProductId || orderItemsCreateData.length > 0) {
        const dbPromise = prisma.order.create({
          data: {
            orderNumber,
            userId: resolvedUserId,
            guestName: data.name,
            guestPhone: data.phone,
            guestEmail: orderCustomerEmail,
            status: initialStatus,
            deliveryType: data.deliveryType,
            subtotal: data.subtotal,
            deliveryFee: data.deliveryFee,
            total: data.total,
            paymentMethod: data.paymentMethod,
            paymentStatus: "PENDING",
            notes: addressJson,
            items: {
              create: orderItemsCreateData,
            },
          },
          include: {
            items: true,
          },
        });

        const dbOrder = await Promise.race([
          dbPromise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Database connection timeout")), 8000)
          ),
        ]);

        // Keep persistent fallback store synchronized
        saveFallbackOrder({
          orderNumber: dbOrder.orderNumber,
          userId: dbOrder.userId || session?.user?.id || null,
          guestName: dbOrder.guestName,
          guestPhone: dbOrder.guestPhone,
          guestEmail: dbOrder.guestEmail || orderCustomerEmail,
          status: dbOrder.status,
          deliveryType: dbOrder.deliveryType,
          addressDetails: data.deliveryType === "DELIVERY"
            ? {
                line1: data.line1,
                line2: data.line2,
                city: data.city || "Ratlam",
                pincode: data.pincode,
              }
            : null,
          subtotal: dbOrder.subtotal,
          deliveryFee: dbOrder.deliveryFee,
          total: dbOrder.total,
          paymentMethod: dbOrder.paymentMethod,
          paymentStatus: dbOrder.paymentStatus,
          notes: addressJson,
          items: dbOrder.items.map((item) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            variantId: item.variantId,
            nameSnapshot: item.nameSnapshot,
            priceSnapshot: item.priceSnapshot,
            quantity: item.quantity,
            imageSnapshot: item.imageSnapshot,
          })),
        });

        triggerEmails();

        return NextResponse.json({
          success: true,
          orderId: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          status: dbOrder.status,
          paymentMethod: dbOrder.paymentMethod,
          source: "database",
        });
      }
    } catch (dbError) {
      console.warn("Database unavailable during order creation, falling back to local store:", dbError);
    }

    // 2. Fallback in-memory order creation
    const fallbackOrder = saveFallbackOrder({
      orderNumber,
      userId: session?.user?.id || null,
      guestName: data.name,
      guestPhone: data.phone,
      guestEmail: orderCustomerEmail,
      status: initialStatus,
      deliveryType: data.deliveryType,
      addressDetails: data.deliveryType === "DELIVERY"
        ? {
            line1: data.line1,
            line2: data.line2,
            city: data.city || "Ratlam",
            pincode: data.pincode,
          }
        : null,
      subtotal: data.subtotal,
      deliveryFee: data.deliveryFee,
      total: data.total,
      paymentMethod: data.paymentMethod,
      paymentStatus: "PENDING",
      notes: addressJson,
      items: data.items.map((item, idx) => ({
        id: `item_${Date.now()}_${idx}`,
        orderId: "",
        productId: item.productId,
        variantId: item.variantId || null,
        nameSnapshot: item.name,
        priceSnapshot: item.price,
        quantity: item.quantity,
        imageSnapshot: item.image || null,
      })),
    });

    triggerEmails();

    return NextResponse.json({
      success: true,
      orderId: fallbackOrder.id,
      orderNumber: fallbackOrder.orderNumber,
      status: fallbackOrder.status,
      paymentMethod: fallbackOrder.paymentMethod,
      source: "fallback",
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
