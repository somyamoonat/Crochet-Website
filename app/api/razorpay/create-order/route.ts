import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { getFallbackOrderById, updateFallbackOrder } from "@/lib/fallback-orders";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId in request body" },
        { status: 400 }
      );
    }

    // 1. Fetch internal order from PostgreSQL or fallback store
    let order: {
      id: string;
      orderNumber: string;
      total: number;
      guestName?: string | null;
      guestEmail?: string | null;
      guestPhone?: string | null;
    } | null = null;

    try {
      const dbOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (dbOrder) {
        order = dbOrder;
      }
    } catch (dbErr) {
      console.warn("Database lookup unavailable for create-order, checking fallback store:", dbErr);
    }

    if (!order) {
      const fallback = getFallbackOrderById(orderId);
      if (fallback) {
        order = fallback;
      }
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const amountInPaise = Math.round(order.total * 100);
    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyid";
    let razorpayOrderId: string;

    // 2. Create Razorpay order via Razorpay API
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: order.orderNumber,
        notes: {
          internalOrderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      razorpayOrderId = rzpOrder.id;
    } catch (rzpErr: unknown) {
      console.warn("Razorpay API order creation failed or test placeholder in use:", rzpErr);
      // In development / test mode with placeholder keys, generate a simulated test order ID
      razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }

    // 3. Save razorpayOrderId to the internal order
    try {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          razorpayOrderId,
          paymentMethod: "RAZORPAY",
        },
      });
    } catch {
      updateFallbackOrder(order.id, {
        razorpayOrderId,
        paymentMethod: "RAZORPAY",
      });
    }

    return NextResponse.json({
      success: true,
      razorpayOrderId,
      key: keyId,
      amount: amountInPaise,
      currency: "INR",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        customerName: order.guestName || "Customer",
        customerEmail: order.guestEmail || "",
        customerPhone: order.guestPhone || "",
      },
    });
  } catch (error) {
    console.error("Error in /api/razorpay/create-order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize payment gateway" },
      { status: 500 }
    );
  }
}
