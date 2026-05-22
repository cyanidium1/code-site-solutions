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
  BLOG_POSTS_LIST_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POSTS_BY_SLUGS_QUERY,
} from "@/lib/sanity/queries";
import type {
  BlogPostDoc,
  BlogPostListItem,
} from "@/types/sanity";
import { BlogPortableText } from "@/lib/sanity/portable";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";

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
  // OG image: prefer explicit Sanity ogImage, else the static coverImage path
  // (relative paths are resolved against the site origin by Next).
  const ogUrl = post.ogImage?.url ?? post.coverImage?.src;

  return {
    title,
    description,
    alternates: { canonical: path },
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

function buildJsonLd(
  post: BlogPostDoc,
): Record<string, unknown> {
  const url = pageUrl(`/blog/${post.slug}`);
  // JSON-LD wants an absolute URL — the static cover path needs SITE_ORIGIN
  // prepended; Sanity ogImage is already absolute.
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
        { "@type": "ListItem", position: 1, name: "Головна", item: SITE_ORIGIN },
        {
          "@type": "ListItem",
          position: 2,
          name: "Блог",
          item: `${SITE_ORIGIN}/blog`,
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
      inLanguage: "uk",
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

  const jsonLd = buildJsonLd(post);
  const dateStr = formatUkDate(post.publishedAt);
  const updatedStr =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? formatUkDate(post.updatedAt)
      : undefined;

  const related = await fetchRelated(post.relatedPostSlugs);

  // FAQ → existing FAQ component expects { q, a: RichText }
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
        {/* Hero cover — rendered above the H1. Full standard width to
            match /sites-for/medicine and other site pages. */}
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
            { label: "Головна", href: "/" },
            { label: "Блог", href: "/blog" },
            { label: post.title ?? post.slug },
          ]}
          eyebrow={post.eyebrow ?? "/ БЛОГ"}
          headline={post.title ?? ""}
          sub={post.lede ?? ""}
        />

        {/* Meta strip — author + date + updated */}
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
        <section className="relative bg-bg pt-16 px-12 pb-20 max-[700px]:pt-10 max-[700px]:px-5 max-[700px]:pb-14">
          <div className="blog-post-bg absolute inset-0 z-0 pointer-events-none" />
          <article className="blog-prose relative z-[1] max-w-container mx-auto">
            <BlogPortableText value={post.body} />
          </article>
        </section>

        {/* FAQ */}
        {faqItems.length > 0 ? <FAQ items={faqItems} /> : null}

        {/* Related articles */}
        {related.length > 0 ? (
          <section className="hp-section">
            <div className="hp-inner">
              <div className="hp-section-head">
                <div className="hp-eyebrow">
                  <span className="hp-eyebrow-dot" />
                  <span>/ ЩЕ ПОЧИТАТИ</span>
                </div>
                <h2 className="hp-h2">
                  Схожі <em>статті</em>
                </h2>
              </div>
              <div className="hp-cases-grid">
                {related.slice(0, 2).map((p) => {
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} хв читання`
                    : undefined;
                  const date = formatUkDate(p.publishedAt);
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
                      href={`/blog/${p.slug}`}
                    />
                  );
                })}
              </div>
              <Link href="/blog" className="hp-link">
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
