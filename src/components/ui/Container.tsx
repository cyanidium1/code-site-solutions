import { type HTMLAttributes, type ElementType } from "react";
import { cn } from "./cn";

type Variant = "default" | "h1" | "narrow" | "prose" | "form";

const widthClass: Record<Variant, string> = {
  default: "max-w-container",
  h1: "max-w-container-h1",
  narrow: "max-w-container-narrow",
  prose: "max-w-container-prose",
  form: "max-w-container-form",
};

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant;
  as?: ElementType;
}

/**
 * Centered, max-width-capped wrapper with horizontal gutter.
 * Mobile-first utility stack: 24px base (≤640) → 32px at sm: (640+)
 *  → 48px at lg: (800+). Matches the @theme --spacing-gutter-* token
 * values; the utility stack is preferred over var() references because
 * Tailwind's responsive prefixes give mobile-first scaling for free.
 */
export function Container({
  variant = "default",
  as: As = "div",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <As
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        widthClass[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
