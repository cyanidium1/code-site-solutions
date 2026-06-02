/**
 * Single source of truth for the header's top-level nav links and the
 * services dropdown. Imported by `hp-header.tsx`, `mobile-menu.tsx`,
 * and any other site chrome that needs to enumerate the navigation.
 *
 * Each header entry stores:
 *   - `uaHref`: the bare UA path. Run through `localizePath` from
 *     `@/constants/i18n-routes` to get the locale-aware href.
 *   - `key`:    the translation key under `messages/{uk,en}.json` →
 *     `Nav` that holds the visible label.
 *
 * Every header entry corresponds to a real `/en/<path>` page today. If
 * you add a route that only exists in UA, gate it on `EN_LOCALIZED_ROOTS`
 * in `i18n-routes.ts` instead of hardcoding the divergence here.
 *
 * All 8 service industries are live in Sanity with published industryPage
 * docs. Service translation keys live under `ServiceNav`. EN availability
 * is gated by `EN_INDUSTRY_SLUGS` in `@/constants/i18n-routes`.
 */

export type HeaderNavLink = {
  uaHref: string;
  key: string;
};

/** Nav translation key for `/portfolio` — shows CMS case count in the header. */
export const NAV_CASE_COUNT_LINK_KEY = "work";

export const HEADER_NAV_LINKS: readonly HeaderNavLink[] = [
  { uaHref: "/about", key: "about" },
  { uaHref: "/calculator", key: "calculator" },
  { uaHref: "/portfolio", key: "work" },
  { uaHref: "/blog", key: "blog" },
  { uaHref: "/pricing", key: "pricing" },
  { uaHref: "/process", key: "process" },
  { uaHref: "/contacts", key: "contact" },
] as const;

export type ServiceNavLink = {
  href: string;
  key: string;
  published: boolean;
};

export const SERVICE_NAV_LINKS: readonly ServiceNavLink[] = [
  { href: "/sites-for/medicine", key: "medicine", published: true },
  { href: "/sites-for/renovation", key: "renovation", published: true },
  { href: "/sites-for/legal", key: "legal", published: true },
  { href: "/sites-for/finance", key: "finance", published: true },
  { href: "/sites-for/ecommerce", key: "ecommerce", published: true },
  { href: "/sites-for/auto", key: "auto", published: true },
  { href: "/sites-for/real-estate", key: "realEstate", published: true },
  { href: "/sites-for/courses", key: "courses", published: true },
] as const;
