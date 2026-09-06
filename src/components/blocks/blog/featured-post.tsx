import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  GeneratedCover,
  caseChipClass,
  caseChipsClass,
} from "@/components/blocks/related-card";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { SanityImg, type SanityImgInput } from "@/lib/shared/sanity-image";

/**
 * Newest post on page 1 of a blog listing, laid out wide: cover left, copy
 * right from lg. Every card in the old listing was the same size, so the
 * grid read as an undifferentiated wall of 70 tiles (design audit
 * 2026-09-06, C5) — this gives the page an entry point.
 *
 * Deliberately NOT a variant of `RelatedCard`: the two share a cover and a
 * chip row, but nothing else about the layout, and folding a second layout
 * into that component would make both harder to read.
 */
export type FeaturedPostProps = {
  title: string;
  sub?: string;
  href: string;
  /** Chips above the title — category, date, reading time. */
  chips?: (string | undefined)[];
  coverImage?: { src: SanityImgInput; alt: string };
  generatedCover?: { title: string; category?: string };
  /** Small mono label over the cover, e.g. "СВІЖА СТАТТЯ". */
  badge: string;
  /** Call-to-action label under the copy, e.g. "Читати статтю". */
  readLabel: string;
};

const LINK_CLASS =
  "group/feat mb-5 grid grid-cols-1 overflow-hidden rounded-[22px] border border-line " +
  "bg-[oklch(1_0_0_/_0.02)] text-inherit no-underline " +
  "transition-[transform,border-color] duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:-translate-y-0.5 hover:border-line-strong lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]";

export function FeaturedPost({
  title,
  sub,
  href,
  chips = [],
  coverImage,
  generatedCover,
  badge,
  readLabel,
}: FeaturedPostProps) {
  const visibleChips = chips.filter((c): c is string => Boolean(c && c.trim()));

  return (
    <Link href={href} className={LINK_CLASS}>
      <div className="relative aspect-[1.91/1] overflow-hidden lg:aspect-auto lg:min-h-[300px]">
        {coverImage ? (
          <SanityImg
            image={coverImage.src}
            alt={coverImage.alt}
            sizes={IMG_SIZES.half}
            widths={[600, 900, 1200]}
            fill
            className="object-cover object-top"
          />
        ) : generatedCover ? (
          <GeneratedCover {...generatedCover} />
        ) : null}
        <span className="absolute left-4 top-4 rounded-full border border-[oklch(1_0_0/0.18)] bg-[oklch(0_0_0/0.45)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[oklch(1_0_0/0.9)] backdrop-blur-md">
          {badge}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-3 px-6 py-7 lg:px-9 lg:py-10">
        {visibleChips.length > 0 ? (
          <div className={caseChipsClass}>
            {visibleChips.map((c) => (
              <span key={c} className={caseChipClass}>
                {c}
              </span>
            ))}
          </div>
        ) : null}
        <h3 className="font-actay text-[clamp(22px,3.2vw,30px)] font-bold uppercase leading-[1.15] tracking-[-0.01em] text-ink [text-wrap:balance]">
          {title}
        </h3>
        {sub ? (
          <p className="text-[15px] leading-[1.6] text-ink-dim line-clamp-3">{sub}</p>
        ) : null}
        <span className="mt-1 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-accent-soft">
          {readLabel}
          <ArrowUpRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/feat:translate-x-1 group-hover/feat:-translate-y-1"
          />
        </span>
      </div>
    </Link>
  );
}
