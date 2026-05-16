import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  BLOG_POSTS_LIST_QUERY,
  CASE_STUDIES_QUERY,
  INDUSTRY_PAGES_QUERY,
} from "@/lib/sanity/queries";
import type {
  BlogPostListItem,
  CaseStudyRef,
  IndustryPageRef,
} from "@/lib/sanity/types";
import {
  EN_BLOG_SLUG_MAP,
  EN_INDUSTRY_SLUGS,
  enBlogSlugForUk,
} from "@/lib/i18n-routes";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/portfolio", changeFrequency: "weekly", priority: 0.8 },
  { path: "/process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contacts", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/calculator", changeFrequency: "monthly", priority: 0.7 },
  { path: "/vs-wordpress", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vs-constructors", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vs-freelancers", changeFrequency: "monthly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const [industryPages, caseStudies, blogPosts] = await Promise.all([
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
  ]);

  // Routes that are also published under /en. Sprint 2BC promoted the
  // five core pages + blog listing into this set after their /en/*
  // counterparts landed.
  const EN_LOCALIZED_PATHS = new Set<string>([
    "/",
    "/about",
    "/pricing",
    "/portfolio",
    "/process",
    "/contacts",
    "/blog",
    "/calculator",
    "/vs-wordpress",
    "/vs-constructors",
    "/vs-freelancers",
  ]);

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

  // EN_INDUSTRY_SLUGS is imported from @/lib/i18n-routes — single source of
  // truth shared with the locale switcher + header dropdown.
  const industryEntries: MetadataRoute.Sitemap = industryPages.flatMap((p) => {
    const ukUrl = `${SITE_ORIGIN}/sites-for/${p.slug}`;
    const hasEn = EN_INDUSTRY_SLUGS.has(p.slug);
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

  // Blog posts — UA always; EN only when the slug is in EN_BLOG_SLUG_MAP
  // (i.e. bodyEn has been seeded and the post is intended to be visible
  // in EN). Slugs differ between locales — pull the EN slug from the map.
  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((p) => {
    const ukUrl = `${SITE_ORIGIN}/blog/${p.slug}`;
    const enSlug = enBlogSlugForUk(p.slug);
    const ukEntry: MetadataRoute.Sitemap[number] = {
      url: ukUrl,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
    if (enSlug && EN_BLOG_SLUG_MAP[p.slug]) {
      const enUrl = `${SITE_ORIGIN}/en/blog/${enSlug}`;
      const languages = {
        uk: ukUrl,
        en: enUrl,
        "x-default": ukUrl,
      };
      ukEntry.alternates = { languages };
      const enEntry: MetadataRoute.Sitemap[number] = {
        url: enUrl,
        lastModified: ukEntry.lastModified,
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
