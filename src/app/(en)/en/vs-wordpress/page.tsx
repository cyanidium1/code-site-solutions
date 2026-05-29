import type { Metadata } from "next";

import {
  VsWordpressView,
  getVsWordpressContent,
} from "@/components/vs-wordpress";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";

const PATH = "/en/vs-wordpress";
const UK_PATH = "/vs-wordpress";
const URL = pageUrl(PATH);
const CONTENT = getVsWordpressContent("en");

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
    title: "WordPress was right in 2015. Not in 2026. — Code-Site.Art",
    description: CONTENT.metaDescription,
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: URL,
  },
};

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
          name: "Migrate off WordPress",
          item: URL,
        },
      ],
    },
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
  ],
};

export default function VsWordpressPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VsWordpressView locale="en" />
    </>
  );
}
