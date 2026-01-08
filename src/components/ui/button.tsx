"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out rounded-2xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-night-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Primary - warm and inviting
            primary:
              "bg-sage text-night-200 hover:bg-sage-dark active:scale-[0.98] shadow-sm hover:shadow-md",
            // Secondary - subtle
            secondary:
              "bg-surface-light text-cream hover:bg-surface active:scale-[0.98]",
            // Ghost - minimal
            ghost:
              "text-cream-muted hover:text-cream hover:bg-surface",
          }[variant],
          {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
          }[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
