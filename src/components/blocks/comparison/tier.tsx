"use client";

import type { Locale } from "@/constants/locales";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { TierProps } from "@/types/pricing";
import { useLeadModal } from "@/components/blocks/lead-modal";
import { PhoneMore, SHOW_MORE_LABEL } from "@/components/shared/phone-more";
import { ctaAttrs } from "@/constants/conversion-ids";

function TierCheck() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent-soft"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TierX() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 mt-0.5 text-ink-3 opacity-50"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 2026-09-25 (DESIGN.md, pricing): a tier is a column of one ruled sheet —
// `CmpPricingGrid` draws the frame and the hairlines between columns — not a
// floating card. No per-tier border, fill, lift or glow; the recommended
// package differs by its filled CTA only.
const TIER_BASE =
  "relative px-[22px] py-[26px] bg-bg flex flex-col gap-5 md:px-7 md:py-8 md:gap-6";


const TIER_BTN_BASE =
  "inline-flex items-center justify-center min-h-11 w-full px-5 py-3.5 rounded-full font-sans text-[14px] font-semibold cursor-pointer transition-[background-color,border-color,color] duration-200";

const TIER_BTN_PRIMARY =
  "bg-accent text-[oklch(1_0_0_/_0.98)] border-0 hover:bg-accent-2";

const TIER_BTN_GHOST =
  "bg-transparent border border-line-strong text-ink shadow-none hover:border-accent-soft hover:text-accent-soft hover:bg-accent-8";

const TIER_LIST_BASE =
  "list-none flex flex-col gap-2.5 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:text-[14px] [&>li]:leading-[1.45] [&>li_em]:not-italic";

const TIER_LIST_DEFAULT = "[&>li]:text-ink-dim";

const TIER_LIST_MUTED = "[&>li]:text-ink-3";

export function Tier({
  name,
  price,
  priceLabel = "від",
  weeks,
  bestFor,
  bestForLabel = "Кому підходить:",
  includes,
  excludes,
  ctaLabel,
  ctaGhost,
  ctaHref,
  ctaSource,
  tierKey,
  discountLine,
  compact = false,
}: TierProps & {
  /** Homepage / comparison pages: no "not included" list, and phones see
      the first three inclusions only (plan 2026-09-16). */
  compact?: boolean;
}) {
  const { open } = useLeadModal();
  const locale = useLocale() as Locale;
  return (
    <div className={TIER_BASE}>
      <PhoneMore label={SHOW_MORE_LABEL[locale]} className="flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col gap-3.5">
        <div className="font-actay font-bold text-[15px] uppercase text-ink leading-[1.2] md:text-[17px]">
          {name}
        </div>
        <h3 className="font-display font-bold text-[28px] leading-none text-ink tracking-[-0.025em] tabular-nums m-0 md:text-[38px]">
          <span className="mb-1.5 block font-sans text-[12px] font-medium normal-case tracking-normal text-ink-3">{priceLabel}</span>
          {price}
        </h3>
        <div className="font-mono text-[12px] text-ink-3">
          {weeks}
        </div>
        {bestFor ? (
          <div className={`mt-1 pt-3 border-t border-line ${compact ? "pm-extra" : ""}`}>
            <div className="font-sans text-[12px] font-semibold tracking-[0.06em] uppercase text-ink-3 mb-1.5">
              {bestForLabel}
            </div>
            <p className="m-0 text-[12.5px] leading-[1.5] text-ink-dim">
              {bestFor}
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <h4 className="font-sans text-[12px] font-semibold tracking-[0.06em] uppercase text-ink-3 mb-3">
          {includes.heading}
        </h4>
        <ul className={`${TIER_LIST_BASE} ${TIER_LIST_DEFAULT} ${compact ? "pm-cap-3" : ""}`}>
          {includes.items.map((it, i) => (
            <li key={i}>
              <TierCheck />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>

      {excludes && excludes.items.length > 0 && (
        <>
          {/* Phones fold the "not included" list behind "show more". */}
          <div className="pm-extra h-px bg-line m-0" />
          <div className="pm-extra">
            <h4 className="font-sans text-[12px] font-semibold tracking-[0.06em] uppercase text-ink-3 mb-3">
              {excludes.heading ?? "Не входить"}
            </h4>
            <ul className={`${TIER_LIST_BASE} ${TIER_LIST_MUTED}`}>
              {excludes.items.map((it, i) => (
                <li key={i}>
                  <TierX />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      </PhoneMore>

      <div className="mt-auto pt-2">
        {discountLine ? (
          <div className="mb-2.5 text-center font-sans text-[13px] font-semibold text-accent-soft">
            {discountLine}
          </div>
        ) : null}
        {/* One id per package, so a campaign can see which card people press
            rather than a single "pricing" number. Not `unique`: /pricing
            renders five of these on one page, and the tier key is what makes
            each id distinct. */}
        {ctaHref ? (
          <Link
            href={ctaHref}
            className={`${TIER_BTN_BASE} ${ctaGhost ? TIER_BTN_GHOST : TIER_BTN_PRIMARY} inline-flex items-center justify-center text-center no-underline`}
            {...ctaAttrs(`cta-package-${tierKey ?? "custom"}`)}
          >
            {ctaLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() =>
              open({
                source: ctaSource ?? "pricing",
                tier: tierKey,
                locale,
              })
            }
            className={`${TIER_BTN_BASE} ${ctaGhost ? TIER_BTN_GHOST : TIER_BTN_PRIMARY}`}
            {...ctaAttrs(`cta-package-${tierKey ?? "custom"}`)}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
