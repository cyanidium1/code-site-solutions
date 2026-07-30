import { DEFAULT_LOCALE, SECONDARY_LOCALES, type Locale, type SecondaryLocale } from "@/constants/locales";
import type { LocalizedString } from "@/types/sanity";

/**
 * True when the doc has non-empty content for `locale`. MUST stay logically
 * identical to the registry GROQ predicate (title[$locale] non-empty) — see
 * lib/server/i18n-registry.ts. Divergence re-introduces the "enabled but
 * 404s" failure mode.
 *
 * The default locale is the authoring locale and is always available.
 */
export function hasLocaleContent(
  doc: { title?: LocalizedString },
  locale: Locale,
): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return Boolean(doc.title?.[locale]?.trim());
}

/** Secondary locales this doc is available in — feeds buildAlternates. */
export function availableLocales(doc: {
  title?: LocalizedString;
}): SecondaryLocale[] {
  return SECONDARY_LOCALES.filter((l) => hasLocaleContent(doc, l));
}
