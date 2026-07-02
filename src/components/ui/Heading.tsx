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
  | "launch-cta"
  | "turnkey"
  | "contact-split"
  | "calc-card"
  | "calc-intro"
  | "calc-summary"
  | "calc-after"
  | "calc-lead";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: Level;
  variant?: Variant;
}

/**
 * Utility strings reproduce the legacy `.h1` / `.hp-h1` / `.hp-h2` /
 * `.case-h2` / `.page-hero-h1` sizes from the deleted per-block CSS files.
 * Each variant matches a specific block's typography contract and is
 * documented at the row level — see also docs/superpowers/specs for the
 * design tokens that informed the clamp ranges. The `font-actay` class
 * applies the heading typeface explicitly (no global selector inheritance).
 *
 * NON-STANDARD SIZES — IMPORTANT when adding new blocks:
 * Several blocks in the codebase use heading sizes that are NOT just
 * "section h2" or "page hero h1". Examples include calculator info-card
 * h3, blog markdown headings, hero stat numbers, turnkey-list titles, and
 * comparison plan headers. When adding a block whose heading does not
 * match an existing variant in this table:
 *
 *   1. Prefer adding a NEW variant (e.g. `variant="calc-card"`) to this
 *      file and giving it its own size row. Variants document intent and
 *      let designers find sizes in one place.
 *   2. Do NOT pass arbitrary `text-[Npx]` overrides via `className` as the
 *      default solution — that re-creates the "inline styles everywhere"
 *      problem this refactor killed.
 *   3. The `className` escape hatch exists for one-off, genuinely unique
 *      headings (a hero numeric counter that is not text, a marquee title
 *      that animates per-character). Use sparingly and add a comment
 *      explaining why a new variant was not warranted.
 */
const sizes: Record<Level, Record<Variant, string>> = {
  1: {
    default: "font-actay text-[64px] leading-[1.05] tracking-[-0.02em] font-bold",
    hp: "font-actay font-bold text-[clamp(26px,7vw,40px)] leading-[0.98] tracking-[-0.035em] uppercase sm:leading-[0.96] md:text-[clamp(36px,5vw,64px)]",
    case: "font-actay text-[56px] leading-[1.05] tracking-[-0.02em] font-bold",
    "page-hero": "font-actay text-[clamp(26px,7vw,36px)] leading-[1.05] tracking-[-0.02em] font-bold md:text-[clamp(36px,4.6vw,60px)]",
    "image-text": "font-actay text-[clamp(28px,3.4vw,44px)] leading-[1.05] tracking-[-0.02em] font-bold",
    comparison: "font-actay text-[clamp(34px,4.4vw,56px)] leading-none tracking-[-0.035em] font-bold",
    "comparison-contact": "font-actay text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.03em] font-bold",
    "launch-cta": "font-actay text-[clamp(32px,3.4vw,48px)] leading-[1.2] tracking-[-0.025em] font-bold",
    turnkey: "font-actay text-[clamp(34px,4vw,52px)] leading-[1.05] tracking-[-0.02em] font-bold",
    "contact-split": "font-actay text-[clamp(28px,3.2vw,36px)] leading-[1.05] tracking-[-0.02em] font-bold",
    "calc-card": "font-actay text-[17px] font-bold tracking-[-0.01em] text-ink",
    "calc-intro": "font-actay text-[18px] font-bold tracking-[-0.01em] text-ink",
    "calc-summary": "font-actay text-[16px] font-bold tracking-[-0.01em] text-ink",
    "calc-after": "font-actay text-[16px] font-bold tracking-[-0.01em] text-ink",
    "calc-lead": "font-actay text-[18px] font-bold tracking-[-0.01em] text-ink",
  },
  2: {
    default: "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    hp: "font-actay font-bold text-[clamp(24px,6vw,32px)] leading-[1.05] tracking-[-0.02em] md:text-[clamp(34px,4vw,56px)]",
    case: "font-actay font-bold text-[clamp(24px,6vw,32px)] leading-none tracking-[-0.035em] max-w-full text-balance md:text-[clamp(30px,5vw,44px)] md:max-w-[14ch] xl:text-[clamp(34px,4.6vw,60px)]",
    "page-hero": "font-actay text-[44px] leading-[1.1] tracking-[-0.01em] font-bold",
    "image-text": "font-actay text-[clamp(24px,6vw,36px)] leading-[1.1] tracking-[-0.02em] font-bold lg:text-[clamp(28px,3.4vw,44px)]",
    comparison:
      "font-actay font-bold text-[clamp(24px,6vw,32px)] leading-none tracking-[-0.035em] md:text-[clamp(28px,5vw,44px)] xl:text-[clamp(34px,4.4vw,56px)]",
    "comparison-contact":
      "font-actay font-bold text-[26px] leading-none tracking-[-0.03em] md:text-[clamp(28px,3.6vw,44px)]",
    "launch-cta":
      "font-actay font-bold text-[clamp(24px,6vw,32px)] leading-[1.2] tracking-[-0.025em] uppercase text-balance md:text-[clamp(32px,3.4vw,48px)]",
    turnkey: "font-actay font-bold text-[clamp(24px,6vw,32px)] leading-[1.05] tracking-[-0.02em] md:text-[clamp(34px,4vw,52px)]",
    "contact-split": "font-actay font-bold text-[clamp(24px,6vw,32px)] leading-[1.05] tracking-[-0.02em] md:text-[clamp(28px,3.2vw,36px)]",
    "calc-card": "font-actay text-[17px] font-bold tracking-[-0.01em] text-ink",
    "calc-intro": "font-actay text-[18px] font-bold tracking-[-0.01em] text-ink",
    "calc-summary": "font-actay text-[16px] font-bold tracking-[-0.01em] text-ink",
    "calc-after": "font-actay text-[16px] font-bold tracking-[-0.01em] text-ink",
    "calc-lead": "font-actay text-[18px] font-bold tracking-[-0.01em] text-ink",
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
    turnkey: "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "contact-split": "font-actay text-[28px] leading-[1.2] tracking-[-0.005em] font-bold",
    "calc-card": "font-actay text-[17px] font-bold tracking-[-0.01em] text-ink m-0",
    "calc-intro": "font-actay text-[18px] font-bold tracking-[-0.01em] text-ink m-0",
    "calc-summary": "font-actay text-[16px] font-bold tracking-[-0.01em] text-ink m-0",
    "calc-after": "font-actay text-[16px] font-bold tracking-[-0.01em] text-ink m-0",
    "calc-lead": "font-actay text-[18px] font-bold tracking-[-0.01em] text-ink m-0",
  },
};

/**
 * Italic-em padding fix: brand-gradient italic <em> glyphs slant past the
 * inline-box edge; without this padding, background-clip:text clips the
 * descender/tail. box-decoration-clone makes the padding apply per fragment
 * when the em wraps to multiple lines. Applies to every Heading regardless
 * of whether the em uses a gradient (cost is 2.5px of trailing space which
 * is invisible without the gradient). Mirrors the `h1 em / h2 em / h3 em`
 * rule in globals.css for raw heading tags that bypass this primitive.
 */
const EM_GRADIENT_FIX = "[&_em]:pe-[0.16em] [&_em]:box-decoration-clone";
const GLOBAL_HEADING_STYLE = "uppercase";

export function Heading({
  level,
  variant = "default",
  className,
  children,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <Tag
      className={cn(sizes[level][variant], EM_GRADIENT_FIX, GLOBAL_HEADING_STYLE, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const H1 = (props: Omit<HeadingProps, "level">) => <Heading level={1} {...props} />;
export const H2 = (props: Omit<HeadingProps, "level">) => <Heading level={2} {...props} />;
export const H3 = (props: Omit<HeadingProps, "level">) => <Heading level={3} {...props} />;
