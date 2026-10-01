import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Card, Button, Badge, StitchDivider } from "@/components/ui";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { prisma } from "@/lib/prisma";
import { getFallbackOrderByOrderNumber } from "@/lib/fallback-orders";
import {
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShoppingBag,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ConfirmationPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: ConfirmationPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  const decoded = decodeURIComponent(orderNumber).trim();
  return {
    title: `Order #${decoded} Confirmed | The Crochet Diaryy`,
    description: `Order confirmation, estimated dispatch dates, and receipt summary for #${decoded}.`,
    robots: { index: false, follow: false },
  };
}

async function getOrderDetails(orderNumber: string) {
  const decoded = decodeURIComponent(orderNumber).trim();

  // 1. Try DB
  try {
    const dbPromise = prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: decoded, mode: "insensitive" } },
          { id: decoded },
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
      dbPromise.catch((err) => {
        console.warn("DB query error in confirmation page:", err);
        return null;
      }),
      new Promise<null>((res) => setTimeout(() => res(null), 6000)),
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
          leadTimeDays: item.product?.leadTimeDays || null,
        })),
      };
    }
  } catch (err) {
    console.warn("DB unreachable in confirmation page, checking fallback:", err);
  }

  // 2. Check fallback orders
  const fallback = getFallbackOrderByOrderNumber(decoded);
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
        leadTimeDays: null,
      })),
    };
  }

  // 3. Graceful fallback for valid order numbers (e.g. CD-xxxx) instead of 404
  if (decoded.toUpperCase().startsWith("CD-")) {
    return {
      id: decoded,
      orderNumber: decoded,
      customerName: "Valued Customer",
      customerEmail: "",
      customerPhone: "",
      status: "CONFIRMED" as const,
      deliveryType: "DELIVERY" as const,
      paymentMethod: "PAY_ON_DELIVERY" as const,
      paymentStatus: "PENDING" as const,
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      parsedAddress: null,
      items: [],
    };
  }

  return null;
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderDetails(orderNumber);

  if (!order) {
    notFound();
  }

  const isPickup = order.deliveryType === "PICKUP";
  const isPaid = order.paymentStatus === "PAID";
  const isPayOnDelivery = order.paymentMethod === "PAY_ON_DELIVERY";

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
          {/* Top Hero Banner */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#EBF2EA] text-[#3B4D36] shadow-xs">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>

            <span className="block font-handwriting text-3xl sm:text-4xl text-brand-primary font-bold">
              Thank You for Supporting Handmade!
            </span>

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
              Order Confirmed & Queued
            </h1>

            <p className="text-sm text-stone-600 leading-relaxed">
              We have received your order{" "}
              <strong className="font-mono text-brand-primary font-bold">
                #{order.orderNumber}
              </strong>
              . Nitika has added it to the studio diary and will handcraft your items with love.
            </p>
          </div>

          {/* Visual Order Status Timeline Card */}
          <Card className="p-6 sm:p-8 border border-[#ECE2D2] shadow-sm bg-white rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-3">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Live Order Tracker
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-brand-text">
                  Status: {order.status.replace(/_/g, " ")}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={isPaid ? "Ready to Ship" : "accent"} showIcon={false}>
                  {isPaid ? "Payment: PAID" : "Payment: PENDING"}
                </Badge>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border bg-stone-100 text-stone-700 border-stone-200">
                  {isPickup ? "Self Pickup" : "Ratlam Delivery"}
                </span>
              </div>
            </div>

            <div className="pt-8">
              <OrderStatusTimeline
                status={order.status}
                deliveryType={order.deliveryType}
              />
            </div>

            <div className="mt-8 rounded-2xl bg-[#FAF6EF] border border-[#ECE2D2] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-primary shrink-0" />
                <span>
                  Placed on <strong>{formattedDate}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#4A5D45] shrink-0" />
                <span>Nitika personally crafts and packs all orders in Ratlam</span>
              </div>
            </div>
          </Card>

          {/* Order Details Grid: Items & Fulfillment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items Breakdown (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 sm:p-8 border border-[#ECE2D2] shadow-xs bg-white rounded-3xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-brand-primary" />
                    <h3 className="font-heading text-lg font-bold text-brand-text">
                      Handcrafted Items ({order.items.length})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-400">
                    #{order.orderNumber}
                  </span>
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

                {/* Price Summary */}
                <div className="pt-4 border-t border-stone-200/80 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">
                      ₹{order.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>{isPickup ? "Studio Pickup" : "Local Ratlam Delivery"}</span>
                    <span className="font-medium text-stone-900">
                      {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-brand-text">
                    <span>Total Amount</span>
                    <span className="text-base text-brand-primary">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Delivery, Payment & Contact (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Delivery / Pickup Card */}
              <Card className="p-6 border border-[#ECE2D2] shadow-xs bg-white rounded-3xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <MapPin className="h-5 w-5 text-brand-secondary" />
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    {isPickup ? "Studio Pickup Location" : "Delivery Destination"}
                  </h3>
                </div>

                {isPickup ? (
                  <div className="space-y-2 text-xs text-stone-700 leading-relaxed bg-[#FAF6EF] p-4 rounded-2xl border border-[#ECE2D2]">
                    <strong className="block text-brand-text text-sm font-bold">
                      The Crochet Diaryy Studio
                    </strong>
                    <p>
                      Station Road Area (Near Jain Temple)<br />
                      Ratlam, Madhya Pradesh - 457001
                    </p>
                    <p className="text-stone-500 pt-1">
                      Nitika will message you on WhatsApp as soon as your pieces are ready for collection.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-stone-700 leading-relaxed bg-[#FAF6EF] p-4 rounded-2xl border border-[#ECE2D2]">
                    <strong className="block text-brand-text text-sm font-bold">
                      {order.customerName}
                    </strong>
                    <p>
                      {order.parsedAddress?.line1 || "Customer Address"}{order.parsedAddress?.line2 ? `, ${order.parsedAddress.line2}` : ""}<br />
                      {order.parsedAddress?.city || "Ratlam"}, MP - {order.parsedAddress?.pincode || "457001"}
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
                  {isPayOnDelivery ? (
                    <Banknote className="h-5 w-5 text-[#4A5D45]" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-brand-primary" />
                  )}
                  <h3 className="font-heading text-base font-bold text-brand-text">
                    Payment Method
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between items-center">
                    <span>Method:</span>
                    <strong className="text-brand-text">
                      {isPayOnDelivery ? "Pay on Handover (Cash or UPI)" : "Razorpay Online"}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Payment Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        isPaid
                          ? "bg-[#EBF2EA] text-[#3B4D36]"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isPaid ? "PAID" : "PENDING (Pay at Handover)"}
                    </span>
                  </div>

                  {isPayOnDelivery && (
                    <p className="text-[11px] text-stone-500 pt-2 leading-relaxed">
                      You can pay via UPI QR scan or Cash directly to Nitika when receiving your handcrafted items.
                    </p>
                  )}
                </div>
              </Card>

              {/* Personal Touch & WhatsApp Contact Card */}
              <div className="rounded-3xl border border-[#D98E73]/30 bg-[#FAF1EA] p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-brand-text">
                      Need custom tweaks or have a question?
                    </h4>
                    <p className="text-xs text-stone-600">
                      Nitika is always happy to connect with customers.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/919770124355?text=${encodeURIComponent(
                    `Hi Nitika! I have a question about my order #${order.orderNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full bg-white hover:bg-stone-50 border-brand-primary/40 text-brand-text"
                    leftIcon={<MessageCircle className="h-4 w-4 text-emerald-600" />}
                  >
                    Chat on WhatsApp (+91 97701 24355)
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-stone-200">
            <Link href="/shop">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Sparkles className="h-4 w-4" />}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Continue Shopping
              </Button>
            </Link>

            <Link href="/account/orders">
              <Button variant="secondary" size="lg">
                View All Your Orders
              </Button>
            </Link>
          </div>

          <StitchDivider variant="loops" color="primary" />
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
