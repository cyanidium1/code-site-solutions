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
  BLOG_POST_BY_EN_SLUG_QUERY,
  BLOG_POSTS_BY_SLUGS_QUERY,
} from "@/lib/server/sanity-queries";
import type {
  BlogPostDoc,
  BlogPostListItem,
} from "@/types/sanity";
import { BlogPortableText } from "@/lib/shared/sanity-portable";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpLinkClass, hpSectionClass, hpSectionHeadClass } from "@/components/homepage/shared";

/* ─── Static params + metadata ──────────────────────────────────────────── */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY,
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  return posts
    .filter((p) => p.slugEn && p.titleEn)
    .map((p) => ({ slug: p.slugEn as string }));
}

async function fetchPost(slug: string): Promise<BlogPostDoc | null> {
  return sanityFetch<BlogPostDoc | null>({
    query: BLOG_POST_BY_EN_SLUG_QUERY,
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
  if (!post || !post.titleEn) return {};

  const title = post.metaTitleEn ?? post.titleEn ?? "";
  const description = post.metaDescriptionEn ?? post.ledeEn ?? "";
  const path = `/en/blog/${slug}`;
  const ogUrl = post.ogImage?.url ?? post.coverImage?.src;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        uk: `/blog/${post.slug}`,
        en: path,
        "x-default": `/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "en_US",
      url: path,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogUrl ? [{ url: ogUrl }] : undefined,
    },
  };
}

/* ─── Date helper ─────────────────────────────────────────────────────────── */

function formatEnDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─── JSON-LD ─────────────────────────────────────────────────────────────── */

function buildJsonLd(
  post: BlogPostDoc,
  enSlug: string,
): Record<string, unknown> {
  const url = pageUrl(`/en/blog/${enSlug}`);
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
          name: post.titleEn ?? enSlug,
          item: url,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      url,
      mainEntityOfPage: url,
      headline: post.titleEn ?? enSlug,
      description: post.metaDescriptionEn ?? post.ledeEn,
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

  if (post.faqEn?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faqEn.map((item) => ({
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
    query: BLOG_POSTS_BY_SLUGS_QUERY,
    params: { slugs },
    revalidate: 300,
  }).catch(() => [] as BlogPostListItem[]);
  // GROQ does not preserve $slugs order — reorder client-side.
  // Filter to only posts that have EN content.
  const bySlug = new Map(items.map((i) => [i.slug, i] as const));
  return slugs
    .map((s) => bySlug.get(s))
    .filter((i): i is BlogPostListItem => Boolean(i) && Boolean(i?.slugEn && i?.titleEn));
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function EnBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  // Render-time guards: require titleEn + bodyEn so half-translated drafts
  // can't accidentally publish as a broken EN page.
  if (!post || !post.titleEn || !post.bodyEn?.length) notFound();

  const jsonLd = buildJsonLd(post, slug);
  const dateStr = formatEnDate(post.publishedAt);
  const updatedStr =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? formatEnDate(post.updatedAt)
      : undefined;

  const related = await fetchRelated(post.relatedPostSlugs);

  const faqItems = (post.faqEn ?? []).map((item) => ({
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage.src}
                alt={post.coverImage.alt ?? post.titleEn ?? ""}
                className="w-full h-auto rounded-2xl border border-line block"
              />
            </div>
          </section>
        ) : null}

        <PageHero
          breadcrumbs={[
            { label: "Home", href: "/en" },
            { label: "Blog", href: "/en/blog" },
            { label: post.titleEn ?? slug },
          ]}
          eyebrow={post.eyebrowEn ?? "/ BLOG"}
          headline={post.titleEn ?? ""}
          sub={post.ledeEn ?? ""}
        />

        <section className="bg-bg px-12 max-[700px]:px-5">
          <div className="max-w-container mx-auto py-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11.5px] tracking-[0.1em] uppercase text-[var(--ink-3)] border-b border-line">
            {post.author?.name ? (
              <span className="flex items-center gap-2.5">
                {post.author.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
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
            <BlogPortableText value={post.bodyEn} />
          </article>
        </section>

        {faqItems.length > 0 ? <FAQ items={faqItems} locale="en" /> : null}

        {related.length > 0 ? (
          <section className={hpSectionClass}>
            <div className={hpInnerClass}>
              <div className={hpSectionHeadClass}>
                <div className={hpEyebrowClass}>
                  <span className={hpEyebrowDotClass} />
                  <span>/ MORE READING</span>
                </div>
                <h2 className={hpH2Class}>
                  Related <em>articles</em>
                </h2>
              </div>
              <div className={casesGridClass}>
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
                        alt: p.coverImage.alt ?? p.titleEn ?? "",
                      }
                    : undefined;
                  return (
                    <RelatedCard
                      key={p._id}
                      category={p.category}
                      metrics={metrics}
                      title={p.titleEn ?? p.slugEn ?? ""}
                      eyebrow={date}
                      sub={p.ledeEn}
                      coverImage={cover}
                      href={`/en/blog/${p.slugEn}`}
                    />
                  );
                })}
              </div>
              <Link href="/en/blog" className={hpLinkClass}>
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
