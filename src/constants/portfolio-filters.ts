/**
 * Single source of truth for /portfolio filter dropdown options.
 *
 * The `industry` options are derived dynamically from published industryPage
 * docs at render time (see PortfolioFilters); only `country` and `budget` live
 * here because their value vocabulary is finite and fixed by schema.
 */

import type { Locale } from "@/types/sanity";

export type PortfolioFilterKey = "industry" | "country" | "budget";

export type FilterOption = { key: string; label: string };

export const COUNTRY_OPTS_BY_LOCALE: Record<"uk" | "en", FilterOption[]> = {
  uk: [
    { key: "UA", label: "Україна" },
    { key: "DK", label: "Данія" },
    { key: "US", label: "США" },
    { key: "PL", label: "Польща" },
    { key: "DE", label: "Німеччина" },
    { key: "UK", label: "Велика Британія" },
    { key: "EU", label: "Інше / ЄС" },
  ],
  en: [
    { key: "UA", label: "Ukraine" },
    { key: "DK", label: "Denmark" },
    { key: "US", label: "USA" },
    { key: "PL", label: "Poland" },
    { key: "DE", label: "Germany" },
    { key: "UK", label: "United Kingdom" },
    { key: "EU", label: "Other / EU" },
  ],
};

/** Bucket keys mirror BUDGET_OPTS_BY_LOCALE in constants/form-options.ts. */
export const BUDGET_FILTER_OPTS_BY_LOCALE: Record<"uk" | "en", FilterOption[]> = {
  uk: [
    { key: "lt3k", label: "До $3k" },
    { key: "3-7k", label: "$3–7k" },
    { key: "7-15k", label: "$7–15k" },
    { key: "gt15k", label: "$15k+" },
  ],
  en: [
    { key: "lt3k", label: "Under $3k" },
    { key: "3-7k", label: "$3–7k" },
    { key: "7-15k", label: "$7–15k" },
    { key: "gt15k", label: "$15k+" },
  ],
};

export const FILTER_LABELS_BY_LOCALE: Record<
  "uk" | "en",
  Record<PortfolioFilterKey, string>
> = {
  uk: { industry: "Галузь", country: "Країна", budget: "Бюджет" },
  en: { industry: "Industry", country: "Country", budget: "Budget" },
};

export const FILTER_PLACEHOLDER_BY_LOCALE: Record<"uk" | "en", string> = {
  uk: "Всі",
  en: "All",
};

export const INDUSTRY_CTA_LABEL_BY_LOCALE: Record<
  "uk" | "en",
  (industryLabel: string) => string
> = {
  uk: (label) => `Дізнатися більше про сайти для ${label}`,
  en: (label) => `Learn more about sites for ${label}`,
};

export function localeFromLocaleType(locale: Locale): "uk" | "en" {
  return locale === "en" ? "en" : "uk";
}
