import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Clock, Ban } from "lucide-react";

export type BadgeVariant =
  | "Ready to Ship"
  | "Made to Order"
  | "Sold Out"
  | "ready-to-ship"
  | "made-to-order"
  | "sold-out"
  | "accent";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  showIcon?: boolean;
}

export function Badge({
  className,
  variant = "Ready to Ship",
  showIcon = true,
  children,
  ...props
}: BadgeProps) {
  const normalizedVariant = variant.toLowerCase().replace(/ /g, "-");

  let styles = "bg-stone-100 text-stone-700 border-stone-200";
  let label = children;
  let icon: React.ReactNode = null;

  switch (normalizedVariant) {
    case "ready-to-ship":
      styles =
        "bg-[#EBF2EA] text-[#3B4D36] border-[#D1E0CE] hover:bg-[#E3EDE1]";
      label = children || "Ready to Ship";
      icon = <Sparkles className="h-3 w-3 shrink-0 text-[#4A5D45]" />;
      break;

    case "made-to-order":
      styles =
        "bg-[#FAECE8] text-[#9E5740] border-[#F2D7D0] hover:bg-[#F6E3DD]";
      label = children || "Made to Order";
      icon = <Clock className="h-3 w-3 shrink-0 text-[#D98E73]" />;
      break;

    case "sold-out":
      styles =
        "bg-stone-200/70 text-stone-500 border-stone-300 line-through decoration-stone-400";
      label = children || "Sold Out";
      icon = <Ban className="h-3 w-3 shrink-0 text-stone-400" />;
      break;

    case "accent":
      styles =
        "bg-[#F7E6E8] text-[#8C4A54] border-[#ECD0D4]";
      label = children || "Special Edition";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide rounded-full border transition-colors duration-150 select-none",
        styles,
        className
      )}
      {...props}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
}
