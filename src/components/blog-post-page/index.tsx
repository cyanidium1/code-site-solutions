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
import { LeadForm } from "@/components/blocks/lead-form";
import "@/components/blocks/blog/blog.css";

import { fetchBlogPost, fetchRelated, fetchSiblingPosts } from "./data";

export {
  buildBlogPostMetadata,
  fetchBlogPost,
  generateBlogPostStaticParams,
  hasBlogLocaleContent,
} from "./data";

import type { BlogPostDoc, BlogPostListItem } from "@/types/sanity";

/** End-of-post lead-form copy, per locale. */
const BLOG_FORM_COPY: Record<
  Locale,
  { eyebrow: string; heading: string; sub: string }
> = {
  uk: {
    eyebrow: "БЕЗКОШТОВНА КОНСУЛЬТАЦІЯ",
    heading: "Обговорити свій проєкт?",
    sub: "Залиште контакт — відповімо протягом 4 робочих годин. Без спаму і скриптів продажів.",
  },
  ru: {
    eyebrow: "БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ",
    heading: "Обсудить свой проект?",
    sub: "Оставьте контакт — ответим в течение 4 рабочих часов. Без спама и скриптов продаж.",
  },
  en: {
    eyebrow: "FREE CONSULTATION",
    heading: "Want to discuss your project?",
    sub: "Leave your contact — we reply within 4 working hours. No spam, no sales scripts.",
  },
};
import {
  LOCALE_CONFIG,
  SECONDARY_LOCALES,
  type Locale,
  type SecondaryLocale,
} from "@/constants/locales";
import { localizePath, resolveRootHref } from "@/constants/i18n-routes";
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

/**
 * Commercial page each blog category funnels into, with keyword anchors.
 * Rendered as a server-side contextual link in the "related" block so
 * every article passes equity to a money page even when its body copy
 * doesn't (body links live in the CMS).
 */
const CATEGORY_COMMERCIAL: Record<
  string,
  { href: string; anchor: Record<Locale, string> }
> = {
  medicine: {
    href: "/sites-for/medicine",
    anchor: {
      uk: "створення медичних сайтів",
      en: "medical website development",
      ru: "создание медицинских сайтов",
    },
  },
  finance: {
    href: "/sites-for/finance",
    anchor: {
      uk: "сайт для фінансової компанії",
      en: "websites for finance firms",
      ru: "сайт для финансовой компании",
    },
  },
  legal: {
    href: "/sites-for/legal",
    anchor: {
      uk: "створення сайту для юридичної фірми",
      en: "websites for law firms",
      ru: "создание сайта для юридической фирмы",
    },
  },
  "real-estate": {
    href: "/sites-for/real-estate",
    anchor: {
      uk: "створення сайту нерухомості",
      en: "real-estate website development",
      ru: "создание сайта недвижимости",
    },
  },
  ecommerce: {
    href: "/sites-for/ecommerce",
    anchor: {
      uk: "створення інтернет-магазину під ключ",
      en: "custom e-commerce development",
      ru: "создание интернет-магазина под ключ",
    },
  },
  auto: {
    href: "/sites-for/auto",
    anchor: {
      uk: "розробка сайту автосервісу",
      en: "websites for car businesses",
      ru: "разработка сайта автосервиса",
    },
  },
  courses: {
    href: "/sites-for/courses",
    anchor: {
      uk: "створення сайту для онлайн-курсів",
      en: "websites for online courses",
      ru: "создание сайта для онлайн-курсов",
    },
  },
  // SEO audit Aug 2026: `renovation` was the only /sites-for page missing from
  // this map, so any post filed under it would fall back to the generic
  // /pricing link instead of its own industry page.
  renovation: {
    href: "/sites-for/renovation",
    anchor: {
      uk: "розробка сайту для будівельної компанії",
      en: "websites for construction companies",
      ru: "разработка сайта для строительной компании",
    },
  },
  platforms: {
    href: "/pricing",
    anchor: {
      uk: "ціна створення сайту",
      en: "website development pricing",
      ru: "цена создания сайта",
    },
  },
};

const COMMERCIAL_LEAD: Record<Locale, string> = {
  uk: "По темі:",
  en: "Related service:",
  ru: "По теме:",
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
            url: `${SITE_ORIGIN}${resolveRootHref("/about", locale)}`,
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

  const curated = await fetchRelated(post.relatedPostSlugs, locale);
  // ALWAYS add one rotating sibling on top of the curated picks. Curation
  // alone left four UA posts with a single in-body inbound link (only the
  // /blog index pointed at them), because every post curates two others and
  // nobody happened to pick those. Rotation walks the archive in publication
  // order, so it forms a cycle: every post is pointed at by its neighbour,
  // whatever the editors chose.
  const seen = new Set(curated.map((p) => p._id));
  const rotating = (await fetchSiblingPosts(slug, locale, 3)).filter(
    (p) => !seen.has(p._id),
  );
  const related = [...curated, ...rotating.slice(0, Math.max(1, 2 - curated.length))];
  const heroCover = resolveBlogCover(post, locale);
  const commercial = post.category?.slug
    ? (CATEGORY_COMMERCIAL[post.category.slug] ?? CATEGORY_COMMERCIAL.platforms)
    : CATEGORY_COMMERCIAL.platforms;

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
        {/* Hero cover — rendered above the H1.
            Width is capped at the H1 column (920px) rather than the full
            1440px container: a 16:9 cover across the full width came out
            810px tall, which is most of a laptop screen before a word of the
            article is visible. Narrowing it also fixes the softness — the
            same 1600px source now covers the display width about 1.7x
            instead of being stretched past 1:1. The height cap trims the
            band to roughly 2:1; these covers are abstract, so a centre crop
            costs nothing. */}
        {!heroCover.generic ? (
          <section className="bg-bg px-5 pt-6 lg:px-12 lg:pt-10">
            <div className="max-w-container-h1 mx-auto">
              <SanityImg
                image={heroCover.image}
                alt={heroCover.alt}
                sizes={IMG_SIZES.prose}
                priority
                className="w-full h-auto max-h-[300px] sm:max-h-[380px] lg:max-h-[440px] object-cover rounded-2xl border border-line block"
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
                {/* The byline links the studio page: it is the natural
                    place a reader checks who wrote this, and it is what
                    gives /about in-body inbound links from the archive. */}
                <Link
                  href={resolveRootHref("/about", locale)}
                  className="text-ink-dim no-underline transition-colors hover:text-ink"
                >
                  {post.author.name}
                </Link>
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

        {/* Lead form — every post ends with a direct contact form. The
            `source` encodes the reading locale and the article slug, so each
            lead arrives tagged with the language and the page it came from. */}
        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            <div className="mx-auto max-w-[760px]">
              <div className="mb-6 text-center">
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
                  {BLOG_FORM_COPY[locale].eyebrow}
                </div>
                <h2 className="mt-3 mb-0 font-actay uppercase font-bold text-[clamp(22px,2.6vw,32px)] leading-[1.15] text-ink">
                  {BLOG_FORM_COPY[locale].heading}
                </h2>
                <p className="mt-3 mb-0 font-sans text-[14.5px] leading-[1.6] text-ink-dim">
                  {BLOG_FORM_COPY[locale].sub}
                </p>
              </div>
              <div className="p-5 border border-line-strong rounded-2xl bg-[oklch(0.13_0.005_300_/_0.7)] backdrop-blur-[8px] md:p-7 md:rounded-[22px]">
                <LeadForm
                  source={`blog-${locale}:${slug}`}
                  variant="compact"
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Related articles + a commercial contextual link */}
        {related.length > 0 || commercial ? (
          <section className={hpSectionClass}>
            <div className={hpInnerClass}>
              {related.length > 0 ? (
              <>
              <div className={hpSectionHeadClass}>
                <div className={hpEyebrowClass}>
                  <span className={hpEyebrowDotClass} />
                  <span>{labels.moreReadingEyebrow}</span>
                </div>
                <h2 className={hpH2Class}>{labels.relatedHeading}</h2>
              </div>
              <div className={casesGridClass}>
                {related.slice(0, 3).map((p) => {
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
                      coverImage={cover.generic ? undefined : { src: cover.image, alt: cover.alt }}
                      generatedCover={cover.generic ? { title: pickLocalized(p.title, locale) ?? pSlug, category: loc(p.category?.name, locale) || undefined } : undefined}
                      coverAspect="wide"
                      href={localizePath(`/blog/${pSlug}`, locale)}
                    />
                  );
                })}
              </div>
              </>
              ) : null}
              {commercial ? (
                <p className="mt-8 mb-0 font-sans text-[15px] leading-[1.65] text-ink-dim">
                  {COMMERCIAL_LEAD[locale]}{" "}
                  <Link
                    href={
                      commercial.href === "/pricing"
                        ? resolveRootHref("/pricing", locale)
                        : localizePath(commercial.href, locale)
                    }
                    className="rich-link"
                  >
                    {commercial.anchor[locale]}
                  </Link>
                </p>
              ) : null}
              {related.length > 0 ? (
                <Link href={localizePath("/blog", locale)} className={hpLinkClass}>
                  {labels.allArticles}
                </Link>
              ) : null}
            </div>
          </section>
        ) : null}
      </main>
      <HpFooter />
    </>
  );
}
