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
  medicine: {
    color: "#0EA5E9",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.55 0.16 200) 100%)",
    tech: "Next.js",
    label: "Healthcare",
  },
  renovation: {
    color: "#EF4444",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.62 0.18 60) 100%)",
    tech: "Next.js",
    label: "Construction",
  },
  ecommerce: {
    color: "#10B981",
    gradient:
      "linear-gradient(135deg, oklch(0.58 0.20 160) 0%, oklch(0.50 0.16 205) 100%)",
    tech: "Next.js",
    label: "E-commerce",
  },
  auto: {
    color: "#6366F1",
    gradient:
      "linear-gradient(135deg, oklch(0.58 0.19 275) 0%, oklch(0.48 0.17 250) 100%)",
    tech: "Next.js",
    label: "Auto",
  },
  courses: {
    color: "#EC4899",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.22 345) 0%, oklch(0.55 0.19 20) 100%)",
    tech: "Next.js",
    label: "Courses",
  },
  finance: {
    color: "#06B6D4",
    gradient:
      "linear-gradient(135deg, oklch(0.60 0.15 205) 0%, oklch(0.50 0.12 235) 100%)",
    tech: "Next.js",
    label: "Finance",
  },
  legal: {
    color: "#F59E0B",
    gradient:
      "linear-gradient(135deg, oklch(0.70 0.16 85) 0%, oklch(0.62 0.15 60) 100%)",
    tech: "Next.js",
    label: "Legal",
  },
  "real-estate": {
    color: "#14B8A6",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.14 185) 0%, oklch(0.52 0.12 165) 100%)",
    tech: "Next.js",
    label: "Real Estate",
  },
};

const DEFAULT_PRESENTATION: CasePresentation = {
  color: "#8B5CF6",
  gradient:
    "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  tech: "Next.js",
  label: "Other",
};

export function presentationForCase(
  industrySlug?: string,
): CasePresentation {
  const key = normalizeIndustrySlug(industrySlug);
  if (!key) return DEFAULT_PRESENTATION;
  return INDUSTRY_PRESENTATION[key] ?? DEFAULT_PRESENTATION;
}

function normalizeIndustrySlug(slug?: string): string | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === "healthcare") return "medicine";
  if (normalized === "construction") return "renovation";
  if (normalized === "consctruction") return "renovation";
  if (normalized === "construction-renovation") return "renovation";
  if (normalized === "renovation-construction") return "renovation";
  if (normalized === "construction-renovation-and-repair") return "renovation";
  if (normalized === "renovation-and-construction") return "renovation";
  if (normalized === "e-commerse") return "ecommerce";
  if (normalized === "e-commerce") return "ecommerce";
  return normalized;
}
