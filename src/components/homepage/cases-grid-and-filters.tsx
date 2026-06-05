"use client";

import { type CSSProperties, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { btnClass, cn } from "@/components/ui";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import type { CaseCardItem } from "@/lib/shared/case-card-item";

export type IndustryKey = "legal" | "medicine" | "real-estate";

/**
 * Per-industry accent colors. Source of truth lives in
 * `lib/shared/case-presentation.ts::INDUSTRY_PRESENTATION` — keep these in
 * sync. They drive the pill tint via the `--pill-accent` CSS var: inactive
 * pills sit at a faint tint, active ones intensify.
 */
const INDUSTRY_COLORS: Record<IndustryKey, string> = {
  legal: "#F59E0B",
  medicine: "#0EA5E9",
  "real-estate": "#14B8A6",
};

// Button-sized industry pill. Padding/height/font mirror `btnClass("ghost")`
// so the row reads as "all CTAs at the same scale". Color tone is the
// per-pill `--pill-accent` set inline; we derive border/bg/text from it
// via `oklch(from var(...) l c h / <alpha>)`.
const INDUSTRY_PILL_BASE =
  "inline-flex items-center gap-2 rounded-full font-sans font-medium transition cursor-pointer no-underline min-h-11 " +
  "text-[13px] px-[18px] py-[14px] sm:py-[13px] 2xl:px-[22px] 2xl:py-[15px] 2xl:text-sm " +
  "border focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(from_var(--pill-accent,var(--color-accent))_l_c_h_/_0.5)]";

const INDUSTRY_PILL_INACTIVE =
  "text-ink-dim " +
  "border-[oklch(from_var(--pill-accent)_l_c_h_/_0.35)] " +
  "bg-[oklch(from_var(--pill-accent)_l_c_h_/_0.08)] " +
  "hover:text-ink hover:border-[oklch(from_var(--pill-accent)_l_c_h_/_0.55)] " +
  "hover:bg-[oklch(from_var(--pill-accent)_l_c_h_/_0.15)]";

const INDUSTRY_PILL_ACTIVE =
  "text-ink " +
  "border-[oklch(from_var(--pill-accent)_l_c_h_/_0.7)] " +
  "bg-[oklch(from_var(--pill-accent)_l_c_h_/_0.25)] " +
  "shadow-[0_0_0_1px_oklch(from_var(--pill-accent)_l_c_h_/_0.2)_inset]";

// Small accent dot next to the label — picks up the industry color so the
// row reads as color-coded even before a pill is clicked.
const INDUSTRY_PILL_DOT_CLASS =
  "inline-block h-1.5 w-1.5 rounded-full bg-[var(--pill-accent)] shadow-[0_0_8px_oklch(from_var(--pill-accent)_l_c_h_/_0.6)]";

export type CasesGridAndFiltersProps = {
  defaultItems: CaseCardItem[];
  /**
   * Curated card sets per industry. Empty arrays hide the corresponding
   * pill — see `INDUSTRY_ORDER` for render order.
   */
  setsByIndustry: Record<IndustryKey, CaseCardItem[]>;
  /** Locale-resolved labels for the 3 industry pills. */
  pillLabels: Record<IndustryKey, string>;
  ctaLabel: string;
  ctaHref: string;
};

/** Render order for the pill row. Stable across locales. */
const INDUSTRY_ORDER: readonly IndustryKey[] = [
  "legal",
  "medicine",
  "real-estate",
] as const;

function CardGrid({ items }: { items: CaseCardItem[] }) {
  return (
    <div className={casesGridClass}>
      {items.map((c) => {
        const metaLine = [c.industry, c.region, c.year]
          .filter(Boolean)
          .join(" · ");
        return (
          <RelatedCard
            key={c.href ?? c.name}
            metrics={c.chips}
            title={c.name}
            eyebrow={metaLine || undefined}
            sub={c.metrics || undefined}
            coverImage={
              c.coverImage
                ? { src: c.coverImage, alt: c.coverImageAlt ?? c.name }
                : undefined
            }
            gradient={c.gradient}
            href={c.href}
          />
        );
      })}
    </div>
  );
}

export function CasesGridAndFilters({
  defaultItems,
  setsByIndustry,
  pillLabels,
  ctaLabel,
  ctaHref,
}: CasesGridAndFiltersProps) {
  const [active, setActive] = useState<IndustryKey | null>(null);

  const visibleItems =
    active && setsByIndustry[active].length > 0
      ? setsByIndustry[active]
      : defaultItems;

  const visiblePills = INDUSTRY_ORDER.filter(
    (key) => setsByIndustry[key].length > 0,
  );

  return (
    <>
      <CardGrid items={visibleItems} />
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href={ctaHref} className={btnClass("primary", "hp-section-cta")}>
          <span>{ctaLabel}</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
        {visiblePills.map((key) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              className={cn(
                INDUSTRY_PILL_BASE,
                isActive ? INDUSTRY_PILL_ACTIVE : INDUSTRY_PILL_INACTIVE,
              )}
              // eslint-disable-next-line react/forbid-dom-props -- per-pill color var consumed by Tailwind arbitrary values
              style={
                { "--pill-accent": INDUSTRY_COLORS[key] } as CSSProperties
              }
              onClick={() => setActive(isActive ? null : key)}
            >
              <span aria-hidden="true" className={INDUSTRY_PILL_DOT_CLASS} />
              {pillLabels[key]}
            </button>
          );
        })}
      </div>
    </>
  );
}
