/**
 * /pricing view shared by uk, ru and en (TZ v2 §3.2). The three routes stay
 * thin: they pass a locale and a `PricingCopy` from `src/content/{locale}/pricing`.
 * Every price comes from `@/constants/pricing` — copy files interpolate helpers,
 * this file renders the config-driven blocks from `@/components/blocks/packages`.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { Locale } from "@/constants/locales";
import {
  ALL_PACKAGES,
  PACKAGES,
  packagePrice,
} from "@/constants/pricing";
import { LOCALE_CURRENCY } from "@/lib/shared/format-price";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  faqNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { buildAlternates } from "@/lib/shared/alternates";
import { renderRich, type RichText } from "@/lib/shared/rich-text";
import type { FAQItem } from "@/types/faq";
import type { ProseSection } from "@/types/prose";

import { JsonLd } from "@/components/shared/json-ld";
import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { ProseSections } from "@/components/blocks/prose-section";
import { FAQ } from "@/components/blocks/final";
import { CmpTable, CmpThead, CmpTh, CmpTd } from "@/components/blocks/comparison";
import {
  AddonsTable,
  IndustryPricesTable,
  LEAD_FORM_ANCHOR,
  LeadFormSection,
  PackageCards,
  PackagesSection,
  PackagesTable,
  PaymentTerms,
  UspLine,
} from "@/components/blocks/packages";
import { btnClass, cn } from "@/components/ui";

type Head = { title: ReactNode; sub?: ReactNode };

export type PricingCopy = {
  /** Route path: "/pricing", "/ru/pricing", "/en/pricing". */
  path: string;
  ogLocale: string;
  title: string;
  description: string;
  crumbs: { home: string; homeHref: string; self: string };
  eyebrow: string;
  /** `[plain, em]` — rendered as `{plain} <em>{em}</em>`. */
  h1: [string, string];
  heroSub: string;
  heroActions: { primary: string; secondary: string };
  /** One-line CTA repeated under every block, linking to #lead-form. */
  cta: { line: string; button: string };
  cards: Head;
  packages: Head;
  industries: Head;
  addons: Head;
  services: Head & {
    rows: { name: string; price: string; note: RichText }[];
  };
  payment: Head;
  compare: Head & {
    headers: [string, string, string, string];
    rows: { param: string; ours: string; wp: string; builder: string }[];
    foot: string;
  };
  faqTitle: string;
  faq: FAQItem[];
  prose: ProseSection[];
  schema: { serviceName: string; serviceDescription: string; catalogName: string };
};

export function pricingMetadata(locale: Locale, copy: PricingCopy): Metadata {
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildAlternates({ locale, uaPath: "/pricing" }),
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "website",
      locale: copy.ogLocale,
      url: copy.path,
      images: [OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [OG_DEFAULT_IMAGE.url],
    },
  };
}

/** WebPage + breadcrumbs + Service with one Offer per package + FAQPage. */
function pricingJsonLd(locale: Locale, copy: PricingCopy) {
  const url = pageUrl(copy.path);
  const currency = LOCALE_CURRENCY[locale];
  const prices = ALL_PACKAGES.map((id) => packagePrice(id, locale));
  return buildJsonLd([
    webPageNode({ path: copy.path, locale, title: copy.title, description: copy.description }),
    breadcrumbNode([
      { name: copy.crumbs.home, path: copy.crumbs.homeHref },
      { name: copy.crumbs.self, path: copy.path },
    ]),
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: copy.schema.serviceName,
      description: copy.schema.serviceDescription,
      provider: { "@id": ORG_ID },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: currency,
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: prices.length,
        url,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: copy.schema.catalogName,
        itemListElement: ALL_PACKAGES.map((id) => ({
          "@type": "Offer",
          name: PACKAGES[id].name[locale],
          price: packagePrice(id, locale),
          priceCurrency: currency,
          url,
          ...(PACKAGES[id].fromPrice
            ? {
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: packagePrice(id, locale),
                  priceCurrency: currency,
                },
              }
            : {}),
        })),
      },
    },
    faqNode(copy.faq),
  ]);
}

/** Short line + button to the form, repeated after each block (TZ §3.2). */
function CtaLine({ copy }: { copy: PricingCopy }) {
  return (
    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
      <a href={`#${LEAD_FORM_ANCHOR}`} className={btnClass("ghost")}>
        {copy.cta.button}
      </a>
      <p className="m-0 font-sans text-[14px] leading-[1.5] text-ink-3">{copy.cta.line}</p>
    </div>
  );
}

function ServicesList({ copy }: { copy: PricingCopy }) {
  const s = copy.services;
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <dl className="m-0">
        {s.rows.map((row) => (
          <div
            key={row.name}
            className="grid gap-1 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[1.1fr_0.9fr_2fr] md:gap-5 md:px-5"
          >
            <dt className="font-sans text-[14.5px] font-semibold text-ink">{row.name}</dt>
            <dd className="m-0 font-sans text-[14.5px] text-ink tabular-nums">{row.price}</dd>
            <dd className="m-0 font-sans text-[14px] leading-[1.55] text-ink-dim">
              {renderRich(row.note)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CompareTable({ copy }: { copy: PricingCopy }) {
  const c = copy.compare;
  const [param, ours, wp, builder] = c.headers;
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line">
        <CmpTable>
          <CmpThead>
            <tr>
              <CmpTh>{param}</CmpTh>
              <CmpTh good>{ours}</CmpTh>
              <CmpTh>{wp}</CmpTh>
              <CmpTh>{builder}</CmpTh>
            </tr>
          </CmpThead>
          <tbody>
            {c.rows.map((row) => (
              <tr key={row.param}>
                <CmpTd kind="param">{row.param}</CmpTd>
                <CmpTd kind="good" data-label={ours}>
                  {row.ours}
                </CmpTd>
                <CmpTd kind="bad" data-label={wp}>
                  {row.wp}
                </CmpTd>
                <CmpTd kind="bad" data-label={builder}>
                  {row.builder}
                </CmpTd>
              </tr>
            ))}
          </tbody>
        </CmpTable>
      </div>
      <p className="mt-4 mb-0 font-sans text-[12.5px] leading-[1.6] text-ink-3">{c.foot}</p>
    </>
  );
}

export function PricingView({ locale, copy }: { locale: Locale; copy: PricingCopy }) {
  const source = "pricing";
  return (
    <>
      <JsonLd data={pricingJsonLd(locale, copy)} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: copy.crumbs.home, href: copy.crumbs.homeHref },
          { label: copy.crumbs.self },
        ]}
        eyebrow={copy.eyebrow}
        headline={
          <>
            {copy.h1[0]} <em>{copy.h1[1]}</em>
          </>
        }
        sub={copy.heroSub}
        actions={{
          primary: { label: copy.heroActions.primary, href: `#${LEAD_FORM_ANCHOR}` },
          secondary: { label: copy.heroActions.secondary, href: "#packages-table" },
        }}
      />

      <PackagesSection title={copy.cards.title} sub={copy.cards.sub}>
        <UspLine locale={locale} className="mb-6" />
        <PackageCards locale={locale} source={`${source}-card`} />
      </PackagesSection>

      <PackagesSection id="packages-table" title={copy.packages.title} sub={copy.packages.sub}>
        <PackagesTable locale={locale} />
        <CtaLine copy={copy} />
      </PackagesSection>

      <PackagesSection title={copy.industries.title} sub={copy.industries.sub}>
        <IndustryPricesTable locale={locale} />
        <CtaLine copy={copy} />
      </PackagesSection>

      <PackagesSection title={copy.addons.title} sub={copy.addons.sub}>
        <AddonsTable locale={locale} />
        <CtaLine copy={copy} />
      </PackagesSection>


      <PackagesSection title={copy.services.title} sub={copy.services.sub}>
        <ServicesList copy={copy} />
        <CtaLine copy={copy} />
      </PackagesSection>

      <PackagesSection title={copy.payment.title} sub={copy.payment.sub}>
        <PaymentTerms locale={locale} className="max-w-[760px]" />
        <CtaLine copy={copy} />
      </PackagesSection>

      <PackagesSection title={copy.compare.title} sub={copy.compare.sub}>
        <CompareTable copy={copy} />
        <CtaLine copy={copy} />
      </PackagesSection>

      <ProseSections items={copy.prose} locale={locale} />

      <section className={cn("bg-bg")}>
        <FAQ heading={copy.faqTitle} items={copy.faq} locale={locale} />
      </section>

      {/* One form per page: the lead form has fixed inner ids. */}
      <LeadFormSection locale={locale} source={source} />

      <HpFooter />
    </>
  );
}
