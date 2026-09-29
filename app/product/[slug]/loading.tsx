import React from "react";
import { Container, Skeleton } from "@/components/ui";

export default function ProductDetailLoading() {
  return (
    <div className="py-8 sm:py-12 bg-[#FBF6EF] min-h-screen">
      <Container size="xl" className="space-y-10">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        {/* Product Details 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Gallery Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="grid grid-cols-4 gap-3">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="aspect-square w-full rounded-2xl" />
            </div>
          </div>

          {/* Right Column: Info & Buy Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-9 w-4/5 rounded-xl" />
              <Skeleton className="h-7 w-32 rounded-lg" />
            </div>

            {/* Badge strip */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            {/* Description lines */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>

            {/* Variants Skeleton */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart */}
            <div className="pt-4 flex items-center gap-3">
              <Skeleton className="h-12 w-28 rounded-2xl" />
              <Skeleton className="h-12 flex-1 rounded-2xl" />
            </div>

            {/* Trust strip */}
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        </div>
      </Container>
    </div>
  );
}
