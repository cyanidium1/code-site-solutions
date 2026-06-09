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

const PATH = "/en/vs-constructors";
const UK_PATH = "/vs-constructors";
const URL = pageUrl(PATH);
const CONTENT = getVsConstructorsContent("en");

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: {
    canonical: PATH,
    languages: {
      uk: UK_PATH,
      en: PATH,
      "x-default": UK_PATH,
    },
  },
  openGraph: {
    title:
      "Site builders are great. Until your business outgrows them. — Code-Site.Art",
    description: CONTENT.metaDescription,
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Site builders are great. Until your business outgrows them. — Code-Site.Art",
    description: CONTENT.metaDescription,
  },
};

const jsonLd = buildJsonLd([
  webPageNode({
    path: PATH,
    locale: "en",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
  }),
  breadcrumbNode([
    { name: "Home", path: "/en" },
    { name: "Migrate off site builders", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Migration from site builders (Tilda, Webflow, Wix, Squarespace, Weblium) to Next.js",
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    offers: CONTENT.pricing.tiers.map((t) => ({
      "@type": "Offer",
      name: typeof t.name === "string" ? t.name : "Migration tier",
      price: t.price.replace(/[^\d]/g, ""),
      priceCurrency: "GBP",
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

export default function VsConstructorsPageEn() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <VsConstructorsView locale="en" />
    </>
  );
}
