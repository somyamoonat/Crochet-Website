import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wider uppercase text-brand-text/80"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-stone-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full rounded-2xl border border-stone-300 bg-white/90 px-4 py-2.5 text-sm text-brand-text placeholder:text-stone-400 transition-all duration-150",
              "hover:border-stone-400 hover:bg-white",
              "focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-primary/20",
              "disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-400 focus:border-red-500 focus:ring-red-200",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-stone-400 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-xs font-medium text-red-600 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-stone-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
