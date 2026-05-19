import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

/**
 * Resolves the active locale from the request pathname. The pathname is
 * surfaced into request headers by middleware.ts as `x-pathname`.
 *
 * Routes under /en/* render the EN catalog; everything else (including
 * the bare /) defaults to UA. This mirrors the same heuristic used in
 * src/app/layout.tsx for the <html lang> attribute.
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
