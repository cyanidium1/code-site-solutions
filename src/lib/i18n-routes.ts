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
  "/calculator",
  "/pricing",
  "/about",
  "/process",
  "/contacts",
  "/portfolio",
  "/blog",
]);

/**
 * UA blog slug → EN blog slug mapping. Sprint 2BC ships EN translations
 * of these 3 articles. Each EN post lives at a natural English URL,
 * not a transliteration of the UA original. The map is small and
 * static — when a new article ships in EN, add its row here.
 *
 * Sanity also stores `slugEn` per blogPost doc, but routing the
 * locale switcher between /blog/<ua-slug> ↔ /en/blog/<en-slug>
 * doesn't have access to the Sanity doc — this hardcoded map keeps
 * the switcher O(1) and serverless.
 */
export const EN_BLOG_SLUG_MAP: Record<string, string> = {
  "skilky-koshtuye-sayt-2026": "website-cost-2026-breakdown",
  "tilda-7200-za-3-roky": "tilda-7200-over-3-years",
  "dohovir-z-veb-studieyu-7-punktiv": "web-studio-contract-7-items",
};

/** Inverse of EN_BLOG_SLUG_MAP — EN slug → UA slug. */
export const UA_BLOG_SLUG_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(EN_BLOG_SLUG_MAP).map(([uk, en]) => [en, uk]),
);

export function uaBlogToEnSlug(uaSlug: string): string | undefined {
  return EN_BLOG_SLUG_MAP[uaSlug];
}

export function enBlogToUaSlug(enSlug: string): string | undefined {
  return UA_BLOG_SLUG_MAP[enSlug];
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

  // EN → UA: strip the /en prefix to get the UA path. We assume the UA
  // mirror exists since /en/ routes are only published when there's a
  // matching UA route — but if a future /en-only path appears, the
  // caller can null-check.
  if (pathname.startsWith("/en/")) {
    // EN blog post → look up UA slug from the inverse map.
    const enBlogMatch = pathname.match(/^\/en\/blog\/([^/]+)\/?$/);
    if (enBlogMatch) {
      const uaSlug = enBlogToUaSlug(enBlogMatch[1]);
      return {
        uk: uaSlug ? `/blog/${uaSlug}` : null,
        en: pathname,
      };
    }
    return { uk: pathname.slice(3), en: pathname };
  }

  // UA → EN: blog post pages (only when an EN translation exists).
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const enSlug = uaBlogToEnSlug(blogMatch[1]);
    return {
      uk: `/blog/${blogMatch[1]}`,
      en: enSlug ? `/en/blog/${enSlug}` : null,
    };
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

  // UA → EN: top-level localized roots (vs-* compare pages, /calculator).
  const rootMatch = pathname.match(/^(\/[^/]+)\/?$/);
  if (rootMatch) {
    const root = rootMatch[1];
    return {
      uk: root,
      en: EN_LOCALIZED_ROOTS.has(root) ? `/en${root}` : null,
    };
  }

  // Catch-all for any other UA path (e.g. /blog, /blog/<slug>): UA side
  // is the current path; EN side has no counterpart yet (Sprint 5
  // ships /en/blog).
  return { uk: pathname, en: null };
}
