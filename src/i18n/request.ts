import { getRequestConfig } from "next-intl/server";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/constants/locales";

/**
 * Locale + messages for next-intl. The locale is pinned by `setRequestLocale`
 * in each route group's root layout (`app/(uk)/layout.tsx`, `app/(en)/layout.tsx`),
 * so this config no longer needs to read request headers — which means pages
 * stay statically renderable and `experimental.inlineCss` can actually run.
 */
const MESSAGES: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
  uk: () => import("../../messages/uk.json"),
  en: () => import("../../messages/en.json"),
  ru: () => import("../../messages/ru.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale =
    requested && (LOCALES as readonly string[]).includes(requested)
      ? (requested as Locale)
      : DEFAULT_LOCALE;
  return { locale, messages: (await MESSAGES[locale]()).default };
});
