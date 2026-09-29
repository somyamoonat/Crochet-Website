import React from "react";
import Link from "next/link";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Container, Button, Card } from "@/components/ui";
import { Home, ShoppingBag, Package, MessageCircle } from "lucide-react";

export const metadata = {
  title: "404 - Dropped Stitch | The Crochet Diaryy",
  description: "Oops! The page you were looking for seems to have unraveled.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-16 sm:py-24 flex items-center justify-center">
        <Container size="md">
          <Card className="p-8 sm:p-14 border border-[#ECE2D2] bg-white rounded-3xl text-center space-y-8 shadow-sm">
            {/* Whimsical Yarn Dropped Stitch Illustration */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#FAF1EA] animate-pulse" />
              <svg
                viewBox="0 0 100 100"
                className="w-24 h-24 text-brand-primary relative z-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Yarn ball body */}
                <circle cx="50" cy="50" r="35" className="text-[#EBD8CE] fill-[#FAF1EA]" stroke="currentColor" strokeWidth="2.5" />
                <path d="M25 40 Q50 65 75 40" stroke="currentColor" strokeWidth="2.5" />
                <path d="M22 55 Q50 80 78 55" stroke="currentColor" strokeWidth="2.5" />
                <path d="M35 25 Q60 50 65 75" stroke="currentColor" strokeWidth="2.5" />
                <path d="M50 20 Q50 50 50 80" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
                {/* Crochet hook poking out */}
                <path d="M68 22 L85 10 C88 8 92 12 90 15 L78 27" className="text-[#3B4D36]" strokeWidth="3" />
                {/* Unraveled yarn thread curling down */}
                <path d="M35 75 C30 85 20 90 12 85 C5 80 15 70 25 72 C32 74 30 92 40 94 C50 96 55 90 65 92" stroke="#D98E73" strokeWidth="3" />
              </svg>
            </div>

            {/* Error Message */}
            <div className="space-y-3 max-w-md mx-auto">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-brand-primary bg-[#FAF1EA] px-3 py-1 rounded-full border border-brand-primary/20">
                404 • Dropped Stitch
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
                Oops! This Pattern Got Tangled
              </h1>

              <p className="font-handwriting text-2xl text-brand-primary font-bold">
                The page you are looking for has unraveled
              </p>

              <p className="text-sm text-stone-600 leading-relaxed pt-1">
                The link might be broken, or the item may have found a happy home elsewhere. Don&apos;t worry — Nitika&apos;s hook is always ready to stitch something fresh!
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/">
                <Button variant="primary" size="lg" leftIcon={<Home className="h-4 w-4" />}>
                  Back to Home
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" size="lg" leftIcon={<ShoppingBag className="h-4 w-4" />}>
                  Explore Boutique
                </Button>
              </Link>

              <Link href="/account/orders">
                <Button variant="ghost" size="lg" leftIcon={<Package className="h-4 w-4 text-stone-500" />}>
                  Track Order
                </Button>
              </Link>
            </div>

            {/* Direct Help */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-stone-500">
              <span>Looking for something specific?</span>
              <a
                href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20ran%20into%20a%20broken%20link%20or%20missing%20product%20on%20your%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#1FA952] hover:underline flex items-center gap-1"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
                <span>Chat with Nitika on WhatsApp</span>
              </a>
            </div>
          </Card>
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
