import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type Level = 1 | 2 | 3;
type Variant = "default" | "hp" | "case" | "page-hero";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: Level;
  variant?: Variant;
}

/**
 * Utility strings reproduce legacy .h1 / .hp-h1 / .hp-h2 / .case-h2 /
 * .page-hero-h1 sizes from globals.css as of 2026-05-24. Headings inherit
 * the Actay Wide font via the global `h1,h2,h3` selector during Phase 1;
 * once that selector is removed in Task 43, the font-actay class below
 * applies it explicitly.
 */
const sizes: Record<Level, Record<Variant, string>> = {
  1: {
    default: "font-actay text-[64px] leading-[1.05] tracking-[-0.02em] font-bold",
    hp: "font-actay text-[64px] leading-[1.05] tracking-[-0.02em] font-bold",
    case: "font-actay text-[56px] leading-[1.05] tracking-[-0.02em] font-bold",
    "page-hero": "font-actay text-[72px] leading-[1.02] tracking-[-0.02em] font-bold",
  },
  2: {
    default: "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    hp: "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    case: "font-actay text-[40px] leading-[1.1] tracking-[-0.01em] font-bold",
    "page-hero": "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
  },
  3: {
    default: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    hp: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    case: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "page-hero": "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
  },
};

export function Heading({
  level,
  variant = "default",
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <Tag className={cn(sizes[level][variant], className)} {...rest}>
      {children}
    </Tag>
  );
}

export const H1 = (props: Omit<HeadingProps, "level">) => <Heading level={1} {...props} />;
export const H2 = (props: Omit<HeadingProps, "level">) => <Heading level={2} {...props} />;
export const H3 = (props: Omit<HeadingProps, "level">) => <Heading level={3} {...props} />;
