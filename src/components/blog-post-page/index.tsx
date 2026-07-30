/**
 * Locale-parameterized blog post page: static params, metadata, JSON-LD and
 * the full renderer. Each locale's `blog/[slug]/page.tsx` is a thin wrapper
 * that pins `locale` — adding a locale adds a wrapper, not a page rewrite.
 */

import { notFound } from "next/navigation";
import Link from "next/link";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { FAQ } from "@/components/blocks/final";
import "@/components/blocks/blog/blog.css";

import { fetchBlogPost, fetchRelated } from "./data";

export {
  buildBlogPostMetadata,
  fetchBlogPost,
  generateBlogPostStaticParams,
  hasBlogLocaleContent,
} from "./data";

import type { BlogPostDoc, BlogPostListItem } from "@/types/sanity";
import {
  DEFAULT_LOCALE,
  LOCALE_CONFIG,
  SECONDARY_LOCALES,
  type Locale,
  type SecondaryLocale,
} from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import { loc } from "@/lib/shared/sanity-locale";
import { pickLocalized } from "@/lib/shared/pick-localized";
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
import {
  hpEyebrowClass,
  hpEyebrowDotClass,
  hpH2Class,
  hpInnerClass,
  hpLinkClass,
  hpSectionClass,
  hpSectionHeadClass,
} from "@/components/homepage/shared";

/* ─── Per-locale chrome ──────────────────────────────────────────────────── */

const UA_MONTHS_SHORT = [
  "січ", "лют", "бер", "кві", "тра", "чер",
  "лип", "сер", "вер", "жов", "лис", "гру",
];

const RU_MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

/** Short date per locale ("30 чер 2026" / "30 Jun 2026" / "30 июн 2026"). */
const FORMAT_DATE: Record<Locale, (d: Date) => string> = {
  uk: (d) => `${d.getDate()} ${UA_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
  en: (d) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  ru: (d) => `${d.getDate()} ${RU_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`,
};

function formatDate(iso: string | undefined, locale: Locale): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return FORMAT_DATE[locale](d);
}

const LABELS: Record<
  Locale,
  {
    home: string;
    blog: string;
    eyebrow: string;
    updated: string;
    minRead: (n: number) => string;
    moreReadingEyebrow: string;
    relatedHeading: React.ReactNode;
    allArticles: string;
  }
> = {
  uk: {
    home: "Головна",
    blog: "Блог",
    eyebrow: "/ БЛОГ",
    updated: "Оновлено",
    minRead: (n) => `${n} хв читання`,
    moreReadingEyebrow: "/ ЩЕ ПОЧИТАТИ",
    relatedHeading: (
      <>
        Схожі <em>статті</em>
      </>
    ),
    allArticles: "Усі статті →",
  },
  en: {
    home: "Home",
    blog: "Blog",
    eyebrow: "/ BLOG",
    updated: "Updated",
    minRead: (n) => `${n} min read`,
    moreReadingEyebrow: "/ MORE READING",
    relatedHeading: (
      <>
        Related <em>articles</em>
      </>
    ),
    allArticles: "All articles →",
  },
  ru: {
    home: "Главная",
    blog: "Блог",
    eyebrow: "/ БЛОГ",
    updated: "Обновлено",
    minRead: (n) => `${n} мин чтения`,
    moreReadingEyebrow: "/ ЕЩЁ ПОЧИТАТЬ",
    relatedHeading: (
      <>
        Похожие <em>статьи</em>
      </>
    ),
    allArticles: "Все статьи →",
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

/** Glossary terms attached to every blog post — keep small to avoid bloat. */
const BLOG_GLOSSARY_KEYS = ["seo", "coreWebVitals", "nextjs", "isr"] as const;

function buildBlogJsonLd(post: BlogPostDoc, slug: string, locale: Locale) {
  const path = localizePath(`/blog/${slug}`, locale);
  const url = pageUrl(path);
  const cover = resolveBlogCover(post, locale);
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
  const title = pickLocalized(post.title, locale) ?? slug;
  const description =
    pickLocalized(post.metaDescription, locale) ?? pickLocalized(post.lede, locale);
  const faqItems = (post.faq ?? []).filter((it) => loc(it.question, locale));

  return buildJsonLd([
    webPageNode({
      path,
      locale,
      title,
      description,
      type: "ItemPage",
    }),
    breadcrumbNode([
      { name: LABELS[locale].home, path: localizePath("/", locale) },
      { name: LABELS[locale].blog, path: localizePath("/blog", locale) },
      { name: title, path },
    ]),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      url,
      mainEntityOfPage: url,
      headline: title,
      description,
      inLanguage: LOCALE_CONFIG[locale].bcp47,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      image: imageUrl ? [imageUrl] : undefined,
      author: post.author?.name
        ? {
            "@type": "Person",
            name: post.author.name,
            jobTitle: post.author.role,
            url: `${SITE_ORIGIN}${localizePath("/about", locale)}`,
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
      articleSection: loc(post.category?.name, locale) || undefined,
      keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    },
    faqItems.length
      ? {
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: loc(item.question, locale),
            acceptedAnswer: {
              "@type": "Answer",
              text: loc(item.answer, locale),
            },
          })),
        }
      : null,
    definedTermNodes(glossaryTerms(BLOG_GLOSSARY_KEYS, locale), locale),
  ]);
}

/* ─── Page renderer ──────────────────────────────────────────────────────── */

export async function BlogPostPageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const post = await fetchBlogPost(slug, locale);
  // Render-time guards: require this locale's title + body so
  // half-translated drafts can't publish as a broken localized page.
  const body = post ? pickLocalized(post.body, locale) : undefined;
  if (!post || !pickLocalized(post.title, locale) || !body?.length) notFound();

  const labels = LABELS[locale];
  const title = pickLocalized(post.title, locale) ?? "";
  const jsonLd = buildBlogJsonLd(post, slug, locale);
  const dateStr = formatDate(post.publishedAt, locale);
  const updatedStr =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? formatDate(post.updatedAt, locale)
      : undefined;

  const related = await fetchRelated(post.relatedPostSlugs, locale);
  const heroCover = resolveBlogCover(post, locale);

  // FAQ → existing FAQ component expects { q, a }
  const faqItems = (post.faq ?? [])
    .filter((item) => loc(item.question, locale))
    .map((item) => ({
      q: loc(item.question, locale),
      a: [loc(item.answer, locale)],
    }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <main>
        {/* Hero cover — rendered above the H1. Full standard width; skipped
            when the post has no cover of its own. */}
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
            { label: labels.home, href: localizePath("/", locale) },
            { label: labels.blog, href: localizePath("/blog", locale) },
            { label: title },
          ]}
          eyebrow={pickLocalized(post.eyebrow, locale) ?? labels.eyebrow}
          headline={title}
          sub={pickLocalized(post.lede, locale) ?? ""}
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
            {updatedStr ? (
              <span>
                {labels.updated} · {updatedStr}
              </span>
            ) : null}
            {post.readingTimeMinutes ? (
              <span>{labels.minRead(post.readingTimeMinutes)}</span>
            ) : null}
          </div>
        </section>

        {/* Body — outer container is full standard width so the custom
            blocks (tldrBox, ctaCallout, blogTable, blogImage) can break out;
            prose elements are capped via the .blog-prose CSS rules. */}
        <section className="relative bg-bg pt-10 px-5 pb-14 md:pt-16 md:px-12 md:pb-20">
          <div className="blog-post-bg absolute inset-0 z-0 pointer-events-none" />
          <article className="blog-prose relative z-[1] max-w-container mx-auto">
            <BlogPortableText value={body} />
          </article>
        </section>

        {/* FAQ */}
        {faqItems.length > 0 ? (
          <FAQ
            heading={pickLocalized(post.faqHeading, locale) ?? undefined}
            items={faqItems}
            locale={locale}
          />
        ) : null}

        {/* Related articles */}
        {related.length > 0 ? (
          <section className={hpSectionClass}>
            <div className={hpInnerClass}>
              <div className={hpSectionHeadClass}>
                <div className={hpEyebrowClass}>
                  <span className={hpEyebrowDotClass} />
                  <span>{labels.moreReadingEyebrow}</span>
                </div>
                <h2 className={hpH2Class}>{labels.relatedHeading}</h2>
              </div>
              <div className={casesGridClass}>
                {related.slice(0, 2).map((p) => {
                  const pSlug = p.slugs?.[locale]?.current ?? "";
                  const reading = p.readingTimeMinutes
                    ? labels.minRead(p.readingTimeMinutes)
                    : undefined;
                  const date = formatDate(p.publishedAt, locale);
                  const metrics = [reading].filter((m): m is string => Boolean(m));
                  const cover = resolveBlogCover(p, locale);
                  return (
                    <RelatedCard
                      key={p._id}
                      category={loc(p.category?.name, locale) || undefined}
                      metrics={metrics}
                      title={pickLocalized(p.title, locale) ?? pSlug}
                      eyebrow={date}
                      sub={pickLocalized(p.lede, locale)}
                      coverImage={{ src: cover.image, alt: cover.alt }}
                      coverAspect="wide"
                      href={localizePath(`/blog/${pSlug}`, locale)}
                    />
                  );
                })}
              </div>
              <Link href={localizePath("/blog", locale)} className={hpLinkClass}>
                {labels.allArticles}
              </Link>
            </div>
          </section>
        ) : null}
      </main>
      <HpFooter />
    </>
  );
}
