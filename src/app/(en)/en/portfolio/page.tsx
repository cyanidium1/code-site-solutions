import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import { PortfolioFilters } from "@/components/portfolio-filters";
import {
  filterCases,
  readFilterValues,
} from "@/components/portfolio-filters/filter-cases";
import {
  caseRefToCardItem,
  enProjectsBackedHeadline,
} from "@/lib/shared/case-card-item";
import { loc } from "@/lib/shared/sanity-locale";
import { hasEnCase, hasEnIndustry } from "@/constants/i18n-routes";
import { getEnRegistrySafe } from "@/lib/server/i18n-registry";
import { SITE_ORIGIN, pageUrl } from "@/constants/site";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";
import { sanityFetch } from "@/lib/server/sanity-fetch";
import { INDUSTRY_PAGES_QUERY } from "@/lib/server/sanity-queries";
import type { IndustryPageRef } from "@/types/sanity";

export const metadata: Metadata = {
  title: "Portfolio — real projects with real metrics | Code-Site.Art",
  description:
    "Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo.",
  alternates: {
    canonical: "/en/portfolio",
    languages: {
      uk: "/portfolio",
      en: "/en/portfolio",
      "x-default": "/portfolio",
    },
  },
  openGraph: {
    title: "Portfolio — real projects with real metrics | Code-Site.Art",
    description:
      "Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo.",
    type: "website",
    locale: "en_US",
    url: "/en/portfolio",
  },
};

export const revalidate = 3600;

export default async function EnPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filterValues = readFilterValues(params);

  const [cases, registry, industries] = await Promise.all([
    fetchCaseStudies(),
    getEnRegistrySafe(),
    sanityFetch<IndustryPageRef[]>({
      query: INDUSTRY_PAGES_QUERY,
      revalidate: 3600,
      tags: ["industryPage"],
    }).catch(() => [] as IndustryPageRef[]),
  ]);

  const filtered = filterCases(cases, filterValues);
  const portfolioHeadline = enProjectsBackedHeadline(filtered.length);

  // Only offer industries that exist AND have EN content; on EN the CTA must
  // deep-link into /en/sites-for/<slug>, never the UA route.
  const enIndustries = industries.filter((i) => hasEnIndustry(i.slug, registry));
  const industryOptions = enIndustries.map((i) => ({
    key: i.slug,
    label: loc(i.title, "en") || i.slug,
  }));
  const industryCtaHrefBySlug = Object.fromEntries(
    enIndustries.map((i) => [i.slug, `/en/sites-for/${i.slug}`]),
  );

  const PORTFOLIO_URL = pageUrl("/en/portfolio");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
            name: "Portfolio",
            item: PORTFOLIO_URL,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${PORTFOLIO_URL}#collection`,
        url: PORTFOLIO_URL,
        name: "Portfolio — Code-Site.Art",
        description:
          "Real projects with real metrics. Sites for clinics, law firms, e-commerce, startups.",
        inLanguage: "en",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: filtered.length,
          itemListElement: filtered.map((c, i) => {
            const url = hasEnCase(c.slug, registry)
              ? `${SITE_ORIGIN}/en/portfolio/${c.slug}`
              : `${SITE_ORIGIN}/portfolio/${c.slug}`;
            return {
              "@type": "ListItem",
              position: i + 1,
              name: loc(c.title, "en") || c.client || c.slug,
              url,
            };
          }),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/en" },
          { label: "Portfolio" },
        ]}
        eyebrow="PORTFOLIO"
        headline={
          <>
            {portfolioHeadline.count},{" "}
            <em>{portfolioHeadline.backed}</em>
          </>
        }
        sub='Every case is a full breakdown with "before / after" and metrics. ×3.2 inquiries, $4M raised, 24 leads/mo.'
      />

      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          <div className="mb-10">
            <PortfolioFilters
              locale="en"
              industryOptions={industryOptions}
              industryCtaHrefBySlug={industryCtaHrefBySlug}
            />
          </div>

          {filtered.length > 0 ? (
            <div className={casesGridClass}>
              {filtered.map((c) => {
                const item = caseRefToCardItem(c, "en", registry);
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
              No cases match the selected filters.
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow="NEW PROJECT"
        heading={
          <>
            Want a <em>similar result</em>?
          </>
        }
        sub="Free 30-min consult. Tell us about the project — we'll come back with a price range within 24 hours."
        ctaPrimary={{
          label: "Calculate price",
          href: "/en/calculator",
        }}
        ctaSecondary={{
          label: "Or talk to us",
          href: "/en/contacts",
        }}
      />

      <LaunchCta
        locale="en"
        heading={
          <>
            Ready to <em>discuss</em> your project?
          </>
        }
        sub="Free 30-min consult. No obligation."
      />

      <HpFooter />
    </>
  );
}
