"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container, Card, CardTitle, CardDescription, Button } from "@/components/ui";
import {
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Settings,
  Truck,
  Sparkles,
} from "lucide-react";

interface FallbackOrderSummary {
  id: string;
  orderNumber: string;
  guestName?: string | null;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stockQty: number | null;
  price: number | null;
  categorySlug: string;
  images: string[];
}

interface DashboardMetrics {
  todayNewOrdersCount: number;
  todayNewOrders: FallbackOrderSummary[];
  thisMonthRevenue: number;
  totalOrdersCount: number;
  lowStockProducts: LowStockProduct[];
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user as {
    name?: string | null;
    email?: string | null;
  } | undefined;

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMetrics(data);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="xl" className="space-y-8">
          {/* Welcome & Quick Action Banner */}
          <div className="rounded-3xl border border-[#ECE2D2] bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-handwriting text-2xl text-brand-primary">Nitika&apos;s Studio</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EBF2EA] text-[#3B4D36] border border-[#D1E0CE]">
                  Founder Portal
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
                Welcome back, {user?.name || "Nitika Tanted"} 🧶
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
                Here is today&apos;s overview of your handmade crochet business. Manage orders, update stock, and control fulfillment settings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link href="/admin/products/new">
                <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  Add Product
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                  Manage Orders
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="ghost" size="sm" leftIcon={<Settings className="h-4 w-4" />}>
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Metric 1: Today's New Orders */}
            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Today&apos;s New Orders
                </span>
                <div className="h-9 w-9 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-text">
                  {loading ? "..." : metrics?.todayNewOrdersCount ?? 0}
                </p>
                <p className="text-xs text-stone-500">
                  {metrics?.todayNewOrdersCount === 1 ? "Order received today" : "Orders received today"}
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline pt-2"
              >
                View all orders <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>

            {/* Metric 2: This Month's Revenue */}
            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  This Month&apos;s Revenue
                </span>
                <div className="h-9 w-9 rounded-full bg-[#EBF2EA] flex items-center justify-center text-[#3B4D36]">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-text">
                  {loading ? "..." : `₹${(metrics?.thisMonthRevenue ?? 0).toLocaleString("en-IN")}`}
                </p>
                <p className="text-xs text-stone-500">
                  Confirmed & paid orders this calendar month
                </p>
              </div>
              <span className="text-xs text-stone-400 font-medium block pt-2">
                Lifetime: {metrics?.totalOrdersCount ?? 0} total orders
              </span>
            </Card>

            {/* Metric 3: Low-Stock Alert Count */}
            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Low-Stock Items
                </span>
                <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-text">
                  {loading ? "..." : metrics?.lowStockProducts.length ?? 0}
                </p>
                <p className="text-xs text-stone-500">
                  Ready-to-ship items with &le; 3 units left
                </p>
              </div>
              <a
                href="#low-stock-section"
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:underline pt-2"
              >
                Review low inventory <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Card>
          </div>

          {/* Section: Low-Stock Alert List */}
          <div id="low-stock-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-brand-text flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Low-Stock Alerts (Ready to Ship)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Products that need your crochet hooks or inventory restock soon.
                </p>
              </div>

              <Link href="/admin/products/new">
                <Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  New Product
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="p-10 text-center text-stone-400 text-sm">Loading stock data...</div>
            ) : metrics?.lowStockProducts.length === 0 ? (
              <Card className="p-6 text-center space-y-2 border border-emerald-200 bg-emerald-50/50 rounded-2xl">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 mx-auto" />
                <p className="font-heading text-sm font-bold text-emerald-900">
                  All Ready-to-Ship items have sufficient stock!
                </p>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  No products are currently under the 3-unit low stock threshold.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics?.lowStockProducts.map((prod) => (
                  <Card
                    key={prod.id}
                    className="p-4 border border-amber-200 bg-white rounded-2xl space-y-3 shadow-2xs hover:shadow-xs transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-sm font-bold text-brand-text truncate">
                          {prod.name}
                        </h3>
                        <span className="text-[11px] text-stone-500 capitalize">
                          {prod.categorySlug.replace(/-/g, " ")}
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold px-2.5 py-0.5 whitespace-nowrap">
                        {prod.stockQty === 0 ? "Sold Out" : `${prod.stockQty} left`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="font-bold text-brand-text">
                        {prod.price ? `₹${prod.price.toLocaleString("en-IN")}` : "Custom Price"}
                      </span>
                      <Link href={`/admin/products/${encodeURIComponent(prod.id)}`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 h-7">
                          Edit Stock
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section: Today's Orders / Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-brand-text flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand-primary" />
                  Today&apos;s Orders
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Orders placed since midnight awaiting fulfillment or delivery.
                </p>
              </div>

              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All Orders
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="p-10 text-center text-stone-400 text-sm">Loading today&apos;s orders...</div>
            ) : metrics?.todayNewOrders.length === 0 ? (
              <Card className="p-8 text-center space-y-2 border border-stone-200/80 bg-white rounded-3xl">
                <div className="mx-auto h-12 w-12 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-brand-text">No orders yet today</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  New orders will pop up here in real time as customers place them.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics?.todayNewOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-5 border border-[#ECE2D2] bg-white rounded-2xl space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-brand-primary">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#FAF6EF] text-stone-700">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span>Customer: <strong>{order.guestName || "Guest"}</strong></span>
                      <span className="font-heading font-extrabold text-brand-text text-sm">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <Link href={`/admin/orders/${encodeURIComponent(order.id)}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Update Status
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Business Rules Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand-secondary" />
                <CardTitle className="text-base">Delivery &amp; Pickup Modes</CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed text-stone-600">
                Manage your doorstep delivery preferences and studio pickup options. All customer orders reflect in your dashboard instantly.
              </CardDescription>
              <div className="pt-2">
                <Link href="/admin/settings">
                  <Button variant="outline" size="sm" leftIcon={<Settings className="h-4 w-4" />}>
                    Adjust Delivery Settings
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
                <CardTitle className="text-base">Catalog &amp; Categories</CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed text-stone-600">
                Organize pieces into Amigurumi &amp; Toys, Bags &amp; Pouches, Home Decor, Apparel, or add new categories anytime.
              </CardDescription>
              <div className="pt-2 flex items-center gap-2">
                <Link href="/admin/categories">
                  <Button variant="outline" size="sm">
                    Manage Categories
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button variant="secondary" size="sm">
                    View All Products
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}
