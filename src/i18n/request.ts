import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

/**
 * Locale resolver — reads the `x-pathname` header that middleware sets on
 * every request. Paths starting with `/en` get the EN message bundle; all
 * others (including `/`, `/uk/...`, `/ru/...` if we ever add them) get UA.
 *
 * Why a header and not the URL: getRequestConfig runs before route params
 * are available, so we lean on middleware to forward the path we already
 * computed for the layout's `<html lang>` attribute.
 *
 * Sprint 2BC fix: before this, locale was hardcoded to "uk" and every
 * useTranslations() call returned UA strings even on /en/* routes.
 */
export default getRequestConfig(async () => {
  const pathname = (await headers()).get("x-pathname") ?? "/";
  const locale = pathname.startsWith("/en") ? "en" : "uk";
  const messages =
    locale === "en"
      ? (await import("../../messages/en.json")).default
      : (await import("../../messages/uk.json")).default;
  return { locale, messages };
});
