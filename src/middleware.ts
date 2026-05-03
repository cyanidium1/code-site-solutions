import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale strategy:
 *   - `/` always renders UA. `/en/...` always renders EN. Both URLs stay
 *     individually crawlable so SEO + hreflang work as declared in
 *     metadata.
 *   - First visit to `/` (no NEXT_LOCALE cookie): we read Accept-Language;
 *     if the user prefers EN over UK, we 302 to `/en`. Search-engine
 *     crawlers don't send Accept-Language so they always land on UA — by
 *     design.
 *   - Once the user picks a locale via the LocaleSwitcher, the choice is
 *     persisted in a `NEXT_LOCALE` cookie and the auto-detect on `/`
 *     respects it.
 *
 * We only auto-redirect on `/`. Deep links (e.g. /sites-for/medicine,
 * /en/sites-for/medicine) are honored as-is — the user clicked through
 * to that specific URL, we don't want to fight them.
 *
 * The pathname header is still set so the root layout can pick `<html lang>`.
 */

const COOKIE_NAME = "NEXT_LOCALE";

type Locale = "uk" | "en";

function preferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "uk";
  // Parse "uk-UA,uk;q=0.9,en;q=0.8". Pick the highest-q tag matching
  // either uk or en. If en outranks uk, return en.
  let bestUk = -1;
  let bestEn = -1;
  for (const part of acceptLanguage.split(",")) {
    const [tagRaw, qRaw] = part.trim().split(";q=");
    const lang = tagRaw.toLowerCase().split("-")[0];
    const q = qRaw ? parseFloat(qRaw) : 1;
    if (lang === "uk" && q > bestUk) bestUk = q;
    else if (lang === "en" && q > bestEn) bestEn = q;
  }
  // Tie goes to UK (the original locale of the site).
  return bestEn > bestUk ? "en" : "uk";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
    if (cookieLocale === "en") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
    if (!cookieLocale) {
      const detected = preferredLocale(request.headers.get("accept-language"));
      if (detected === "en") {
        return NextResponse.redirect(new URL("/en", request.url));
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
