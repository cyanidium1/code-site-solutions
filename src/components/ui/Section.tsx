import { type HTMLAttributes, type ElementType } from "react";
import { cn } from "./cn";

type Variant = "default" | "tight" | "lg" | "md";

const yClass: Record<Variant, string> = {
  default: "py-(--section-y)",
  tight: "py-(--section-y-tight)",
  lg: "py-(--section-y-lg)",
  md: "py-(--section-y-md)",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  as?: ElementType;
}

/**
 * Vertical-rhythm wrapper using --section-y tokens. Responsive values still
 * come from globals.css :root media queries in Phase 1.
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
