import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import { AUDIT_RU as CONTENT } from "@/content/ru/audit";

const IMPL_OFFER_NAME = "Внедрение правок по отчёту (час)";
const PATH = "/ru/audit";
const URL = pageUrl(PATH);

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "ru", uaPath: "/audit" }),
  openGraph: {
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    type: "website",
    locale: "ru_UA",
    url: URL,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

const jsonLd = buildJsonLd([
  webPageNode({
    path: PATH,
    locale: "ru",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
  }),
  breadcrumbNode([
    { name: "Главная", path: "/ru" },
    { name: "Аудит сайта", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Аудит сайта и бизнеса",
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    // Offers mirror the product cards on the page, so a price change in the
    // content file cannot drift away from the structured data.
    offers: [
      ...(CONTENT.offers?.tiers ?? []).map((t) => ({
        "@type": "Offer",
        name: String(t.name),
        price: t.price.replace(/[^\d]/g, ""),
        priceCurrency: "USD",
        url: URL,
      })),
      {
        "@type": "Offer",
        name: IMPL_OFFER_NAME,
        price: "40",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: CONTENT.faq.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function RuAuditServicePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="ru" content={CONTENT} source="audit-page" />
      <HpFooter />
    </>
  );
}
