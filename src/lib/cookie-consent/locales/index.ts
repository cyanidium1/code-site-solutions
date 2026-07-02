import { consentCopyEn, type ConsentCopy } from "./en/consent";
import { consentCopyUk } from "./uk/consent";

export type { ConsentCopy };

/** Locale → copy, English fallback for unknown locales. */
export function getConsentCopy(locale: string): ConsentCopy {
  return locale === "uk" ? consentCopyUk : consentCopyEn;
}
