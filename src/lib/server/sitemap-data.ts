import { SITE_ORIGIN } from "@/constants/site";
import { LOCALIZED_ROOTS, localizePath } from "@/constants/i18n-routes";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CONFIG,
  SECONDARY_LOCALES,
  type Locale,
  type SecondaryLocale,
} from "@/constants/locales";
import type { ContentRegistry } from "@/lib/shared/i18n-registry-types";
import type {
  BlogPostListItem,
  CaseStudyRef,
  IndustryPageRef,
} from "@/types/sanity";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFrequency;
  priority: number;
  alternates?: { languages: Record<string, string> };
};

export type SitemapEntries = Record<Locale, SitemapEntry[]>;

const STATIC_ROUTES: {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contacts", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/calculator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/vs-wordpress", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vs-constructors", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vs-freelancers", changeFrequency: "monthly", priority: 0.8 },
];

export type BuildEntriesInput = {
  industryPages: IndustryPageRef[];
  caseStudies: CaseStudyRef[];
  blogPosts: BlogPostListItem[];
  registry: ContentRegistry;
  now: Date;
};

/** Absolute URL for a default-locale path, localized for `locale`. */
function absUrl(uaPath: string, locale: Locale): string {
  const p = localizePath(uaPath === "/" ? "/" : uaPath, locale);
  return `${SITE_ORIGIN}${p === "/" ? "" : p}`;
}

/**
 * hreflang languages map for an entry: default locale + every secondary
 * locale that has the page (per LOCALE_CONFIG hreflang tags), plus
 * x-default pointing at the default-locale URL.
 */
function languagesFor(
  uaUrl: string,
  localized: Partial<Record<SecondaryLocale, string>>,
): Record<string, string> {
  const languages: Record<string, string> = {
    [LOCALE_CONFIG[DEFAULT_LOCALE].hreflang]: uaUrl,
  };
  for (const l of SECONDARY_LOCALES) {
    const u = localized[l];
    if (u) languages[LOCALE_CONFIG[l].hreflang] = u;
  }
  languages["x-default"] = uaUrl;
  return languages;
}

/**
 * Pure transform: given already-fetched CMS data + the content registry,
 * partition all sitemap entries into per-locale buckets. Each localized
 * entry carries its own `alternates.languages` (hreflang per available
 * locale + x-default) so hreflang is preserved in every per-language
 * sitemap. Availability gating mirrors the registry (same predicates the
 * locale switcher and the actual localized pages use).
 */
export function buildEntries(input: BuildEntriesInput): SitemapEntries {
  const { industryPages, caseStudies, blogPosts, registry, now } = input;
  const out = Object.fromEntries(
    LOCALES.map((l) => [l, [] as SitemapEntry[]]),
  ) as SitemapEntries;

  /**
   * Push one logical page into every bucket it exists in. `localizedUrls`
   * lists the secondary locales that have the page; entries in all locales
   * share one languages map so hreflang stays symmetric.
   */
  const push = (
    uaUrl: string,
    localizedUrls: Partial<Record<SecondaryLocale, string>>,
    meta: { lastModified: Date; changeFrequency: ChangeFrequency; priority: number },
  ) => {
    const hasLocalized = Object.values(localizedUrls).some(Boolean);
    if (!hasLocalized) {
      out[DEFAULT_LOCALE].push({ url: uaUrl, ...meta });
      return;
    }
    const languages = languagesFor(uaUrl, localizedUrls);
    out[DEFAULT_LOCALE].push({ url: uaUrl, ...meta, alternates: { languages } });
    for (const l of SECONDARY_LOCALES) {
      const u = localizedUrls[l];
      if (u) out[l].push({ url: u, ...meta, alternates: { languages } });
    }
  };

  // Static code-based routes. `/` is localized everywhere by definition
  // (each locale has a homepage); other roots gate on LOCALIZED_ROOTS.
  for (const { path, changeFrequency, priority } of STATIC_ROUTES) {
    const localized: Partial<Record<SecondaryLocale, string>> = {};
    for (const l of SECONDARY_LOCALES) {
      if (path === "/" || LOCALIZED_ROOTS[l].has(path)) {
        localized[l] = absUrl(path, l);
      }
    }
    push(absUrl(path, DEFAULT_LOCALE), localized, {
      lastModified: now,
      changeFrequency,
      priority,
    });
  }

  for (const p of industryPages) {
    const uaPath = `/sites-for/${p.slug}`;
    const localized: Partial<Record<SecondaryLocale, string>> = {};
    for (const l of SECONDARY_LOCALES) {
      if (registry.get(l)?.industries.has(p.slug)) localized[l] = absUrl(uaPath, l);
    }
    push(absUrl(uaPath, DEFAULT_LOCALE), localized, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const c of caseStudies) {
    const uaPath = `/portfolio/${c.slug}`;
    const localized: Partial<Record<SecondaryLocale, string>> = {};
    for (const l of SECONDARY_LOCALES) {
      if (registry.get(l)?.cases.has(c.slug)) localized[l] = absUrl(uaPath, l);
    }
    push(absUrl(uaPath, DEFAULT_LOCALE), localized, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const p of blogPosts) {
    const modified = p.publishedAt ? new Date(p.publishedAt) : now;
    const localized: Partial<Record<SecondaryLocale, string>> = {};
    for (const l of SECONDARY_LOCALES) {
      const slug = registry.get(l)?.blogFromUa.get(p.slug);
      if (slug) localized[l] = absUrl(`/blog/${slug}`, l);
    }
    push(absUrl(`/blog/${p.slug}`, DEFAULT_LOCALE), localized, {
      lastModified: modified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return out;
}
