import type { Locale, RichTextSimple } from "@/types/sanity";

/**
 * Returns the rich-text body for the requested locale, or undefined if
 * that locale's content is missing. Was previously a UA-fallback (EN
 * → UA when missing) which silently leaked Ukrainian into EN pages.
 * In dev mode we console.warn so missing translations surface during
 * build/QA; in prod the caller renders nothing rather than the wrong
 * language.
 *
 * Shared by `case-page` and `industry-page`.
 */
export function pickRichText(
  uk: RichTextSimple | undefined,
  en: RichTextSimple | undefined,
  locale: Locale,
): RichTextSimple | undefined {
  if (locale === "en") {
    if (en && en.length) return en;
    if (process.env.NODE_ENV !== "production") {
      console.warn("[pickRichText] missing EN translation; returning undefined");
    }
    return undefined;
  }
  return uk;
}
