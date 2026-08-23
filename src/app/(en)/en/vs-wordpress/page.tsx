import { buildAlternates } from "@/lib/shared/alternates";
import type { Metadata } from "next";

import {
  VsWordpressView,
  getVsWordpressContent,
} from "@/components/vs-wordpress";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

const PATH = "/en/vs-wordpress";
const UK_PATH = "/vs-wordpress";
const URL = pageUrl(PATH);
const CONTENT = getVsWordpressContent("en");

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "en", uaPath: UK_PATH }),
  openGraph: {
    title: "WordPress was right in 2015. Not in 2026. — Code-Site.Art",
    description: CONTENT.metaDescription,
    type: "website",
    locale: "en_GB",
    alternateLocale: ["uk_UA"],
    url: URL,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "WordPress was right in 2015. Not in 2026. — Code-Site.Art",
    description: CONTENT.metaDescription,
    images: [OG_DEFAULT_IMAGE.url],
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
    { name: "Migrate off WordPress", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "WordPress to Next.js migration",
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

export default function VsWordpressPageEn() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <VsWordpressView locale="en" />
    </>
  );
}
