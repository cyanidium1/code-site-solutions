import type { Metadata } from "next";

import { localizePath } from "@/constants/i18n-routes";
import {
  DEFAULT_LOCALE,
  LOCALE_CONFIG,
  SECONDARY_LOCALES,
  type Locale,
  type SecondaryLocale,
} from "@/constants/locales";

/**
 * Canonical + hreflang alternates derived from LOCALE_CONFIG, replacing
 * per-page hand-written `alternates` blocks. `uaPath` is the default-locale
 * path. `available` limits which secondary locales exist for this page
 * (default: all). `paths` overrides prefix-derived paths (translated slugs).
 * Relative paths resolve against layout `metadataBase` exactly as before.
 */
export function buildAlternates(opts: {
  locale: Locale;
  uaPath: string;
  available?: readonly SecondaryLocale[];
  paths?: Partial<Record<SecondaryLocale, string>>;
}): NonNullable<Metadata["alternates"]> {
  const { locale, uaPath, available = SECONDARY_LOCALES, paths = {} } = opts;
  const languages: Record<string, string> = {
    [LOCALE_CONFIG[DEFAULT_LOCALE].hreflang]: uaPath,
  };
  for (const l of available) {
    languages[LOCALE_CONFIG[l].hreflang] = paths[l] ?? localizePath(uaPath, l);
  }
  languages["x-default"] = uaPath;
  const canonical =
    locale === DEFAULT_LOCALE ? uaPath : (paths[locale] ?? localizePath(uaPath, locale));
  return { canonical, languages };
}
