import React from "react";
import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF6EF] px-4">
      <Container size="sm" className="text-center space-y-4">
        {/* Animated Yarn Loop Icon */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FAF1EA] animate-ping opacity-75" />
          <div className="relative z-10 h-12 w-12 rounded-full border-3 border-dashed border-[#D98E73] animate-spin flex items-center justify-center">
            <span className="text-base">🧶</span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-lg font-bold text-brand-text">
            Hooking Stitches...
          </h2>
          <p className="font-handwriting text-base text-brand-primary">
            Warming up our yarn for you
          </p>
        </div>
      </Container>
    </div>
  );
}
