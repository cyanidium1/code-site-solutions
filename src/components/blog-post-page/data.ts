/**
 * Data layer for the blog post pages: fetchers, static params, metadata.
 * Split from index.tsx so data-only consumers (opengraph-image routes)
 * don't pull the component tree — and its route-scoped CSS — into their
 * module graph (CSS imports break the OG image context).
 */

import type { Metadata } from "next";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  BLOG_POSTS_LIST_QUERY,
  BLOG_POST_BY_LOCALE_SLUG_QUERY,
  BLOG_POSTS_BY_SLUGS_QUERY,
} from "@/lib/server/sanity-queries";
import type { BlogPostDoc, BlogPostListItem } from "@/types/sanity";
import {
  DEFAULT_LOCALE,
  LOCALE_CONFIG,
  SECONDARY_LOCALES,
  type Locale,
  type SecondaryLocale,
} from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import { buildAlternates } from "@/lib/shared/alternates";
import { pickLocalized } from "@/lib/shared/pick-localized";
import { resolveBlogCover } from "@/lib/shared/blog-cover";
import { sanityCdn } from "@/lib/shared/sanity-cdn";

/** True when the post is fully renderable in `locale` (slug+title+body). */
export function hasBlogLocaleContent(
  post: Pick<BlogPostDoc, "slugs" | "title" | "body">,
  locale: Locale,
): boolean {
  return Boolean(
    post.slugs?.[locale]?.current &&
      pickLocalized(post.title, locale) &&
      pickLocalized(post.body, locale)?.length,
  );
}

export async function generateBlogPostStaticParams(
  locale: Locale,
): Promise<{ slug: string }[]> {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY,
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  return posts
    .map((p) => p.slugs?.[locale]?.current)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
}

export async function fetchBlogPost(
  slug: string,
  locale: Locale,
): Promise<BlogPostDoc | null> {
  return sanityFetch<BlogPostDoc | null>({
    query: BLOG_POST_BY_LOCALE_SLUG_QUERY,
    params: { slug, locale },
    revalidate: 300,
    tags: [`blogPost:${locale}:${slug}`],
  });
}

export async function fetchRelated(
  uaSlugs: string[] | undefined,
  locale: Locale,
): Promise<BlogPostListItem[]> {
  if (!uaSlugs?.length) return [];
  const items = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_BY_SLUGS_QUERY,
    params: { slugs: uaSlugs },
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  // GROQ does not preserve $slugs order — reorder client-side. On secondary
  // locales, drop posts without that locale's slug + title.
  const bySlug = new Map(
    items.map((i) => [i.slugs?.[DEFAULT_LOCALE]?.current ?? "", i] as const),
  );
  return uaSlugs
    .map((s) => bySlug.get(s))
    .filter(
      (i): i is BlogPostListItem =>
        Boolean(i) &&
        Boolean(i?.slugs?.[locale]?.current && pickLocalized(i?.title, locale)),
    );
}

export async function buildBlogPostMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const post = await fetchBlogPost(slug, locale);
  if (!post || !pickLocalized(post.title, locale)) return {};

  const title =
    pickLocalized(post.metaTitle, locale) ?? pickLocalized(post.title, locale) ?? "";
  const description =
    pickLocalized(post.metaDescription, locale) ?? pickLocalized(post.lede, locale) ?? "";
  const uaSlug = post.slugs?.[DEFAULT_LOCALE]?.current ?? slug;
  const uaPath = `/blog/${uaSlug}`;
  const path = localizePath(`/blog/${slug}`, locale);

  // OG image: explicit Sanity ogImage → resolved cover (generic skipped —
  // the opengraph-image route's branded text card is the better fallback).
  const cover = resolveBlogCover(post, locale);
  const ogUrl = post.ogImage?.url
    ? sanityCdn(post.ogImage.url, { w: 1200, q: 70 })
    : !cover.generic
      ? sanityCdn(cover.url, { w: 1200, q: 70 })
      : undefined;

  // hreflang only for locales the post is actually renderable in.
  const available = SECONDARY_LOCALES.filter((l) => hasBlogLocaleContent(post, l));
  const paths = Object.fromEntries(
    available.map((l) => [l, localizePath(`/blog/${post.slugs![l]!.current}`, l)]),
  ) as Partial<Record<SecondaryLocale, string>>;
  // `buildAlternates` always anchors the set on the UA URL, which would
  // emit an hreflang pointing at a 404 for secondary-locale-only posts —
  // those get a bare self-canonical instead.
  const hasUa = hasBlogLocaleContent(post, DEFAULT_LOCALE);

  return {
    title,
    description,
    alternates:
      locale === DEFAULT_LOCALE && available.length === 0
        ? { canonical: uaPath }
        : !hasUa
          ? { canonical: path }
          : buildAlternates({ locale, uaPath, available, paths }),
    openGraph: {
      title,
      description,
      type: "article",
      locale: LOCALE_CONFIG[locale].ogLocale,
      url: path,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogUrl ? [{ url: ogUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
