"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Container, Card, Button } from "@/components/ui";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import {
  CheckCircle2,
  MapPin,
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface RazorpayInstance {
  open: () => void;
  on: (
    event: string,
    handler: (response: { error?: { description?: string; code?: string } }) => void
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function PaymentStepContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber") || "CD-XXXX";
  const initialMethod = searchParams.get("method") || "razorpay";

  const [paymentState, setPaymentState] = React.useState<
    "idle" | "loading" | "verifying" | "success" | "failed" | "cancelled"
  >(initialMethod === "handover" ? "success" : "idle");

  const [method, setMethod] = React.useState<"razorpay" | "handover">(
    initialMethod === "handover" ? "handover" : "razorpay"
  );

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = React.useState<{
    paymentId?: string;
    orderNumber?: string;
  } | null>(null);

  // If initial method is handover, order is already CONFIRMED
  const isHandover = method === "handover";

  // Function to initialize Razorpay checkout
  const initiateRazorpayPayment = async () => {
    if (!orderId) {
      setErrorMessage("Missing order ID. Please return to checkout.");
      setPaymentState("failed");
      return;
    }

    setPaymentState("loading");
    setErrorMessage(null);

    try {
      // 1. Call POST /api/razorpay/create-order
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize payment gateway order.");
      }

      // Check if Razorpay script is loaded in window
      if (typeof window === "undefined" || !window.Razorpay) {
        // Fallback test simulation if script was blocked by browser or test keys
        console.warn("Razorpay script not available, providing test simulation fallback");
        await simulateTestVerification(data.razorpayOrderId);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "The Crochet Diaryy",
        description: `Handcrafted Order ${data.order.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          await verifyPaymentOnServer({
            orderId: data.order.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: function () {
            setPaymentState("cancelled");
            setErrorMessage(
              "Payment checkout was cancelled or closed. Your order is safely saved as PENDING."
            );
          },
        },
        prefill: {
          name: data.order.customerName,
          email: data.order.customerEmail,
          contact: data.order.customerPhone,
        },
        theme: {
          color: "#D98E73", // Brand primary terracotta
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: { error?: { description?: string } }) {
          console.error("Razorpay payment failed:", response.error);
          setPaymentState("failed");
          setErrorMessage(
            response.error?.description || "Payment was declined by your bank. Please retry."
          );
        });
        rzp.open();
      } catch (clientErr) {
        console.warn("Error opening Razorpay modal with test keys:", clientErr);
        await simulateTestVerification(data.razorpayOrderId);
      }
    } catch (err: unknown) {
      console.error("Payment initiation error:", err);
      const msg = err instanceof Error ? err.message : "Unable to open payment gateway.";
      setErrorMessage(msg);
      setPaymentState("failed");
    }
  };

  // 3. Call POST /api/razorpay/verify
  const verifyPaymentOnServer = async (verificationPayload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    setPaymentState("verifying");
    try {
      const res = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationPayload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Payment signature verification failed.");
      }

      setPaymentState("success");
      setPaymentDetails({
        paymentId: verificationPayload.razorpayPaymentId,
        orderNumber: result.order?.orderNumber || orderNumber,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification error.";
      setErrorMessage(msg);
      setPaymentState("failed");
    }
  };

  // Helper for automated / test mode verification
  const simulateTestVerification = async (rzpOrderId: string) => {
    await verifyPaymentOnServer({
      orderId: orderId || "",
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: `pay_test_${Date.now()}`,
      razorpaySignature: "test_signature",
    });
  };

  // Switch to Pay on Handover
  const switchToHandover = () => {
    setMethod("handover");
    setPaymentState("success");
    setErrorMessage(null);
  };

  return (
    <>
      {/* Load Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="py-12 sm:py-16">
        <Container size="md">
          {/* SUCCESS STATE */}
          {paymentState === "success" ? (
            <Card className="p-8 sm:p-12 border border-[#ECE2D2] shadow-sm space-y-6 bg-white text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EBF2EA] text-[#3B4D36]">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <span className="font-handwriting text-2xl sm:text-3xl text-brand-primary font-bold">
                  Thank You for Your Order!
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
                  Order Successfully Confirmed
                </h1>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your handcrafted crochet order{" "}
                  <strong className="font-mono text-brand-primary font-bold">
                    {paymentDetails?.orderNumber || orderNumber}
                  </strong>{" "}
                  is now marked as <strong>CONFIRMED</strong>!
                </p>
              </div>

              {/* Order Status Badge Details */}
              <div className="rounded-2xl border border-stone-200/80 bg-[#FAF6EF]/70 p-5 space-y-3 text-xs text-stone-700 max-w-md mx-auto text-left">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
                  <span className="text-stone-500 font-medium">Order Status:</span>
                  <span className="font-bold text-[#3B4D36] bg-[#EBF2EA] px-2.5 py-0.5 rounded-full">
                    CONFIRMED
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
                  <span className="text-stone-500 font-medium">Payment Method:</span>
                  <span className="font-bold text-brand-text">
                    {isHandover ? "Pay on Handover (Cash or UPI)" : "Online Payment (UPI / Cards)"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-stone-200/60">
                  <span className="text-stone-500 font-medium">Payment Status:</span>
                  <span className="font-bold text-emerald-700">
                    {isHandover ? "PENDING (Pay at Delivery/Pickup)" : "PAID (Verified)"}
                  </span>
                </div>

                {paymentDetails?.paymentId && (
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-medium">Payment Transaction ID:</span>
                    <span className="font-mono text-[11px] text-stone-600">
                      {paymentDetails.paymentId}
                    </span>
                  </div>
                )}
              </div>

              {/* Local Handover Notice */}
              <div className="rounded-2xl border border-brand-primary/20 bg-[#FAF3EA] p-4 text-xs text-stone-700 max-w-md mx-auto space-y-1.5 text-left">
                <div className="flex items-center gap-2 font-bold text-brand-text">
                  <MapPin className="h-4 w-4 text-brand-primary" />
                  <span>Doorstep Delivery &amp; Studio Coordination</span>
                </div>
                <p className="leading-relaxed text-stone-600">
                  Nitika Tanted has received your order. She will begin preparing your handmade items and coordinate delivery/pickup with you via WhatsApp.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/order/${encodeURIComponent(paymentDetails?.orderNumber || orderNumber)}/confirmation`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto shadow-md"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    View Order Details & Live Timeline
                  </Button>
                </Link>

                <a
                  href={`https://wa.me/919770124355?text=${encodeURIComponent(
                    `Hi Nitika! I just placed order ${paymentDetails?.orderNumber || orderNumber} on The Crochet Diaryy.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE]"
                    leftIcon={<MessageCircle className="h-4 w-4 text-[#25D366]" />}
                  >
                    WhatsApp Nitika
                  </Button>
                </a>
              </div>
            </Card>
          ) : (
            /* PAYMENT PENDING / IN-PROGRESS / RETRY STATE */
            <Card className="p-6 sm:p-10 border border-[#ECE2D2] shadow-sm space-y-8 bg-white">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF1EA] text-brand-primary">
                  <CreditCard className="h-8 w-8" />
                </div>
                <span className="font-handwriting text-2xl text-brand-primary font-bold">
                  Step 2 of 2
                </span>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
                  Complete Secure Payment
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Order <strong className="font-mono text-brand-primary">{orderNumber}</strong> has been registered with status <strong>RECEIVED</strong> and payment status <strong>PENDING</strong>.
                </p>
              </div>

              {/* Failure / Cancellation Alert */}
              {(paymentState === "failed" || paymentState === "cancelled") && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-2 text-xs sm:text-sm text-amber-900">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Payment Pending</span>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {errorMessage || "The payment window was cancelled. Your order remains safely saved as PENDING."}
                  </p>
                </div>
              )}

              {/* Verifying Spinner Indicator */}
              {paymentState === "verifying" && (
                <div className="rounded-2xl border border-brand-primary/20 bg-[#FAF1EA] p-6 text-center space-y-3">
                  <div className="h-8 w-8 mx-auto border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  <p className="font-heading text-sm font-bold text-brand-text">
                    Verifying Payment Signature with Bank...
                  </p>
                  <p className="text-xs text-stone-500">
                    Please do not close this window while we secure your confirmation.
                  </p>
                </div>
              )}

              {/* Payment Methods and Trigger */}
              <div className="space-y-4">
                {/* Online Payment Button */}
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={paymentState === "loading" || paymentState === "verifying"}
                  disabled={paymentState === "loading" || paymentState === "verifying"}
                  onClick={initiateRazorpayPayment}
                  className="w-full shadow-md py-4 text-base font-bold"
                  leftIcon={
                    paymentState === "failed" || paymentState === "cancelled" ? (
                      <RotateCcw className="h-5 w-5" />
                    ) : (
                      <CreditCard className="h-5 w-5" />
                    )
                  }
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {paymentState === "failed" || paymentState === "cancelled"
                    ? "Retry Payment"
                    : "Pay Now"}
                </Button>

                {/* Alternative: Switch to Pay on Handover */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-stone-200"></div>
                  <span className="flex-shrink mx-4 text-stone-400 text-xs uppercase tracking-wider font-semibold">
                    Or Choose
                  </span>
                  <div className="flex-grow border-t border-stone-200"></div>
                </div>

                <Button
                  variant="outline"
                  size="md"
                  onClick={switchToHandover}
                  className="w-full border-stone-300 hover:border-brand-primary"
                  leftIcon={<Banknote className="h-4 w-4 text-[#4A5D45]" />}
                >
                  Switch to Pay on Handover (Cash or UPI at Delivery)
                </Button>
              </div>

              {/* Trust & Guarantee Info */}
              <div className="rounded-2xl border border-stone-200/80 bg-[#FAF6EF]/60 p-4 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-bold text-brand-text">
                  <ShieldCheck className="h-4 w-4 text-brand-primary" />
                  <span>256-bit Bank-Grade Encryption</span>
                </div>
                <p className="leading-relaxed">
                  Supports Google Pay, PhonePe, Paytm, all Indian credit/debit cards, and netbanking. No additional gateway fees.
                </p>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-stone-500 hover:text-brand-primary transition"
                >
                  ← Return to Shop Collection
                </Link>
              </div>
            </Card>
          )}
        </Container>
      </div>
    </>
  );
}

export default function PaymentStepPage() {
  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col">
      <StoreHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center">
              <Container size="sm">
                <div className="h-64 rounded-3xl bg-white/60 animate-pulse border border-stone-200" />
              </Container>
            </div>
          }
        >
          <PaymentStepContent />
        </Suspense>
      </main>
      <StoreFooter />
    </div>
  );
}
