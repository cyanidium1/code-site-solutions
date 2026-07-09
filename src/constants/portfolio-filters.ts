/**
 * UI chrome constants for the /portfolio filter dropdowns.
 *
 * The actual option lists (industry, country, budget) are derived at render
 * time from the case data — see `dedupeOptionRefs` / `dedupeIndustries` in
 * `components/portfolio-filters/filter-cases.ts`. Editors maintain the
 * country and budget vocabulary in the CMS Studio under Options.
 */

import type { Locale } from "@/types/sanity";

export type PortfolioFilterKey = "industry" | "country" | "budget";

export type { FilterOption } from "@/lib/shared/filters/types";

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

/**
 * Sentinel key for the explicit "All" reset option inside each dropdown.
 * Empty string isn't safe as an option key (ui/Select uses `""` for "no
 * selection"), so we use a sentinel and translate it to `""` (which clears
 * the URL param) in the change handler.
 */
export const FILTER_ALL_KEY = "__all__";

export const FILTER_ALL_LABEL_BY_LOCALE: Record<"uk" | "en", string> = {
  uk: "Всі",
  en: "All",
};

/**
 * Lowercases only the first character so the industry title reads naturally
 * mid-sentence while any internal proper nouns keep their case.
 */
function lowerFirst(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

/**
 * CTA shown when an industry filter is active, linking to that industry page.
 *
 * The industry `label` is the industryPage title, which already reads as a
 * full noun phrase ("Websites for the auto industry" / "Сайти для медичних
 * клінік"). So we embed it directly — prepending "sites for / сайти для" here
 * would double up ("…sites for Websites for…"). Title-cased label is
 * lower-cased at the front to sit cleanly inside the sentence.
 */
export const INDUSTRY_CTA_LABEL_BY_LOCALE: Record<
  "uk" | "en",
  (industryLabel: string) => string
> = {
  uk: (label) => `Дізнатися більше про ${lowerFirst(label)}`,
  en: (label) => `Learn more about ${lowerFirst(label)}`,
};

export function localeFromLocaleType(locale: Locale): "uk" | "en" {
  return locale === "en" ? "en" : "uk";
}
