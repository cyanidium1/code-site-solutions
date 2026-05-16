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
 *
 * Sprint 2BC: added /pricing, /about, /process, /contacts, /portfolio,
 * /blog. /blog/[slug] handled separately via EN_BLOG_SLUG_MAP below.
 */
export const EN_LOCALIZED_ROOTS: ReadonlySet<string> = new Set([
  "/vs-wordpress",
  "/vs-constructors",
  "/vs-freelancers",
  "/calculator",
  "/pricing",
  "/about",
  "/process",
  "/contacts",
  "/portfolio",
  "/blog",
]);

/**
 * UA blog slug → EN blog slug map. Sprint 2BC: each /blog/<ua-slug>
 * resolves to a different EN URL slug for SEO clarity. The map is
 * hardcoded because there are only 3 entries today and dynamic Sanity
 * lookup from a sync render path is awkward — see sprint-2bc-inventory
 * §4 for the trade-off.
 *
 * Update when a new blogPost ships with both slug + slugEn populated.
 */
// Sprint 2BC scope: only article 1 has a full EN translation today.
// Articles 2 and 3 will join the map once their EN bodies ship (the
// source file PART B has the EN copy — translation to portable text is
// a follow-up commit). Leaving the entries out keeps the locale
// switcher from sending users to half-rendered pages.
export const EN_BLOG_SLUG_MAP: Readonly<Record<string, string>> = {
  "skilky-koshtuye-sayt-2026": "website-cost-2026-breakdown",
};

/** Reverse map for EN → UA lookups. Derived once at module load. */
export const UK_BLOG_SLUG_MAP: Readonly<Record<string, string>> =
  Object.fromEntries(
    Object.entries(EN_BLOG_SLUG_MAP).map(([uk, en]) => [en, uk]),
  );

export function ukBlogSlugForEn(enSlug: string): string | undefined {
  return UK_BLOG_SLUG_MAP[enSlug];
}

export function enBlogSlugForUk(ukSlug: string): string | undefined {
  return EN_BLOG_SLUG_MAP[ukSlug];
}

/**
 * Map current pathname to its UA / EN counterpart so the locale switcher
 * keeps page context.
 *
 * Returns `null` for a locale when no counterpart exists for the current
 * pathname — the switcher renders that locale's button in a disabled
 * state (see LocaleSwitcher / MobileMenu) instead of silently bouncing
 * to the homepage. Always returns a non-null value for the locale the
 * user is currently on (the "current" side is just the pathname itself).
 */
export function resolveLocaleAlternate(
  pathname: string,
): { uk: string | null; en: string | null } {
  if (pathname === "/" || pathname === "/en") {
    return { uk: "/", en: "/en" };
  }

  // EN → UA: handle /en/blog/<slug> via the slug map. Other /en/ paths
  // strip the prefix and assume a UA mirror exists.
  if (pathname.startsWith("/en/blog/")) {
    const enSlug = pathname.slice("/en/blog/".length).replace(/\/$/, "");
    const ukSlug = ukBlogSlugForEn(enSlug);
    return {
      uk: ukSlug ? `/blog/${ukSlug}` : null,
      en: pathname,
    };
  }
  if (pathname.startsWith("/en/")) {
    return { uk: pathname.slice(3), en: pathname };
  }

  // UA → EN: industry pages (only when an EN translation exists).
  const industryMatch = pathname.match(/^\/sites-for\/([^/]+)\/?$/);
  if (industryMatch) {
    const normalized = `/sites-for/${industryMatch[1]}`;
    return {
      uk: normalized,
      en: hasEnIndustry(industryMatch[1]) ? `/en${normalized}` : null,
    };
  }

  // UA → EN: case-study pages (only when EN content exists).
  const caseMatch = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (caseMatch) {
    const normalized = `/portfolio/${caseMatch[1]}`;
    return {
      uk: normalized,
      en: hasEnCase(caseMatch[1]) ? `/en${normalized}` : null,
    };
  }

  // UA → EN: blog post slug (only when an EN translation exists, via the map).
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const normalized = `/blog/${blogMatch[1]}`;
    const enSlug = enBlogSlugForUk(blogMatch[1]);
    return {
      uk: normalized,
      en: enSlug ? `/en/blog/${enSlug}` : null,
    };
  }

  // UA → EN: top-level localized roots.
  const rootMatch = pathname.match(/^(\/[^/]+)\/?$/);
  if (rootMatch) {
    const root = rootMatch[1];
    return {
      uk: root,
      en: EN_LOCALIZED_ROOTS.has(root) ? `/en${root}` : null,
    };
  }

  // Catch-all for any other UA path.
  return { uk: pathname, en: null };
}
