import type { CaseStudyRef, Locale, OptionRef } from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import type { FilterOption } from "@/constants/portfolio-filters";

export type PortfolioFilterValues = {
  industry?: string;
  country?: string;
  budget?: string;
};

/**
 * Filters the case list by the given dropdown values. Empty/undefined values
 * match anything. Pure — no side effects, safe to call on the server.
 */
export function filterCases(
  cases: CaseStudyRef[],
  filters: PortfolioFilterValues,
): CaseStudyRef[] {
  const { industry, country, budget } = filters;
  if (!industry && !country && !budget) return cases;

  return cases.filter((c) => {
    if (industry) {
      const slug = c.industry?.slug ?? c.industrySlug;
      if (slug !== industry) return false;
    }
    if (country && c.country?.slug !== country) return false;
    if (budget && c.budgetBucket?.slug !== budget) return false;
    return true;
  });
}

/**
 * Reads a URLSearchParams-like object (or Next.js searchParams prop) into a
 * normalised PortfolioFilterValues. Unknown keys are ignored. Array values
 * (e.g. ?industry=a&industry=b) take the first entry — multi-select is out
 * of scope for v1.
 */
export function readFilterValues(
  searchParams:
    | Record<string, string | string[] | undefined>
    | URLSearchParams
    | undefined,
): PortfolioFilterValues {
  const pick = (k: string): string | undefined => {
    if (!searchParams) return undefined;
    if (searchParams instanceof URLSearchParams) {
      const v = searchParams.get(k);
      return v ?? undefined;
    }
    const v = searchParams[k];
    if (Array.isArray(v)) return v[0];
    return v ?? undefined;
  };
  return {
    industry: pick("industry"),
    country: pick("country"),
    budget: pick("budget"),
  };
}

/**
 * Reduces a list of OptionRefs to a deduplicated list of {key, label} options,
 * sorted by first appearance in the input. Empty/missing refs are dropped, so
 * the returned list only contains keys the caller can safely render in a
 * dropdown that will yield matching cases.
 */
export function dedupeOptionRefs(
  refs: Array<OptionRef | null | undefined>,
  locale: Locale,
): FilterOption[] {
  const seen = new Map<string, string>();
  for (const r of refs) {
    if (!r?.slug || seen.has(r.slug)) continue;
    seen.set(r.slug, loc(r.name, locale) || r.slug);
  }
  return Array.from(seen, ([key, label]) => ({ key, label }));
}

/**
 * Same shape as dedupeOptionRefs but for the inline `industry` projection
 * (cases carry `industry: {slug, title}` rather than a generic OptionRef).
 */
export function dedupeIndustries(
  cases: CaseStudyRef[],
  locale: Locale,
): FilterOption[] {
  const seen = new Map<string, string>();
  for (const c of cases) {
    const slug = c.industry?.slug ?? c.industrySlug;
    if (!slug || seen.has(slug)) continue;
    seen.set(slug, loc(c.industry?.title, locale) || slug);
  }
  return Array.from(seen, ([key, label]) => ({ key, label }));
}
