import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter, FinalCta3 } from "@/components/homepage";
import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import {
  caseRefToCardItem,
  enCasesNoun,
} from "@/lib/shared/case-card-item";
import { loc } from "@/lib/shared/sanity-locale";
import { hasEnCase } from "@/constants/i18n-routes";
import { SITE_ORIGIN, pageUrl } from "@/constants/site";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

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

export default async function EnPortfolioPage() {
  const cases = await fetchCaseStudies();

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
          numberOfItems: cases.length,
          itemListElement: cases.map((c, i) => {
            const url = hasEnCase(c.slug)
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
            {cases.length} real {enCasesNoun(cases.length)}. The{" "}
            <em>numbers are real</em>.
          </>
        }
        sub='Every case is a full breakdown with "before / after" and metrics. ×3.2 inquiries, $4M raised, 24 leads/mo.'
      />

      <section className={hpSectionClass}>
        <div className={hpInnerClass}>
          {cases.length > 0 ? (
            <div className={casesGridClass}>
              {cases.map((c) => {
                const item = caseRefToCardItem(c, "en");
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
              Cases loading…
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

      <FinalCta3
        eyebrow="GET IN TOUCH"
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
