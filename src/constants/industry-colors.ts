/**
 * Single source of truth for per-industry accent hex.
 *
 * Used by:
 *   - Homepage Industries cards (border/accent CSS var)
 *   - Blog filter pills (background tint when active)
 *
 * Slug values mirror the published industryPage docs in Sanity.
 * Keep keys in sync with `INDUSTRY_PAGES_QUERY` results.
 */
export const INDUSTRY_ACCENT_BY_SLUG: Record<string, string> = {
  medicine: "#0EA5E9",
  renovation: "#EF4444",
  legal: "#8B5CF6",
  finance: "#10B981",
  ecommerce: "#F59E0B",
  auto: "#0070F3",
  "real-estate": "#EC4899",
  courses: "#14B8A6",
};

/**
 * Fallback color for industries without a registered accent (e.g. a new
 * industry slug added in the CMS before this map is updated).
 */
export const INDUSTRY_ACCENT_FALLBACK = "#6B7280";

export function industryAccent(slug: string | null | undefined): string {
  if (!slug) return INDUSTRY_ACCENT_FALLBACK;
  return INDUSTRY_ACCENT_BY_SLUG[slug] ?? INDUSTRY_ACCENT_FALLBACK;
}
