/**
 * Short service names for the header services dropdown.
 *
 * All 8 industries are live in Sanity with published industryPage docs.
 * Translation keys (`key`) live in `messages/{uk,en}.json` → `ServiceNav`.
 * EN availability is gated by `EN_INDUSTRY_SLUGS` in `lib/i18n-routes.ts`.
 */
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
