import { DEFAULT_LOCALE, type Locale } from "@/constants/locales";

/**
 * Localized-object picker. The default locale is the authoring locale, so
 * it gets no cross-locale fallback; secondary locales return undefined when
 * their value is missing so the caller renders nothing rather than the
 * wrong language (same policy as pickRichText). Dev-mode warn surfaces
 * translation gaps during build/QA.
 */
export function pickLocalized<T>(
  value: Partial<Record<Locale, T>> | undefined | null,
  locale: Locale,
): T | undefined {
  if (!value) return undefined;
  const v = value[locale];
  const empty =
    v == null ||
    (typeof v === "string" && v === "") ||
    (Array.isArray(v) && v.length === 0);
  if (!empty) return v as T;
  if (locale !== DEFAULT_LOCALE && process.env.NODE_ENV !== "production") {
    console.warn(`[pickLocalized] missing "${locale}" translation`);
  }
  return undefined;
}
