import type { Metadata } from "next";

import {
  VsFreelancersView,
  getVsFreelancersContent,
} from "@/components/vs-freelancers";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/constants/site";

const PATH = "/vs-freelancers";
const URL = pageUrl(PATH);
const CONTENT = getVsFreelancersContent("uk");

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
    title: CONTENT.ogTitle,
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
          name: "Студія vs Фрілансер",
          item: URL,
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${URL}#service`,
      name: "Розробка сайтів студією замість фрілансера",
      description: CONTENT.metaDescription,
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
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

export default function VsFreelancersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VsFreelancersView locale="uk" />
    </>
  );
}
