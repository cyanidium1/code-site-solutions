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
 * Centered, max-width-capped wrapper with horizontal gutter that respects
 * the legacy --gutter-x token (responsive overrides in globals.css :root
 * stay in effect during Phase 1; Phase 2 inverts those to mobile-first).
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
        "mx-auto w-full px-(--gutter-x)",
        widthClass[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
