"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Container, Card, Button, Badge, StitchDivider } from "@/components/ui";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import {
  Package,
  Clock,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  Sparkles,
  CreditCard,
  Banknote,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  nameSnapshot?: string;
  priceSnapshot?: number;
  imageSnapshot?: string | null;
}

interface OrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "RECEIVED" | "CONFIRMED" | "MAKING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  deliveryType: "DELIVERY" | "PICKUP";
  paymentMethod: "RAZORPAY" | "PAY_ON_DELIVERY";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  total: number;
  subtotal: number;
  items: OrderItem[];
}

export default function AccountOrdersPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/account/orders");
      return;
    }

    if (authStatus === "authenticated") {
      fetchUserOrders();
    }
  }, [authStatus, router]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderSummary["status"]) => {
    switch (status) {
      case "RECEIVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700 border border-stone-200">
            Received
          </span>
        );
      case "CONFIRMED":
        return <Badge variant="Ready to Ship" showIcon={false}>Confirmed</Badge>;
      case "MAKING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF1EA] px-2.5 py-0.5 text-xs font-bold text-brand-primary border border-brand-primary/20">
            <Sparkles className="h-3 w-3" /> Making
          </span>
        );
      case "READY":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
            Ready & Packed
          </span>
        );
      case "OUT_FOR_DELIVERY":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 border border-sky-200">
            Out for Delivery
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            Delivered
          </span>
        );
      case "CANCELLED":
        return <Badge variant="Sold Out" showIcon={false}>Cancelled</Badge>;
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-700 border border-stone-200">
            {status}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") {
      return ["RECEIVED", "CONFIRMED", "MAKING", "READY", "OUT_FOR_DELIVERY"].includes(order.status);
    }
    if (filter === "COMPLETED") {
      return ["DELIVERED", "CANCELLED"].includes(order.status);
    }
    return true;
  });

  if (authStatus === "loading" || (loading && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
        <StoreHeader />
        <main className="py-20 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-stone-500">
            <div className="h-9 w-9 animate-spin rounded-full border-3 border-brand-primary border-t-transparent" />
            <p className="font-handwriting text-2xl text-brand-primary">Loading your orders...</p>
          </div>
        </main>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-10 sm:py-16">
        <Container size="lg" className="space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/account"
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-brand-primary transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to My Account
            </Link>

            <span className="text-xs text-stone-400 font-mono">
              Signed in as {session?.user?.email}
            </span>
          </div>

          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5 text-brand-primary" />
                <span className="font-handwriting text-2xl text-brand-primary">Your Diary</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
                Order History & Tracking
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                View your past purchases, track creation progress, and download receipts.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center rounded-2xl bg-[#FAF1EA] p-1 border border-stone-200/60 self-start sm:self-auto">
              {(["ALL", "ACTIVE", "COMPLETED"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    filter === tab
                      ? "bg-white text-brand-text shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {tab === "ALL" ? "All Orders" : tab === "ACTIVE" ? "Active" : "Delivered"}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center space-y-4 border border-[#ECE2D2] bg-white rounded-3xl">
              <div className="mx-auto h-16 w-16 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-xl font-bold text-brand-text">
                  {filter === "ALL" ? "No orders found" : `No ${filter.toLowerCase()} orders`}
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                  Every item at The Crochet Diaryy is handcrafted with patience and care by Nitika. Explore our catalogue to place your first order!
                </p>
              </div>
              <Link href="/shop">
                <Button variant="primary" size="md" leftIcon={<Sparkles className="h-4 w-4" />}>
                  Explore Handmade Catalogue
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const isPaid = order.paymentStatus === "PAID";
                const isPickup = order.deliveryType === "PICKUP";
                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <Card
                    key={order.id}
                    className="p-6 sm:p-7 border border-[#ECE2D2] shadow-xs hover:shadow-md transition bg-white rounded-3xl space-y-5"
                  >
                    {/* Header: Order Number, Date, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-brand-primary">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(order.status)}

                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#FAF6EF] text-stone-600 border border-stone-200/60">
                          {isPickup ? "Studio Pickup" : "Doorstep Delivery"}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Items Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-8 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {order.items.slice(0, 3).map((item, idx) => {
                            const itemName = item.nameSnapshot || item.name;
                            const itemImage = item.imageSnapshot || item.image;
                            return (
                              <div
                                key={item.id || idx}
                                className="flex items-center gap-2.5 rounded-2xl bg-[#FAF6EF]/70 p-2 pr-3 border border-stone-200/70"
                              >
                                {itemImage ? (
                                  <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                                    <Image
                                      src={itemImage}
                                      alt={itemName}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                                    <Sparkles className="h-4 w-4" />
                                  </div>
                                )}
                                <div className="text-xs">
                                  <strong className="block text-brand-text truncate max-w-[140px]">
                                    {itemName}
                                  </strong>
                                  <span className="text-stone-500">Qty: {item.quantity}</span>
                                </div>
                              </div>
                            );
                          })}

                          {order.items.length > 3 && (
                            <span className="text-xs font-bold text-stone-400 pl-1">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Payment, Total, and Details CTA */}
                      <div className="md:col-span-4 flex flex-col sm:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                        <div className="sm:text-right">
                          <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                            Total Amount
                          </span>
                          <span className="font-heading text-xl font-extrabold text-brand-text">
                            ₹{order.total.toLocaleString("en-IN")}
                          </span>
                          <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-stone-500 mt-0.5">
                            {order.paymentMethod === "PAY_ON_DELIVERY" ? (
                              <>
                                <Banknote className="h-3 w-3 text-[#4A5D45]" />
                                <span>Pay on Handover ({isPaid ? "Paid" : "Pending"})</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-3 w-3 text-brand-primary" />
                                <span>Online ({isPaid ? "Paid" : "Pending"})</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto border-brand-primary/40 hover:bg-[#FAF1EA] text-brand-primary font-bold"
                              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                            >
                              Track Order & Timeline
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <StitchDivider variant="loops" color="secondary" />
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
