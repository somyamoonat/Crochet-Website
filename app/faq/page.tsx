"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Container, Card, Button } from "@/components/ui";
import {
  HelpCircle,
  Truck,
  Clock,
  Sparkles,
  HeartHandshake,
  CreditCard,
  ChevronDown,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: React.ReactNode;
  tag?: string;
  badgeWarning?: boolean;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "Delivery & Local Pickup",
    icon: <Truck className="h-5 w-5 text-brand-primary" />,
    items: [
      {
        q: "Where do you deliver?",
        a: (
          <p>
            We offer personalized doorstep delivery as well as free studio self-pickup. Because our items are delicate and handmade, orders are carefully prepared and handed over with maximum care.
          </p>
        ),
      },
      {
        q: "How much does delivery cost?",
        a: (
          <p>
            Doorstep delivery is a flat <strong>₹49</strong>, and completely <strong>FREE</strong> for orders above ₹799! Studio pickup from our workshop is always free regardless of order amount.
          </p>
        ),
      },
      {
        q: "How does studio self-pickup work?",
        a: (
          <p>
            When choosing &ldquo;Self Pickup&rdquo; at checkout, you will receive our studio workshop location and an estimated ready date. As soon as Nitika finishes your piece, we send a WhatsApp notification with pickup coordinates.
          </p>
        ),
      },
    ],
  },
  {
    title: "Made-to-Order Timelines",
    icon: <Clock className="h-5 w-5 text-brand-primary" />,
    items: [
      {
        q: "How long does a made-to-order item take to create?",
        a: (
          <p>
            Every crochet piece is hand-stitched loop by loop. Standard amigurumi plushies, floral bouquets, and pouches typically require <strong>3 to 7 business days</strong>. Larger items like granny square bags, baby blankets, or bulk wedding favors take <strong>10 to 14 days</strong>. Each product page displays its specific lead time.
          </p>
        ),
      },
      {
        q: "What is the difference between 'Ready to Ship' and 'Made to Order'?",
        a: (
          <p>
            <strong>Ready to Ship:</strong> In-stock pieces already crafted by Nitika, dispatched or ready for pickup within 24–48 hours.
            <br />
            <strong>Made to Order:</strong> Stitched fresh upon receiving your order, allowing custom color choices or sizing.
          </p>
        ),
      },
      {
        q: "Can I place a rush order for a birthday or anniversary?",
        a: (
          <p>
            If you need an order urgently for an upcoming event or celebration, please message Nitika on WhatsApp at{" "}
            <a
              href="https://wa.me/919770124355"
              className="text-[#25D366] font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 97701 24355
            </a>{" "}
            before placing the order. We will check our current hook schedule and do our absolute best to accommodate!
          </p>
        ),
      },
    ],
  },
  {
    title: "Care Instructions for Handmade Crochet",
    icon: <Sparkles className="h-5 w-5 text-brand-primary" />,
    items: [
      {
        q: "How do I wash and clean my crochet plushies or flowers?",
        a: (
          <div className="space-y-2">
            <p>
              Crochet items require gentle care to preserve stitch tension, shape, and yarn softness:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 pl-1">
              <li>
                <strong>Spot Clean First:</strong> For small smudges, gently dab with a damp cloth and mild baby soap.
              </li>
              <li>
                <strong>Gentle Hand Wash:</strong> Submerge in lukewarm or cold water with mild liquid detergent. Gently press; do NOT wring, scrub, or twist.
              </li>
              <li>
                <strong>Drying:</strong> Press flat between two clean towels to extract excess moisture. Reshape the item with your hands and lay it flat to air-dry in the shade. Never hang or tumble dry.
              </li>
            </ul>
          </div>
        ),
      },
      {
        q: "What yarns do you use? Are they safe for babies?",
        a: (
          <p>
            We use premium hypoallergenic 4-ply &amp; 5-ply milk cotton yarns and super-soft velvet chenille yarn. Our plushies use secure safety eyes backed with washers and non-toxic high-resilience polyester fiberfill, making them wonderfully soft and child-friendly.
          </p>
        ),
      },
    ],
  },
  {
    title: "Returns, Exchanges & Cancellations",
    icon: <HeartHandshake className="h-5 w-5 text-brand-primary" />,
    items: [
      {
        q: "What is your return/exchange policy for handmade goods?",
        badgeWarning: true,
        tag: "[CONFIRM WITH FOUNDER]",
        a: (
          <div className="space-y-2">
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>[CONFIRM WITH FOUNDER] — Policy statement subject to final confirmation</span>
            </div>
            <p>
              Due to the bespoke, personalized, and time-intensive nature of handmade crochet crafts, <strong>we do not accept returns or exchanges for change of mind</strong>.
            </p>
            <p className="text-xs text-stone-600">
              Each piece is created with hours of dedicated artisanal labor. Please review sizing, dimensions, and color palettes carefully prior to ordering.
            </p>
          </div>
        ),
      },
      {
        q: "What if my item arrives defective or damaged?",
        badgeWarning: true,
        tag: "[CONFIRM WITH FOUNDER]",
        a: (
          <div className="space-y-2">
            <p>
              We take immense pride in quality control. In the rare event that an item arrives with a structural defect or transit damage, please record an <strong>unboxing video</strong> and contact us on WhatsApp (+91 97701 24355) within <strong>24 hours</strong> of receiving the package.
            </p>
            <p className="text-xs text-stone-600">
              Upon verification, Nitika will gladly offer a free repair, replacement piece, or store credit.
            </p>
          </div>
        ),
      },
      {
        q: "Can I cancel my made-to-order piece?",
        a: (
          <p>
            Cancellations are accepted within <strong>12 hours</strong> of placing your order. Once yarn has been wound or stitching has begun, made-to-order items cannot be cancelled.
          </p>
        ),
      },
    ],
  },
  {
    title: "Payments & Pricing",
    icon: <CreditCard className="h-5 w-5 text-brand-primary" />,
    items: [
      {
        q: "What payment methods do you accept?",
        a: (
          <p>
            We offer two convenient payment choices:
            <br />
            1. <strong>Online Payment:</strong> Pay instantly with UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or Netbanking.
            <br />
            2. <strong>Pay on Delivery / Pickup:</strong> Pay via Cash or direct UPI scan upon receiving or collecting your order.
          </p>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
    "1-0": true,
    "3-0": true,
  });

  const toggle = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-10 sm:py-16">
        <Container size="lg" className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF1EA] px-3.5 py-1 text-xs font-bold text-brand-primary border border-brand-primary/20">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Frequently Asked Questions</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
              Got Questions? We Have Answers.
            </h1>

            <p className="font-handwriting text-2xl text-brand-primary font-bold">
              Everything you need to know about our handmade crafts
            </p>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1">
              Find answers regarding doorstep delivery, made-to-order timelines, yarn care tips, and our handmade policies.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-10 max-w-4xl mx-auto">
            {FAQ_DATA.map((cat, catIdx) => (
              <div key={cat.title} className="space-y-4">
                <div className="flex items-center gap-2.5 pb-1 border-b border-[#ECE2D2]">
                  {cat.icon}
                  <h2 className="font-heading text-xl font-bold text-brand-text">
                    {cat.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key];

                    return (
                      <Card
                        key={key}
                        className="border border-[#EAE1D3] bg-white rounded-2xl overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => toggle(key)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-heading text-sm sm:text-base font-bold text-brand-text hover:text-brand-primary transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{item.q}</span>
                            {item.tag && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform duration-200 text-stone-400 ${
                              isOpen ? "rotate-180 text-brand-primary" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                            {item.a}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <Card className="max-w-3xl mx-auto p-8 sm:p-10 border border-[#D98E73]/30 bg-[#FAF1EA] rounded-3xl text-center space-y-4">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
              Didn&apos;t find what you were looking for?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Nitika is always happy to chat directly about specific dimensions, custom color palettes, or special delivery coordination.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20have%20a%20question%20that%20wasn't%20in%20the%20FAQ."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE]"
                  leftIcon={<MessageCircle className="h-4 w-4 text-[#25D366]" />}
                >
                  Ask Nitika on WhatsApp
                </Button>
              </a>

              <Link href="/contact">
                <Button variant="primary" size="md">
                  Send a Message
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
