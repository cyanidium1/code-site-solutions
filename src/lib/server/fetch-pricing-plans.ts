import "server-only";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { PRICING_PLANS_QUERY } from "@/lib/server/sanity-queries";
import { loc } from "@/lib/shared/sanity-locale";
import {
  formatPrice,
  type PriceCurrency,
  type PriceLocale,
} from "@/lib/shared/format-price";
import type { TierProps } from "@/types/pricing";
import type { PricingPlanDoc } from "@/types/sanity";
import {
  TIER_AMOUNTS,
  TIER_NAMES,
  TIER_WEEKS,
  type HomepagePlanInfo,
  type TierKey,
} from "@/constants/pricing-tiers";

/** A plan shaped for both <Tier> rendering and JSON-LD Offer derivation. */
export type ResolvedPlan = {
  key: string;
  priceFrom: number;
  currency: PriceCurrency;
  /** Localized plan name (for JSON-LD Offer.name). */
  name: string;
  /** Ready to spread into <Tier {...tier} />. */
  tier: TierProps;
};

const FROM_LABEL: Record<PriceLocale, string> = { uk: "від", en: "from" };

function defaultHref(planKey: string, locale: PriceLocale): string {
  const prefix = locale === "en" ? "/en" : "";
  return `${prefix}/contacts?tier=${planKey}`;
}

/**
 * Fetches all `pricingPlan` docs and shapes them into render-ready `TierProps`
 * for the given locale. Soft-fails to `[]` when Sanity is unconfigured or the
 * query errors — callers fall back to the hardcoded constants. 5-minute
 * revalidate + `pricing-plans` cache tag, matching `fetchTestimonialSlides`.
 */
export async function fetchPricingPlans(
  locale: PriceLocale,
): Promise<ResolvedPlan[]> {
  const docs = await sanityFetch<PricingPlanDoc[] | null>({
    query: PRICING_PLANS_QUERY,
    revalidate: 300,
    tags: ["pricing-plans"],
  }).catch(() => null);
  if (!docs?.length) return [];

  return docs
    .filter((d) => typeof d.priceFrom === "number" && loc(d.name, locale))
    .map<ResolvedPlan>((d) => {
      const key = d.planKey || d._id;
      // EN targets the UK market → GBP (£). UA keeps the doc currency ($).
      const currency: PriceCurrency =
        locale === "en" ? "GBP" : ((d.currency ?? "USD") as PriceCurrency);
      const includesItems = (d.includes ?? [])
        .map((s) => loc(s, locale))
        .filter(Boolean);
      const excludesItems = (d.excludes ?? [])
        .map((s) => loc(s, locale))
        .filter(Boolean);

      const tier: TierProps = {
        name: loc(d.name, locale),
        price: formatPrice(d.priceFrom as number, { locale, currency }),
        priceLabel: FROM_LABEL[locale],
        weeks: loc(d.weeks, locale),
        popular: Boolean(d.isPopular),
        popularLabel: loc(d.popularLabel, locale) || undefined,
        includes: {
          heading: loc(d.includesHeading, locale),
          items: includesItems,
        },
        excludes: excludesItems.length
          ? {
              heading: loc(d.excludesHeading, locale) || undefined,
              items: excludesItems,
            }
          : undefined,
        ctaLabel: loc(d.ctaLabel, locale),
        ctaGhost: Boolean(d.ctaGhost),
        ctaHref: d.ctaHref?.trim() || defaultHref(key, locale),
        discountLine: loc(d.discountLine, locale) || undefined,
      };

      return {
        key,
        priceFrom: d.priceFrom as number,
        currency,
        name: loc(d.name, locale),
        tier,
      };
    });
}

/**
 * Map resolved plans into a `{ landing, corporate, custom }` override the
 * homepage FAQ builder can merge over its constant defaults. Plans whose
 * `key` isn't one of the three known TierKeys are ignored.
 */
export function toHomepagePlanOverride(
  plans: ResolvedPlan[],
): Partial<Record<TierKey, HomepagePlanInfo>> {
  const knownKeys: TierKey[] = ["landing", "corporate", "custom"];
  const out: Partial<Record<TierKey, HomepagePlanInfo>> = {};
  for (const p of plans) {
    if (!(knownKeys as string[]).includes(p.key)) continue;
    const key = p.key as TierKey;
    const weeks =
      typeof p.tier.weeks === "string" ? p.tier.weeks : String(p.tier.weeks ?? "");
    out[key] = { name: p.name, priceFrom: p.priceFrom, weeks };
  }
  return out;
}

/**
 * Formatted "from $X" price floor derived from resolved plans, with
 * fallback to TIER_AMOUNTS (matches the homepage constants) when CMS plans
 * are empty. (The 2026-07 landing copy dropped the "to $Y+" upper bound.)
 */
export function pricingRange(
  plans: ResolvedPlan[],
  locale: PriceLocale,
): { min: string } {
  const prices = plans.length
    ? plans.map((p) => p.priceFrom)
    : [TIER_AMOUNTS.landing, TIER_AMOUNTS.corporate, TIER_AMOUNTS.custom];
  return {
    min: formatPrice(Math.min(...prices), { locale }),
  };
}

// Re-export the constants the FAQ builder falls back to so callers don't
// need separate imports.
export { TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS };
