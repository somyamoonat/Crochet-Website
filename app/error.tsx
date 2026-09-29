"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container, Card, Button } from "@/components/ui";
import { RotateCcw, Home, MessageCircle, AlertTriangle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FBF6EF] flex items-center justify-center p-4">
      <Container size="md">
        <Card className="p-8 sm:p-12 border border-[#EAE1D3] bg-white rounded-3xl text-center space-y-6 shadow-sm">
          {/* Yarn Unraveled Graphic */}
          <div className="h-16 w-16 mx-auto rounded-3xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Pattern Glitch
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
              A Stitch Unraveled!
            </h1>
            <p className="font-handwriting text-2xl text-brand-primary font-bold">
              Don&apos;t worry, Nitika&apos;s hook is ready to fix it
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
              An unexpected hiccup occurred while rendering this page. You can try picking up the stitch again, or jump back to the shop.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => reset()}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Pick Up Stitch (Try Again)
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Home className="h-4 w-4" />}
              >
                Back to Boutique
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-center gap-1.5">
            <span>Stuck? Reach out to Nitika:</span>
            <a
              href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20hit%20an%20error%20on%20the%20website."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1FA952] font-bold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </Card>
      </Container>
    </div>
  );
}
