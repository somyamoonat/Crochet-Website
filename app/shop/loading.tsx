import React from "react";
import { Container, Skeleton } from "@/components/ui";

export default function ShopLoading() {
  return (
    <div className="py-8 sm:py-12 bg-[#FBF6EF] min-h-screen">
      <Container size="xl" className="space-y-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-10 w-3/4 mx-auto rounded-xl" />
          <Skeleton className="h-5 w-1/2 mx-auto rounded-md" />
        </div>

        {/* Filter controls skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#EAE1D3]">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-36 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-[#EAE1D3] bg-white p-4 space-y-4 shadow-xs"
            >
              {/* Product Image Skeleton */}
              <Skeleton className="aspect-square w-full rounded-2xl" />

              {/* Badges & Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md" />
                </div>
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>

              {/* Price & Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
