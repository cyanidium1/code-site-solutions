import type { Metadata } from "next";

import {
  VsWordpressView,
  getVsWordpressContent,
} from "@/components/vs-wordpress";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

const PATH = "/vs-wordpress";
const URL = pageUrl(PATH);
const CONTENT = getVsWordpressContent("uk");

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: {
    canonical: PATH,
    languages: {
      uk: PATH,
      en: `/en${PATH}`,
      "x-default": PATH,
    },
  },
  openGraph: {
    title: "WordPress був правий у 2015. Не у 2026. — Code-Site.Art",
    description: CONTENT.metaDescription,
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_US"],
    url: URL,
  },
};

const jsonLd = buildJsonLd([
  webPageNode({
    path: PATH,
    locale: "uk",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
  }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Перейти з WordPress", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Міграція з WordPress на Next.js",
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    offers: CONTENT.pricing.tiers.map((t) => ({
      "@type": "Offer",
      name: typeof t.name === "string" ? t.name : "Migration tier",
      price: t.price.replace(/[^\d]/g, ""),
      priceCurrency: "USD",
      url: URL,
    })),
  },
  {
    "@type": "FAQPage",
    mainEntity: CONTENT.faq.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  },
]);

export default function VsWordpressPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <VsWordpressView locale="uk" />
    </>
  );
}
