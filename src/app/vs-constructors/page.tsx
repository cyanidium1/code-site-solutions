import type { Metadata } from "next";

import {
  VsConstructorsView,
  getVsConstructorsContent,
} from "@/components/vs-constructors";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";

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
      en: `/en${PATH}`,
      "x-default": PATH,
    },
  },
  openGraph: {
    title:
      "Конструктори ідеальні. Поки бізнес у них поміщається. — Code-Site.Art",
    description: CONTENT.metaDescription,
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_US"],
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
          name: "Головна",
          item: SITE_ORIGIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Перейти з конструктора",
          item: URL,
        },
      ],
    },
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
  ],
};

export default function VsConstructorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VsConstructorsView locale="uk" />
    </>
  );
}
