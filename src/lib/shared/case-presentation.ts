/**
 * Presentational data for case-study cards (industry chip color, gradient,
 * tech label, display label). Used wherever case cards render: /portfolio
 * listing, homepage <Cases>, case-page <Related>.
 *
 * Schema doesn't store these — keep here as a small per-industry config
 * until industries grow large enough to warrant moving into Sanity.
 */

export type CasePresentation = {
  color: string;
  gradient: string;
  tech: string;
  label: string;
};

const INDUSTRY_PRESENTATION: Record<string, CasePresentation> = {
  healthcare: {
    color: "#0EA5E9",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.55 0.16 200) 100%)",
    tech: "Next.js",
    label: "Healthcare",
  },
  construction: {
    color: "#EF4444",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.62 0.18 60) 100%)",
    tech: "Next.js",
    label: "Construction",
  },
};

const DEFAULT_PRESENTATION: CasePresentation = {
  color: "#8B5CF6",
  gradient:
    "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  tech: "Next.js",
  label: "Other",
};

/**
 * Until every caseStudy doc carries an `industry` reference, this map
 * hard-codes which industry presentation a given case slug should fall
 * back to. Drop entries once the corresponding doc has an industry ref
 * set in Studio.
 */
const CASE_SLUG_TO_INDUSTRY: Record<string, string> = {
  "efedra-clinic": "healthcare",
  "nbyg-kobenhavn": "construction",
};

export function presentationForCase(
  caseSlug: string,
  industrySlug?: string,
): CasePresentation {
  const key = industrySlug ?? CASE_SLUG_TO_INDUSTRY[caseSlug];
  if (!key) return DEFAULT_PRESENTATION;
  return INDUSTRY_PRESENTATION[key] ?? DEFAULT_PRESENTATION;
}
