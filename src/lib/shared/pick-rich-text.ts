import { DEFAULT_LOCALE } from "@/constants/locales";
import type { Locale, RichTextSimple } from "@/types/sanity";

/**
 * Returns the rich-text body for the requested locale, or undefined if
 * that locale's content is missing. No cross-locale fallback for
 * secondary locales — the caller renders nothing rather than the wrong
 * language. In dev mode we console.warn so missing translations surface
 * during build/QA.
 *
 * @deprecated Prefer `pickLocalized` with a localized-object shape
 * (`Partial<Record<Locale, RichTextSimple>>`). This flat-pair form only
 * expresses two locales and is being phased out.
 */
export function pickRichText(
  uk: RichTextSimple | undefined,
  en: RichTextSimple | undefined,
  locale: Locale,
): RichTextSimple | undefined {
  if (locale !== DEFAULT_LOCALE) {
    if (en && en.length) return en;
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[pickRichText] missing "${locale}" translation; returning undefined`);
    }
    return undefined;
  }
  return uk;
}
