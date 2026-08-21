import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { PortfolioFilters } from "@/components/portfolio-filters";
import { filterCases } from "@/components/portfolio-filters/filter-cases";
import {
  dedupeIndustryRefs,
  dedupeOptionRefs,
} from "@/lib/shared/filters/dedupe-options";
import { readFilterValues } from "@/lib/shared/filters/read-filter-values";
import {
  caseRefToCardItem,
  ruProjectsBackedHeadline,
} from "@/lib/shared/case-card-item";
import { loc } from "@/lib/shared/sanity-locale";
import { hasLocaleCase, hasLocaleIndustry } from "@/constants/i18n-routes";
import { getContentRegistrySafe } from "@/lib/server/i18n-registry";
import { SITE_ORIGIN } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { buildAlternates } from "@/lib/shared/alternates";

const META_TITLE =
  "ᐈ Портфолио веб-разработки | Кейсы кастомных сайтов | Code-Site.Art";
const META_DESCRIPTION =
  "➤ 50+ кастомных сайтов для клиник, юристов, недвижимости и e-commerce ✔️ Реальные результаты: ×3.2 заявок, LCP 0.8с, топ-3 Google ✔️ Next.js + Sanity ➡ Смотреть проекты.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/portfolio" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: "/ru/portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

export const revalidate = 3600;

export default async function RuPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filterValues = readFilterValues(params, [
    "industry",
    "country",
    "budget",
  ] as const);

  const [cases, registry] = await Promise.all([
    fetchCaseStudies(),
    getContentRegistrySafe(),
  ]);

  const filtered = filterCases(cases, filterValues);
  const portfolioHeadline = ruProjectsBackedHeadline(filtered.length);

  // Dropdown options come from the UNFILTERED list; the industry dropdown is
  // constrained to industries that have RU content so the CTA never deep-links
  // into a 404.
  const industryOptions = dedupeIndustryRefs(
    cases,
    (c) => c.industry ?? (c.industrySlug ? { slug: c.industrySlug } : null),
    "ru",
  ).filter((o) => hasLocaleIndustry(o.key, "ru", registry));
  const countryOptions = dedupeOptionRefs(
    cases.map((c) => c.country),
    "ru",
  );
  const budgetOptions = dedupeOptionRefs(
    cases.map((c) => c.budgetBucket),
    "ru",
  );
  const industryCtaHrefBySlug = Object.fromEntries(
    industryOptions.map((o) => [o.key, `/ru/sites-for/${o.key}`]),
  );

  const jsonLd = buildJsonLd([
    webPageNode({
      path: "/ru/portfolio",
      locale: "ru",
      title: META_TITLE,
      description: META_DESCRIPTION,
      type: "CollectionPage",
      extra: {
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: filtered.length,
          itemListElement: filtered.map((c, i) => {
            const url = hasLocaleCase(c.slug, "ru", registry)
              ? `${SITE_ORIGIN}/ru/portfolio/${c.slug}`
              : `${SITE_ORIGIN}/portfolio/${c.slug}`;
            return {
              "@type": "ListItem",
              position: i + 1,
              name: loc(c.title, "ru") || c.client || c.slug,
              url,
            };
          }),
        },
      },
    }),
    breadcrumbNode([
      { name: "Главная", path: "/ru" },
      { name: "Портфолио", path: "/ru/portfolio" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[{ label: "Главная", href: "/ru" }, { label: "Портфолио" }]}
        eyebrow="ПОРТФОЛИО"
        headline={
          <>
            {portfolioHeadline.count}, <em>{portfolioHeadline.backed}</em>
          </>
        }
        sub="Каждый кейс — полный разбор с «до / после» и метриками. ×3.2 заявок, $250k+ инвестиций, 24 заявки в месяц."
      />

      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <div className="mb-10">
            <PortfolioFilters
              locale="ru"
              industryOptions={industryOptions}
              countryOptions={countryOptions}
              budgetOptions={budgetOptions}
              industryCtaHrefBySlug={industryCtaHrefBySlug}
            />
          </div>

          {filtered.length > 0 ? (
            <div className={casesGridClass}>
              {filtered.map((c) => {
                const item = caseRefToCardItem(c, "ru", registry);
                const metaLine = [item.industry, item.region, item.year]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <RelatedCard
                    key={c._id}
                    metrics={item.chips}
                    title={item.name}
                    eyebrow={metaLine || undefined}
                    sub={item.metrics || undefined}
                    coverImage={
                      item.coverImage
                        ? {
                            src: item.coverImage,
                            alt: item.coverImageAlt ?? item.name,
                          }
                        : undefined
                    }
                    gradient={item.gradient}
                    href={item.href}
                  />
                );
              })}
            </div>
          ) : (
            <p className="py-[60px] text-center font-mono text-ink-3">
              Нет кейсов под выбранные фильтры.
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow="НОВЫЙ ПРОЕКТ"
        heading={
          <>
            Хотите <em>похожий результат</em>?
          </>
        }
        sub="Бесплатная 30-мин консультация. Расскажите о проекте — вернёмся с вилкой цены в течение 24 часов."
        ctaPrimary={{
          label: "Рассчитать цену",
          href: "/ru/calculator",
        }}
        ctaSecondary={{
          label: "Или обсудить с нами",
          href: "/ru/contacts",
        }}
      />

      <LaunchCta
        locale="ru"
        heading={
          <>
            Готовы <em>обсудить</em> проект?
          </>
        }
        sub="Бесплатная 30-мин консультация. Без обязательств."
      />

      <HpFooter />
    </>
  );
}
