import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "default" | "brand";

const variantClass: Record<Variant, string> = {
  default: "bg-text-gradient bg-clip-text text-transparent",
  brand: "bg-brand-gradient bg-clip-text text-transparent",
};

interface TextGradientProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

/**
 * Inline gradient-fill text. Wrap a word or phrase to fill it with the
 * --background-image-text-gradient (default) or brand gradient.
 */
export function TextGradient({
  variant = "default",
  className,
  children,
  ...rest
}: TextGradientProps) {
  return (
    <span className={cn(variantClass[variant], className)} {...rest}>
      {children}
    </span>
  );
}
