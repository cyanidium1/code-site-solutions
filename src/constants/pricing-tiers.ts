/**
 * Canonical tier definitions for the homepage Pricing section, the
 * "Pricing in the brief" Bento visual, and the FAQ. Update prices here
 * and they propagate everywhere automatically.
 */

import type { PriceLocale } from "@/lib/shared/format-price";

export type TierKey = "landing" | "corporate" | "custom";

export const TIER_AMOUNTS: Record<TierKey, number> = {
  landing: 800,
  corporate: 3500,
  custom: 6000,
};

export const TIER_NAMES: Record<TierKey, Record<PriceLocale, string>> = {
  landing: { uk: "Лендінг", en: "Landing" },
  corporate: { uk: "Корпоративний сайт", en: "Corporate Website" },
  custom: { uk: "Кастомна платформа", en: "Custom Platform" },
};

export const TIER_WEEKS: Record<TierKey, Record<PriceLocale, string>> = {
  landing: { uk: "1-2 тижні", en: "1–2 weeks" },
  corporate: { uk: "4-8 тижнів", en: "4–8 weeks" },
  custom: { uk: "8-16 тижнів", en: "8–16 weeks" },
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
