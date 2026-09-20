import { packagePrice, servicePrice } from "@/constants/pricing";

/**
 * Constructor tariff the Ads landing compares against (TZ v2 §4, "порівняння
 * з конструктором"). This is a third-party price, not ours, so it lives here
 * rather than in `@/constants/pricing`.
 *
 * CHECK DATE: 2026-09-20 — Wix "Business" plan, USD per month, billed yearly
 * (wix.com/plans). Re-check before each Ads campaign: Wix changes plan names
 * and regional prices. Update `checkedAt` together with the number.
 */
export const BUILDER_PLAN = {
  name: "Wix Business",
  perMonthUsd: 36,
  checkedAt: "2026-09-20",
} as const;

/** Months in the 3-year comparison window. */
export const COMPARISON_MONTHS = 36;

/** Business package + hosting renewal for years 2 and 3 (year 1 is included). */
export function ourThreeYearCost(): number {
  return packagePrice("business", "uk") + 2 * servicePrice("hostingRenewalPerYear", "uk");
}

export function builderThreeYearCost(): number {
  return BUILDER_PLAN.perMonthUsd * COMPARISON_MONTHS;
}
