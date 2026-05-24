import { type HTMLAttributes, type ElementType } from "react";
import { cn } from "./cn";

type Variant = "default" | "tight" | "lg" | "md";

const yClass: Record<Variant, string> = {
  default: "py-14 lg:py-[100px]",      // 56px mobile → 100px desktop
  tight: "py-9 lg:py-14",              // 36px → 56px
  md: "py-14 lg:py-20",                // 56px → 80px
  lg: "py-[72px] lg:py-[120px]",       // 72px → 120px
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  as?: ElementType;
}

/**
 * Vertical-rhythm wrapper. Mobile-first utility stack: base values
 * target ≤800px viewports, `lg:` overrides reach desktop values.
 * Reconciled with Phase 1's --section-y / --section-y-md / --section-y-lg
 * legacy spacing tokens at the lg breakpoint (800px+).
 */
export function Section({
  variant = "default",
  as: As = "section",
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <As className={cn(yClass[variant], className)} {...rest}>
      {children}
    </As>
  );
}
