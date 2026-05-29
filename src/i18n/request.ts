import { getRequestConfig } from "next-intl/server";

/**
 * Locale + messages for next-intl. The locale is pinned by `setRequestLocale`
 * in each route group's root layout (`app/(uk)/layout.tsx`, `app/(en)/layout.tsx`),
 * so this config no longer needs to read request headers — which means pages
 * stay statically renderable and `experimental.inlineCss` can actually run.
 */
const LOCALES = ["uk", "en"] as const;
type Locale = (typeof LOCALES)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale =
    requested && (LOCALES as readonly string[]).includes(requested)
      ? (requested as Locale)
      : "uk";
  const messages =
    locale === "en"
      ? (await import("../../messages/en.json")).default
      : (await import("../../messages/uk.json")).default;
  return { locale, messages };
});
