import Link from "next/link";
import type { ReactNode } from "react";

import { DeviceMockup, HERO_BG_CLASS } from "@/components/blocks/hero";
import { H1, btnClass } from "@/components/ui";
import { ctaAttrs, ctaId } from "@/constants/conversion-ids";
import type { SanityImage } from "@/types/sanity";

/**
 * Hero for the /sites-for/* pages (every industry except medicine, which keeps
 * its own composition — see medicine/med-hero.tsx).
 *
 * The shared <HeroEditorial> is tuned for a two-line homepage headline. On an
 * industry page the <h1> is built from the pricing config and carries the whole
 * offer sentence — «Сайт для агентства нерухомості — $2 200 за 14–21 робочий
 * день, з каталогом об'єктів». Set in the `hp` display size that produced:
 *   1. six lines of 64px uppercase Actay Wide — a meta title typeset as a
 *      headline, with no hierarchy inside it;
 *   2. a real collision at ≥1600px: each H1 line was capped at 50vw while the
 *      device stage sat at z-10 with a `clamp(420px,50vw,1000px)` image nudged
 *      10% left, so the mockup covered the end of the headline ("РОБОЧИЙ" was
 *      unreadable on a 1920 screen);
 *   3. the price set in gradient *italic* — the same AI tell the site-type and
 *      medicine redesigns already removed everywhere else.
 *
 * Reference lock (continues the medicine lock, docs/medicine-redesign.md):
 *   - Display register stops at the industry name. Price and term drop into a
 *     hairline-ruled spec row *inside* the same <h1>, so the heading text (and
 *     its keywords) is byte-for-byte what it was — only its typesetting changed.
 *   - The accent is a solid brand gradient, upright. Never italic.
 *   - Depth is glow, not box-shadow; cards only where there is interaction, so
 *     the stats are a ruled row rather than a filled panel.
 *   - CMS stat values are sometimes phrases ("3 сценарії заявки"), so they get a
 *     clamp and a mono caption instead of a fixed 22px bold.
 */

export type IndustryHeroStat = { num: string; lbl: ReactNode };

const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Trailing em-dash of the lead line — the hairline rule replaces it. */
const stripDash = (s: string) => s.replace(/\s*[—–-]\s*$/, "");

export function IndustryHero({
  h1,
  lede,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  stats,
  tickerItems,
  deviceMockupImage,
  deviceMockupAlt,
}: {
  /** H1 parts from `industryH1()` — rendered in two registers, same sentence. */
  h1: { lead: string; price: string; term: string; integration: string };
  lede?: ReactNode;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref: string;
  stats?: IndustryHeroStat[];
  tickerItems?: string[];
  deviceMockupImage?: SanityImage | null;
  deviceMockupAlt?: string;
}) {
  return (
    <>
      <div className={HERO_BG_CLASS} />
      <div className="hero-grain" />

      <div className="relative z-[5] px-6 pb-8 pt-2 sm:px-8 sm:pb-11 sm:pt-6 lg:px-12 lg:pb-14">
        <div className="mx-auto grid max-w-container grid-cols-1 grid-rows-[auto_auto] items-center gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] md:grid-rows-none md:gap-8 md:min-h-[clamp(400px,58vh,540px)] lg:gap-11 xl:gap-14">
          {/* ── Text column ─────────────────────────────────────────── */}
          <div className="relative z-[4] min-w-0">
            <H1
              variant="industry-hero"
              className="m-0 text-ink"
              data-speakable="hero-title"
            >
              <span className="block text-balance">{stripDash(h1.lead)}</span>

              {/* Spec row — still inside the <h1>, so the heading keeps the
                  full offer sentence while the display face keeps its line. */}
              <span className="mt-3.5 flex max-w-[520px] flex-wrap items-baseline gap-x-3.5 gap-y-1 border-t border-line pt-3.5 sm:mt-4 sm:pt-4">
                <span className="bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] bg-clip-text text-[0.88em] leading-none tracking-[-0.03em] text-transparent [font-feature-settings:'tnum'] md:text-[0.8em]">
                  {h1.price}
                </span>
                <span className="min-w-0 max-w-[28ch] font-sans text-[12.5px] font-medium normal-case leading-[1.4] tracking-normal text-ink-dim sm:text-[13px]">
                  {h1.term} {h1.integration}
                </span>
              </span>
            </H1>

            {lede ? (
              <p
                className="mb-0 mt-4 max-w-[44ch] text-pretty font-sans text-[13.5px] leading-[1.6] text-ink-dim sm:mt-5 sm:text-[14px] [&_em]:font-medium [&_em]:not-italic [&_em]:text-ink"
                data-speakable="hero-description"
              >
                {lede}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col items-stretch gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href={ctaPrimaryHref}
                className={btnClass("primary")}
                {...ctaAttrs(ctaId("hero", "lead"), { unique: true })}
              >
                <span>{ctaPrimaryLabel}</span>
                {ARROW}
              </Link>
              {/* No ▶ glyph: the secondary CTA opens the portfolio, not a video. */}
              <Link
                href={ctaSecondaryHref}
                className={btnClass("ghost")}
                {...ctaAttrs(ctaId("hero", "cases", "secondary"), { unique: true })}
              >
                <span>{ctaSecondaryLabel}</span>
              </Link>
            </div>

            {stats?.length ? (
              <div className="mt-7 grid max-w-[520px] grid-cols-1 gap-y-3.5 border-t border-line pt-4 sm:mt-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-0">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`min-w-0 ${i > 0 ? "sm:border-l sm:border-line sm:pl-6" : ""}`}
                  >
                    {/* CMS values range from "4 валюти" to a full phrase
                        ("a structure that can be trusted"), so the size stays
                        modest and the cell wraps instead of overflowing. */}
                    <div className="text-balance font-actay text-[clamp(13px,1.35vw,16px)] font-bold uppercase leading-[1.15] tracking-[-0.02em] text-ink">
                      {s.num}
                    </div>
                    <div className="mt-1.5 max-w-[24ch] font-mono text-[10px] uppercase leading-[1.45] tracking-[0.05em] text-ink-3">
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* ── Device stage ────────────────────────────────────────── */}
          <div className="relative -order-1 -mx-6 mb-1 h-[205px] min-h-[205px] w-[calc(100%+48px)] min-w-0 [contain:layout] sm:-mx-8 sm:w-[calc(100%+64px)] md:order-none md:mx-0 md:mb-0 md:h-full md:w-full md:min-h-[330px] lg:min-h-[390px]">
            <div className="relative h-full w-full min-w-0 overflow-hidden after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:z-[3] after:h-[60px] after:bg-[linear-gradient(180deg,transparent,var(--color-bg)_90%)] after:content-[''] md:after:content-none">
              <div className="pointer-events-none absolute -inset-[10%] bg-[radial-gradient(ellipse_58%_48%_at_50%_50%,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)] blur-[42px]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] bg-[size:24px_24px] [mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)] [-webkit-mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)]" />

              <DeviceMockup
                contain
                image={deviceMockupImage}
                alt={deviceMockupAlt}
              />
            </div>
          </div>
        </div>

        {tickerItems?.length ? (
          <div className="relative z-[5] mt-7 overflow-hidden border-y border-line py-2.5 [mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [-webkit-mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:mt-10 sm:py-3.5">
            <div className="flex animate-[marquee_44s_linear_infinite] gap-0 whitespace-nowrap">
              {[0, 1].map((rep) => (
                <div
                  key={rep}
                  aria-hidden={rep === 1 ? "true" : undefined}
                  className="flex items-center gap-5 pr-5 font-actay text-[13px] font-bold uppercase tracking-[-0.01em] text-ink-dim sm:gap-7 sm:pr-7 sm:text-[16px]"
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
    </>
  );
}
