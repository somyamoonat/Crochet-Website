import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Card, Button, StitchDivider } from "@/components/ui";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { prisma } from "@/lib/prisma";
import { getFallbackOrderByOrderNumber } from "@/lib/fallback-orders";
import {
  ChevronLeft,
  ShoppingBag,
  MapPin,
  Clock,
  Phone,
  CreditCard,
  Banknote,
  Sparkles,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Status #${orderNumber} | The Crochet Diaryy`,
    description: `Track your handmade crochet order status: Received, Making, Ready, Out for Delivery, or Delivered.`,
    robots: { index: false, follow: false },
  };
}

async function getOrderDetail(orderNumber: string) {
  // 1. Try PostgreSQL
  try {
    const dbPromise = prisma.order.findFirst({
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

    const dbOrder = await Promise.race([
      dbPromise.catch(() => null),
      new Promise<null>((res) => setTimeout(() => res(null), 1200)),
    ]);

    if (dbOrder) {
      let parsedAddress = null;
      try {
        if (dbOrder.notes && dbOrder.notes.startsWith("{")) {
          parsedAddress = JSON.parse(dbOrder.notes);
        }
      } catch {
        // ignore
      }

      return {
        id: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        customerName: dbOrder.guestName || "Valued Customer",
        customerEmail: dbOrder.guestEmail || "",
        customerPhone: dbOrder.guestPhone || "",
        status: dbOrder.status,
        deliveryType: dbOrder.deliveryType,
        paymentMethod: dbOrder.paymentMethod,
        paymentStatus: dbOrder.paymentStatus,
        razorpayPaymentId: dbOrder.razorpayPaymentId,
        subtotal: dbOrder.subtotal,
        deliveryFee: dbOrder.deliveryFee,
        total: dbOrder.total,
        createdAt: dbOrder.createdAt.toISOString(),
        parsedAddress,
        items: dbOrder.items.map((item) => ({
          id: item.id,
          name: item.nameSnapshot,
          price: item.priceSnapshot,
          quantity: item.quantity,
          image: item.imageSnapshot || item.product?.images?.[0] || null,
        })),
      };
    }
  } catch (err) {
    console.warn("DB unreachable in account order detail page, checking fallback:", err);
  }

  // 2. Check fallback orders
  const fallback = getFallbackOrderByOrderNumber(orderNumber);
  if (fallback) {
    let parsedAddress = fallback.addressDetails;
    if (!parsedAddress && fallback.notes && fallback.notes.startsWith("{")) {
      try {
        parsedAddress = JSON.parse(fallback.notes);
      } catch {
        // ignore
      }
    }

    return {
      id: fallback.id,
      orderNumber: fallback.orderNumber,
      customerName: fallback.guestName || "Valued Customer",
      customerEmail: fallback.guestEmail || "",
      customerPhone: fallback.guestPhone || "",
      status: fallback.status,
      deliveryType: fallback.deliveryType,
      paymentMethod: fallback.paymentMethod,
      paymentStatus: fallback.paymentStatus,
      razorpayPaymentId: fallback.razorpayPaymentId,
      subtotal: fallback.subtotal,
      deliveryFee: fallback.deliveryFee,
      total: fallback.total,
      createdAt: fallback.createdAt,
      parsedAddress,
      items: fallback.items.map((item) => ({
        id: item.id,
        name: item.nameSnapshot,
        price: item.priceSnapshot,
        quantity: item.quantity,
        image: item.imageSnapshot || null,
      })),
    };
  }

  return null;
}

export default async function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderDetail(orderNumber);

  if (!order) {
    notFound();
  }

  const isPickup = order.deliveryType === "PICKUP";
  const isPaid = order.paymentStatus === "PAID";
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-10 sm:py-16">
        <Container size="lg" className="space-y-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-primary transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Order History
            </Link>

            <Link
              href={`/order/${encodeURIComponent(order.orderNumber)}/confirmation`}
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
            >
              Public Confirmation Link
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-handwriting text-2xl text-brand-primary">Order Tracking</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FAF6EF] text-stone-600 border border-stone-200/60">
                  {isPickup ? "Self Pickup" : "Doorstep Delivery"}
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-stone-400" />
                Placed on {formattedDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/919770124355?text=${encodeURIComponent(
                  `Hi Nitika! I'm checking the status of my order #${order.orderNumber}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE]"
                  leftIcon={<MessageCircle className="h-4 w-4 text-[#25D366]" />}
                >
                  WhatsApp Nitika
                </Button>
              </a>
            </div>
          </div>

          {/* Visual Order Status Timeline Card */}
          <Card className="p-6 sm:p-8 border border-[#ECE2D2] shadow-sm bg-white rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
              <h2 className="font-heading text-lg font-bold text-brand-text">
                Current Stage: {order.status.replace(/_/g, " ")}
              </h2>
              <span className="text-xs text-stone-500">
                Updated in real time by the founder
              </span>
            </div>

            <div className="pt-4">
              <OrderStatusTimeline
                status={order.status}
                deliveryType={order.deliveryType}
              />
            </div>
          </Card>

          {/* Grid: Order Items & Delivery Information */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items Breakdown (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 sm:p-8 border border-[#ECE2D2] shadow-xs bg-white rounded-3xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-heading text-lg font-bold text-brand-text">
                      Items Ordered ({order.items.length})
                    </h3>
                  </div>
                </div>

                <div className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      {item.image ? (
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-[#FAF1EA] flex items-center justify-center text-brand-primary shrink-0">
                          <Sparkles className="h-6 w-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-sm font-bold text-brand-text truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Quantity: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-heading text-sm font-bold text-brand-text">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="pt-4 border-t border-stone-200/80 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">
                      ₹{order.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>{isPickup ? "Studio Pickup" : "Doorstep Delivery"}</span>
                    <span className="font-medium text-stone-900">
                      {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-brand-text">
                    <span>Total Paid / Payable</span>
                    <span className="text-base text-brand-primary">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Fulfillment & Payment Details (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Delivery Details Card */}
              <Card className="p-6 border border-[#ECE2D2] shadow-xs bg-white rounded-3xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <MapPin className="h-5 w-5 text-brand-secondary" />
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    {isPickup ? "Studio Pickup Address" : "Delivery Details"}
                  </h3>
                </div>

                {isPickup ? (
                  <div className="space-y-2 text-xs text-stone-700 bg-[#FAF6EF] p-4 rounded-2xl border border-[#ECE2D2] leading-relaxed">
                    <strong className="block text-brand-text text-sm font-bold">
                      The Crochet Diaryy Studio
                    </strong>
                    <p>
                      Station Road Studio Workshop<br />
                      Madhya Pradesh - 457001
                    </p>
                    <p className="text-stone-500 pt-1">
                      Nitika will send a WhatsApp message when your parcel is ready for handover.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-stone-700 bg-[#FAF6EF] p-4 rounded-2xl border border-[#ECE2D2] leading-relaxed">
                    <strong className="block text-brand-text text-sm font-bold">
                      {order.customerName}
                    </strong>
                    <p>
                      {order.parsedAddress?.line1 || "Customer Address"}{order.parsedAddress?.line2 ? `, ${order.parsedAddress.line2}` : ""}<br />
                      {order.parsedAddress?.city ? `${order.parsedAddress.city}, ` : ""}${order.parsedAddress?.state || "MP"}${order.parsedAddress?.pincode ? ` - ${order.parsedAddress.pincode}` : ""}
                    </p>
                    <p className="text-stone-500 pt-1 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      Contact: {order.customerPhone}
                    </p>
                  </div>
                )}
              </Card>

              {/* Payment Details Card */}
              <Card className="p-6 border border-[#ECE2D2] shadow-xs bg-white rounded-3xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  {order.paymentMethod === "PAY_ON_DELIVERY" ? (
                    <Banknote className="h-5 w-5 text-[#4A5D45]" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-brand-primary" />
                  )}
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    Payment Information
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between items-center">
                    <span>Payment Method:</span>
                    <strong className="text-brand-text">
                      {order.paymentMethod === "PAY_ON_DELIVERY"
                        ? "Pay on Handover (Cash / UPI)"
                        : "Online Payment (UPI / Cards)"}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Payment Status:</span>
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                        isPaid
                          ? "bg-[#EBF2EA] text-[#3B4D36]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isPaid ? "PAID" : "PENDING (Pay at Handover)"}
                    </span>
                  </div>

                  {order.razorpayPaymentId && (
                    <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-[11px] text-stone-600">
                        {order.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Trust Badge */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 flex items-center gap-3 text-xs text-stone-600">
                <ShieldCheck className="h-5 w-5 text-[#4A5D45] shrink-0" />
                <span>
                  All items are handcrafted by Nitika with quality cotton and velvet yarns.
                </span>
              </div>
            </div>
          </div>

          <StitchDivider variant="loops" color="primary" />
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
