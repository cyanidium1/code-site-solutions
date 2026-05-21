/**
 * Single source of truth for the header's top-level nav links.
 *
 * Imported by both `hp-header.tsx` (desktop) and `mobile-menu.tsx`
 * (mobile drawer) so the two stay in lockstep instead of being
 * maintained as parallel arrays.
 *
 * Each entry stores:
 *   - `uaHref`: the bare UA path. Run through `localizePath` from
 *     `@/lib/i18n-routes` to get the locale-aware href.
 *   - `key`:    the translation key under `messages/{uk,en}.json` →
 *     `Nav` that holds the visible label.
 *
 * Every entry corresponds to a real `/en/<path>` page today. If you
 * add a route that only exists in UA, gate it on `EN_LOCALIZED_ROOTS`
 * in `i18n-routes.ts` instead of hardcoding the divergence here.
 */
export type HeaderNavLink = {
  uaHref: string;
  key: string;
};

export const HEADER_NAV_LINKS: readonly HeaderNavLink[] = [
  { uaHref: "/about", key: "about" },
  { uaHref: "/calculator", key: "calculator" },
  { uaHref: "/portfolio", key: "work" },
  { uaHref: "/blog", key: "blog" },
  { uaHref: "/pricing", key: "pricing" },
  { uaHref: "/process", key: "process" },
  { uaHref: "/contacts", key: "contact" },
] as const;
