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
import { OG_DEFAULT_IMAGE, ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";

const BLOG_TITLE = "ᐈ Блог о веб-дизайне и разработке | Code-Site.Art";
const BLOG_DESCRIPTION =
  "➤ Экспертные гайды о разработке кастомных сайтов, Next.js, Sanity CMS и трендах веб-дизайна ✔️ Реальные кейсы ✔️ Рабочие стратегии ➡ Читайте свежие статьи.";

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/ru/blog",
    locale: "ru",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    type: "CollectionPage",
  }),
  breadcrumbNode([
    { name: "Главная", path: "/ru" },
    { name: "Блог", path: "/ru/blog" },
  ]),
  {
    "@type": "Blog",
    "@id": `${pageUrl("/ru/blog")}#blog`,
    name: "Блог Code-Site.Art — веб-дизайн и разработка",
    description: BLOG_DESCRIPTION,
    url: pageUrl("/ru/blog"),
    inLanguage: "ru",
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
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/blog" }),
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: "/ru/blog",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

const RU_MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

function formatRuDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${d.getDate()} ${RU_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function RuBlogPage({
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

  // RU listing: only posts that have a RU translation (title.ru + slugs.ru).
  const ruPosts = posts.filter((p) => p.title?.ru && p.slugs?.ru?.current);

  const pillItems = dedupeCategoryRefs(ruPosts, (p) => p.category ?? null, "ru");

  const filtered = category
    ? ruPosts.filter((p) => p.category?.slug === category)
    : ruPosts;

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Главная", href: "/ru" },
            { label: "Блог" },
          ]}
          eyebrow="/ БЛОГ"
          headline={
            <>
              Блог — <em>разборы</em> реальных проектов с цифрами
            </>
          }
          sub="Раз в месяц — одна статья о реальном проекте: бюджет, ошибки, что бы сделали иначе. Без воды и без новостей."
        />

        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            {pillItems.length > 0 ? (
              <div className="mb-10">
                <FilterPills
                  paramKey="category"
                  items={pillItems}
                  allLabel="Все"
                  ariaLabel="Фильтр по категории"
                />
              </div>
            ) : null}

            {filtered.length > 0 ? (
              <div className={casesGridClass}>
                {filtered.map((p) => {
                  const slug = p.slugs?.ru?.current ?? "";
                  const date = formatRuDate(p.publishedAt);
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} мин чтения`
                    : undefined;
                  const metrics = [reading].filter(
                    (m): m is string => Boolean(m),
                  );
                  const cover = resolveBlogCover(p, "ru");
                  const categoryLabel = p.category?.name?.ru ?? undefined;
                  return (
                    <RelatedCard
                      key={p._id}
                      category={categoryLabel}
                      metrics={metrics}
                      title={p.title?.ru ?? slug}
                      eyebrow={date}
                      sub={p.lede?.ru}
                      coverImage={cover.generic ? undefined : { src: cover.image, alt: cover.alt }}
                      generatedCover={cover.generic ? { title: p.title?.ru ?? slug, category: categoryLabel } : undefined}
                      coverAspect="wide"
                      href={`/ru/blog/${slug}`}
                    />
                  );
                })}
              </div>
            ) : (
              <p className={`${hpSubClass} py-[60px] text-center`}>
                {category
                  ? "В этой категории пока нет статей."
                  : "Скоро здесь появятся статьи. Первый материал уже готовится."}
              </p>
            )}
          </div>
        </section>
      </main>
      <HpFooter />
    </>
  );
}
