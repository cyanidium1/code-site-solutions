import type { Metadata } from "next";

import {
  VsConstructorsView,
  getVsConstructorsContent,
} from "@/components/vs-constructors";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

const PATH = "/vs-constructors";
const URL = pageUrl(PATH);
const CONTENT = getVsConstructorsContent("uk");

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: {
    canonical: PATH,
    languages: {
      uk: PATH,
      "en-GB": `/en${PATH}`,
      "x-default": PATH,
    },
  },
  openGraph: {
    title:
      "Конструктори ідеальні. Поки бізнес у них поміщається. — Code-Site.Art",
    description: CONTENT.metaDescription,
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_GB"],
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Конструктори ідеальні. Поки бізнес у них поміщається. — Code-Site.Art",
    description: CONTENT.metaDescription,
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
    { name: "Перейти з конструктора", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Міграція з конструктора (Tilda, Webflow, Wix, Squarespace, Weblium) на Next.js",
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

export default function VsConstructorsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <VsConstructorsView locale="uk" />
    </>
  );
}
