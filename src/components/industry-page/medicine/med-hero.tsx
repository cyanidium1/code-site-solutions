import Link from "next/link";
import type { ReactNode } from "react";

import { DeviceMockup } from "@/components/blocks/hero";
import type { SanityImage } from "@/types/sanity";

import "./medicine.css";

/**
 * Medicine hero.
 *
 * The shared <HeroEditorial> is tuned for the homepage and seven other
 * industries; on this page it produced three problems it cannot fix without
 * changing every page at once:
 *   1. the accent phrase was set in gradient *italic* — the loudest AI tell
 *      on the page, and the exact treatment the site-type redesign already
 *      removed elsewhere;
 *   2. the "50+ patients a month" KPI was welded into the <h1>, so a display
 *      face was carrying a lowercase caption and the headline lost its line;
 *   3. the stats bar renders every CMS value at 22px bold, which works for
 *      "×3.2" and breaks for a phrase like "doctor profiles".
 *
 * Reference lock:
 *   Impilo — hero accent is a phrase in the brand colour, set solid, never
 *     italicised; hairline-separated data blocks rather than filled cards.
 *   Harness — display type gets authority from scale and restraint, not from
 *     decoration; metadata sits in a mono register beside it.
 *   Superlative — the spec grid: ruled cells, mono labels, values aligned.
 *   code-site-frontend — the "drops" (diagonal blurred streaks) and the
 *     floating annotation pills over the device.
 *
 * Typography here departs from the shared hero on purpose: tighter tracking
 * (-0.035em) and a 0.94 line-height on Actay so the two headline lines lock
 * into a block, and the KPI moves out of the heading into its own ruled row
 * where a mono caption can sit beside it without fighting the display face.
 */

export type MedHeroStat = { num: string; lbl: ReactNode };
export type MedHeroFeature = { label: string; sub: string };

const ARROW = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function MedHero({
  eyebrow,
  eyebrowEm,
  h1Lines,
  h1Accent,
  kpiValue,
  kpiLabel,
  lede,
  features,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  stats,
  tickerItems,
  deviceTags,
  deviceMockupImage,
  deviceMockupAlt,
}: {
  eyebrow?: string;
  eyebrowEm?: string;
  /** Headline lines rendered plain; the last one may be accented instead. */
  h1Lines: ReactNode[];
  /** Final headline line, painted in the brand gradient — upright, never italic. */
  h1Accent?: ReactNode;
  kpiValue?: string;
  kpiLabel?: ReactNode;
  lede?: ReactNode;
  features?: MedHeroFeature[];
  ctaPrimaryLabel?: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref: string;
  stats?: MedHeroStat[];
  tickerItems?: string[];
  deviceTags?: { kind: "default" | "good"; primary: string; mini?: string }[];
  deviceMockupImage?: SanityImage | null;
  deviceMockupAlt?: string;
}) {
  return (
    <div className="med relative overflow-hidden">
      {/* Old-site "drops": diagonal blurred streaks, not a centred blob */}
      <div className="med-streaks" />
      <div className="hero-grain" />

      <div className="relative z-[5] px-6 pb-10 pt-8 sm:px-8 sm:pb-14 lg:px-12 2xl:pb-[60px]">
        <div className="mx-auto grid max-w-container grid-cols-1 grid-rows-[auto_auto] items-center gap-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] sm:grid-rows-none sm:gap-8 sm:min-h-[clamp(560px,78vh,720px)] xl:gap-14">
          {/* ── Text column ───────────────────────────────────────────── */}
          <div className="relative z-[4] min-w-0">
            {eyebrow ? (
              <div className="mb-6 flex flex-wrap items-center gap-2.5 sm:mb-8">
                <span className="med-label">
                  <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                  {eyebrow}
                </span>
                {eyebrowEm ? (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-soft">
                    {eyebrowEm}
                  </span>
                ) : null}
              </div>
            ) : null}

            <h1
              className="m-0 font-actay text-[clamp(34px,8.4vw,44px)] font-bold uppercase leading-[0.94] tracking-[-0.035em] text-ink sm:text-[clamp(38px,4.6vw,68px)]"
              data-speakable="hero-title"
            >
              {h1Lines.map((line, i) => (
                <span key={i} className="block text-balance">
                  {line}
                </span>
              ))}
              {h1Accent ? (
                <span className="block bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] bg-clip-text text-balance text-transparent">
                  {h1Accent}
                </span>
              ) : null}
            </h1>

            {/* KPI on its own ruled row — display face and caption stop
                competing inside the heading. */}
            {kpiValue ? (
              <div className="mt-6 flex max-w-[560px] items-center gap-4 border-y border-line py-3.5 sm:mt-7">
                <span className="font-actay text-[38px] font-bold leading-none tracking-[-0.03em] text-ink sm:text-[46px]">
                  {kpiValue}
                </span>
                <span className="min-w-0 font-sans text-[12.5px] font-medium leading-[1.35] text-ink-dim sm:text-[13.5px]">
                  {kpiLabel}
                </span>
              </div>
            ) : null}

            {lede ? (
              <p
                className="mb-0 mt-5 max-w-[48ch] text-pretty font-sans text-[14px] leading-[1.65] text-ink-dim sm:mt-6 sm:text-[15px] [&_em]:font-medium [&_em]:not-italic [&_em]:text-ink"
                data-speakable="hero-description"
              >
                {lede}
              </p>
            ) : null}

            {/* Spec grid — ruled cells, mono captions. Replaces the four
                identical check-chips. */}
            {features?.length ? (
              <dl className="mt-7 grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-0 sm:mt-8">
                {features.map((f, i) => (
                  <div
                    key={f.label}
                    className={`border-line py-3 ${i < 2 ? "border-b" : ""} ${
                      i % 2 === 0 ? "sm:pr-6" : ""
                    }`}
                  >
                    <dt className="font-sans text-[13px] font-semibold leading-[1.25] text-ink">
                      {f.label}
                    </dt>
                    {f.sub ? (
                      <dd className="m-0 mt-1 font-mono text-[10.5px] leading-[1.35] text-ink-3">
                        {f.sub}
                      </dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href={ctaPrimaryHref}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] px-7 py-3 font-sans text-[13.5px] font-semibold tracking-[0.01em] text-[oklch(1_0_0_/_0.97)] no-underline shadow-[0_14px_34px_oklch(from_var(--color-accent)_l_c_h_/_0.34)] transition-transform duration-200 hover:-translate-y-px"
              >
                <span>{ctaPrimaryLabel}</span>
                {ARROW}
              </Link>
              <Link
                href={ctaSecondaryHref}
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-line-strong px-6 py-3 font-sans text-[13.5px] font-medium text-ink no-underline transition-[border-color,background-color] duration-200 hover:border-accent-40 hover:bg-accent-8"
              >
                <span>{ctaSecondaryLabel}</span>
              </Link>
            </div>

            {/* One column on phones: CMS values are sometimes phrases, and
                three of those across 390px shred into four-line stacks. */}
            {stats?.length ? (
              <div className="mt-8 grid max-w-[560px] grid-cols-1 gap-y-4 border-t border-line pt-5 sm:mt-9 sm:grid-cols-3 sm:gap-x-7 sm:gap-y-0">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`min-w-0 ${i > 0 ? "sm:border-l sm:border-line sm:pl-7" : ""}`}
                  >
                    {/* CMS values are sometimes phrases, not numerals — the
                        clamp keeps "doctor profiles" from breaking the row. */}
                    <div className="text-balance font-actay text-[clamp(14px,1.7vw,19px)] font-bold uppercase leading-[1.12] tracking-[-0.02em] text-ink">
                      {s.num}
                    </div>
                    <div className="mt-1.5 font-mono text-[10px] uppercase leading-[1.35] tracking-[0.06em] text-ink-3">
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* ── Device stage ──────────────────────────────────────────── */}
          <div className="relative -order-1 -mx-6 mb-2 h-[300px] min-h-[300px] w-[calc(100%+48px)] min-w-0 overflow-visible [contain:layout] sm:order-none sm:mx-0 sm:mb-0 sm:h-full sm:w-full md:min-h-[440px]">
            <div className="relative h-full w-full min-w-0 overflow-hidden after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:z-[3] after:h-[60px] after:bg-[linear-gradient(180deg,transparent,var(--color-bg)_90%)] after:content-[''] sm:after:content-none lg:overflow-visible">
              <div className="pointer-events-none absolute -inset-[10%] bg-[radial-gradient(ellipse_58%_46%_at_52%_48%,oklch(from_var(--color-accent)_l_c_h_/_0.2),transparent_70%)] blur-[44px]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] bg-[size:26px_26px] [mask:radial-gradient(ellipse_58%_48%_at_50%_50%,black,transparent_70%)] [-webkit-mask:radial-gradient(ellipse_58%_48%_at_50%_50%,black,transparent_70%)]" />

              <DeviceMockup image={deviceMockupImage} alt={deviceMockupAlt} />

              {deviceTags?.map((t, i) => (
                <div
                  key={i}
                  className={`animate-float absolute z-[5] hidden items-center gap-2 rounded-full border border-line-strong bg-[oklch(0.22_0.008_60_/_0.85)] px-3 py-1.5 text-[10.5px] font-medium tracking-[0.02em] text-ink shadow-[0_4px_16px_oklch(0_0_0_/_0.4)] backdrop-blur-[12px] sm:inline-flex ${TAG_POS[i] ?? TAG_POS[0]}`}
                  // eslint-disable-next-line react/forbid-dom-props -- per-pill float offset staggers the shared keyframe
                  style={{ animationDelay: `${i * -2}s` }}
                >
                  {i === 0 ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]" />
                  ) : null}
                  <span>{t.primary}</span>
                  {t.mini ? (
                    <span
                      className={`font-mono text-[10px] ${
                        t.kind === "good" ? "text-[var(--med-vital)]" : "text-ink-3"
                      }`}
                    >
                      {t.mini}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticker — carried over from the old site's niche pages */}
        {tickerItems?.length ? (
          <div className="relative z-[5] mt-8 overflow-hidden border-y border-line py-3 [mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [-webkit-mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:mt-12 sm:py-4">
            <div className="flex animate-[marquee_44s_linear_infinite] gap-0 whitespace-nowrap">
              {[0, 1].map((rep) => (
                <div
                  key={rep}
                  aria-hidden={rep === 1 ? "true" : undefined}
                  className="flex items-center gap-5 pr-5 font-actay text-[15px] font-bold uppercase tracking-[-0.01em] text-ink-dim sm:gap-8 sm:pr-8 sm:text-[20px]"
                >
                  {tickerItems.map((it, j) => (
                    <span key={j} className="contents">
                      <span>{it}</span>
                      <span className="text-accent" aria-hidden="true">
                        ·
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Float-pill placements over the device; the middle one waits for 2xl. */
const TAG_POS = [
  "top-[9%] left-[1%] xl:left-[3%]",
  "top-[24%] left-[58%] sm:hidden 2xl:inline-flex",
  "bottom-[24%] left-[38%]",
];
