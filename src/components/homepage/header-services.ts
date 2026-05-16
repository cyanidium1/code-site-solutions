/**
 * Short service names for the header services dropdown.
 *
 * All 8 industries render in the dropdown for visual completeness even
 * when their Sanity page isn't published yet — unpublished entries get
 * the `published: false` flag and render as non-clickable disabled rows.
 * Translation keys (`key`) live in `messages/{uk,en}.json` → `ServiceNav`.
 * Once a new industry ships a Sanity page, flip `published: true` and
 * (for EN) add the slug to `EN_INDUSTRY_SLUGS` in `lib/i18n-routes.ts`.
 */
export type ServiceNavLink = {
  href: string;
  key: string;
  published: boolean;
};

export const SERVICE_NAV_LINKS: readonly ServiceNavLink[] = [
  { href: "/sites-for/medicine", key: "medicine", published: true },
  { href: "/sites-for/renovation", key: "renovation", published: true },
  { href: "/sites-for/legal", key: "legal", published: false },
  { href: "/sites-for/accounting", key: "accounting", published: false },
  { href: "/sites-for/ecommerce", key: "ecommerce", published: false },
  { href: "/sites-for/saas", key: "saas", published: false },
  { href: "/sites-for/cosmetology", key: "cosmetology", published: false },
  { href: "/sites-for/education", key: "education", published: false },
] as const;
