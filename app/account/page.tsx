"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  StitchDivider,
} from "@/components/ui";
import {
  Mail,
  Phone,
  Package,
  MapPin,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Loader2,
} from "lucide-react";
import { AddressModal } from "@/components/account/address-modal";
import { FallbackAddress } from "@/lib/fallback-addresses";

interface SimpleOrderSummary {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Address state
  const [addresses, setAddresses] = React.useState<FallbackAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = React.useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<FallbackAddress | null>(null);
  const [addressNotice, setAddressNotice] = React.useState<string | null>(null);

  // Orders state
  const [recentOrders, setRecentOrders] = React.useState<SimpleOrderSummary[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(true);

  // Route protection fallback if middleware hasn't redirected yet
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  // Load user saved addresses
  const loadAddresses = React.useCallback(async () => {
    try {
      setIsLoadingAddresses(true);
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.addresses)) {
          setAddresses(data.addresses);
        }
      }
    } catch (err) {
      console.warn("Could not fetch addresses:", err);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  // Load recent orders
  const loadRecentOrders = React.useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setRecentOrders(data.orders.slice(0, 3));
        }
      }
    } catch (err) {
      console.warn("Could not fetch orders:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  React.useEffect(() => {
    if (status === "authenticated") {
      loadAddresses();
      loadRecentOrders();
    }
  }, [status, loadAddresses, loadRecentOrders]);

  if (status === "loading") {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-primary border-t-transparent" />
          <p className="font-handwriting text-2xl text-brand-primary">Opening your diary...</p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    phone?: string;
  };

  const isAdmin = user.role === "ADMIN";

  const handleEditAddressClick = (addr: FallbackAddress) => {
    setSelectedAddress(addr);
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddressClick = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleAddressSaved = (saved: FallbackAddress) => {
    setAddresses((prev) => {
      const idx = prev.findIndex((a) => a.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    setAddressNotice("Delivery address saved successfully!");
    setTimeout(() => {
      setAddressNotice(null);
    }, 4000);

    // Refresh from backend to ensure synchronization
    loadAddresses();
  };

  return (
    <main className="py-12 md:py-16">
      <Container size="lg" className="space-y-10">
        {/* Header with Greeting & Admin Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-handwriting text-2xl text-brand-primary">Welcome,</span>
              <Badge variant={isAdmin ? "Ready to Ship" : "accent"}>
                {isAdmin ? "Admin Account" : "Customer Account"}
              </Badge>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
              {user.name || "Crochet Enthusiast"}
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Manage your personal details, saved delivery addresses, and past orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin">
                <Button variant="secondary" size="md" rightIcon={<ExternalLink className="h-4 w-4" />}>
                  Admin Dashboard
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="md"
              leftIcon={<LogOut className="h-4 w-4" />}
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center font-heading text-2xl font-bold">
                    {(user.name || user.email || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name || "Customer"}</CardTitle>
                    <p className="text-xs text-stone-500 font-mono">{user.email}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 border-t border-stone-100 pt-4 text-sm">
                <div className="flex items-center gap-2.5 text-stone-700">
                  <Mail className="h-4 w-4 text-stone-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                <div className="flex items-center gap-2.5 text-stone-700">
                  <Phone className="h-4 w-4 text-stone-400 shrink-0" />
                  <span>
                    {addresses.length > 0 && addresses[0].phone
                      ? addresses[0].phone
                      : user.phone || "No phone added yet"}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-stone-700">
                  <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
                  <span>Madhya Pradesh, India</span>
                </div>

                {isAdmin && (
                  <div className="rounded-2xl bg-[#EBF2EA] p-3 text-xs text-[#3B4D36] border border-[#D1E0CE] flex items-center gap-2 mt-4">
                    <ShieldCheck className="h-4 w-4 text-brand-secondary shrink-0" />
                    <span>Administrator privilege enabled</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Local Delivery Info Box */}
            <div className="rounded-3xl border border-[#E9DFD0] bg-[#FAF3EA] p-5 space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-1.5 font-bold text-brand-text">
                <MapPin className="h-4 w-4 text-brand-primary" />
                Handcrafted &amp; Delivered with Care
              </div>
              <p className="leading-relaxed">
                Nitika personally prepares and packages each order, offering convenient doorstep delivery or free self-pickup at the studio.
              </p>
            </div>
          </div>

          {/* Main Content: Orders & Saved Addresses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Orders Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-brand-primary" />
                    Order History
                  </CardTitle>
                  <CardDescription>
                    Track your orders from &quot;Received&quot; to &quot;Delivered&quot;.
                  </CardDescription>
                </div>

                <Link href="/account/orders">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    View All Orders
                  </Button>
                </Link>
              </CardHeader>

              <CardContent>
                {isLoadingOrders ? (
                  <div className="py-8 flex items-center justify-center gap-2 text-stone-400 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                    <span>Loading recent orders...</span>
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-2xl border border-stone-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-primary/30 transition shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-extrabold text-brand-primary">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF1EA] text-brand-primary">
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            <span>•</span>
                            <span>{ord.items?.length || 0} items</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <span className="text-sm font-bold text-stone-800">
                            ₹{ord.total.toLocaleString("en-IN")}
                          </span>
                          <Link href={`/order/${encodeURIComponent(ord.orderNumber)}/confirmation`}>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-stone-200 p-8 text-center space-y-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-lg font-semibold text-brand-text">
                        No orders yet
                      </h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Explore our handcrafted amigurumi plushies, tote bags, and cardigans. Each piece is crafted just for you!
                      </p>
                    </div>
                    <Link href="/">
                      <Button variant="primary" size="md" leftIcon={<Sparkles className="h-4 w-4" />}>
                        Explore Catalogue
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Addresses Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-secondary" />
                    Saved Addresses
                  </CardTitle>
                  <CardDescription>
                    Your preferred drop-off addresses for orders and delivery.
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  onClick={handleAddNewAddressClick}
                >
                  Add Address
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success alert banner */}
                {addressNotice && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{addressNotice}</span>
                  </div>
                )}

                {isLoadingAddresses ? (
                  <div className="py-6 flex items-center justify-center gap-2 text-stone-400 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                    <span>Loading saved addresses...</span>
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition hover:border-stone-300"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                              {addr.label || "DEFAULT DELIVERY"}
                            </span>
                            {addr.isDefault && (
                              <Badge variant="Ready to Ship" showIcon={false}>
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-brand-text">
                            {addr.recipientName || user.name || "Customer Name"}
                          </p>
                          <p className="text-xs text-stone-500">
                            {addr.line1}
                            {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city},{" "}
                            {addr.state || "Madhya Pradesh"} - {addr.pincode}
                          </p>
                          {addr.phone && (
                            <p className="text-[11px] text-stone-400 flex items-center gap-1 pt-0.5">
                              <Phone className="h-3 w-3" />
                              <span>{addr.phone}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddressClick(addr)}
                            className="rounded-xl border-[#D98E73]/40 text-[#B8684C] hover:bg-[#FAF1EA]"
                          >
                            Edit Address
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-stone-200 p-6 text-center space-y-3">
                    <p className="text-xs text-stone-500">
                      No delivery address saved yet.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={handleAddNewAddressClick}
                    >
                      Add Delivery Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <StitchDivider variant="loops" color="secondary" />
      </Container>

      {/* Edit / Add Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSaved={handleAddressSaved}
        initialAddress={selectedAddress}
        defaultName={user.name || "Somya Moonat"}
        defaultPhone={user.phone || "+91 98765 43210"}
      />
    </main>
  );
}
