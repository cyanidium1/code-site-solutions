import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/constants/site";
import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  BLOG_POSTS_LIST_QUERY,
  CASE_STUDIES_QUERY,
  INDUSTRY_PAGES_QUERY,
} from "@/lib/server/sanity-queries";
import type {
  BlogPostListItem,
  CaseStudyRef,
  IndustryPageRef,
} from "@/types/sanity";
import { EN_LOCALIZED_ROOTS } from "@/constants/i18n-routes";
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const [industryPages, caseStudies, blogPosts, registry] = await Promise.all([
    sanityFetch<IndustryPageRef[]>({
      query: INDUSTRY_PAGES_QUERY,
      revalidate: 3600,
    }).catch(() => [] as IndustryPageRef[]),
    sanityFetch<CaseStudyRef[]>({
      query: CASE_STUDIES_QUERY,
      revalidate: 3600,
    }).catch(() => [] as CaseStudyRef[]),
    sanityFetch<BlogPostListItem[]>({
      query: BLOG_POSTS_LIST_QUERY,
      revalidate: 3600,
    }).catch(() => [] as BlogPostListItem[]),
    getEnRegistrySafe(),
  ]);

  // Routes that also have an /en twin — single source is
  // `EN_LOCALIZED_ROOTS` in `@/constants/i18n-routes` (filesystem-rooted
  // intersection of UA + EN top-level page.tsx files). The locale
  // switcher uses the same set. `/` is added here because the homepage
  // pair (UA at `/`, EN at `/en`) isn't kept in EN_LOCALIZED_ROOTS — the
  // resolver special-cases it.
  const EN_LOCALIZED_PATHS = new Set<string>(["/", ...EN_LOCALIZED_ROOTS]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    ({ path, changeFrequency, priority }) => {
      const url = `${SITE_ORIGIN}${path === "/" ? "" : path}`;
      if (!EN_LOCALIZED_PATHS.has(path)) {
        return [{ url, lastModified, changeFrequency, priority }];
      }
      const enUrl = `${SITE_ORIGIN}/en${path === "/" ? "" : path}`;
      const languages = {
        uk: url,
        en: enUrl,
        "x-default": url,
      };
      return [
        {
          url,
          lastModified,
          changeFrequency,
          priority,
          alternates: { languages },
        },
        {
          url: enUrl,
          lastModified,
          changeFrequency,
          priority,
          alternates: { languages },
        },
      ];
    },
  );

  // EN-available industry slugs come from the registry — same source
  // shared with the locale switcher + header services dropdown + footer.
  const industryEntries: MetadataRoute.Sitemap = industryPages.flatMap((p) => {
    const ukUrl = `${SITE_ORIGIN}/sites-for/${p.slug}`;
    const hasEn = registry.industries.has(p.slug);
    const ukEntry: MetadataRoute.Sitemap[number] = {
      url: ukUrl,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
    if (hasEn) {
      const enUrl = `${SITE_ORIGIN}/en/sites-for/${p.slug}`;
      const languages = {
        uk: ukUrl,
        en: enUrl,
        "x-default": ukUrl,
      };
      ukEntry.alternates = { languages };
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: enUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages },
      };
      return [ukEntry, enEntry];
    }
    return [ukEntry];
  });

  // Sanity-driven case studies — emit UA always, EN only when title.en is set.
  const caseEntries: MetadataRoute.Sitemap = caseStudies.flatMap((c) => {
    const ukUrl = `${SITE_ORIGIN}/portfolio/${c.slug}`;
    const hasEn = Boolean(c.title?.en);
    const ukEntry: MetadataRoute.Sitemap[number] = {
      url: ukUrl,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
    if (hasEn) {
      const enUrl = `${SITE_ORIGIN}/en/portfolio/${c.slug}`;
      const languages = {
        uk: ukUrl,
        en: enUrl,
        "x-default": ukUrl,
      };
      ukEntry.alternates = { languages };
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: enUrl,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages },
      };
      return [ukEntry, enEntry];
    }
    return [ukEntry];
  });

  // Blog posts — emit UA always; emit EN when the post has slugEn + titleEn
  // (mirrors the EN listing/post-render guards).
  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((p) => {
    const ukUrl = `${SITE_ORIGIN}/blog/${p.slug}`;
    const modified = p.publishedAt ? new Date(p.publishedAt) : lastModified;
    const ukEntry: MetadataRoute.Sitemap[number] = {
      url: ukUrl,
      lastModified: modified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
    const hasEn = Boolean(p.slugEn && p.titleEn);
    if (hasEn) {
      const enUrl = `${SITE_ORIGIN}/en/blog/${p.slugEn}`;
      const languages = {
        uk: ukUrl,
        en: enUrl,
        "x-default": ukUrl,
      };
      ukEntry.alternates = { languages };
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: enUrl,
        lastModified: modified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages },
      };
      return [ukEntry, enEntry];
    }
    return [ukEntry];
  });

  return [...staticEntries, ...industryEntries, ...caseEntries, ...blogEntries];
}
