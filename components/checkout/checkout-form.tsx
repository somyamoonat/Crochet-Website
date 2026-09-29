"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { checkoutOrderSchema, CheckoutOrderInput } from "@/lib/validations";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  PICKUP_STUDIO_ADDRESS,
  WHATSAPP_URL,
} from "@/lib/constants";
import {
  Container,
  Card,
  Button,
  Input,
  Textarea,
  StitchDivider,
} from "@/components/ui";
import {
  ShoppingBag,
  Truck,
  Store,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  User,
  AlertCircle,
  Sparkles,
  CreditCard,
  Banknote,
} from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    clearCart,
    getTotalPrice,
    getTotalItems,
    hasMadeToOrder,
    maxLeadTimeDays,
  } = useCartStore();

  const [mounted, setMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = getTotalItems();
  const subtotal = getTotalPrice();
  const containsMadeToOrder = hasMadeToOrder();
  const maxDays = maxLeadTimeDays() || 4;

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutOrderInput>({
    resolver: zodResolver(checkoutOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      deliveryType: "DELIVERY",
      paymentMethod: "RAZORPAY",
      line1: "",
      line2: "",
      city: "Ratlam",
      pincode: "457001",
      notes: "",
    },
  });

  // Watch delivery method & payment method
  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");

  // Dynamic store settings
  const [storeDeliveryFee, setStoreDeliveryFee] = React.useState(DELIVERY_FEE);
  const [storeFreeThreshold, setStoreFreeThreshold] = React.useState(FREE_DELIVERY_THRESHOLD);
  const [storeCity, setStoreCity] = React.useState("Ratlam");

  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (typeof data.settings.deliveryFee === "number") setStoreDeliveryFee(data.settings.deliveryFee);
          if (typeof data.settings.freeDeliveryThreshold === "number") setStoreFreeThreshold(data.settings.freeDeliveryThreshold);
          if (data.settings.cityName) setStoreCity(data.settings.cityName);
        }
      })
      .catch(() => {});
  }, []);

  // Pre-fill logged-in user details & default address if available
  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name) setValue("name", session.user.name);
      if (session.user.email) setValue("email", session.user.email);
      if ((session.user as { phone?: string }).phone) {
        setValue("phone", (session.user as { phone?: string }).phone || "");
      }

      // Also pre-fill default saved address if available
      fetch("/api/addresses")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && Array.isArray(data.addresses) && data.addresses.length > 0) {
            const defaultAddr = data.addresses.find((a: { isDefault: boolean }) => a.isDefault) || data.addresses[0];
            if (defaultAddr) {
              if (defaultAddr.phone) setValue("phone", defaultAddr.phone);
              if (defaultAddr.line1) setValue("line1", defaultAddr.line1);
              if (defaultAddr.line2) setValue("line2", defaultAddr.line2);
              if (defaultAddr.city) setValue("city", defaultAddr.city);
              if (defaultAddr.pincode) setValue("pincode", defaultAddr.pincode);
            }
          }
        })
        .catch(() => {});
    }
  }, [session, setValue]);

  // Delivery fee calculation
  const deliveryFee =
    deliveryType === "PICKUP"
      ? 0
      : subtotal >= storeFreeThreshold
      ? 0
      : storeDeliveryFee;

  const total = subtotal + deliveryFee;

  // Calculate estimated ready date for Made to Order items
  const estimatedReadyDate = React.useMemo(() => {
    if (!containsMadeToOrder) {
      return "Ready within 24 hours";
    }
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + maxDays);
    return targetDate.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }, [containsMadeToOrder, maxDays]);

  // Form submission
  const onSubmit = async (data: CheckoutOrderInput) => {
    if (items.length === 0) {
      setSubmissionError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        deliveryType: data.deliveryType,
        paymentMethod: data.paymentMethod,
        line1: data.deliveryType === "DELIVERY" ? data.line1 : undefined,
        line2: data.deliveryType === "DELIVERY" ? data.line2 : undefined,
        city: data.deliveryType === "DELIVERY" ? (data.city || "Ratlam") : undefined,
        pincode: data.deliveryType === "DELIVERY" ? data.pincode : undefined,
        notes: data.notes,
        subtotal,
        deliveryFee,
        total,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          name: item.name || item.title || "Crochet Piece",
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to create order. Please verify your details.");
      }

      // Clear cart upon successful order registration
      clearCart();

      // Move to payment step (Phase 10)
      const isHandover = data.paymentMethod === "PAY_ON_DELIVERY";
      router.push(
        `/checkout/payment?orderId=${encodeURIComponent(result.orderId)}&orderNumber=${encodeURIComponent(
          result.orderNumber
        )}&method=${isHandover ? "handover" : "razorpay"}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setSubmissionError(msg);
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="py-20 text-center">
        <Container size="lg">
          <div className="h-96 rounded-3xl bg-white/60 animate-pulse border border-stone-200" />
        </Container>
      </div>
    );
  }

  // Empty cart redirect prompt
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24">
        <Container size="md">
          <Card className="p-8 sm:p-14 text-center space-y-6 border border-dashed border-[#E3D8C8]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF1EA] text-brand-primary">
              <ShoppingBag className="h-10 w-10 text-brand-primary/60" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold text-brand-text">
                Your basket is empty
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                Add your favorite handmade pieces to your cart before proceeding to checkout.
              </p>
            </div>
            <div>
              <Link href="/shop">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore Handmade Boutique
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <Container size="xl" className="space-y-8">
        {/* Checkout Header */}
        <div className="border-b border-[#ECE2D2] pb-6 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-handwriting text-2xl text-brand-primary font-bold">
              Final Step
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-brand-text">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Handcrafted with love • Doorstep delivery or free studio pickup
          </p>
        </div>

        {/* Global Error Banner if submission fails */}
        {submissionError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p>{submissionError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Form Details (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Logged in status or Guest checkout badge */}
              <div className="rounded-2xl border border-[#ECE2D2] bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FAF1EA] text-brand-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    {session?.user ? (
                      <div>
                        <p className="text-xs font-bold text-brand-text">
                          Logged in as {session.user.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-stone-500">{session.user.email}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-brand-text">
                          Guest Checkout (No account required)
                        </p>
                        <p className="text-[11px] text-stone-500">
                          We will only use your contact info for order updates and handover.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {!session?.user && (
                  <Link
                    href="/login"
                    className="text-xs font-bold text-brand-primary hover:underline self-start sm:self-auto"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* 1. Customer Information Card */}
              <Card className="p-6 border border-[#ECE2D2] shadow-xs space-y-5 bg-white">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                    1
                  </span>
                  <h2 className="font-heading text-base font-bold text-brand-text">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      Full Name <span className="text-brand-primary">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Somya Moonat"
                      {...register("name")}
                      error={errors.name?.message}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Phone & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        Phone Number (WhatsApp) <span className="text-brand-primary">*</span>
                      </label>
                      <Input
                        placeholder="10-digit mobile number"
                        type="tel"
                        {...register("phone")}
                        error={errors.phone?.message}
                        className="rounded-xl"
                      />
                      <p className="text-[10px] text-stone-400">
                        Used for delivery updates & order coordination.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <Input
                        placeholder="yourname@gmail.com (optional)"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                        className="rounded-xl"
                      />
                      <p className="text-[10px] text-stone-400">
                        Confirmation email sent here if provided.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 2. Delivery Method Toggle Card */}
              <Card className="p-6 border border-[#ECE2D2] shadow-xs space-y-5 bg-white">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                      2
                    </span>
                    <h2 className="font-heading text-base font-bold text-brand-text">
                      Delivery Method
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-brand-secondary bg-[#EBF2EA] px-2.5 py-0.5 rounded-full">
                    Direct Handover
                  </span>
                </div>

                {/* Delivery Method Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option A: Home Delivery */}
                  <label
                    onClick={() => setValue("deliveryType", "DELIVERY")}
                    className={`flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      deliveryType === "DELIVERY"
                        ? "border-brand-primary bg-[#FAF1EA] ring-2 ring-brand-primary/20 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Truck className="h-5 w-5 text-brand-primary" />
                        <div>
                          <p className="font-heading text-sm font-bold text-brand-text">
                            Home Delivery in {storeCity}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Doorstep hand-delivery by Nitika
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        value="DELIVERY"
                        {...register("deliveryType")}
                        className="mt-1 text-brand-primary cursor-pointer"
                      />
                    </div>
                    <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="text-stone-500">Delivery Fee:</span>
                      <span className="font-bold text-brand-text">
                        {subtotal >= storeFreeThreshold ? (
                          <span className="text-emerald-700 font-bold">FREE (Above ₹{storeFreeThreshold})</span>
                        ) : (
                          formatINR(storeDeliveryFee)
                        )}
                      </span>
                    </div>
                  </label>

                  {/* Option B: Self Pickup */}
                  <label
                    onClick={() => setValue("deliveryType", "PICKUP")}
                    className={`flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition ${
                      deliveryType === "PICKUP"
                        ? "border-brand-primary bg-[#FAF1EA] ring-2 ring-brand-primary/20 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Store className="h-5 w-5 text-brand-secondary" />
                        <div>
                          <p className="font-heading text-sm font-bold text-brand-text">
                            Self Pickup at Studio
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Collect directly at our studio workshop
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        value="PICKUP"
                        {...register("deliveryType")}
                        className="mt-1 text-brand-primary cursor-pointer"
                      />
                    </div>
                    <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                      <span className="text-stone-500">Pickup Fee:</span>
                      <span className="font-bold text-emerald-700">FREE</span>
                    </div>
                  </label>
                </div>

                {/* Conditional Form: Address Form ONLY if Delivery selected */}
                {deliveryType === "DELIVERY" ? (
                  <div className="space-y-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                      <MapPin className="h-4 w-4 text-brand-primary" />
                      <span>Delivery Address</span>
                    </div>

                    {/* Street Address Line 1 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        House / Flat No., Building & Street <span className="text-brand-primary">*</span>
                      </label>
                      <Input
                        placeholder="e.g. 14, Shanti Nagar, Near Station Road"
                        {...register("line1")}
                        error={errors.line1?.message}
                        className="rounded-xl"
                      />
                    </div>

                    {/* Landmark / Line 2 */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        Landmark / Area (Optional)
                      </label>
                      <Input
                        placeholder="e.g. Opposite Jain Temple, Freeganj"
                        {...register("line2")}
                        className="rounded-xl"
                      />
                    </div>

                    {/* City & Pincode Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700">City</label>
                        <Input
                          placeholder="City"
                          {...register("city")}
                          className="rounded-xl font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-700">
                          Pincode <span className="text-brand-primary">*</span>
                        </label>
                        <Input
                          placeholder="e.g. 457001"
                          maxLength={6}
                          {...register("pincode")}
                          error={errors.pincode?.message}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Pickup Studio Information Box */
                  <div className="rounded-2xl border border-brand-secondary/30 bg-[#EBF2EA] p-4 space-y-2 text-xs text-[#3B4D36]">
                    <div className="flex items-center gap-2 font-bold">
                      <Store className="h-4 w-4 text-brand-secondary" />
                      <span>{PICKUP_STUDIO_ADDRESS.name}</span>
                    </div>
                    <p className="leading-relaxed text-stone-700">
                      {PICKUP_STUDIO_ADDRESS.note}
                    </p>
                  </div>
                )}

                {/* Order Special Notes */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-stone-700">
                    Special Instructions / Notes for Nitika (Optional)
                  </label>
                  <Textarea
                    placeholder="e.g. Please pack with a birthday note, ring bell twice, preferred delivery time..."
                    {...register("notes")}
                    className="rounded-xl text-xs"
                    rows={2}
                  />
                </div>
              </Card>

              {/* 3. Payment Method Selection Card */}
              <Card className="p-6 border border-[#ECE2D2] shadow-xs space-y-5 bg-white">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                      3
                    </span>
                    <h2 className="font-heading text-base font-bold text-brand-text">
                      Payment Method
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-stone-500">
                    Secure & Verified
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Option A: Online Payment via Razorpay */}
                  <label
                    onClick={() => setValue("paymentMethod", "RAZORPAY")}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === "RAZORPAY"
                        ? "border-brand-primary bg-[#FAF1EA] ring-2 ring-brand-primary/20 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="RAZORPAY"
                      {...register("paymentMethod")}
                      className="mt-1 text-brand-primary cursor-pointer"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-brand-primary" />
                          <p className="font-heading text-sm font-bold text-brand-text">
                            Online Payment (UPI, Cards, NetBanking)
                          </p>
                        </div>
                        <span className="rounded-md bg-[#FAF1EA] px-2 py-0.5 text-[10px] font-bold text-brand-primary">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Instant confirmation via UPI (Google Pay, PhonePe, Paytm), Credit / Debit Cards, or Netbanking.
                      </p>
                    </div>
                  </label>

                  {/* Option B: Pay on Delivery / Pickup */}
                  <label
                    onClick={() => setValue("paymentMethod", "PAY_ON_DELIVERY")}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === "PAY_ON_DELIVERY"
                        ? "border-brand-primary bg-[#FAF1EA] ring-2 ring-brand-primary/20 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value="PAY_ON_DELIVERY"
                      {...register("paymentMethod")}
                      className="mt-1 text-brand-primary cursor-pointer"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-[#4A5D45]" />
                          <p className="font-heading text-sm font-bold text-brand-text">
                            Pay on Delivery / Pickup (Cash or UPI)
                          </p>
                        </div>
                        <span className="rounded-md bg-[#EBF2EA] px-2 py-0.5 text-[10px] font-bold text-[#3B4D36]">
                          Instant Confirm
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Pay with cash or UPI QR scan when your handcrafted pieces are delivered to your doorstep or collected at the studio. No online payment step required!
                      </p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>

            {/* Right Column: Order Summary Sidebar (lg:col-span-5) */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <Card className="p-6 border border-[#ECE2D2] shadow-xs space-y-6 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-heading text-lg font-bold text-brand-text">
                    Order Summary
                  </h3>
                  <span className="text-xs text-stone-500 font-bold">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </span>
                </div>

                {/* Line Items List Preview */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const displayName = item.name || item.title || "Crochet Item";
                    const isMadeToOrder = item.stockType === "MADE_TO_ORDER";

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 text-xs pb-3 border-b border-stone-100 last:border-b-0 last:pb-0"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-[#FAF1EA]">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={displayName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs">
                              🧶
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-brand-text truncate">{displayName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                            <span>Qty: {item.quantity}</span>
                            {item.variant && (
                              <span className="text-brand-primary font-medium truncate">
                                • {item.variant}
                              </span>
                            )}
                          </div>
                          {isMadeToOrder && (
                            <span className="inline-block mt-0.5 rounded-md bg-[#FAECE8] px-1.5 py-0.2 text-[9px] font-bold text-[#9E5740]">
                              Made to Order
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-brand-text">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Combined Estimated Ready Date Notice */}
                <div className="rounded-2xl border border-brand-primary/20 bg-[#FAF3EA] p-3.5 space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center gap-2 font-bold text-brand-text">
                    <Clock className="h-4 w-4 text-brand-primary shrink-0" />
                    <span>Estimated Completion / Handover</span>
                  </div>
                  <p className="text-stone-700 font-semibold text-xs">
                    {containsMadeToOrder ? (
                      <>
                        Estimated Ready by: <strong className="text-brand-primary">{estimatedReadyDate}</strong>
                      </>
                    ) : (
                      <>
                        Ready for Handover: <strong className="text-brand-secondary">{estimatedReadyDate}</strong>
                      </>
                    )}
                  </p>
                  {containsMadeToOrder && (
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Based on ~{maxDays} days needed to stitch your made-to-order piece(s) fresh.
                    </p>
                  )}
                </div>

                {/* Subtotal, Delivery Fee & Total Calculation */}
                <div className="space-y-2.5 text-xs border-t border-stone-100 pt-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-brand-text">{formatINR(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-stone-600 items-baseline">
                    <div className="space-y-0.5">
                      <span>Delivery Fee</span>
                      {deliveryType === "DELIVERY" && subtotal < storeFreeThreshold && (
                        <p className="text-[10px] text-stone-400">
                          Add {formatINR(storeFreeThreshold - subtotal)} more for free delivery!
                        </p>
                      )}
                    </div>
                    <span className="font-bold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700">FREE</span>
                      ) : (
                        formatINR(deliveryFee)
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <div>
                      <span className="font-heading text-base font-bold text-brand-text block">
                        Total Amount
                      </span>
                      <span className="text-[10px] text-stone-400">All local taxes included</span>
                    </div>
                    <div className="text-right">
                      <span className="font-heading text-2xl font-extrabold text-brand-text">
                        {formatINR(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit / Proceed to Payment Button */}
                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full shadow-md hover:shadow-lg py-4 text-base font-bold"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {paymentMethod === "PAY_ON_DELIVERY"
                      ? "Place Order (Pay on Handover)"
                      : "Proceed to Payment"}
                  </Button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-secondary" />
                      UPI, Cards &amp; COD
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                      100% Handcrafted
                    </span>
                  </div>
                </div>
              </Card>

              {/* Need Assistance Callout */}
              <div className="rounded-2xl border border-stone-200/80 bg-white p-4 text-xs text-stone-600 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <p className="font-bold text-brand-text">Have a question?</p>
                  <p className="text-[11px] text-stone-500">Nitika is happy to help on WhatsApp.</p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#E8F8EE] text-[#1FA952] px-3 py-1.5 font-bold hover:bg-[#25D366] hover:text-white transition text-xs shrink-0"
                >
                  WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </form>

        <StitchDivider variant="loops" color="primary" />
      </Container>
    </div>
  );
}
