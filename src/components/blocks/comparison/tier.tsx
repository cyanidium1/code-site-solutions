"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { TierProps } from "@/types/pricing";
import { useLeadModal } from "@/components/blocks/lead-modal";

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

const TIER_BASE =
  "relative px-[22px] py-[26px] border rounded-[18px] flex flex-col gap-5 transition-[border-color,transform] duration-[250ms] md:px-7 md:py-8 md:gap-6";

const TIER_DEFAULT =
  "border-line bg-[oklch(0.16_0.005_300)] hover:border-line-strong hover:-translate-y-0.5";

const TIER_POP =
  "border-accent-40 bg-[linear-gradient(180deg,oklch(0.18_0.04_295)_0%,oklch(0.13_0.03_295)_100%)] shadow-[0_30px_60px_oklch(from_var(--color-accent)_l_c_h_/_0.18)] translate-y-0 hover:-translate-y-0.5 xl:-translate-y-2 xl:hover:-translate-y-2.5";

const TIER_BTN_BASE =
  "inline-flex items-center justify-center min-h-11 w-full px-5 py-3.5 rounded-full font-sans text-[11px] font-bold tracking-[0.12em] uppercase cursor-pointer transition-all duration-[250ms]";

const TIER_BTN_PRIMARY =
  "bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] border-0 shadow-[0_6px_18px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.4)]";

const TIER_BTN_GHOST =
  "bg-transparent border border-line-strong text-ink shadow-none hover:border-accent-soft hover:text-accent-soft hover:bg-accent-8";

const TIER_LIST_BASE =
  "list-none flex flex-col gap-2.5 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:text-[13px] [&>li]:leading-[1.45] [&>li_em]:not-italic";

const TIER_LIST_DEFAULT = "[&>li]:text-ink-dim";

const TIER_LIST_MUTED = "[&>li]:text-ink-3";

export function Tier({
  name,
  price,
  priceLabel = "від",
  weeks,
  bestFor,
  bestForLabel = "Кому підходить:",
  popular,
  popularLabel = "Популярно",
  includes,
  excludes,
  ctaLabel,
  ctaGhost,
  ctaHref,
  ctaSource,
  tierKey,
  discountLine,
}: TierProps) {
  const { open } = useLeadModal();
  const locale = useLocale() === "en" ? "en" : "uk";
  return (
    <div className={`${TIER_BASE} ${popular ? TIER_POP : TIER_DEFAULT}`}>
      {popular && (
        <div className="absolute top-[-1px] left-6 px-3 py-[5px] bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] font-display text-[9px] font-bold tracking-[0.14em] uppercase rounded-b-lg shadow-[0_4px_12px_oklch(from_var(--color-accent)_l_c_h_/_0.4)]">
          {popularLabel}
        </div>
      )}
      <div className="flex flex-col gap-3.5">
        <div className="font-display font-bold text-[12px] tracking-[0.14em] uppercase text-ink leading-[1.2] md:text-[13px]">
          {name}
        </div>
        <h3 className="font-display font-bold text-[32px] leading-none text-ink tracking-[-0.025em] m-0 [&_em]:not-italic [&_em]:font-medium [&_em]:text-[14px] [&_em]:text-ink-3 [&_em]:tracking-normal [&_em]:block [&_em]:mb-1 md:text-[38px]">
          <em>{priceLabel}</em>
          {price}
        </h3>
        <div className="text-[12px] text-ink-3 tracking-[0.04em]">
          {weeks}
        </div>
        {bestFor ? (
          <div className="mt-1 pt-3 border-t border-line">
            <div className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-1.5">
              {bestForLabel}
            </div>
            <p className="m-0 text-[12.5px] leading-[1.5] text-ink-dim">
              {bestFor}
            </p>
          </div>
        ) : null}
      </div>

      <div>
        <h4 className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-3">
          {includes.heading}
        </h4>
        <ul className={`${TIER_LIST_BASE} ${TIER_LIST_DEFAULT}`}>
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
          <div className="h-px bg-line m-0" />
          <div>
            <h4 className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-ink-3 mb-3">
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

      <div className="mt-auto pt-2">
        {discountLine ? (
          <div className="mb-2.5 text-center font-display text-[11px] font-bold uppercase tracking-[0.1em] text-accent-soft">
            {discountLine}
          </div>
        ) : null}
        {ctaHref ? (
          <Link
            href={ctaHref}
            className={`${TIER_BTN_BASE} ${ctaGhost ? TIER_BTN_GHOST : TIER_BTN_PRIMARY} inline-flex items-center justify-center text-center no-underline`}
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
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
