import type { Locale, LocalizedString, OptionRef } from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import type { FilterOption } from "./types";

/**
 * Reduces a list of OptionRefs (from `countryOption` / `budgetBucketOption`)
 * to a deduplicated `{key,label}[]`, sorted by first appearance. Missing or
 * empty refs are dropped so the caller can render the result directly.
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
 * Generic version for inline `industry` projections used by both `caseStudy`
 * and `blogPost` (shape: `{ slug, title? }`). Accepts a list of items and a
 * field accessor — keeps the helper agnostic about the document type.
 *
 * Cases use `c.industry?.slug ?? c.industrySlug` (the latter is a legacy
 * projection). For posts, the accessor is just `p.industry`.
 */
export type IndustryInline = {
  slug?: string;
  title?: LocalizedString;
} | null | undefined;

export function dedupeIndustryRefs<T>(
  items: readonly T[],
  pickIndustry: (item: T) => IndustryInline,
  locale: Locale,
): FilterOption[] {
  const seen = new Map<string, string>();
  for (const item of items) {
    const ind = pickIndustry(item);
    if (!ind?.slug || seen.has(ind.slug)) continue;
    seen.set(ind.slug, loc(ind.title, locale) || ind.slug);
  }
  return Array.from(seen, ([key, label]) => ({ key, label }));
}
