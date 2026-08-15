import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/components/ui";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg, type SanityImgInput } from "@/lib/shared/sanity-image";

export type RelatedCardProps = {
  eyebrow?: string;
  category?: string;
  title: string;
  sub?: string;
  metrics?: string[];
  /** `src` takes anything SanityImg accepts: URL/path string or image object. */
  coverImage?: { src: SanityImgInput; alt: string };
  /** Programmatic cover: deterministic gradient + the (localized) title text.
   *  Used by blog cards when a post has no CMS cover, so the cover text
   *  always matches the active locale. Ignored when `coverImage` is set. */
  generatedCover?: { title: string; category?: string; brand?: string };
  /** Cover area aspect: 4/3 (portfolio cases, default) or 1.91:1 ("wide" —
   *  blog covers, which are designed as og-card frames). */
  coverAspect?: "album" | "wide";
  /** Fallback gradient for the mockup cover when no image is provided. */
  gradient?: string;
  /** `null` renders the card as a non-clickable "Coming soon" tile. */
  href: string | null;
};

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, oklch(0.30 0.10 290), oklch(0.22 0.06 250))";

/* Palette pool for generated covers — dark, brand-adjacent hues. The pick is
   a deterministic hash of the title, so a card keeps its colors between
   renders and locales while different posts get different gradients. */
const GENERATED_GRADIENTS = [
  "linear-gradient(131deg, oklch(0.34 0.13 292) 0%, oklch(0.19 0.06 258) 78%)",
  "linear-gradient(118deg, oklch(0.33 0.12 252) 0%, oklch(0.18 0.05 300) 80%)",
  "linear-gradient(142deg, oklch(0.32 0.11 322) 0%, oklch(0.18 0.05 272) 76%)",
  "linear-gradient(125deg, oklch(0.31 0.09 212) 0%, oklch(0.17 0.05 262) 82%)",
  "linear-gradient(136deg, oklch(0.30 0.08 182) 0%, oklch(0.17 0.05 240) 78%)",
  "linear-gradient(122deg, oklch(0.33 0.10 268) 0%, oklch(0.18 0.06 322) 80%)",
] as const;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function GeneratedCover({
  title,
  category,
  brand = "CODE-SITE.ART",
}: NonNullable<RelatedCardProps["generatedCover"]>) {
  const gradient = GENERATED_GRADIENTS[hashSeed(title) % GENERATED_GRADIENTS.length];
  return (
    <>
      <div
        className={caseCoverBgClass}
        // eslint-disable-next-line react/forbid-dom-props -- deterministic per-title gradient
        style={{ background: gradient }}
      />
      <div className={caseCoverDotsClass} />
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[oklch(1_0_0/0.55)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_295)] shadow-[0_0_8px_oklch(0.72_0.16_295/0.8)]" />
          {category ?? "BLOG"}
        </div>
        <div className="font-actay uppercase font-bold text-[clamp(17px,1.6vw,23px)] leading-[1.18] text-[oklch(0.97_0.005_300)] line-clamp-3 [text-wrap:balance]">
          {title}
        </div>
        <div className="flex items-center justify-between">
          <span className="h-[5px] w-16 rounded-full bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.5_0.19_320))]" />
          <span className="font-mono text-[10px] tracking-[0.14em] text-[oklch(1_0_0/0.35)]">
            {brand}
          </span>
        </div>
      </div>
    </>
  );
}

// Shared class strings exported for other portfolio/case consumers
// (e.g. case-page/index.tsx) that compose their own JSX out of the same
// hp-case-* visual primitives.
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
// Line-clamps below prevent layout shift when card sets swap behind a filter
// (homepage Cases pills, /portfolio dropdowns): all variable text regions
// have a hard line ceiling, so any swap produces same-height cards row-to-row.
// Counts chosen to fit the longest current CMS strings without truncation.
export const caseNameClass =
  "font-actay uppercase text-xl font-semibold leading-[1.2] text-ink line-clamp-2";
export const caseArrowClass =
  "shrink-0 text-ink-3 transition-[transform,color] duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/case:translate-x-1 group-hover/case:-translate-y-1 group-hover/case:text-ink";
export const caseMetaClass = "mt-1 font-mono text-[11px] text-ink-3 line-clamp-2";
export const caseMetricsClass = "mt-4 text-[13px] leading-[1.55] text-ink-dim line-clamp-3";
// 3-up grid wrapper. Used by Cases (homepage), case-page related grid,
// portfolio listings. Falls to 1-col @800px.
export const casesGridClass = "grid grid-cols-1 gap-5 lg:grid-cols-3 mb-4";

export function RelatedCard({
  eyebrow,
  category,
  title,
  sub,
  metrics = [],
  coverImage,
  generatedCover,
  coverAspect = "album",
  gradient,
  href,
}: RelatedCardProps) {
  const disabled = !href;
  const chips = [category, ...metrics].filter(
    (c): c is string => Boolean(c && c.trim()),
  );

  const cover = (
    <div
      className={
        coverAspect === "wide"
          ? "relative aspect-[1.91/1] overflow-hidden"
          : caseCoverClass
      }
    >
      {coverImage ? (
        <SanityImg
          image={coverImage.src}
          alt={coverImage.alt}
          sizes={IMG_SIZES.cardThird}
          widths={[400, 600, 800, 1200]}
          fill
          className="object-cover object-top"
        />
      ) : generatedCover ? (
        <GeneratedCover {...generatedCover} />
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
