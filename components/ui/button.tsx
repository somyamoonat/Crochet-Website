"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-55 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary focus-visible:ring-offset-brand-bg active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-brand-primary text-white shadow-xs hover:bg-[#c67e64] hover:shadow-md active:bg-[#b57057]",
      secondary:
        "bg-brand-secondary text-white shadow-xs hover:bg-[#3d4d38] hover:shadow-md active:bg-[#32402e]",
      outline:
        "border-2 border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary/10 active:bg-brand-primary/20",
      ghost:
        "text-brand-text bg-transparent hover:bg-stone-200/60 hover:text-brand-primary active:bg-stone-300/60",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-full gap-1.5",
      md: "h-11 px-5 text-sm rounded-full gap-2",
      lg: "h-13 px-7 text-base rounded-full gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
