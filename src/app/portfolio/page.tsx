import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter, FinalCta3 } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { fetchCaseStudies } from "@/components/case-page";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";
import {
  caseRefToCardItem,
  ukRealCasesPhrase,
} from "@/lib/shared/case-card-item";
import { loc } from "@/lib/shared/sanity-locale";
import { SITE_ORIGIN, pageUrl } from "@/constants/site";

export const metadata: Metadata = {
  title: "Портфоліо — кейси від Code-Site.Art",
  description:
    "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів. Від $1 000 до $14 000+.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Портфоліо — кейси від Code-Site.Art",
    description:
      "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів.",
    type: "website",
    locale: "uk_UA",
    url: "/portfolio",
  },
};

export const revalidate = 3600;

export default async function PortfolioPage() {
  const cases = await fetchCaseStudies();

  const PORTFOLIO_URL = pageUrl("/portfolio");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: SITE_ORIGIN },
          {
            "@type": "ListItem",
            position: 2,
            name: "Портфоліо",
            item: PORTFOLIO_URL,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${PORTFOLIO_URL}#collection`,
        url: PORTFOLIO_URL,
        name: "Портфоліо — Code-Site.Art",
        description:
          "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів.",
        inLanguage: "uk",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: cases.length,
          itemListElement: cases.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: loc(c.title, "uk") || c.client || c.slug,
            url: `${SITE_ORIGIN}/portfolio/${c.slug}`,
          })),
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
          { label: "Головна", href: "/" },
          { label: "Портфоліо" },
        ]}
        eyebrow="/ PORTFOLIO"
        headline={
          <>
            {cases.length} {ukRealCasesPhrase(cases.length)} з{" "}
            <em>реальними метриками</em>
          </>
        }
        sub="Кожен кейс — повний розбір з «до/після», цифрами і скриншотами."
      />

      <section className="hp-section">
        <div className="hp-inner">
          {cases.length > 0 ? (
            <div className={casesGridClass}>
              {cases.map((c) => {
                const item = caseRefToCardItem(c, "uk");
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
            <p className="py-[60px] text-center font-mono text-[var(--ink-3)]">
              Кейси завантажуються…
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

      <FinalCta3
        eyebrow="/ GET IN TOUCH"
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
