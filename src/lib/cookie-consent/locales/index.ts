import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/constants/locales";

import { consentCopyEn, type ConsentCopy } from "./en/consent";
import { consentCopyUk } from "./uk/consent";
import { consentCopyRu } from "./ru/consent";

export type { ConsentCopy };

const COPY: Record<Locale, ConsentCopy> = {
  uk: consentCopyUk,
  en: consentCopyEn,
  ru: consentCopyRu,
};

/** Locale → copy; default-locale copy for unknown locale strings. */
export function getConsentCopy(locale: string): ConsentCopy {
  const l = (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
  return COPY[l];
}
