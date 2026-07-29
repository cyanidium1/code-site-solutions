import { NextResponse, type NextRequest } from "next/server";

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CONFIG,
  SECONDARY_LOCALES,
  type Locale,
} from "@/constants/locales";

/**
 * Locale strategy:
 *   - `/` always renders the default locale (UA). Secondary-locale routes
 *     (`/en/...`) always render that locale. Both URL families stay
 *     individually crawlable so SEO + hreflang work as declared in metadata.
 *   - First visit to `/` (no NEXT_LOCALE cookie): we read Accept-Language;
 *     if the user prefers a secondary locale over UK, we 302 to its prefix.
 *     Search-engine crawlers don't send Accept-Language so they always land
 *     on UA — by design.
 *   - Once the user picks a locale via the LocaleSwitcher, the choice is
 *     persisted in a `NEXT_LOCALE` cookie and the auto-detect on `/`
 *     respects it.
 *
 * We only auto-redirect on `/`. Deep links (e.g. /sites-for/medicine,
 * /en/sites-for/medicine) are honored as-is — the user clicked through
 * to that specific URL, we don't want to fight them.
 *
 * No request headers are mutated: `<html lang>` is hardcoded statically
 * in each route group's root layout, so the renderer doesn't need to know
 * the request path. Keeping the middleware lean lets the rest of the app
 * render statically.
 */

const COOKIE_NAME = "NEXT_LOCALE";

function preferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  // Parse "uk-UA,uk;q=0.9,en;q=0.8". Track the highest q per configured
  // locale; a secondary locale wins only with strictly higher q than the
  // default (ties go to the site's original language).
  const best: Partial<Record<Locale, number>> = {};
  for (const part of acceptLanguage.split(",")) {
    const [tagRaw, qRaw] = part.trim().split(";q=");
    const lang = tagRaw.toLowerCase().split("-")[0];
    if (!(LOCALES as readonly string[]).includes(lang)) continue;
    const l = lang as Locale;
    const q = qRaw ? parseFloat(qRaw) : 1;
    if (q > (best[l] ?? -1)) best[l] = q;
  }
  let winner: Locale = DEFAULT_LOCALE;
  let winQ = best[DEFAULT_LOCALE] ?? -1;
  for (const l of SECONDARY_LOCALES) {
    const q = best[l] ?? -1;
    if (q > winQ) {
      winner = l;
      winQ = q;
    }
  }
  return winner;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
    const target: Locale | undefined =
      cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
        ? (cookieLocale as Locale)
        : cookieLocale
          ? undefined // unknown cookie value: no preference, no auto-detect
          : preferredLocale(request.headers.get("accept-language"));
    if (target && target !== DEFAULT_LOCALE) {
      return NextResponse.redirect(
        new URL(LOCALE_CONFIG[target].urlPrefix, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
