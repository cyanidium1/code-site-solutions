import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { FAQ } from "@/components/blocks/final";
import "@/components/blocks/blog/blog.css";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import {
  BLOG_POSTS_LIST_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POSTS_BY_SLUGS_QUERY,
} from "@/lib/server/sanity-queries";
import type {
  BlogPostDoc,
  BlogPostListItem,
} from "@/types/sanity";
import { BlogPortableText } from "@/lib/shared/blog-portable";
import { resolveBlogCover } from "@/lib/shared/blog-cover";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import { sanityCdn } from "@/lib/shared/sanity-cdn";
import { SanityImg } from "@/lib/shared/sanity-image";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
  definedTermNodes,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { glossaryTerms } from "@/constants/glossary";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpLinkClass, hpSectionClass, hpSectionHeadClass } from "@/components/homepage/shared";

/* ─── Static params + metadata ──────────────────────────────────────────── */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY,
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  return posts.map((p) => ({ slug: p.slug }));
}

async function fetchPost(slug: string): Promise<BlogPostDoc | null> {
  return sanityFetch<BlogPostDoc | null>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 300,
    tags: [`blogPost:${slug}`],
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};

  const title = post.metaTitle ?? post.title ?? "";
  const description = post.metaDescription ?? post.lede ?? "";
  const path = `/blog/${slug}`;
  // OG image: explicit Sanity ogImage → resolved cover (CMS asset or legacy
  // path; relative paths resolve against the site origin). The generic
  // placeholder is skipped — the opengraph-image route's branded text card
  // is a better OG than a stock banner.
  const cover = resolveBlogCover(post, "uk");
  const ogUrl = post.ogImage?.url
    ? sanityCdn(post.ogImage.url, { w: 1200, q: 70 })
    : !cover.generic
      ? sanityCdn(cover.url, { w: 1200, q: 70 })
      : undefined;

  // Mirror the EN post's hreflang only when an EN translation exists
  // (slugEn + titleEn) — matches the EN listing/render guards and sitemap.
  const hasEn = Boolean(post.slugEn && post.titleEn);
  const languages = hasEn
    ? {
        uk: path,
        "en-GB": `/en/blog/${post.slugEn}`,
        "x-default": path,
      }
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "uk_UA",
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

/* ─── Date helper ─────────────────────────────────────────────────────────── */

const UA_MONTHS_SHORT = [
  "січ", "лют", "бер", "кві", "тра", "чер",
  "лип", "сер", "вер", "жов", "лис", "гру",
];

function formatUkDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${d.getDate()} ${UA_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─── JSON-LD ─────────────────────────────────────────────────────────────── */

/** Glossary terms attached to every blog post — keep small to avoid bloat. */
const BLOG_GLOSSARY_KEYS = [
  "seo",
  "coreWebVitals",
  "nextjs",
  "isr",
] as const;

function buildBlogJsonLd(post: BlogPostDoc) {
  const path = `/blog/${post.slug}`;
  const url = pageUrl(path);
  // JSON-LD wants an absolute URL — a path-based cover needs SITE_ORIGIN
  // prepended; a Sanity CDN URL is already absolute. Generic placeholder
  // is skipped (not real article imagery).
  const cover = resolveBlogCover(post, "uk");
  const coverAbs = !cover.generic
    ? cover.url.startsWith("http")
      ? cover.url
      : `${SITE_ORIGIN}${cover.url}`
    : undefined;
  const imageUrl = post.ogImage?.url
    ? sanityCdn(post.ogImage.url, { w: 1200, q: 70 })
    : coverAbs
      ? sanityCdn(coverAbs, { w: 1200, q: 70 })
      : undefined;
  const title = post.title ?? post.slug;

  return buildJsonLd([
    webPageNode({
      path,
      locale: "uk",
      title,
      description: post.metaDescription ?? post.lede,
      type: "ItemPage",
    }),
    breadcrumbNode([
      { name: "Головна", path: "/" },
      { name: "Блог", path: "/blog" },
      { name: title, path },
    ]),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      url,
      mainEntityOfPage: url,
      headline: title,
      description: post.metaDescription ?? post.lede,
      inLanguage: "uk-UA",
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      image: imageUrl ? [imageUrl] : undefined,
      author: post.author?.name
        ? {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.role,
            url: `${SITE_ORIGIN}/about`,
          }
        : undefined,
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Code-Site.Art",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/logo-512.png`,
        },
      },
      articleSection: post.category,
      keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    },
    post.faq?.length
      ? {
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.question ?? "",
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer ?? "",
            },
          })),
        }
      : null,
    definedTermNodes(glossaryTerms(BLOG_GLOSSARY_KEYS, "uk"), "uk"),
  ]);
}

/* ─── Related-articles resolver ──────────────────────────────────────────── */

async function fetchRelated(
  slugs: string[] | undefined,
): Promise<BlogPostListItem[]> {
  if (!slugs?.length) return [];
  const items = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_BY_SLUGS_QUERY,
    params: { slugs },
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  // GROQ does not preserve $slugs order — reorder client-side.
  const bySlug = new Map(items.map((i) => [i.slug, i] as const));
  return slugs
    .map((s) => bySlug.get(s))
    .filter((i): i is BlogPostListItem => Boolean(i));
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const jsonLd = buildBlogJsonLd(post);
  const dateStr = formatUkDate(post.publishedAt);
  const updatedStr =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? formatUkDate(post.updatedAt)
      : undefined;

  const related = await fetchRelated(post.relatedPostSlugs);
  const heroCover = resolveBlogCover(post, "uk");

  // FAQ → existing FAQ component expects { q, a: RichText }
  const faqItems = (post.faq ?? []).map((item) => ({
    q: item.question ?? "",
    a: [item.answer ?? ""],
  }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <main>
        {/* Hero cover — rendered above the H1. Full standard width to
            match /sites-for/medicine and other site pages. Skipped when
            the post has no cover of its own (generic adds nothing here). */}
        {!heroCover.generic ? (
          <section className="bg-bg px-5 pt-6 lg:px-12 lg:pt-10">
            <div className="max-w-container mx-auto">
              <SanityImg
                image={heroCover.image}
                alt={heroCover.alt}
                sizes={IMG_SIZES.container}
                priority
                className="w-full h-auto rounded-2xl border border-line block"
              />
            </div>
          </section>
        ) : null}

        <PageHero
          breadcrumbs={[
            { label: "Головна", href: "/" },
            { label: "Блог", href: "/blog" },
            { label: post.title ?? post.slug },
          ]}
          eyebrow={post.eyebrow ?? "/ БЛОГ"}
          headline={post.title ?? ""}
          sub={post.lede ?? ""}
        />

        {/* Meta strip — author + date + updated */}
        <section className="bg-bg px-5 md:px-12">
          <div className="max-w-container mx-auto py-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11.5px] tracking-[0.1em] uppercase text-ink-3 border-b border-line">
            {post.author?.name ? (
              <span className="flex items-center gap-2.5">
                {post.author.photoUrl ? (
                  <AppImage
                    src={post.author.photoUrl}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    sizes="28px"
                    className="rounded-full border border-line block"
                  />
                ) : null}
                <span className="text-ink-dim">{post.author.name}</span>
                {post.author.role ? (
                  <span className="opacity-60">· {post.author.role}</span>
                ) : null}
              </span>
            ) : null}
            {dateStr ? <span>{dateStr}</span> : null}
            {updatedStr ? <span>Оновлено · {updatedStr}</span> : null}
            {post.readingTimeMinutes ? (
              <span>{post.readingTimeMinutes} хв читання</span>
            ) : null}
          </div>
        </section>

        {/* Body — outer container is full standard width (1240px) so the
            custom blocks (tldrBox, ctaCallout, blogTable, blogImage) can
            break out to match the rest of the site. Prose elements are
            individually capped to a 720px reading measure via the
            .blog-prose CSS rules. */}
        <section className="relative bg-bg pt-10 px-5 pb-14 md:pt-16 md:px-12 md:pb-20">
          <div className="blog-post-bg absolute inset-0 z-0 pointer-events-none" />
          <article className="blog-prose relative z-[1] max-w-container mx-auto">
            <BlogPortableText value={post.body} />
          </article>
        </section>

        {/* FAQ */}
        {faqItems.length > 0 ? (
          <FAQ heading={post.faqHeading ?? undefined} items={faqItems} />
        ) : null}

        {/* Related articles */}
        {related.length > 0 ? (
          <section className={hpSectionClass}>
            <div className={hpInnerClass}>
              <div className={hpSectionHeadClass}>
                <div className={hpEyebrowClass}>
                  <span className={hpEyebrowDotClass} />
                  <span>/ ЩЕ ПОЧИТАТИ</span>
                </div>
                <h2 className={hpH2Class}>
                  Схожі <em>статті</em>
                </h2>
              </div>
              <div className={casesGridClass}>
                {related.slice(0, 2).map((p) => {
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} хв читання`
                    : undefined;
                  const date = formatUkDate(p.publishedAt);
                  const metrics = [reading].filter(
                    (m): m is string => Boolean(m),
                  );
                  const cover = resolveBlogCover(p, "uk");
                  return (
                    <RelatedCard
                      key={p._id}
                      category={p.category?.name?.uk ?? undefined}
                      metrics={metrics}
                      title={p.title ?? p.slug}
                      eyebrow={date}
                      sub={p.lede}
                      coverImage={{ src: cover.image, alt: cover.alt }}
                      coverAspect="wide"
                      href={`/blog/${p.slug}`}
                    />
                  );
                })}
              </div>
              <Link href="/blog" className={hpLinkClass}>
                Усі статті →
              </Link>
            </div>
          </section>
        ) : null}
      </main>
      <HpFooter />
    </>
  );
}

export const revalidate = 300;
