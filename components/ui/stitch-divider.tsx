import * as React from "react";
import { cn } from "@/lib/utils";

export interface StitchDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "loops" | "shell" | "dash-stitch";
  color?: "primary" | "secondary" | "accent" | "muted";
  withCenterAccent?: boolean;
}

export function StitchDivider({
  variant = "loops",
  color = "primary",
  withCenterAccent = true,
  className,
  ...props
}: StitchDividerProps) {
  const colorMap = {
    primary: "text-brand-primary stroke-brand-primary fill-brand-primary",
    secondary: "text-brand-secondary stroke-brand-secondary fill-brand-secondary",
    accent: "text-brand-accent stroke-brand-accent fill-brand-accent",
    muted: "text-[#DCD2C4] stroke-[#DCD2C4] fill-[#DCD2C4]",
  };

  return (
    <div
      role="separator"
      aria-label="Crochet stitch divider"
      className={cn(
        "relative flex w-full items-center justify-center my-8 select-none overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Left Stitch Line */}
      <div className="flex-1 flex justify-end overflow-hidden max-w-xl opacity-80">
        <svg
          className={cn("h-5 w-full", colorMap[color])}
          viewBox="0 0 300 20"
          fill="none"
          preserveAspectRatio="none"
        >
          {variant === "loops" && (
            <path
              d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10 T 150 10 T 180 10 T 210 10 T 240 10 T 270 10 T 300 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === "shell" && (
            <path
              d="M0 14 Q 15 2, 30 14 Q 45 2, 60 14 Q 75 2, 90 14 Q 105 2, 120 14 Q 135 2, 150 14 Q 165 2, 180 14 Q 195 2, 210 14 Q 225 2, 240 14 Q 255 2, 270 14 Q 285 2, 300 14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          )}
          {variant === "dash-stitch" && (
            <line
              x1="0"
              y1="10"
              x2="300"
              y2="10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      {/* Center Crochet Motif / Loop Knot */}
      {withCenterAccent && (
        <div className="mx-3 flex shrink-0 items-center justify-center">
          <div className="relative flex items-center justify-center rounded-full bg-brand-bg px-2.5 py-1">
            <svg
              className={cn("h-6 w-6", colorMap[color])}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Stylized Interlocking Crochet Loop / Yarn Skein Knot */}
              <circle cx="12" cy="12" r="7" strokeDasharray="3 2" />
              <path d="M7 12 C 7 8, 17 8, 17 12 C 17 16, 7 16, 7 12 Z" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}

      {/* Right Stitch Line */}
      <div className="flex-1 flex justify-start overflow-hidden max-w-xl opacity-80">
        <svg
          className={cn("h-5 w-full", colorMap[color])}
          viewBox="0 0 300 20"
          fill="none"
          preserveAspectRatio="none"
        >
          {variant === "loops" && (
            <path
              d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 120 10 T 150 10 T 180 10 T 210 10 T 240 10 T 270 10 T 300 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}
          {variant === "shell" && (
            <path
              d="M0 14 Q 15 2, 30 14 Q 45 2, 60 14 Q 75 2, 90 14 Q 105 2, 120 14 Q 135 2, 150 14 Q 165 2, 180 14 Q 195 2, 210 14 Q 225 2, 240 14 Q 255 2, 270 14 Q 285 2, 300 14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          )}
          {variant === "dash-stitch" && (
            <line
              x1="0"
              y1="10"
              x2="300"
              y2="10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
