import Link from "next/link";
import type { ReactNode } from "react";

import { ScrollReveal } from "@/components/homepage/scroll-reveal";

import "./medicine.css";

/**
 * The "why patients don't book" block, rebuilt as a diagnostic sheet.
 *
 * The CMS ships three reasons, each with a tag, a body and a supporting
 * statistic. The shared <Reasons> block renders them as an asymmetric bento
 * of three cards — which on this page left a 350px hole inside card 01 and
 * gave all three the same visual weight as everything else on the page.
 *
 * Here they are rows on a ruled sheet: index and tag in the left margin,
 * the finding in the middle, the number in the right margin. Superlative's
 * register — hairlines, corner metadata, mono labels — carries it. The
 * statistic is the only coloured thing in the row, because it is the only
 * part that is evidence.
 */

export type DiagnosisItem = {
  n: string;
  tag: string;
  title: ReactNode;
  body: ReactNode;
  stat: { n: string; lbl: string; src: string };
};

export function MedDiagnosis({
  eyebrow,
  eyebrowNum,
  heading,
  metaRows,
  items,
  footText,
  footCtaLabel,
  footCtaHref,
}: {
  eyebrow?: string;
  eyebrowNum?: string;
  heading?: ReactNode;
  metaRows?: string[];
  items?: DiagnosisItem[];
  footText?: ReactNode;
  footCtaLabel?: string;
  footCtaHref: string;
}) {
  if (!items?.length) return null;

  return (
    <section className="med relative overflow-hidden bg-bg px-6 py-14 sm:px-8 lg:px-12 lg:py-[100px]">
      <div className="med-streaks" />

      <div className="relative mx-auto max-w-container">
        <ScrollReveal className="med-reveal">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            {eyebrow ? (
              <span className="med-label">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {eyebrow}
              </span>
            ) : null}
            {eyebrowNum ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                {eyebrowNum}
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            {heading ? (
              <h2 className="m-0 max-w-[20ch] font-actay text-[clamp(24px,3.2vw,42px)] font-bold uppercase leading-[1.08] text-ink [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent">
                {heading}
              </h2>
            ) : null}
            {metaRows?.length ? (
              <div className="flex flex-col gap-1 lg:items-end lg:pb-2">
                {metaRows.map((m) => (
                  <span
                    key={m}
                    className="font-mono text-[11px] leading-[1.5] text-ink-3"
                  >
                    {m}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        {/* Ruled sheet — one row per finding, no cards */}
        <div className="mt-10 border-t border-line lg:mt-14">
          {items.map((it, i) => (
            <ScrollReveal
              key={it.n || i}
              className="med-reveal grid grid-cols-1 gap-x-10 gap-y-4 border-b border-line py-7 lg:grid-cols-[92px_minmax(0,1fr)_260px] lg:py-9"
            >
              {/* Left margin: index + tag */}
              <div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-2">
                <span className="font-actay text-[30px] font-bold leading-none text-ink-3 lg:text-[38px]">
                  {it.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                  {it.tag}
                </span>
              </div>

              {/* The finding */}
              <div className="min-w-0">
                <h3 className="m-0 font-actay text-[17px] font-bold uppercase leading-[1.2] text-ink lg:text-[21px] [&_em]:text-accent-soft">
                  {it.title}
                </h3>
                <p className="mb-0 mt-2.5 max-w-[62ch] font-sans text-[13.5px] leading-[1.65] text-ink-dim lg:text-[14.5px] [&_strong]:font-semibold [&_strong]:text-ink">
                  {it.body}
                </p>
              </div>

              {/* Right margin: the evidence */}
              {it.stat.n ? (
                <div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-1.5 lg:border-l lg:border-line lg:pl-6">
                  <span className="font-actay text-[32px] font-bold leading-none tracking-[-0.02em] text-[var(--med-signal)] lg:text-[40px]">
                    {it.stat.n}
                  </span>
                  <span className="max-w-[26ch] font-sans text-[12px] leading-[1.4] text-ink-3">
                    {it.stat.lbl}
                    {it.stat.src ? (
                      <span className="mt-1 block font-mono text-[10px] text-ink-muted">
                        {it.stat.src}
                      </span>
                    ) : null}
                  </span>
                </div>
              ) : null}
            </ScrollReveal>
          ))}
        </div>

        {footText || footCtaLabel ? (
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {footText ? (
              <p className="m-0 max-w-[60ch] font-sans text-[13.5px] leading-[1.6] text-ink-dim [&_em]:text-ink [&_em]:not-italic [&_em]:font-medium">
                {footText}
              </p>
            ) : null}
            {footCtaLabel ? (
              <Link
                href={footCtaHref}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:border-accent-40 hover:text-accent-soft"
              >
                {footCtaLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
