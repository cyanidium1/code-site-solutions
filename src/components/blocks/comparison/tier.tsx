"use client";

import Link from "next/link";
import type { TierProps } from "@/types/pricing";

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
      className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--ink-3)] opacity-50"
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
  "relative pt-8 px-7 pb-8 border rounded-[18px] flex flex-col gap-6 transition-[border-color,transform] duration-[250ms] max-[700px]:px-[22px] max-[700px]:py-[26px] max-[700px]:gap-5";

const TIER_DEFAULT =
  "border-line bg-[oklch(0.16_0.005_300)] hover:border-[var(--line-2)] hover:-translate-y-0.5";

const TIER_POP =
  "border-[oklch(from_var(--accent)_l_c_h_/_0.4)] bg-[linear-gradient(180deg,oklch(0.18_0.04_295)_0%,oklch(0.13_0.03_295)_100%)] shadow-[0_30px_60px_oklch(from_var(--accent)_l_c_h_/_0.18)] -translate-y-2 hover:-translate-y-2.5 max-[1100px]:translate-y-0 max-[1100px]:hover:-translate-y-0.5";

const TIER_BTN_BASE =
  "w-full px-5 py-3.5 rounded-full font-sans text-[11px] font-bold tracking-[0.12em] uppercase cursor-pointer transition-all duration-[250ms]";

const TIER_BTN_PRIMARY =
  "bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] text-[oklch(1_0_0_/_0.98)] border-0 shadow-[0_6px_18px_oklch(from_var(--accent)_l_c_h_/_0.3)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_oklch(from_var(--accent)_l_c_h_/_0.4)]";

const TIER_BTN_GHOST =
  "bg-transparent border border-[var(--line-2)] text-ink shadow-none hover:border-accent-soft hover:text-accent-soft hover:bg-[oklch(from_var(--accent)_l_c_h_/_0.08)]";

const TIER_LIST_BASE =
  "list-none flex flex-col gap-2.5 [&>li]:flex [&>li]:items-start [&>li]:gap-2.5 [&>li]:text-[13px] [&>li]:leading-[1.45] [&>li_em]:not-italic";

const TIER_LIST_DEFAULT = "[&>li]:text-[var(--ink-2)]";

const TIER_LIST_MUTED = "[&>li]:text-[var(--ink-3)]";

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
}: TierProps) {
  return (
    <div className={`${TIER_BASE} ${popular ? TIER_POP : TIER_DEFAULT}`}>
      {popular && (
        <div className="absolute top-[-1px] left-6 px-3 py-[5px] bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] text-[oklch(1_0_0_/_0.98)] font-display text-[9px] font-bold tracking-[0.14em] uppercase rounded-b-lg shadow-[0_4px_12px_oklch(from_var(--accent)_l_c_h_/_0.4)]">
          {popularLabel}
        </div>
      )}
      <div className="flex flex-col gap-3.5">
        <div className="font-display font-bold text-[13px] tracking-[0.14em] uppercase text-ink leading-[1.2] max-[700px]:text-[12px]">
          {name}
        </div>
        <h3 className="font-display font-bold text-[38px] leading-none text-ink tracking-[-0.025em] m-0 [&_em]:not-italic [&_em]:font-medium [&_em]:text-[14px] [&_em]:text-[var(--ink-3)] [&_em]:tracking-normal [&_em]:block [&_em]:mb-1 max-[700px]:text-[32px]">
          <em>{priceLabel}</em>
          {price}
        </h3>
        <div className="text-[12px] text-[var(--ink-3)] tracking-[0.04em]">
          {weeks}
        </div>
        {bestFor ? (
          <div className="mt-1 pt-3 border-t border-line">
            <div className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-accent-soft mb-1.5">
              {bestForLabel}
            </div>
            <p className="m-0 text-[12.5px] leading-[1.5] text-[var(--ink-2)]">
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
            <h4 className="font-display text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--ink-3)] mb-3">
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
        {ctaHref ? (
          <Link
            href={ctaHref}
            className={`${TIER_BTN_BASE} ${ctaGhost ? TIER_BTN_GHOST : TIER_BTN_PRIMARY} inline-flex items-center justify-center text-center no-underline`}
          >
            {ctaLabel}
          </Link>
        ) : (
          <button
            className={`${TIER_BTN_BASE} ${ctaGhost ? TIER_BTN_GHOST : TIER_BTN_PRIMARY}`}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
