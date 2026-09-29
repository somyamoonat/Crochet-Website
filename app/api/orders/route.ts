import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  saveFallbackOrder,
  getAllFallbackOrders,
  getFallbackOrdersByUserId,
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const isAdmin = (session.user as { role?: string }).role === "ADMIN";

    // 1. Try PostgreSQL
    try {
      const dbOrders = await prisma.order.findMany({
        where: isAdmin
          ? {}
          : {
              OR: [
                ...(userId ? [{ userId }] : []),
                ...(userEmail ? [{ guestEmail: userEmail }] : []),
              ],
            },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ success: true, orders: dbOrders, source: "database" });
    } catch (dbError) {
      console.warn("Database unavailable in GET /api/orders, using fallback:", dbError);
    }

    // 2. Fallback in-memory list
    const fallbackList = isAdmin
      ? getAllFallbackOrders()
      : getFallbackOrdersByUserId(userId || "", userEmail);

    return NextResponse.json({ success: true, orders: fallbackList, source: "fallback" });
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
        customerEmail: data.email?.trim() || null,
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

    // 1. Try writing to PostgreSQL with timeout safeguard
    try {
      const dbPromise = prisma.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || null,
          guestName: data.name,
          guestPhone: data.phone,
          guestEmail: data.email?.trim() || null,
          status: initialStatus,
          deliveryType: data.deliveryType,
          subtotal: data.subtotal,
          deliveryFee: data.deliveryFee,
          total: data.total,
          paymentMethod: data.paymentMethod,
          paymentStatus: "PENDING",
          notes: addressJson,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId || null,
              nameSnapshot: item.name,
              priceSnapshot: item.price,
              quantity: item.quantity,
              imageSnapshot: item.image || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      const dbOrder = await Promise.race([
        dbPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Database connection timeout")), 1500)
        ),
      ]);

      // Keep persistent fallback store synchronized
      saveFallbackOrder({
        orderNumber: dbOrder.orderNumber,
        userId: dbOrder.userId,
        guestName: dbOrder.guestName,
        guestPhone: dbOrder.guestPhone,
        guestEmail: dbOrder.guestEmail,
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
    } catch (dbError) {
      console.warn("Database unavailable during order creation, falling back to local store:", dbError);
    }

    // 2. Fallback in-memory order creation
    const fallbackOrder = saveFallbackOrder({
      orderNumber,
      userId: session?.user?.id || null,
      guestName: data.name,
      guestPhone: data.phone,
      guestEmail: data.email?.trim() || null,
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
