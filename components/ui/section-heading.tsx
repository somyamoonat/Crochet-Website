import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  tagline?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({
  tagline,
  title,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div
      className={cn("flex flex-col max-w-2xl", alignClasses[align], className)}
      {...props}
    >
      {tagline && (
        <span className="font-handwriting text-2xl font-bold tracking-wide text-brand-primary mb-1">
          {tagline}
        </span>
      )}
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-text">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
