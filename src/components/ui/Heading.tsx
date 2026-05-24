import { type HTMLAttributes } from "react";
import { cn } from "./cn";

type Level = 1 | 2 | 3;
type Variant =
  | "default"
  | "hp"
  | "case"
  | "page-hero"
  | "image-text"
  | "comparison"
  | "comparison-contact"
  | "launch-cta";

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
 *
 * NON-STANDARD SIZES — IMPORTANT for Phase C block migrations:
 * Several blocks in the codebase use heading sizes that are NOT just
 * "section h2" or "page hero h1". Examples include calculator info-card
 * h3, blog markdown headings, hero stat numbers, turnkey-list titles, and
 * comparison plan headers. When migrating a block whose heading does not
 * match an existing variant in this table:
 *
 *   1. Prefer adding a NEW variant (e.g. `variant="calc-card"`) to this
 *      file and giving it its own size row. Variants document intent and
 *      let designers find sizes in one place.
 *   2. Do NOT pass arbitrary `text-[Npx]` overrides via `className` as the
 *      default solution — that re-creates the "inline styles everywhere"
 *      problem this refactor is trying to kill.
 *   3. The `className` escape hatch exists for one-off, genuinely unique
 *      headings (a hero numeric counter that is not text, a marquee title
 *      that animates per-character). Use sparingly and add a comment
 *      explaining why a new variant was not warranted.
 */
const sizes: Record<Level, Record<Variant, string>> = {
  1: {
    default: "font-actay text-[64px] leading-[1.05] tracking-[-0.02em] font-bold",
    hp: "font-actay text-[64px] leading-[1.05] tracking-[-0.02em] font-bold",
    case: "font-actay text-[56px] leading-[1.05] tracking-[-0.02em] font-bold",
    "page-hero": "font-actay text-[clamp(36px,4.6vw,60px)] leading-[1.05] tracking-[-0.02em] font-bold",
    "image-text": "font-actay text-[clamp(28px,3.4vw,44px)] leading-[1.05] tracking-[-0.02em] font-bold",
    comparison: "font-actay text-[clamp(34px,4.4vw,56px)] leading-none tracking-[-0.035em] font-bold",
    "comparison-contact": "font-actay text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.03em] font-bold",
    "launch-cta": "font-actay text-[clamp(32px,3.4vw,48px)] leading-[1.2] tracking-[-0.025em] font-bold",
  },
  2: {
    default: "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    hp: "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    case: "font-actay text-[40px] leading-[1.1] tracking-[-0.01em] font-bold",
    "page-hero": "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    "image-text": "font-actay text-[clamp(28px,3.4vw,44px)] leading-[1.1] tracking-[-0.02em] font-bold max-[800px]:text-[clamp(24px,6vw,36px)]",
    comparison:
      "font-actay font-bold text-[clamp(34px,4.4vw,56px)] leading-none tracking-[-0.035em] max-[1100px]:text-[clamp(28px,5vw,44px)] max-[700px]:text-[clamp(24px,8vw,34px)]",
    "comparison-contact":
      "font-actay font-bold text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.03em] max-[700px]:text-[26px]",
    "launch-cta":
      "font-actay font-bold text-[clamp(32px,3.4vw,48px)] leading-[1.2] tracking-[-0.025em] uppercase text-balance max-[700px]:text-[clamp(26px,7vw,36px)]",
  },
  3: {
    default: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    hp: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    case: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "page-hero": "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "image-text": "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    comparison: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "comparison-contact": "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "launch-cta": "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
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
