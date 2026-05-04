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

/**
 * Case-study slugs with EN content. Mirror of `title.en` presence in
 * Sanity caseStudy docs. Update when a new case ships in English.
 */
export const EN_CASE_SLUGS: ReadonlySet<string> = new Set(["nbyg-kobenhavn"]);

export function hasEnCase(slug: string): boolean {
  return EN_CASE_SLUGS.has(slug);
}

/**
 * Top-level routes that have a fully-translated EN counterpart at
 * `/en<path>`. Used by the locale switcher to keep the user on the
 * same page when toggling languages instead of bouncing to `/en`.
 */
export const EN_LOCALIZED_ROOTS: ReadonlySet<string> = new Set([
  "/vs-wordpress",
  "/vs-constructors",
  "/vs-freelancers",
]);

/**
 * Map current pathname to its UA / EN counterpart so the locale switcher
 * keeps page context. Falls back to the EN homepage only when no EN
 * counterpart is known to exist (avoids 404s).
 */
export function resolveLocaleAlternate(
  pathname: string,
): { uk: string; en: string } {
  if (pathname === "/" || pathname === "/en") {
    return { uk: "/", en: "/en" };
  }

  // EN → UA: strip the /en prefix
  if (pathname.startsWith("/en/")) {
    return { uk: pathname.slice(3), en: pathname };
  }

  // UA → EN: industry pages (only when an EN translation exists).
  const industryMatch = pathname.match(/^\/sites-for\/([^/]+)\/?$/);
  if (industryMatch && hasEnIndustry(industryMatch[1])) {
    const normalized = `/sites-for/${industryMatch[1]}`;
    return { uk: normalized, en: `/en${normalized}` };
  }

  // UA → EN: case-study pages (only when EN content exists).
  const caseMatch = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (caseMatch && hasEnCase(caseMatch[1])) {
    const normalized = `/portfolio/${caseMatch[1]}`;
    return { uk: normalized, en: `/en${normalized}` };
  }

  // UA → EN: top-level localized roots (vs-* compare pages).
  const rootMatch = pathname.match(/^(\/[^/]+)\/?$/);
  if (rootMatch && EN_LOCALIZED_ROOTS.has(rootMatch[1])) {
    return { uk: rootMatch[1], en: `/en${rootMatch[1]}` };
  }

  // No known EN counterpart — bounce to EN homepage to avoid 404.
  return { uk: pathname, en: "/en" };
}
