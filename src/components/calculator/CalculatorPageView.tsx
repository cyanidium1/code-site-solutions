import type { Metadata } from "next";

import type { Locale } from "@/constants/locales";
import { LOCALE_CONFIG } from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import { OG_DEFAULT_IMAGE } from "@/constants/site";
import { HpFooter, HpHeader } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ProseSections } from "@/components/blocks/prose-section";
import { FAQ } from "@/components/blocks/final";
import { JsonLd } from "@/components/shared/json-ld";
import { buildJsonLd, breadcrumbNode, faqNode, webPageNode } from "@/lib/shared/jsonld";
import { buildAlternates } from "@/lib/shared/alternates";
import { calculatorPage } from "@/content/calculator-page";
import { PackageCalculator } from "./PackageCalculator";
import { SocialProof } from "./SocialProof";

const PATH = "/calculator";

export function calculatorMetadata(locale: Locale): Metadata {
  const c = calculatorPage(locale);
  const url = localizePath(PATH, locale);
  return {
    title: c.title,
    description: c.description,
    alternates: buildAlternates({ locale, uaPath: PATH }),
    openGraph: {
      title: c.title,
      description: c.description,
      type: "website",
      locale: LOCALE_CONFIG[locale].ogLocale,
      url,
      images: [OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: [OG_DEFAULT_IMAGE.url],
    },
  };
}

/** Shared /calculator page for every locale; routes stay thin. */
export function CalculatorPageView({ locale }: { locale: Locale }) {
  const c = calculatorPage(locale);
  const home = localizePath("/", locale);
  const url = localizePath(PATH, locale);
  const jsonLd = buildJsonLd([
    webPageNode({ path: url, locale, title: c.title, description: c.description }),
    breadcrumbNode([
      { name: c.breadcrumbHome, path: home },
      { name: c.breadcrumbSelf, path: url },
    ]),
    faqNode(c.faq),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <PageHero
        breadcrumbs={[{ label: c.breadcrumbHome, href: home }, { label: c.breadcrumbSelf }]}
        eyebrow={c.eyebrow}
        headline={
          <>
            {c.h1[0]}
            <em>{c.h1[1]}</em>
          </>
        }
        sub={c.sub}
      />
      <StatsBar items={c.stats} />
      <PackageCalculator locale={locale} />
      {c.prose.length ? <ProseSections items={c.prose} locale={locale} /> : null}
      <SocialProof />
      <section className="bg-bg">
        <FAQ heading={c.faqHeading} items={c.faq} locale={locale} />
      </section>
      <HpFooter />
    </>
  );
}
