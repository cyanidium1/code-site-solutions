import { NextResponse } from "next/server";

/**
 * Locale strategy: `/` ALWAYS renders Ukrainian and returns 200 — no
 * locale redirect, server-side or otherwise.
 *
 * History (2026-08, SEO round 2): `/` used to 307 to `/en` or `/ru` based
 * on Accept-Language / the NEXT_LOCALE cookie. Two problems killed it:
 *
 *   1. All 558 external backlinks point at `/`, and hreflang declared both
 *      `uk` and `x-default` as `https://www.code-site.art/` — a URL that
 *      did not resolve to itself. The canonical followed the redirect.
 *   2. Worse: the locale-adaptive response was CDN-cached WITHOUT
 *      `Vary: Accept-Language`. Whichever variant was warm on a Vercel
 *      edge node was served to everyone hitting it, so Ukrainian visitors
 *      were served the English homepage and vice versa.
 *
 * Language switching for non-Ukrainian visitors now happens through the
 * dismissible <LanguageBanner>, which renders CLIENT-side from
 * `navigator.language`. That keeps the server HTML byte-identical for
 * every visitor, so `/` is not locale-adaptive at all and needs no
 * `Vary` — the CDN can cache one variant safely. Google recommends this
 * banner pattern over automatic language redirection.
 *
 * Deep links (`/en/...`, `/ru/...`) were never redirected and still are
 * not: language is carried by the URL prefix.
 *
 * The middleware is now a pass-through. It is kept (rather than deleted)
 * so the matcher and this rationale stay in one obvious place if locale
 * routing is ever revisited.
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.).*)"],
};
