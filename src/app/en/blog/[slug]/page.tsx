import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard } from "@/components/blocks/related-card";
import { FAQ } from "@/components/blocks/final";
import "@/components/blocks/blog/blog.css";

import { sanityFetch } from "@/lib/sanity/fetch";
import {
  BLOG_POSTS_LIST_QUERY_EN,
  BLOG_POST_BY_SLUG_QUERY_EN,
  BLOG_POSTS_BY_SLUGS_QUERY_EN,
} from "@/lib/sanity/queries";
import type {
  BlogPostDoc,
  BlogPostListItem,
} from "@/lib/sanity/types";
import { BlogPortableText } from "@/lib/sanity/portable";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";

/* ─── Static params + metadata ──────────────────────────────────────────── */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY_EN,
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  return posts.map((p) => ({ slug: p.slug }));
}

async function fetchPost(slug: string): Promise<BlogPostDoc | null> {
  return sanityFetch<BlogPostDoc | null>({
    query: BLOG_POST_BY_SLUG_QUERY_EN,
    params: { slug },
    revalidate: 300,
    tags: [`blogPost:en:${slug}`],
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
  const path = `/en/blog/${slug}`;
  const ukPath = post.alternateSlug ? `/blog/${post.alternateSlug}` : undefined;
  const ogUrl = post.ogImage?.url ?? post.coverImage?.src;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: path,
        ...(ukPath ? { uk: ukPath, "x-default": ukPath } : {}),
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_US",
      alternateLocale: ["uk_UA"],
      url: path,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogUrl ? [{ url: ogUrl }] : undefined,
    },
  };
}

/* ─── Date helper ─────────────────────────────────────────────────────────── */

const EN_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatEnDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${EN_MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ─── JSON-LD ─────────────────────────────────────────────────────────────── */

function buildJsonLd(post: BlogPostDoc): Record<string, unknown> {
  const url = pageUrl(`/en/blog/${post.slug}`);
  const coverAbs = post.coverImage?.src
    ? post.coverImage.src.startsWith("http")
      ? post.coverImage.src
      : `${SITE_ORIGIN}${post.coverImage.src}`
    : undefined;
  const imageUrl = post.ogImage?.url ?? coverAbs ?? undefined;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_ORIGIN}/en`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${SITE_ORIGIN}/en/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title ?? post.slug,
          item: url,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      url,
      mainEntityOfPage: url,
      headline: post.title ?? post.slug,
      description: post.metaDescription ?? post.lede,
      inLanguage: "en",
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      image: imageUrl ? [imageUrl] : undefined,
      author: post.author?.name
        ? {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.role,
            url: `${SITE_ORIGIN}/en/about`,
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
  ];

  if (post.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question ?? "",
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer ?? "",
        },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/* ─── Related-articles resolver ──────────────────────────────────────────── */

async function fetchRelated(
  slugs: string[] | undefined,
): Promise<BlogPostListItem[]> {
  if (!slugs?.length) return [];
  const items = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_BY_SLUGS_QUERY_EN,
    // relatedPostSlugs is UA — the EN query filters by `slug.current in $slugs`
    // (UA slug as source of truth) and returns rows with slugEn populated.
    params: { slugs },
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  return items;
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function BlogPostPageEn({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const jsonLd = buildJsonLd(post);
  const dateStr = formatEnDate(post.publishedAt);
  const updatedStr =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? formatEnDate(post.updatedAt)
      : undefined;

  const related = await fetchRelated(post.relatedPostSlugs);

  const faqItems = (post.faq ?? []).map((item) => ({
    q: item.question ?? "",
    a: [item.answer ?? ""],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />
      <main>
        {post.coverImage?.src ? (
          <section className="bg-bg px-12 pt-10 max-[800px]:px-5 max-[800px]:pt-6">
            <div className="max-w-container mx-auto">
              <img
                src={post.coverImage.src}
                alt={post.coverImage.alt ?? post.title ?? ""}
                className="w-full h-auto rounded-2xl border border-line block"
              />
            </div>
          </section>
        ) : null}

        <PageHero
          breadcrumbs={[
            { label: "Home", href: "/en" },
            { label: "Blog", href: "/en/blog" },
            { label: post.title ?? post.slug },
          ]}
          eyebrow={post.eyebrow ?? "/ BLOG"}
          headline={post.title ?? ""}
          sub={post.lede ?? ""}
        />

        <section className="bg-bg px-12 max-[700px]:px-5">
          <div className="max-w-container mx-auto py-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11.5px] tracking-[0.1em] uppercase text-[var(--ink-3)] border-b border-line">
            {post.author?.name ? (
              <span className="flex items-center gap-2.5">
                {post.author.photoUrl ? (
                  <img
                    src={post.author.photoUrl}
                    alt={post.author.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-line block"
                  />
                ) : null}
                <span className="text-[var(--ink-2)]">{post.author.name}</span>
                {post.author.role ? (
                  <span className="opacity-60">· {post.author.role}</span>
                ) : null}
              </span>
            ) : null}
            {dateStr ? <span>{dateStr}</span> : null}
            {updatedStr ? <span>Updated · {updatedStr}</span> : null}
            {post.readingTimeMinutes ? (
              <span>{post.readingTimeMinutes} min read</span>
            ) : null}
          </div>
        </section>

        <section className="relative bg-bg pt-16 px-12 pb-20 max-[700px]:pt-10 max-[700px]:px-5 max-[700px]:pb-14">
          <div className="blog-post-bg absolute inset-0 z-0 pointer-events-none" />
          <article className="blog-prose relative z-[1] max-w-container mx-auto">
            <BlogPortableText value={post.body} />
          </article>
        </section>

        {faqItems.length > 0 ? <FAQ items={faqItems} /> : null}

        {related.length > 0 ? (
          <section className="hp-section">
            <div className="hp-inner">
              <div className="hp-section-head">
                <div className="hp-eyebrow">
                  <span className="hp-eyebrow-dot" />
                  <span>/ MORE TO READ</span>
                </div>
                <h2 className="hp-h2">
                  Related <em>articles</em>
                </h2>
              </div>
              <div className="hp-cases-grid">
                {related.slice(0, 2).map((p) => {
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} min read`
                    : undefined;
                  const date = formatEnDate(p.publishedAt);
                  const metrics = [reading].filter(
                    (m): m is string => Boolean(m),
                  );
                  const cover = p.coverImage?.src
                    ? {
                        src: p.coverImage.src,
                        alt: p.coverImage.alt ?? p.title ?? "",
                      }
                    : undefined;
                  return (
                    <RelatedCard
                      key={p._id}
                      category={p.category}
                      metrics={metrics}
                      title={p.title ?? p.slug}
                      eyebrow={date}
                      sub={p.lede}
                      coverImage={cover}
                      href={`/en/blog/${p.slug}`}
                    />
                  );
                })}
              </div>
              <Link href="/en/blog" className="hp-link">
                All articles →
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
