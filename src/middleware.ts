import { NextResponse, type NextRequest } from "next/server";

import { SITE_ORIGIN } from "@/constants/site";

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
 */

const CANONICAL_HOST = new URL(SITE_ORIGIN).host;

/**
 * Everything the site serves on a host other than the canonical one is
 * marked `noindex, nofollow`.
 *
 * Audit 31.08.2026: the whole site was reachable and indexable on Vercel
 * preview hosts, and it was not theoretical — Clarity recorded 9 sessions
 * on `code-site-frontend.vercel.app` in 30 days, and both it and
 * `code-site-solution.vercel.app` showed up as referrers. A full duplicate
 * of a 300-page site competing with the original is crawl budget taken
 * from the pages that matter, on a site where Google already declined to
 * index 46 of them.
 *
 * A header rather than a redirect: redirecting every preview host to
 * production would make preview deploys useless for review. `X-Robots-Tag`
 * keeps them browsable and keeps them out of the index.
 *
 * This only covers hosts served by THIS project. A mirror deployed from
 * another repository has to be removed in its own Vercel project.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const host = request.headers.get("host");
  if (host && host !== CANONICAL_HOST) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.).*)"],
};
