"use client";

import React from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  PackageCheck,
  Truck,
  MapPin,
  Heart,
  XCircle,
} from "lucide-react";

export type OrderStatusType =
  | "RECEIVED"
  | "CONFIRMED"
  | "MAKING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusTimelineProps {
  status: OrderStatusType;
  deliveryType?: "DELIVERY" | "PICKUP";
  className?: string;
}

export function OrderStatusTimeline({
  status,
  deliveryType = "DELIVERY",
  className = "",
}: OrderStatusTimelineProps) {
  const isPickup = deliveryType === "PICKUP";
  const isCancelled = status === "CANCELLED";

  const standardSteps = [
    {
      key: "RECEIVED",
      label: "Received",
      description: "Order placed in diary",
      icon: ClipboardCheck,
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      description: "Queued for creation",
      icon: CheckCircle2,
    },
    {
      key: "MAKING",
      label: "Making",
      description: "Handcrafted with yarn",
      icon: Sparkles,
    },
    {
      key: "READY",
      label: "Ready",
      description: "Packed & quality checked",
      icon: PackageCheck,
    },
    {
      key: "OUT_FOR_DELIVERY",
      label: isPickup ? "Ready for Pickup" : "Out for Delivery",
      description: isPickup ? "Available at home studio" : "En route to doorstep",
      icon: isPickup ? MapPin : Truck,
    },
    {
      key: "DELIVERED",
      label: isPickup ? "Collected" : "Delivered",
      description: isPickup ? "Handed over at studio" : "Delivered to doorstep",
      icon: Heart,
    },
  ];

  const statusOrder: Record<string, number> = {
    RECEIVED: 0,
    CONFIRMED: 1,
    MAKING: 2,
    READY: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
  };

  const currentStepIndex = isCancelled ? -1 : statusOrder[status] ?? 0;

  if (isCancelled) {
    return (
      <div className={`rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-center space-y-3 ${className}`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <XCircle className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-bold text-rose-900">Order Cancelled</h3>
          <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto leading-relaxed">
            This order has been marked as cancelled. If this was unexpected or if you have questions regarding refunds, please contact Nitika directly on WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Desktop & Tablet Horizontal Stepper */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Track */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-stone-200 -z-0" />

          {/* Active Progress Track */}
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#4A5D45] transition-all duration-700 -z-0"
            style={{
              width: `${(currentStepIndex / (standardSteps.length - 1)) * 100}%`,
            }}
          />

          {standardSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center group text-center max-w-[90px]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCurrent
                      ? "border-brand-primary bg-brand-primary text-white shadow-md ring-4 ring-brand-primary/20 scale-110"
                      : isCompleted
                      ? "border-[#4A5D45] bg-[#4A5D45] text-white"
                      : "border-stone-300 bg-white text-stone-400"
                  }`}
                >
                  <StepIcon className="h-5 w-5" />
                </div>

                <div className="mt-2.5 space-y-0.5">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isCurrent
                        ? "text-brand-primary"
                        : isCompleted
                        ? "text-[#3B4D36]"
                        : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="block text-[10px] text-stone-500 line-clamp-1 leading-tight">
                    {step.description}
                  </span>
                </div>

                {isCurrent && (
                  <span className="absolute -top-7 rounded-full bg-brand-primary/10 px-2 py-0.5 text-[9px] font-bold text-brand-primary border border-brand-primary/20 whitespace-nowrap animate-pulse">
                    Current Status
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="sm:hidden space-y-4">
        {standardSteps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isUpcoming = idx > currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3.5 relative">
              {/* Connecting line between mobile steps */}
              {idx < standardSteps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] ${
                    idx < currentStepIndex ? "bg-[#4A5D45]" : "bg-stone-200"
                  }`}
                  style={{ height: "calc(100% - 10px)" }}
                />
              )}

              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  isCurrent
                    ? "border-brand-primary bg-brand-primary text-white shadow-md ring-4 ring-brand-primary/20"
                    : isCompleted
                    ? "border-[#4A5D45] bg-[#4A5D45] text-white"
                    : "border-stone-300 bg-white text-stone-400"
                }`}
              >
                <StepIcon className="h-4 w-4" />
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-heading text-sm font-bold ${
                      isCurrent
                        ? "text-brand-primary"
                        : isCompleted
                        ? "text-[#3B4D36]"
                        : "text-stone-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary border border-brand-primary/20">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isUpcoming ? "text-stone-400" : "text-stone-600"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
