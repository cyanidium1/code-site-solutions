import type { ContentRegistry } from "@/lib/shared/i18n-registry-types";
import { normalizePathname } from "@/lib/shared/normalize-pathname";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CONFIG,
  toCanonicalPath,
  type Locale,
  type SecondaryLocale,
} from "./locales";

/**
 * Filesystem-rooted truth: which single-segment top-level routes have BOTH a
 * default-locale `page.tsx` (`app/(uk)/<seg>/page.tsx`) AND a localized twin
 * (e.g. `app/(en)/en/<seg>/page.tsx`), per secondary locale. The locale
 * switcher uses this to map `/<seg>` ↔ `/<locale>/<seg>` when toggling.
 *
 * This stays a hardcoded constant — Sanity isn't the source of truth
 * for code-based routes. When you add or remove a top-level page, update
 * this set in the same commit. `Frontend/scripts/check-i18n-alignment.ts`
 * (if it exists) cross-checks against the filesystem at CI time.
 */
export const LOCALIZED_ROOTS: Record<SecondaryLocale, ReadonlySet<string>> = {
  en: new Set([
    "/vs-wordpress",
    "/vs-constructors",
    "/vs-freelancers",
    "/landing",
    "/calculator",
    "/pricing",
    "/about",
    "/process",
    "/contacts",
    "/portfolio",
    "/blog",
    "/cookies",
  ]),
  // RU phase-1 surface: homepage (implicit) + blog + contacts. Grows as
  // content/ru pages ship (about, process, pricing, calculator, vs-*).
  ru: new Set(["/blog", "/contacts", "/landing"]),
};

/**
 * Prefix a default-locale path for the target locale.
 *
 * Used by the header / mobile drawer to keep all top-level nav links on
 * the active locale. Pass the bare UA path (e.g. `/about`) and the target
 * locale; you get `/en/about` on EN, `/about` on UA.
 *
 * `/` → the locale's bare prefix (the EN homepage lives at `/en`, not `/en/`).
 */
export function localizePath(uaPath: string, locale: Locale): string {
  const prefix = LOCALE_CONFIG[locale].urlPrefix;
  if (!prefix) return uaPath;
  return uaPath === "/" ? prefix : `${prefix}${uaPath}`;
}

/* ────────────── Sanity-rooted resolvers ──────────────
 *
 * All helpers below take an explicit `registry: ContentRegistry`. The
 * registry is fetched server-side once per layout render and exposed
 * to client components via `I18nRegistryContext` (see
 * `components/layout/i18n-registry-provider`). Server callers can also
 * `await getContentRegistrySafe()` directly.
 *
 * Why pass it in instead of importing constants: the data lives in
 * Sanity, not here. Reading from a registry means new translations show
 * up within the registry's revalidate window (default 5 min) without a
 * deploy, instead of staying dark until someone updates a hardcoded set
 * and ships a release.
 */

export function hasLocaleIndustry(
  slug: string,
  locale: SecondaryLocale,
  registry: ContentRegistry,
): boolean {
  return registry.get(locale)?.industries.has(slug) ?? false;
}

export function hasLocaleCase(
  slug: string,
  locale: SecondaryLocale,
  registry: ContentRegistry,
): boolean {
  return registry.get(locale)?.cases.has(slug) ?? false;
}

export function blogSlugFromUa(
  uaSlug: string,
  locale: SecondaryLocale,
  registry: ContentRegistry,
): string | undefined {
  return registry.get(locale)?.blogFromUa.get(uaSlug);
}

export function blogSlugToUa(
  localizedSlug: string,
  locale: SecondaryLocale,
  registry: ContentRegistry,
): string | undefined {
  return registry.get(locale)?.blogToUa.get(localizedSlug);
}

/**
 * Resolve a UA service-link href (`/sites-for/<slug>`) to its locale-
 * appropriate target. On the default locale we return the path as-is. On a
 * secondary locale we return the prefixed path only when a localized
 * industry page exists for the slug; otherwise we fall back to that
 * locale's homepage Solutions anchor so the user lands somewhere
 * meaningful instead of a 404.
 *
 * Shared by the desktop header dropdown and the mobile drawer so both
 * apply the same fallback rule.
 */
export function resolveServiceHref(
  uaHref: string,
  locale: Locale,
  registry: ContentRegistry,
): string {
  if (locale === DEFAULT_LOCALE) return uaHref;
  const slug = uaHref.replace(/^\/sites-for\//, "");
  return hasLocaleIndustry(slug, locale, registry)
    ? localizePath(uaHref, locale)
    : `${LOCALE_CONFIG[locale].urlPrefix}#solutions`;
}

/**
 * Resolve a top-level UA href (`/about`, `/pricing`, `/vs-wordpress`, …) to
 * its locale-appropriate target: the locale-prefixed path when that root is
 * localized for the target locale (per `LOCALIZED_ROOTS`), otherwise the
 * bare UA path. Chrome (header/footer) must use this instead of a raw
 * `localizePath` so locales with a partial surface (RU phase-1) fall back
 * to the UA page instead of linking to a 404.
 */
export function resolveRootHref(uaPath: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return uaPath;
  return LOCALIZED_ROOTS[locale].has(uaPath) ? localizePath(uaPath, locale) : uaPath;
}

/**
 * Map current pathname to its counterpart in every configured locale so the
 * locale switcher keeps page context.
 *
 * Returns `null` for a locale when no counterpart exists for the current
 * pathname — the switcher renders that locale's button in a disabled
 * state (see LocaleSwitcher) instead of silently bouncing
 * to the homepage. Always returns a non-null value for the locale the
 * user is currently on (the "current" side is just the pathname itself).
 */
export function resolveLocaleAlternate(
  rawPathname: string,
  registry: ContentRegistry,
): Record<Locale, string | null> {
  // Next prerenders the root route with usePathname() === "/index"; normalize
  // it (and any nullish value) so the homepage special-case below matches.
  const pathname = normalizePathname(rawPathname);
  const { locale: current, path } = toCanonicalPath(pathname);
  const uaPath = toUaPath(path, current, registry);

  const out = {} as Record<Locale, string | null>;
  for (const target of LOCALES) {
    if (target === current) {
      out[target] = pathname;
      continue;
    }
    if (uaPath === null) {
      out[target] = null;
      continue;
    }
    out[target] =
      target === DEFAULT_LOCALE ? uaPath : fromUaPath(uaPath, target, registry);
  }
  return out;
}

/**
 * Map a stripped secondary-locale path back to its UA-canonical path.
 * Non-blog paths mirror 1:1 (secondary routes are only published when a
 * matching UA route exists); blog slugs translate via the registry.
 */
function toUaPath(path: string, from: Locale, registry: ContentRegistry): string | null {
  if (from === DEFAULT_LOCALE) return path;
  const blog = path.match(/^\/blog\/([^/]+)\/?$/);
  if (blog) {
    const ua = blogSlugToUa(blog[1], from, registry);
    return ua ? `/blog/${ua}` : null;
  }
  return path;
}

/**
 * Map a UA-canonical path to the target secondary locale, or null when the
 * localized counterpart doesn't exist (content not translated / UA-only
 * route like `/stories/<slug>` or `/legal/<sub>`).
 */
function fromUaPath(
  uaPath: string,
  to: SecondaryLocale,
  registry: ContentRegistry,
): string | null {
  if (uaPath === "/") return LOCALE_CONFIG[to].urlPrefix;

  // Blog post pages (only when a translation exists).
  const blog = uaPath.match(/^\/blog\/([^/]+)\/?$/);
  if (blog) {
    const s = blogSlugFromUa(blog[1], to, registry);
    return s ? localizePath(`/blog/${s}`, to) : null;
  }

  // Industry pages (only when a translation exists).
  const ind = uaPath.match(/^\/sites-for\/([^/]+)\/?$/);
  if (ind) return hasLocaleIndustry(ind[1], to, registry) ? localizePath(uaPath, to) : null;

  // Case-study pages (only when localized content exists).
  const cs = uaPath.match(/^\/portfolio\/([^/]+)\/?$/);
  if (cs) return hasLocaleCase(cs[1], to, registry) ? localizePath(uaPath, to) : null;

  // Top-level localized roots (vs-* compare pages, /calculator, /about, …).
  const root = uaPath.match(/^(\/[^/]+)\/?$/);
  if (root) return LOCALIZED_ROOTS[to].has(root[1]) ? localizePath(root[1], to) : null;

  // Multi-segment UA-only paths: no counterpart.
  return null;
}
