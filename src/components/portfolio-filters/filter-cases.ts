import type { CaseStudyRef } from "@/types/sanity";

export type PortfolioFilterValues = {
  industry?: string;
  country?: string;
  budget?: string;
};

/**
 * Filters the case list by the given dropdown values. Empty/undefined
 * values match anything. Pure — no side effects, safe to call on the server.
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
