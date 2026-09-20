/**
 * Locale-keyed option arrays for the standalone lead-form block.
 *
 * The calculator's lead form (`src/components/calculator/LeadForm.tsx`)
 * uses a different, calculator-specific form shape and does not share
 * these arrays.
 */

import { LOCALES, type Locale } from "@/constants/locales";
import { formatPrice } from "@/lib/shared/format-price";
import { CORE_PACKAGES, PACKAGES, formatPackagePrice } from "@/constants/pricing";
export type LeadFormLocale = Locale;

export type LeadFormOption = { key: string; label: string };

function byLocale<T>(build: (l: Locale) => T): Record<Locale, T> {
  return Object.fromEntries(LOCALES.map((l) => [l, build(l)])) as Record<Locale, T>;
}

const UNKNOWN_TIER: Record<Locale, string> = {
  uk: "Не знаю, потрібна консультація",
  ru: "Не знаю, нужна консультация",
  en: "Not sure — I need advice",
};

/** "Що потрібно" — package keys match PackageId in `@/constants/pricing`. */
export const TIER_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = byLocale((l) => [
  ...[...CORE_PACKAGES, "industry" as const].map((id) => ({
    key: id,
    label: `${PACKAGES[id].name[l]} — ${formatPackagePrice(id, l)}`,
  })),
  { key: "unknown", label: UNKNOWN_TIER[l] },
]);

/** Budget brackets follow the package ladder (TZ v2 §5). Required field. */
const BUDGET_EDGES = [600, 1000, 2000, 4000] as const;
const UNDER: Record<Locale, string> = { uk: "до", ru: "до", en: "under" };
const OVER: Record<Locale, string> = { uk: "понад", ru: "больше", en: "over" };

export const BUDGET_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = byLocale((l) => {
  const f = (n: number) => formatPrice(n, { locale: l });
  const [a, b, c, d] = BUDGET_EDGES;
  return [
    { key: `lt${a}`, label: `${UNDER[l]} ${f(a)}` },
    { key: `${a}-${b}`, label: `${f(a)}–${f(b)}` },
    { key: `${b}-${c}`, label: `${f(b)}–${f(c)}` },
    { key: `${c}-${d}`, label: `${f(c)}–${f(d)}` },
    { key: `gt${d}`, label: `${OVER[l]} ${f(d)}` },
  ];
});

export const HAS_SITE_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = {
  uk: [
    { key: "no", label: "Ні" },
    { key: "yes", label: "Так, вкажу URL" },
  ],
  ru: [
    { key: "no", label: "Нет" },
    { key: "yes", label: "Да, укажу URL" },
  ],
  en: [
    { key: "no", label: "No" },
    { key: "yes", label: "Yes, here's the URL" },
  ],
};
