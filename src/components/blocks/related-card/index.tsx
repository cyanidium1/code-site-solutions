import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/components/ui";

export type RelatedCardProps = {
  eyebrow?: string;
  category?: string;
  title: string;
  sub?: string;
  metrics?: string[];
  coverImage?: { src: string; alt: string };
  /** Fallback gradient for the mockup cover when no image is provided. */
  gradient?: string;
  /** `null` renders the card as a non-clickable "Coming soon" tile. */
  href: string | null;
};

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, oklch(0.30 0.10 290), oklch(0.22 0.06 250))";

// Shared class strings exported for other portfolio/case consumers
// (case-page/index.tsx, portfolio/nbyg-shared.tsx) that compose their own
// JSX out of the same hp-case-* visual primitives.
export const caseLinkClass =
  "group/case block overflow-hidden rounded-[22px] border border-line bg-[oklch(1_0_0_/_0.02)] text-inherit no-underline transition-[transform,border-color] duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-line-strong";
export const caseCoverClass = "relative aspect-[4/3] overflow-hidden";
export const caseCoverBgClass = "absolute inset-0";
export const caseCoverDotsClass =
  "absolute inset-0 [background-image:radial-gradient(circle,oklch(1_0_0_/_0.10)_1px,transparent_1px)] [background-size:20px_20px] opacity-50";
export const caseShotClass =
  "absolute inset-7 overflow-hidden rounded-[10px] border border-[oklch(1_0_0_/_0.12)] bg-[oklch(0_0_0_/_0.30)] backdrop-blur-md";
export const caseShotBarClass =
  "flex items-center gap-1.5 border-b border-[oklch(1_0_0_/_0.10)] px-3 py-2";
export const caseShotDotClass = "h-[7px] w-[7px] rounded-full bg-[oklch(1_0_0_/_0.25)]";
export const caseShotBodyClass = "flex flex-col gap-2 p-4";
export const caseShotLineClass = "h-1.5 rounded";
export const caseShotLineS1 = cn(caseShotLineClass, "w-[32%] bg-[oklch(1_0_0_/_0.18)]");
export const caseShotLineS2 = cn(caseShotLineClass, "w-[65%] bg-[oklch(1_0_0_/_0.14)]");
export const caseShotLineS3 = cn(caseShotLineClass, "w-[48%] bg-[oklch(1_0_0_/_0.10)]");
export const caseBodyClass = "px-6 py-[22px]";
export const caseChipsClass = "flex flex-wrap gap-1.5";
export const caseChipClass =
  "inline-flex rounded-md border border-line bg-[oklch(1_0_0_/_0.03)] px-2 py-[3px] font-mono text-[10.5px] text-ink-3";
export const caseNameRowClass = "mt-3.5 flex items-start justify-between gap-3";
export const caseNameClass = "font-actay text-xl font-semibold leading-[1.2] text-ink";
export const caseArrowClass =
  "shrink-0 text-ink-3 transition-[transform,color] duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/case:translate-x-1 group-hover/case:-translate-y-1 group-hover/case:text-ink";
export const caseMetaClass = "mt-1 font-mono text-[11px] text-ink-3";
export const caseMetricsClass = "mt-4 text-[13px] leading-[1.55] text-ink-dim";
// 3-up grid wrapper. Used by Cases (homepage), case-page related grid,
// portfolio listings. Falls to 1-col @800px.
export const casesGridClass = "grid grid-cols-1 gap-5 lg:grid-cols-3";

export function RelatedCard({
  eyebrow,
  category,
  title,
  sub,
  metrics = [],
  coverImage,
  gradient,
  href,
}: RelatedCardProps) {
  const disabled = !href;
  const chips = [category, ...metrics].filter(
    (c): c is string => Boolean(c && c.trim()),
  );

  const cover = (
    <div className={caseCoverClass}>
      {coverImage ? (
        <img
          src={coverImage.src}
          alt={coverImage.alt}
          className="absolute inset-0 block h-full w-full object-cover object-top"
        />
      ) : (
        <>
          <div
            className={caseCoverBgClass}
            // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient string per card
            style={{ background: gradient ?? DEFAULT_GRADIENT }}
          />
          <div className={caseCoverDotsClass} />
          <div className={caseShotClass}>
            <div className={caseShotBarClass}>
              <span className={caseShotDotClass} />
              <span className={caseShotDotClass} />
              <span className={caseShotDotClass} />
            </div>
            <div className={caseShotBodyClass}>
              <div className={caseShotLineS1} />
              <div className={caseShotLineS2} />
              <div className={caseShotLineS3} />
            </div>
          </div>
        </>
      )}
      {disabled ? (
        <span className="absolute right-3.5 top-3.5 rounded-full border border-[oklch(1_0_0/0.18)] bg-[oklch(0_0_0/0.4)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[oklch(1_0_0/0.85)] backdrop-blur-md">
          Coming soon
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className={caseBodyClass}>
      {chips.length > 0 ? (
        <div className={caseChipsClass}>
          {chips.map((ch) => (
            <span key={ch} className={caseChipClass}>
              {ch}
            </span>
          ))}
        </div>
      ) : null}
      <div className={caseNameRowClass}>
        <h3 className={caseNameClass}>{title}</h3>
        {!disabled ? (
          <ArrowUpRight size={20} strokeWidth={1.6} className={caseArrowClass} />
        ) : null}
      </div>
      {eyebrow ? <div className={caseMetaClass}>{eyebrow}</div> : null}
      {sub ? <div className={caseMetricsClass}>{sub}</div> : null}
    </div>
  );

  if (disabled) {
    return (
      <div className={cn(caseLinkClass, "pointer-events-none cursor-default opacity-[0.78]")}>
        {cover}
        {body}
      </div>
    );
  }

  return (
    <Link href={href} className={caseLinkClass}>
      {cover}
      {body}
    </Link>
  );
}
