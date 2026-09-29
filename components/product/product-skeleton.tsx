import React from "react";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-[#ECE3D5] bg-white p-3.5 shadow-xs animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square w-full rounded-2xl bg-stone-200/70" />

      {/* Info Skeleton */}
      <div className="mt-3 flex flex-1 flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="h-3 w-16 rounded-full bg-stone-200/60" />
          <div className="h-4.5 w-3/4 rounded-full bg-stone-200/80" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="h-5 w-16 rounded-full bg-stone-200/80" />
          <div className="h-9 w-9 rounded-full bg-stone-200/70" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
