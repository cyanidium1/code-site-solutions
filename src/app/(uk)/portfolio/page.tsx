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
  ukProjectsBackedHeadline,
} from "@/lib/shared/case-card-item";
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";
import { loc } from "@/lib/shared/sanity-locale";
import { SITE_ORIGIN } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

export const metadata: Metadata = {
  title: "ᐈ Портфоліо веброзробки | Кейси кастомних сайтів | Code-Site.Art",
  description:
    "➤ Понад 50 кастомних сайтів для клінік, юристів, нерухомості та e-commerce ✔️ Реальні результати: ×3.2 заявок, LCP 0.8 с, топ-3 Google ✔️ Стек Next.js + Sanity ➡ Дивіться всі проєкти.",
  alternates: {
    canonical: "/portfolio",
    languages: {
      uk: "/portfolio",
      "en-GB": "/en/portfolio",
      "x-default": "/portfolio",
    },
  },
  openGraph: {
    title: "ᐈ Портфоліо веброзробки | Кейси кастомних сайтів | Code-Site.Art",
    description:
      "➤ Понад 50 кастомних сайтів для клінік, юристів, нерухомості та e-commerce ✔️ Реальні результати: ×3.2 заявок, LCP 0.8 с, топ-3 Google ✔️ Стек Next.js + Sanity ➡ Дивіться всі проєкти.",
    type: "website",
    locale: "uk_UA",
    url: "/portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Портфоліо веброзробки | Кейси кастомних сайтів | Code-Site.Art",
    description:
      "➤ Понад 50 кастомних сайтів для клінік, юристів, нерухомості та e-commerce ✔️ Реальні результати: ×3.2 заявок, LCP 0.8 с, топ-3 Google ✔️ Стек Next.js + Sanity ➡ Дивіться всі проєкти.",
  },
};

export const revalidate = 3600;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filterValues = readFilterValues(params, ["industry", "country", "budget"] as const);

  const [cases, registry] = await Promise.all([
    fetchCaseStudies(),
    getEnRegistrySafe(),
  ]);

  const filtered = filterCases(cases, filterValues);
  const portfolioHeadline = ukProjectsBackedHeadline(filtered.length);

  // Build dropdown options from the UNFILTERED case list — single source of
  // truth. Labels come from the dereferenced option docs (countryOption /
  // budgetBucketOption / industryPage). Empty/missing refs are dropped.
  const industryOptions = dedupeIndustryRefs(
    cases,
    (c) => c.industry ?? (c.industrySlug ? { slug: c.industrySlug } : null),
    "uk",
  );
  const countryOptions = dedupeOptionRefs(
    cases.map((c) => c.country),
    "uk",
  );
  const budgetOptions = dedupeOptionRefs(
    cases.map((c) => c.budgetBucket),
    "uk",
  );
  const industryCtaHrefBySlug = Object.fromEntries(
    industryOptions.map((o) => [o.key, `/sites-for/${o.key}`]),
  );

  const jsonLd = buildJsonLd([
    webPageNode({
      path: "/portfolio",
      locale: "uk",
      title: "ᐈ Портфоліо веброзробки | Кейси кастомних сайтів | Code-Site.Art",
      description:
        "➤ Понад 50 кастомних сайтів для клінік, юристів, нерухомості та e-commerce ✔️ Реальні результати: ×3.2 заявок, LCP 0.8 с, топ-3 Google ✔️ Стек Next.js + Sanity ➡ Дивіться всі проєкти.",
      type: "CollectionPage",
      extra: {
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: filtered.length,
          itemListElement: filtered.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: loc(c.title, "uk") || c.client || c.slug,
            url: `${SITE_ORIGIN}/portfolio/${c.slug}`,
          })),
        },
      },
    }),
    breadcrumbNode([
      { name: "Головна", path: "/" },
      { name: "Портфоліо", path: "/portfolio" },
    ]),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Портфоліо" },
        ]}
        eyebrow="/ PORTFOLIO"
        headline={
          <>
            {portfolioHeadline.count},{" "}
            <em>{portfolioHeadline.backed}</em>
          </>
        }
        sub="Кожен кейс — повний розбір з «до/після», цифрами і скриншотами."
      />

      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <div className="mb-10">
            <PortfolioFilters
              locale="uk"
              industryOptions={industryOptions}
              countryOptions={countryOptions}
              budgetOptions={budgetOptions}
              industryCtaHrefBySlug={industryCtaHrefBySlug}
            />
          </div>

          {filtered.length > 0 ? (
            <div className={casesGridClass}>
              {filtered.map((c) => {
                const item = caseRefToCardItem(c, "uk", registry);
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
              Жодного кейсу за обраними фільтрами.
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow="/ NEW PROJECT"
        heading={
          <>
            Хочете <em>такий же результат</em>?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Розповідаєте про проєкт — повертаємось з вилкою цін за 24 години."
        ctaPrimary={{
          label: "Розрахувати вартість",
          href: "/calculator",
        }}
        ctaSecondary={{
          label: "Або обговорити з нами",
          href: "/contacts",
        }}
      />

      <LaunchCta
        locale="uk"
        heading={
          <>
            Готові <em>обговорити</em> проєкт?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Без зобов'язань."
      />

      <HpFooter />
    </>
  );
}
