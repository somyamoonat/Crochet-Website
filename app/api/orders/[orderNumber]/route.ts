import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFallbackOrderByOrderNumber } from "@/lib/fallback-orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order number is required" },
        { status: 400 }
      );
    }

    // 1. Try finding in database
    try {
      const dbOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: { equals: orderNumber, mode: "insensitive" } },
            { id: orderNumber },
          ],
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  leadTimeDays: true,
                  stockType: true,
                },
              },
            },
          },
        },
      });

      if (dbOrder) {
        // Parse notes if JSON
        let parsedAddress = null;
        try {
          if (dbOrder.notes && dbOrder.notes.startsWith("{")) {
            parsedAddress = JSON.parse(dbOrder.notes);
          }
        } catch {
          // ignore parse error
        }

        return NextResponse.json({
          success: true,
          order: {
            ...dbOrder,
            parsedAddress,
            items: dbOrder.items.map((i) => ({
              id: i.id,
              name: i.nameSnapshot,
              price: i.priceSnapshot,
              quantity: i.quantity,
              image: i.imageSnapshot || i.product?.images?.[0] || null,
              productSlug: i.product?.slug || null,
            })),
          },
          source: "database",
        });
      }
    } catch (dbError) {
      console.warn("Database lookup failed in /api/orders/[orderNumber], checking fallback:", dbError);
    }

    // 2. Check fallback orders
    const fallbackOrder = getFallbackOrderByOrderNumber(orderNumber);
    if (fallbackOrder) {
      let parsedAddress = fallbackOrder.addressDetails;
      if (!parsedAddress && fallbackOrder.notes && fallbackOrder.notes.startsWith("{")) {
        try {
          parsedAddress = JSON.parse(fallbackOrder.notes);
        } catch {
          // ignore
        }
      }

      return NextResponse.json({
        success: true,
        order: {
          id: fallbackOrder.id,
          orderNumber: fallbackOrder.orderNumber,
          userId: fallbackOrder.userId,
          guestName: fallbackOrder.guestName,
          guestEmail: fallbackOrder.guestEmail,
          guestPhone: fallbackOrder.guestPhone,
          status: fallbackOrder.status,
          deliveryType: fallbackOrder.deliveryType,
          subtotal: fallbackOrder.subtotal,
          deliveryFee: fallbackOrder.deliveryFee,
          total: fallbackOrder.total,
          paymentMethod: fallbackOrder.paymentMethod,
          paymentStatus: fallbackOrder.paymentStatus,
          razorpayOrderId: fallbackOrder.razorpayOrderId,
          razorpayPaymentId: fallbackOrder.razorpayPaymentId,
          notes: fallbackOrder.notes,
          createdAt: fallbackOrder.createdAt,
          parsedAddress,
          items: fallbackOrder.items.map((i) => ({
            id: i.id,
            name: i.nameSnapshot,
            price: i.priceSnapshot,
            quantity: i.quantity,
            image: i.imageSnapshot || null,
          })),
        },
        source: "fallback",
      });
    }

    return NextResponse.json(
      { success: false, error: `Order #${orderNumber} not found` },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error retrieving order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
