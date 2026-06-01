import type { EnRegistry } from "@/lib/shared/i18n-registry-types";

/**
 * Filesystem-rooted truth: which single-segment top-level routes have
 * BOTH a UA `page.tsx` (`app/(uk)/<seg>/page.tsx`) AND an EN twin
 * (`app/(en)/en/<seg>/page.tsx`). The locale switcher uses this to map
 * `/<seg>` ↔ `/en/<seg>` when toggling languages.
 *
 * This stays a hardcoded constant — Sanity isn't the source of truth
 * for code-based routes. When you add or remove a top-level page, update
 * this set in the same commit. `Frontend/scripts/check-i18n-alignment.ts`
 * (if it exists) cross-checks against the filesystem at CI time.
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
 * Prefix a UA path with `/en` when the user is on the EN locale.
 *
 * Used by the header / mobile drawer to keep all top-level nav links on
 * the active locale. Pass the bare UA path (e.g. `/about`) and the
 * caller's `isEn` flag; you get `/en/about` on EN, `/about` on UA.
 *
 * `/` → `/en` (the EN homepage lives at `/en`, not `/en/`).
 */
export function localizePath(uaPath: string, isEn: boolean): string {
  if (!isEn) return uaPath;
  if (uaPath === "/") return "/en";
  return `/en${uaPath}`;
}

/* ────────────── Sanity-rooted resolvers ──────────────
 *
 * All helpers below take an explicit `registry: EnRegistry`. The
 * registry is fetched server-side once per layout render and exposed
 * to client components via `I18nRegistryContext` (see
 * `components/layout/i18n-registry-provider`). Server callers can also
 * `await getEnRegistrySafe()` directly.
 *
 * Why pass it in instead of importing constants: the data lives in
 * Sanity, not here. Reading from a registry means new translations show
 * up within the registry's revalidate window (default 5 min) without a
 * deploy, instead of staying dark until someone updates a hardcoded set
 * and ships a release.
 */

export function hasEnIndustry(slug: string, registry: EnRegistry): boolean {
  return registry.industries.has(slug);
}

export function hasEnCase(slug: string, registry: EnRegistry): boolean {
  return registry.cases.has(slug);
}

export function uaBlogToEnSlug(uaSlug: string, registry: EnRegistry): string | undefined {
  return registry.blogUaToEn.get(uaSlug);
}

export function enBlogToUaSlug(enSlug: string, registry: EnRegistry): string | undefined {
  return registry.blogEnToUa.get(enSlug);
}

/**
 * Resolve a UA service-link href (`/sites-for/<slug>`) to its locale-
 * appropriate target. On UA we return the path as-is. On EN we return
 * `/en/sites-for/<slug>` only when an EN industry page exists for the
 * slug; otherwise we fall back to the EN homepage's Solutions anchor
 * so the user lands somewhere meaningful instead of a 404.
 *
 * Shared by the desktop header dropdown and the mobile drawer so both
 * apply the same fallback rule.
 */
export function resolveServiceHref(
  uaHref: string,
  isEn: boolean,
  registry: EnRegistry,
): string {
  if (!isEn) return uaHref;
  const slug = uaHref.replace(/^\/sites-for\//, "");
  return hasEnIndustry(slug, registry) ? `/en/sites-for/${slug}` : "/en#solutions";
}

/**
 * Map current pathname to its UA / EN counterpart so the locale switcher
 * keeps page context.
 *
 * Returns `null` for a locale when no counterpart exists for the current
 * pathname — the switcher renders that locale's button in a disabled
 * state (see LocaleSwitcher) instead of silently bouncing
 * to the homepage. Always returns a non-null value for the locale the
 * user is currently on (the "current" side is just the pathname itself).
 */
export function resolveLocaleAlternate(
  pathname: string,
  registry: EnRegistry,
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
      const uaSlug = enBlogToUaSlug(enBlogMatch[1], registry);
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
    const enSlug = uaBlogToEnSlug(blogMatch[1], registry);
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
      en: hasEnIndustry(industryMatch[1], registry) ? `/en${normalized}` : null,
    };
  }

  // UA → EN: case-study pages (only when EN content exists).
  const caseMatch = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (caseMatch) {
    const normalized = `/portfolio/${caseMatch[1]}`;
    return {
      uk: normalized,
      en: hasEnCase(caseMatch[1], registry) ? `/en${normalized}` : null,
    };
  }

  // UA → EN: top-level localized roots (vs-* compare pages, /calculator,
  // /about, /portfolio, /blog, etc. — see `EN_LOCALIZED_ROOTS`).
  const rootMatch = pathname.match(/^(\/[^/]+)\/?$/);
  if (rootMatch) {
    const root = rootMatch[1];
    return {
      uk: root,
      en: EN_LOCALIZED_ROOTS.has(root) ? `/en${root}` : null,
    };
  }

  // Catch-all for multi-segment UA-only paths (e.g. `/stories/<slug>`,
  // `/legal/<sub>`): UA side is the current path; EN has no counterpart.
  return { uk: pathname, en: null };
}
