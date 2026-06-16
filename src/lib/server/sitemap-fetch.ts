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
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";
import { buildEntries, type SitemapEntries } from "./sitemap-data";

/**
 * Fetch the CMS data the sitemap needs (revalidated hourly, each fetch
 * degrades to an empty list on failure) and hand it to the pure
 * `buildEntries` transform.
 */
export async function buildSitemapEntries(): Promise<SitemapEntries> {
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

  return buildEntries({
    industryPages,
    caseStudies,
    blogPosts,
    enIndustries: registry.industries,
    now: new Date(),
  });
}
