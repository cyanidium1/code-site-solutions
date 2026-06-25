import { SITE_ORIGIN } from "@/constants/site";
import { EN_LOCALIZED_ROOTS } from "@/constants/i18n-routes";
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

export type SitemapEntries = { uk: SitemapEntry[]; en: SitemapEntry[] };

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
  enIndustries: ReadonlySet<string>;
  now: Date;
};

/**
 * Pure transform: given already-fetched CMS data, partition all sitemap
 * entries into UA and EN buckets. Each localized entry carries its own
 * `alternates.languages` (uk / en / x-default) so hreflang is preserved in
 * both per-language sitemaps. Mirrors the gating the old `sitemap.ts` used.
 */
export function buildEntries(input: BuildEntriesInput): SitemapEntries {
  const { industryPages, caseStudies, blogPosts, enIndustries, now } = input;
  const uk: SitemapEntry[] = [];
  const en: SitemapEntry[] = [];

  // Routes that also have an /en twin. `/` is added because the homepage
  // pair (UA at `/`, EN at `/en`) isn't kept in EN_LOCALIZED_ROOTS.
  const EN_LOCALIZED_PATHS = new Set<string>(["/", ...EN_LOCALIZED_ROOTS]);

  for (const { path, changeFrequency, priority } of STATIC_ROUTES) {
    const url = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
    if (!EN_LOCALIZED_PATHS.has(path)) {
      uk.push({ url, lastModified: now, changeFrequency, priority });
      continue;
    }
    const enUrl = `${SITE_ORIGIN}/en${path === "/" ? "" : path}`;
    const languages = { uk: url, "en-GB": enUrl, "x-default": url };
    uk.push({
      url,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    });
    en.push({
      url: enUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    });
  }

  for (const p of industryPages) {
    const ukUrl = `${SITE_ORIGIN}/sites-for/${p.slug}`;
    if (!enIndustries.has(p.slug)) {
      uk.push({
        url: ukUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
      continue;
    }
    const enUrl = `${SITE_ORIGIN}/en/sites-for/${p.slug}`;
    const languages = { uk: ukUrl, "en-GB": enUrl, "x-default": ukUrl };
    uk.push({
      url: ukUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages },
    });
    en.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages },
    });
  }

  for (const c of caseStudies) {
    const ukUrl = `${SITE_ORIGIN}/portfolio/${c.slug}`;
    if (!c.title?.en) {
      uk.push({
        url: ukUrl,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
      continue;
    }
    const enUrl = `${SITE_ORIGIN}/en/portfolio/${c.slug}`;
    const languages = { uk: ukUrl, "en-GB": enUrl, "x-default": ukUrl };
    uk.push({
      url: ukUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
    });
    en.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages },
    });
  }

  for (const p of blogPosts) {
    const ukUrl = `${SITE_ORIGIN}/blog/${p.slug}`;
    const modified = p.publishedAt ? new Date(p.publishedAt) : now;
    if (!(p.slugEn && p.titleEn)) {
      uk.push({
        url: ukUrl,
        lastModified: modified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
      continue;
    }
    const enUrl = `${SITE_ORIGIN}/en/blog/${p.slugEn}`;
    const languages = { uk: ukUrl, "en-GB": enUrl, "x-default": ukUrl };
    uk.push({
      url: ukUrl,
      lastModified: modified,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages },
    });
    en.push({
      url: enUrl,
      lastModified: modified,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages },
    });
  }

  return { uk, en };
}
