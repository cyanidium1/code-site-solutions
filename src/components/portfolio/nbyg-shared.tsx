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
    <div className="hp-case-cover">
      <div
        className="hp-case-cover-bg"
        // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient string per case
        style={{ background: row.gradient }}
      />
      <div className="hp-case-cover-dots" />
      <div className={`hp-case-shot${row.coverImage ? " flex flex-col" : ""}`}>
        <div className="hp-case-shot-bar">
          <span className="hp-case-shot-dot" />
          <span className="hp-case-shot-dot" />
          <span className="hp-case-shot-dot" />
        </div>
        {row.coverImage ? (
          <div className="hp-case-shot-body relative min-h-0 flex-1 overflow-hidden p-0">
            <img
              src={row.coverImage}
              alt={row.coverImageAlt ?? row.name}
              className="absolute inset-0 block h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="hp-case-shot-body">
            <div className="hp-case-shot-line s1" />
            <div className="hp-case-shot-line s2" />
            <div className="hp-case-shot-line s3" />
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
    <div className="hp-case-body">
      <div className="hp-case-chips">
        <span
          className="hp-case-chip"
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
        <span className="hp-case-chip">{row.tech}</span>
      </div>
      <div className="hp-case-name-row">
        <h3 className="hp-case-name">{row.name}</h3>
        {!disabled ? (
          <ArrowUpRight size={20} strokeWidth={1.6} className="hp-case-arrow" />
        ) : null}
      </div>
      <div className="hp-case-meta">{row.meta}</div>
      <div className="hp-case-metrics">{row.metrics}</div>
    </div>
  );

  if (disabled) {
    return (
      <div className="hp-case-link pointer-events-none cursor-default opacity-[0.78]">
        {cover}
        {body}
      </div>
    );
  }

  return (
    <Link href={row.href!} className="hp-case-link">
      {cover}
      {body}
    </Link>
  );
}
