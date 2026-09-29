import React from "react";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Container, Card } from "@/components/ui";
import {
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  FileText,
  AlertTriangle,
  MapPin,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Store Policies | The Crochet Diaryy",
  description:
    "Review our delivery zones, order fulfillment timelines, payment options, and return policies for handmade crochet goods.",
};

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-10 sm:py-16">
        <Container size="lg" className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF1EA] px-3.5 py-1 text-xs font-bold text-brand-primary border border-brand-primary/20">
              <FileText className="h-3.5 w-3.5" />
              <span>Transparency &amp; Trust</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
              Store &amp; Fulfillment Policies
            </h1>

            <p className="font-handwriting text-2xl text-brand-primary font-bold">
              Fair, handmade terms crafted with care
            </p>

            <p className="text-sm text-stone-600 leading-relaxed pt-1">
              Please read our local delivery guidelines, payment terms, and handmade return policies below before placing an order.
            </p>
          </div>

          {/* Prominent Founder Review Banner */}
          <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/90 p-5 sm:p-6 text-amber-950 flex flex-col sm:flex-row items-start gap-4 shadow-xs">
            <div className="h-10 w-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <strong className="font-heading text-base font-bold text-amber-950 block">
                [PLACEHOLDER — REVIEW]
              </strong>
              <p className="text-amber-900 leading-relaxed">
                The policies and clauses listed on this page represent draft operational guidelines tailored for <strong>The Crochet Diaryy</strong>. All clauses marked with <code>[PLACEHOLDER — REVIEW]</code> must be reviewed, adjusted, and approved by founder <strong>Nitika Tanted</strong> prior to legal reliance.
              </p>
            </div>
          </div>

          {/* Quick Navigation Anchor Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-stone-600">
            <a href="#delivery-policy" className="px-3.5 py-1.5 rounded-full bg-white border border-[#EAE1D3] hover:border-brand-primary hover:text-brand-primary transition">
              1. Delivery &amp; Pickup Area
            </a>
            <a href="#payment-methods" className="px-3.5 py-1.5 rounded-full bg-white border border-[#EAE1D3] hover:border-brand-primary hover:text-brand-primary transition">
              2. Accepted Payment Methods
            </a>
            <a href="#returns-policy" className="px-3.5 py-1.5 rounded-full bg-white border border-[#EAE1D3] hover:border-brand-primary hover:text-brand-primary transition">
              3. Returns &amp; Handmade Guarantees
            </a>
            <a href="#privacy-terms" className="px-3.5 py-1.5 rounded-full bg-white border border-[#EAE1D3] hover:border-brand-primary hover:text-brand-primary transition">
              4. Privacy &amp; Communications
            </a>
          </div>

          {/* Section 1: Delivery Area & Fulfillment */}
          <section id="delivery-policy" className="scroll-mt-24">
            <Card className="p-6 sm:p-10 border border-[#EAE1D3] bg-white rounded-3xl space-y-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#FAF1EA] text-brand-primary flex items-center justify-center">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    [PLACEHOLDER — REVIEW]
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
                    1. Delivery Area &amp; Timelines Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div>
                  <h3 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    Local Delivery &amp; Pickup Zone
                  </h3>
                  <p>
                    Doorstep delivery is available within our local service zone in Madhya Pradesh. Orders outside our standard delivery zone can be coordinated for studio pickup or custom courier dispatch upon request.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-2">
                    <h4 className="font-heading text-sm font-bold text-stone-900">
                      Home Delivery Rates
                    </h4>
                    <p className="text-xs text-stone-600">
                      • Flat rate of <strong>₹49</strong> for orders under ₹799.
                      <br />
                      • <strong>FREE Home Delivery</strong> for orders of ₹799 or more.
                      <br />
                      • Hand-delivered with delicate packaging directly to your doorstep.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 space-y-2">
                    <h4 className="font-heading text-sm font-bold text-stone-900">
                      Studio Self-Pickup
                    </h4>
                    <p className="text-xs text-stone-600">
                      • <strong>Always FREE</strong> with no minimum order value.
                      <br />
                      • Studio self-pickup (exact address and timing coordinated upon order confirmation).
                      <br />
                      • Pickup hours: 10:00 AM – 7:30 PM (Mon–Sat).
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-primary" />
                    Lead Times: Ready-to-Ship vs. Made-to-Order
                  </h3>
                  <p>
                    • <strong>Ready to Ship Items:</strong> Dispatched or ready for studio collection within 24 to 48 hours of order confirmation.
                    <br />
                    • <strong>Made to Order Items:</strong> Each item is hooked by hand by Nitika. Standard lead times range from 3 to 14 business days depending on complexity and yarn batch availability. If an order contains both item types, the order will ship once the longest piece is completed.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 2: Payment Methods */}
          <section id="payment-methods" className="scroll-mt-24">
            <Card className="p-6 sm:p-10 border border-[#EAE1D3] bg-white rounded-3xl space-y-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#EBF2EA] text-[#3B4D36] flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    [PLACEHOLDER — REVIEW]
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
                    2. Accepted Payment Methods
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>
                  To make shopping seamless for our patrons, The Crochet Diaryy supports both instant digital settlement and offline payment upon receiving your order:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/60 space-y-2">
                    <h3 className="font-bold text-stone-900">
                      A. Online Payment via Razorpay
                    </h3>
                    <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                      <li>UPI: Google Pay, PhonePe, Paytm, BHIM, Cred</li>
                      <li>Debit &amp; Credit Cards: Visa, MasterCard, RuPay</li>
                      <li>Netbanking with all major Indian banks</li>
                      <li>Encrypted &amp; 100% RBI-compliant processing</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/60 space-y-2">
                    <h3 className="font-bold text-stone-900">
                      B. Pay on Delivery / Studio Pickup
                    </h3>
                    <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                      <li>Cash on Delivery (exact cash change appreciated)</li>
                      <li>Instant UPI QR code scan at doorstep / studio</li>
                      <li>No advance deposit required for standard catalog items</li>
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-stone-500 italic">
                  Note on high-volume custom orders: For custom bridal bouquets, bulk party favors, or customized blankets over ₹3,000, an advance deposit of 50% may be requested prior to yarn procurement.
                </p>
              </div>
            </Card>
          </section>

          {/* Section 3: Returns & Exchange Policy */}
          <section id="returns-policy" className="scroll-mt-24">
            <Card className="p-6 sm:p-10 border border-[#EAE1D3] bg-white rounded-3xl space-y-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#FAECE8] text-rose-700 flex items-center justify-center">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    [PLACEHOLDER — REVIEW]
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
                    3. Returns, Exchanges &amp; Cancellation Policy
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 space-y-2">
                  <strong className="text-rose-900 block font-heading">
                    Non-Returnable Nature of Artisanal Handmade Goods
                  </strong>
                  <p className="text-rose-800 text-xs leading-relaxed">
                    Because each creation is handcrafted exclusively upon demand, customized, and requires hours of meticulous manual handwork, <strong>we do NOT accept returns or exchanges for change of mind or personal preference</strong>.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1">
                    Damaged or Defective Goods upon Arrival
                  </h3>
                  <p>
                    Every package is inspected with supreme care before handoff. In the rare scenario that a piece arrives damaged, defective, or structurally compromised:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-600 pl-1 pt-1.5">
                    <li>
                      <strong>Record an Unboxing Video:</strong> Please record a continuous, unedited video while opening your delivery parcel for the first time.
                    </li>
                    <li>
                      <strong>Notify Within 24 Hours:</strong> Send the unboxing video and photo proof to Nitika on WhatsApp at{" "}
                      <a href="https://wa.me/919770124355" className="text-[#25D366] font-semibold hover:underline">
                        +91 97701 24355
                      </a>{" "}
                      within 24 hours of package delivery.
                    </li>
                    <li>
                      <strong>Resolution:</strong> Upon verification, we will happily arrange for a repair, a freshly remade replacement, or store credit.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 mb-1">
                    Order Cancellations
                  </h3>
                  <p>
                    Orders may be cancelled within <strong>12 hours</strong> of placement by contacting us directly. Once yarn winding, pattern cutting, or custom stitching has commenced, cancellations cannot be honored.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 4: Privacy & Communications */}
          <section id="privacy-terms" className="scroll-mt-24">
            <Card className="p-6 sm:p-10 border border-[#EAE1D3] bg-white rounded-3xl space-y-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    [PLACEHOLDER — REVIEW]
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
                    4. Privacy &amp; Customer Information
                  </h2>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>
                  We treat your privacy with the same tenderness as our crochet stitches:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 pl-1">
                  <li>Your phone number and delivery address are exclusively utilized to coordinate delivery fulfillment and order updates.</li>
                  <li>We never sell, rent, or distribute customer details to third-party marketing brokers.</li>
                  <li>Payment processing is handled securely by Razorpay; we never view or store sensitive debit/credit card credentials on our servers.</li>
                </ul>
              </div>
            </Card>
          </section>

          {/* Founder Review Footer Callout */}
          <div className="text-center p-6 border border-stone-200/80 bg-[#FAF1EA] rounded-2xl text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800">
              Questions regarding these policies or need clarification?
            </p>
            <p>
              Founder Nitika Tanted is available directly via WhatsApp at{" "}
              <a href="https://wa.me/919770124355" className="text-[#25D366] font-bold hover:underline">
                +91 97701 24355
              </a>{" "}
              or email at{" "}
              <a href="mailto:admin@thecrochetdiaryy.com" className="font-bold underline text-stone-800">
                admin@thecrochetdiaryy.com
              </a>.
            </p>
          </div>
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
