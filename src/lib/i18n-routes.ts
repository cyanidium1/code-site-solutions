/**
 * Single source of truth for which industry slugs have an English
 * translation in Sanity. Used by:
 *   - app/sitemap.ts (emits EN URL + hreflang for these slugs)
 *   - components/homepage/locale-switcher.tsx (maps `/sites-for/<slug>`
 *     to its `/en/sites-for/<slug>` counterpart instead of bouncing to
 *     `/en`)
 *   - components/homepage/hp-header.tsx (renders the services dropdown
 *     on EN with valid `/en/sites-for/<slug>` links for translated
 *     industries)
 *
 * When a new industry ships in EN: add its slug here, run the
 * translate script, deploy.
 */
export const EN_INDUSTRY_SLUGS: ReadonlySet<string> = new Set(["medicine"]);

export function hasEnIndustry(slug: string): boolean {
  return EN_INDUSTRY_SLUGS.has(slug);
}
