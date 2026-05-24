/**
 * Shared placeholder / meta / related-card components for the NBYG
 * København case page. Used by both UK (`src/app/portfolio/_nbyg-kobenhavn`)
 * and EN (`src/app/en/portfolio/_nbyg-kobenhavn`) versions.
 *
 * Once real screenshots arrive from the founder, `ScreenshotPending`
 * goes away. `MetaStrip` and `RelatedCard` may be promoted to a generic
 * `src/components/portfolio/case-page-bits.tsx` when a second case page
 * needs the same shape.
 */
import { type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/components/ui";
import {
  caseLinkClass,
  caseCoverClass,
  caseCoverBgClass,
  caseCoverDotsClass,
  caseShotClass,
  caseShotBarClass,
  caseShotDotClass,
  caseShotBodyClass,
  caseShotLineS1,
  caseShotLineS2,
  caseShotLineS3,
  caseBodyClass,
  caseChipsClass,
  caseChipClass,
  caseNameRowClass,
  caseNameClass,
  caseArrowClass,
  caseMetaClass,
  caseMetricsClass,
} from "@/components/blocks/related-card";

export function NbygScreenshotPending({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,oklch(0.55_0.20_25_/_0.18)_0%,oklch(0.62_0.18_60_/_0.18)_100%)] p-6 text-center font-mono text-xs uppercase tracking-[0.08em] text-ink-3">
      {label}
    </div>
  );
}

export function NbygMetaStrip({ items }: { items: string[] }) {
  return (
    <section className="bg-bg px-12 pb-6">
      <div className="mx-auto flex max-w-container flex-wrap gap-x-6 gap-y-2.5 font-mono text-xs tracking-[0.04em] text-ink-3">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

export type NbygRelatedRow = {
  name: string;
  meta: string;
  metrics: string;
  industry: string;
  industryColor: string;
  tech: string;
  gradient: string;
  href?: string;
  coverImage?: string;
  coverImageAlt?: string;
};

interface RelatedCardProps {
  row: NbygRelatedRow;
  comingSoonLabel?: string;
}

export function NbygRelatedCard({ row, comingSoonLabel = "Coming soon" }: RelatedCardProps) {
  const disabled = !row.href;

  const cover = (
    <div className={caseCoverClass}>
      <div
        className={caseCoverBgClass}
        // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient string per case
        style={{ background: row.gradient }}
      />
      <div className={caseCoverDotsClass} />
      <div className={cn(caseShotClass, row.coverImage && "flex flex-col")}>
        <div className={caseShotBarClass}>
          <span className={caseShotDotClass} />
          <span className={caseShotDotClass} />
          <span className={caseShotDotClass} />
        </div>
        {row.coverImage ? (
          <div className={cn(caseShotBodyClass, "relative min-h-0 flex-1 overflow-hidden p-0")}>
            <img
              src={row.coverImage}
              alt={row.coverImageAlt ?? row.name}
              className="absolute inset-0 block h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className={caseShotBodyClass}>
            <div className={caseShotLineS1} />
            <div className={caseShotLineS2} />
            <div className={caseShotLineS3} />
          </div>
        )}
      </div>
      {disabled ? (
        <span className="absolute right-3.5 top-3.5 rounded-full border border-[oklch(1_0_0/0.18)] bg-[oklch(0_0_0/0.4)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[oklch(1_0_0/0.85)] backdrop-blur-md">
          {comingSoonLabel}
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className={caseBodyClass}>
      <div className={caseChipsClass}>
        <span
          className={caseChipClass}
          // eslint-disable-next-line react/forbid-dom-props -- per-case industry color
          style={
            {
              color: row.industryColor,
              borderColor: `${row.industryColor}55`,
            } as CSSProperties
          }
        >
          {row.industry}
        </span>
        <span className={caseChipClass}>{row.tech}</span>
      </div>
      <div className={caseNameRowClass}>
        <h3 className={caseNameClass}>{row.name}</h3>
        {!disabled ? (
          <ArrowUpRight size={20} strokeWidth={1.6} className={caseArrowClass} />
        ) : null}
      </div>
      <div className={caseMetaClass}>{row.meta}</div>
      <div className={caseMetricsClass}>{row.metrics}</div>
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
    <Link href={row.href!} className={caseLinkClass}>
      {cover}
      {body}
    </Link>
  );
}
