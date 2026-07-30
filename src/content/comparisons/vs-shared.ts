import type { Locale } from "@/constants/locales";

/**
 * Copy shared by all three vs-* comparison pages. Adding a locale extends
 * these records (the compiler enforces it).
 */
export const VS_FAQ_HEADING: Record<Locale, string> = {
  uk: "Що питають найчастіше",
  en: "What people ask most",
  ru: "Что спрашивают чаще всего",
};
