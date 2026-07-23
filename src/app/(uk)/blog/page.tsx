import type { Metadata } from "next";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { BLOG_POSTS_LIST_QUERY } from "@/lib/server/sanity-queries";
import type { BlogPostListItem } from "@/types/sanity";
import { hpInnerClass, hpSectionClass, hpSubClass } from "@/components/homepage/shared";
import { resolveBlogCover } from "@/lib/shared/blog-cover";
import { readFilterValues } from "@/lib/shared/filters/read-filter-values";
import { dedupeCategoryRefs } from "@/lib/shared/filters/dedupe-options";
import { FilterPills } from "@/components/filters/filter-pills";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

const BLOG_DESCRIPTION =
  "➤ Експертні гайди про розробку кастомних сайтів, Next.js, Sanity CMS і тренди вебдизайну ✔️ Реальні кейси ✔️ Робочі стратегії ➡ Читайте свіжі статті.";

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/blog",
    locale: "uk",
    title: "ᐈ Блог про вебдизайн і розробку | Code-Site.Art",
    description: BLOG_DESCRIPTION,
    type: "CollectionPage",
  }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Блог", path: "/blog" },
  ]),
  {
    "@type": "Blog",
    "@id": `${pageUrl("/blog")}#blog`,
    name: "Блог Code-Site.Art — вебдизайн і розробка",
    description: BLOG_DESCRIPTION,
    url: pageUrl("/blog"),
    inLanguage: "uk-UA",
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/logo-512.png`,
      },
    },
  },
]);
export const metadata: Metadata = {
  title: "ᐈ Блог про вебдизайн і розробку | Code-Site.Art",
  description:
    "➤ Експертні гайди про розробку кастомних сайтів, Next.js, Sanity CMS і тренди вебдизайну ✔️ Реальні кейси ✔️ Робочі стратегії ➡ Читайте свіжі статті.",
  alternates: {
    canonical: "/blog",
    languages: { uk: "/blog", "en-GB": "/en/blog", "x-default": "/blog" },
  },
  openGraph: {
    title: "ᐈ Блог про вебдизайн і розробку | Code-Site.Art",
    description:
      "➤ Експертні гайди про розробку кастомних сайтів, Next.js, Sanity CMS і тренди вебдизайну ✔️ Реальні кейси ✔️ Робочі стратегії ➡ Читайте свіжі статті.",
    type: "website",
    locale: "uk_UA",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Блог про вебдизайн і розробку | Code-Site.Art",
    description:
      "➤ Експертні гайди про розробку кастомних сайтів, Next.js, Sanity CMS і тренди вебдизайну ✔️ Реальні кейси ✔️ Робочі стратегії ➡ Читайте свіжі статті.",
  },
};

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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { category } = readFilterValues(params, ["category"] as const);

  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY,
    revalidate: 300,
    tags: ["blogPost"],
  }).catch(() => [] as BlogPostListItem[]);

  // Pills are built from the unfiltered post list — single source of truth.
  // Hide the pill row entirely when no post has a category assigned yet.
  const pillItems = dedupeCategoryRefs(posts, (p) => p.category ?? null, "uk");

  const filtered = category
    ? posts.filter((p) => p.category?.slug === category)
    : posts;

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Головна", href: "/" },
            { label: "Блог" },
          ]}
          eyebrow="/ БЛОГ"
          headline={
            <>
              Блог — <em>розбори</em> реальних проєктів з цифрами
            </>
          }
          sub="Раз на місяць — одна стаття про реальний проєкт: бюджет, помилки, що б зробили інакше. Без води і без новин."
        />

        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            {pillItems.length > 0 ? (
              <div className="mb-10">
                <FilterPills
                  paramKey="category"
                  items={pillItems}
                  allLabel="Усі"
                  ariaLabel="Фільтр за категорією"
                />
              </div>
            ) : null}

            {filtered.length > 0 ? (
              <div className={casesGridClass}>
                {filtered.map((p) => {
                  const date = formatUkDate(p.publishedAt);
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} хв читання`
                    : undefined;
                  const eyebrow = date ?? undefined;
                  const metrics = [reading].filter(
                    (m): m is string => Boolean(m),
                  );
                  const cover = resolveBlogCover(p, "uk");
                  const categoryLabel = p.category?.name?.uk ?? undefined;
                  return (
                    <RelatedCard
                      key={p._id}
                      category={categoryLabel}
                      metrics={metrics}
                      title={p.title ?? p.slug}
                      eyebrow={eyebrow}
                      sub={p.lede}
                      coverImage={{ src: cover.image, alt: cover.alt }}
                      coverAspect="wide"
                      href={`/blog/${p.slug}`}
                    />
                  );
                })}
              </div>
            ) : (
              <p className={`${hpSubClass} py-[60px] text-center`}>
                {category
                  ? "Жодної статті у цій категорії."
                  : "Поки що порожньо. Перший допис уже готується."}
              </p>
            )}
          </div>
        </section>
      </main>
      <HpFooter />
    </>
  );
}

export const revalidate = 300;
