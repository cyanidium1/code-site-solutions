import Link from "next/link";

import type { Locale } from "@/constants/locales";
import { industryCalcContent } from "../industry-calcs";
import { MED_PRICING } from "./copy";

import "./medicine.css";

/**
 * The price sheet — the block the page was missing.
 *
 * Before this existed, a visitor asking the only question that matters
 * ("how much, and what do I get for it?") had to scroll ~14 000px to the
 * calculator and work the toggles, because the numbers lived nowhere else.
 * Measured 10.09.2026: the page ran 20 480px over 17 blocks and answered
 * price on the fifteenth screen.
 *
 * Numbers are read from `industryCalcContent` — the calculator's own source
 * — so the sheet cannot drift out of sync with it. This file names the scope
 * only; it never hard-codes a figure.
 *
 * Form follows the page's reference lock (docs/medicine-redesign.md): ruled
 * sheets rather than cards, mono captions, no card chrome around something
 * you only read. `--med-vital` marks the included lines because that accent
 * is bound to "a confirmed state" — an item being inside the price is
 * exactly that. It is not used as a background, a heading or a CTA.
 */
export function MedPricing({
  locale,
  calcHref,
}: {
  locale: Locale;
  calcHref: string;
}) {
  const c = MED_PRICING[locale];
  const calc = industryCalcContent("medicine", locale);
  if (!calc) return null;

  const money = (n: number) => `${calc.currency}${n.toLocaleString("uk-UA").replace(/ /g, " ")}`;

  return (
    <section className="med relative overflow-hidden bg-bg px-6 py-14 sm:px-8 lg:px-12 lg:py-[100px]">
      <div className="relative mx-auto max-w-container">
        <span className="med-label">{c.label}</span>
        <h2 className="mt-4 mb-0 font-actay text-[clamp(22px,2.6vw,34px)] font-bold uppercase leading-[1.15] tracking-[-0.01em] text-ink">
          {c.heading}
        </h2>
        <p className="mt-3 mb-0 max-w-[58ch] font-sans text-[14.5px] leading-[1.6] text-ink-dim">
          {c.lede}
        </p>

        <div className="mt-9 grid grid-cols-1 gap-x-12 gap-y-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* ── Base + what it buys ─────────────────────────────────── */}
          <div>
            <div className="border-b border-line pb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                {c.baseCaption}
              </span>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-actay text-[clamp(38px,5.4vw,60px)] font-bold leading-[0.95] tracking-[-0.03em] text-ink">
                  {money(calc.basePrice)}
                </span>
                <span className="font-sans text-[14px] font-medium text-ink-dim">
                  {calc.baseLabel}
                </span>
              </div>
            </div>

            <span className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {c.includedCaption}
            </span>
            <ul className="m-0 mt-3 list-none p-0">
              {c.included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-line py-2.5 font-sans text-[14px] leading-[1.45] text-ink-dim last:border-b-0"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="mt-[3px] shrink-0 text-[var(--med-vital)]"
                  >
                    <path
                      d="M4 12l5 5L20 6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Options, priced ─────────────────────────────────────── */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {c.optionsCaption}
            </span>
            <dl className="m-0 mt-3">
              {calc.options.map((o) => (
                <div
                  key={o.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                >
                  <dt className="font-sans text-[14px] leading-[1.4] text-ink-dim">
                    {o.label}
                  </dt>
                  <dd className="m-0 shrink-0 font-mono text-[13px] tabular-nums text-ink">
                    +{money(o.price)}
                  </dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                <dt className="font-sans text-[14px] leading-[1.4] text-ink-dim">
                  {calc.blocks.label}
                </dt>
                <dd className="m-0 shrink-0 font-mono text-[13px] tabular-nums text-ink">
                  +{money(calc.blocks.unitPrice)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 mb-0 font-mono text-[10.5px] leading-[1.5] text-ink-3">
              {c.extraPageNote(money(calc.blocks.unitPrice), calc.blocks.max)}
            </p>

            <p className="mt-7 mb-0 max-w-[46ch] font-sans text-[13px] leading-[1.55] text-ink-3">
              {c.foot}
            </p>
            <Link
              href={calcHref}
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-sans text-[13.5px] font-medium text-ink no-underline transition-colors duration-200 hover:text-[var(--med-signal)]"
            >
              <span>{c.ctaLabel}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
