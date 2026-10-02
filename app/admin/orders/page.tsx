"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container, Card, Button } from "@/components/ui";
import { OrderStatusTimeline, OrderStatusType } from "@/components/orders/order-status-timeline";
import {
  ShoppingCart,
  Search,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Save,
  X,
  ChevronLeft,
  MapPin,
  FileText,
} from "lucide-react";
import { FallbackOrder } from "@/lib/fallback-orders";

function getOrderAddressInfo(order: FallbackOrder) {
  const isPickup = order.deliveryType === "PICKUP";
  let line1 = "";
  let line2 = "";
  let city = "Ratlam";
  let pincode = "";
  let customerNotes = "";

  // 1. Try to read from structured addressDetails if present
  if (order.addressDetails) {
    line1 = order.addressDetails.line1 || "";
    line2 = order.addressDetails.line2 || "";
    city = order.addressDetails.city || "Ratlam";
    pincode = order.addressDetails.pincode || "";
  }

  // 2. Try to parse from order.notes (checkout stores delivery address JSON in notes)
  if (order.notes) {
    const raw = order.notes.trim();
    if (raw.startsWith("{") && raw.endsWith("}")) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.line1) line1 = parsed.line1;
        if (parsed.line2) line2 = parsed.line2;
        if (parsed.city) city = parsed.city;
        if (parsed.pincode) pincode = parsed.pincode;
        if (parsed.customerNotes) customerNotes = parsed.customerNotes;
        if (parsed.note && !customerNotes) customerNotes = parsed.note;
      } catch {
        customerNotes = raw;
      }
    } else {
      customerNotes = raw;
    }
  }

  const parts = [line1, line2].filter(Boolean);
  let formattedAddress = "";
  if (isPickup) {
    formattedAddress = "Self-Pickup at Nitika Tanted's Studio (Station Road, Ratlam, MP)";
  } else if (parts.length > 0) {
    formattedAddress = `${parts.join(", ")}, ${city}${pincode ? ` - ${pincode}` : ""}`;
  } else {
    formattedAddress = "Ratlam, Madhya Pradesh";
  }

  return {
    isPickup,
    line1,
    line2,
    city,
    pincode,
    customerNotes,
    formattedAddress,
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<FallbackOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");

  // Selected Order for Modal / Drawer
  const [selectedOrder, setSelectedOrder] = useState<FallbackOrder | null>(null);
  const [editingStatus, setEditingStatus] = useState<OrderStatusType>("RECEIVED");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadOrders() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter !== "ALL") params.append("status", statusFilter);
        if (paymentFilter !== "ALL") params.append("paymentStatus", paymentFilter);

        const res = await fetch(`/api/admin/orders?${params.toString()}`);
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data.success && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      isCancelled = true;
    };
  }, [statusFilter, paymentFilter]);

  const openOrderModal = (order: FallbackOrder) => {
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setUpdateSuccess(false);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    setUpdateSuccess(false);

    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(selectedOrder.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editingStatus,
          notes: selectedOrder.notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUpdateSuccess(true);
        // Update local list
        setOrders(
          orders.map((o) =>
            o.id === selectedOrder.id
              ? { ...o, status: editingStatus }
              : o
          )
        );
        setSelectedOrder({
          ...selectedOrder,
          status: editingStatus,
        });
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Error updating order status.");
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchesNum = o.orderNumber.toLowerCase().includes(q);
    const matchesName = (o.guestName || "").toLowerCase().includes(q);
    const matchesPhone = (o.guestPhone || "").includes(q);
    return matchesNum || matchesName || matchesPhone;
  });

  const allStatuses: OrderStatusType[] = [
    "RECEIVED",
    "CONFIRMED",
    "MAKING",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="xl" className="space-y-6">
          {/* Back to Dashboard Navigation */}
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-primary bg-white hover:bg-[#FAF1EA] px-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-2xs transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-5 w-5 text-brand-primary" />
                <span className="font-handwriting text-2xl text-brand-primary">Fulfillment Queue</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
                Orders Management
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                Update crochet stages from Received to Delivered, manage customer delivery notes, and chat directly on WhatsApp.
              </p>
            </div>

            <div className="text-xs text-stone-500 font-semibold bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs self-start sm:self-auto">
              Total: {orders.length} {orders.length === 1 ? "order" : "orders"}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="rounded-3xl border border-[#ECE2D2] bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-[#FAF6EF]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="ALL">All Order Statuses</option>
                <option value="RECEIVED">Received</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="MAKING">Making</option>
                <option value="READY">Ready</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery / Pickup</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                <option value="ALL">All Payments</option>
                <option value="PAID">Paid (Online)</option>
                <option value="PENDING">Pending (Handover)</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {/* Orders Cards List (Mobile-first stacked cards) */}
          {loading ? (
            <div className="p-16 text-center text-stone-400 text-sm">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <Card className="p-12 text-center space-y-3 border border-[#ECE2D2] bg-white rounded-3xl">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-text">No orders found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No orders match your current filter selections.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((o) => {
                const isPaid = o.paymentStatus === "PAID";
                const isPickup = o.deliveryType === "PICKUP";

                return (
                  <Card
                    key={o.id}
                    onClick={() => openOrderModal(o)}
                    className="p-4 sm:p-5 border border-[#ECE2D2] bg-white rounded-2xl hover:border-brand-primary/50 hover:shadow-xs transition cursor-pointer space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm sm:text-base font-bold text-brand-primary">
                          #{o.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400">•</span>
                        <span className="text-xs text-stone-500 font-medium">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            o.status === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : o.status === "MAKING"
                              ? "bg-[#FAF1EA] text-brand-primary border-brand-primary/30"
                              : o.status === "CANCELLED"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>

                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF6EF] text-stone-600 border border-stone-200">
                          {isPickup ? "Pickup" : "Delivery"}
                        </span>
                      </div>
                    </div>

                    {/* Middle Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                      <div className="sm:col-span-4 space-y-0.5">
                        <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                          Customer
                        </span>
                        <strong className="text-brand-text text-sm block">
                          {o.guestName || "Customer"}
                        </strong>
                        <span className="text-stone-500">{o.guestPhone || o.guestEmail || "No contact"}</span>
                      </div>

                      <div className="sm:col-span-5 space-y-0.5">
                        <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                          Items ({o.items?.length || 0})
                        </span>
                        <p className="text-stone-700 truncate font-medium">
                          {o.items?.map((i) => `${i.nameSnapshot} (×${i.quantity})`).join(", ") || "No items"}
                        </p>
                      </div>

                      <div className="sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <span className="font-heading text-base font-extrabold text-brand-text">
                          ₹{o.total.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-[11px] font-bold ${
                            isPaid ? "text-emerald-700" : "text-amber-800"
                          }`}
                        >
                          {isPaid ? "PAID" : "PENDING (Handover)"}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Modal / Drawer for Order Details and Status Update */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#ECE2D2] shadow-2xl p-6 sm:p-8 space-y-6">
                {/* Header with Back button */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 rounded-xl text-stone-500 hover:text-brand-primary hover:bg-[#FAF1EA] transition sm:hidden"
                      title="Back to Orders"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Order Management
                      </span>
                      <h2 className="font-mono text-xl font-extrabold text-brand-primary">
                        #{selectedOrder.orderNumber}
                      </h2>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {updateSuccess && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Order lifecycle status successfully updated!
                  </div>
                )}

                {/* Timeline Status Preview */}
                <div className="rounded-2xl bg-[#FAF6EF] p-4 border border-stone-200/80">
                  <OrderStatusTimeline
                    status={editingStatus}
                    deliveryType={selectedOrder.deliveryType}
                  />
                </div>

                {/* Status Update Actions */}
                <div className="space-y-4 bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80">
                  <h3 className="font-heading text-sm font-bold text-brand-text">
                    Update Order Lifecycle Status
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {allStatuses.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setEditingStatus(st)}
                        className={`p-2 rounded-xl text-xs font-bold border transition ${
                          editingStatus === st
                            ? "border-brand-primary bg-brand-primary text-white shadow-2xs"
                            : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                        }`}
                      >
                        {st.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleSaveStatus}
                      isLoading={updating}
                      disabled={updating}
                      leftIcon={<Save className="h-4 w-4" />}
                    >
                      Save Status
                    </Button>

                    {/* WhatsApp link to customer */}
                    {selectedOrder.guestPhone && (
                      <a
                        href={`https://wa.me/${selectedOrder.guestPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hi ${selectedOrder.guestName || "there"}! Update from The Crochet Diaryy: Your order #${selectedOrder.orderNumber} is now ${editingStatus.replace(/_/g, " ")}! 🧶`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE] text-xs font-bold"
                          leftIcon={<MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />}
                        >
                          WhatsApp Customer
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                {/* Clean Customer & Delivery Address Details (Human-readable, no JSON code) */}
                {(() => {
                  const addr = getOrderAddressInfo(selectedOrder);
                  return (
                    <div className="rounded-2xl border border-[#ECE2D2] bg-white p-4 sm:p-5 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-brand-text">
                          <MapPin className="h-4 w-4 text-brand-primary" />
                          <span>{addr.isPickup ? "Pickup Location" : "Delivery Address"}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF1EA] text-brand-primary border border-brand-primary/20">
                          {addr.isPickup ? "Store Pickup" : "Doorstep Delivery"}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-stone-400 font-semibold w-16 shrink-0">Name:</span>
                            <strong className="text-brand-text font-bold">
                              {selectedOrder.guestName || "Customer"}
                            </strong>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-stone-400 font-semibold w-16 shrink-0">Phone:</span>
                            <span className="font-mono text-stone-800 font-semibold">
                              {selectedOrder.guestPhone || "No phone provided"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2 border-t border-stone-100">
                          <span className="text-stone-400 font-semibold w-16 shrink-0">Address:</span>
                          <p className="text-stone-800 font-medium leading-relaxed bg-[#FAF6EF]/70 p-2.5 rounded-xl border border-stone-200/80 flex-1">
                            {addr.formattedAddress}
                          </p>
                        </div>

                        {addr.customerNotes && (
                          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1 mt-2">
                            <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800 uppercase tracking-wider">
                              <FileText className="h-3.5 w-3.5 text-amber-700" />
                              <span>Customer Request / Note</span>
                            </div>
                            <p className="italic font-medium text-stone-700 pl-5">
                              &ldquo;{addr.customerNotes}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Items & Customer Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-heading text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Ordered Line Items
                  </h4>
                  <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white overflow-hidden">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <strong className="font-bold text-brand-text block">{item.nameSnapshot}</strong>
                          <span className="text-stone-500">Qty: {item.quantity} × ₹{item.priceSnapshot}</span>
                        </div>
                        <span className="font-heading font-bold text-brand-text">
                          ₹{(item.priceSnapshot * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    <div className="p-3.5 bg-stone-50 flex items-center justify-between text-xs font-bold text-brand-text">
                      <span>Total (including delivery)</span>
                      <span className="text-sm font-extrabold text-brand-primary">
                        ₹{selectedOrder.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer with Public Link and Back button */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <Link
                    href={`/order/${encodeURIComponent(selectedOrder.orderNumber)}/confirmation`}
                    target="_blank"
                    className="inline-flex items-center gap-1 font-bold text-brand-primary hover:underline"
                  >
                    Open Public Confirmation Page
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(null)}
                    leftIcon={<ChevronLeft className="h-4 w-4" />}
                    className="text-xs font-bold"
                  >
                    Back to Orders
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
