/**
 * Canonical tier definitions for the homepage Pricing section, the
 * "Pricing in the brief" Bento visual, and the FAQ. Update prices here
 * and they propagate everywhere automatically.
 */

import type { PriceLocale } from "@/lib/shared/format-price";

export type TierKey = "landing" | "corporate" | "custom";

export const TIER_AMOUNTS: Record<TierKey, number> = {
  landing: 800,
  corporate: 2500,
  custom: 6000,
};

/**
 * Per-market amounts. The USD markets (uk, ru) run the corporate tier at
 * $2,500; the EN market is priced for the UK in GBP and stays at £3,500.
 * These are two separate market prices, not a currency conversion of one
 * another — do not "fix" one to match the other.
 *
 * Only overrides go here; anything absent falls back to TIER_AMOUNTS.
 */
export const TIER_AMOUNT_OVERRIDES: Partial<
  Record<PriceLocale, Partial<Record<TierKey, number>>>
> = {
  en: { corporate: 3500 },
};

/** Amount for a tier on a given market. Use instead of reading TIER_AMOUNTS. */
export function tierAmount(tier: TierKey, locale: PriceLocale): number {
  return TIER_AMOUNT_OVERRIDES[locale]?.[tier] ?? TIER_AMOUNTS[tier];
}

export const TIER_NAMES: Record<TierKey, Record<PriceLocale, string>> = {
  landing: { uk: "Лендінг", en: "Landing", ru: "Лендинг" },
  corporate: { uk: "Корпоративний сайт", en: "Corporate Website", ru: "Корпоративный сайт" },
  custom: { uk: "Кастомна платформа", en: "Custom Platform", ru: "Кастомная платформа" },
};

export const TIER_WEEKS: Record<TierKey, Record<PriceLocale, string>> = {
  landing: { uk: "1-2 тижні", en: "1–2 weeks", ru: "1–2 недели" },
  corporate: { uk: "4-8 тижнів", en: "4–8 weeks", ru: "4–8 недель" },
  custom: { uk: "8-16 тижнів", en: "8–16 weeks", ru: "8–16 недель" },
};

export const TIER_ORDER: TierKey[] = ["landing", "corporate", "custom"];

/**
 * Plain-data snapshot of a tier used by content-layer FAQ builders and any
 * place that wants name + numeric price + weeks together. Client-safe (no
 * server-only imports), so it can flow from a server fetch into client
 * content files via an `override?` parameter.
 */
export type HomepagePlanInfo = {
  name: string;
  priceFrom: number;
  weeks: string;
};
