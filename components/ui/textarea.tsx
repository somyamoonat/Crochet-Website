import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold tracking-wider uppercase text-brand-text/80"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full rounded-2xl border border-stone-300 bg-white/90 p-3.5 text-sm text-brand-text placeholder:text-stone-400 transition-all duration-150 resize-y",
            "hover:border-stone-400 hover:bg-white",
            "focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-primary/20",
            "disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200",
            error && "border-red-400 focus:border-red-500 focus:ring-red-200",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-red-600 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-stone-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
