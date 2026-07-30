/**
 * Single source of truth for the site's locales. Middleware, route helpers,
 * metadata, the content registry, sitemaps, and price formatting all derive
 * from this file. Adding a locale = add it to LOCALES + LOCALE_CONFIG and
 * follow docs/adding-a-locale.md (workspace docs).
 */
export const LOCALES = ["uk", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = "uk" satisfies Locale;
export type SecondaryLocale = Exclude<Locale, typeof DEFAULT_LOCALE>;
export const SECONDARY_LOCALES: readonly SecondaryLocale[] = LOCALES.filter(
  (l): l is SecondaryLocale => l !== DEFAULT_LOCALE,
);

export type LocaleConfig = {
  /** URL prefix. "" = default locale at root; secondary locales use "/xx". */
  urlPrefix: "" | `/${string}`;
  /** <html lang> attribute for the locale's root layout. */
  htmlLang: string;
  /** hreflang tag used in metadata alternates and sitemaps. */
  hreflang: string;
  /** OpenGraph locale tag. */
  ogLocale: string;
  /** BCP 47 tag for JSON-LD inLanguage and similar full-language metadata. */
  bcp47: string;
  /**
   * Include in Accept-Language auto-detect on `/`. ru is cookie-only: many
   * Ukrainian visitors' browsers send `ru`, and we must not bounce them off
   * the default-locale homepage. They reach /ru via the switcher, and the
   * choice then persists in the NEXT_LOCALE cookie.
   */
  autoDetect: boolean;
};

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  uk: { urlPrefix: "", htmlLang: "uk", hreflang: "uk", ogLocale: "uk_UA", bcp47: "uk-UA", autoDetect: true },
  en: { urlPrefix: "/en", htmlLang: "en", hreflang: "en-GB", ogLocale: "en_GB", bcp47: "en-GB", autoDetect: true },
  ru: { urlPrefix: "/ru", htmlLang: "ru", hreflang: "ru", ogLocale: "ru_UA", bcp47: "ru", autoDetect: false },
};

/** Locale of a pathname by its URL prefix; DEFAULT_LOCALE when none matches. */
export function localeFromPathname(pathname: string): Locale {
  for (const l of SECONDARY_LOCALES) {
    const p = LOCALE_CONFIG[l].urlPrefix;
    if (pathname === p || pathname.startsWith(`${p}/`)) return l;
  }
  return DEFAULT_LOCALE;
}

/** Split a pathname into its locale + default-locale-canonical path. */
export function toCanonicalPath(pathname: string): { locale: Locale; path: string } {
  const locale = localeFromPathname(pathname);
  if (locale === DEFAULT_LOCALE) return { locale, path: pathname };
  const rest = pathname.slice(LOCALE_CONFIG[locale].urlPrefix.length);
  return { locale, path: rest === "" ? "/" : rest };
}
