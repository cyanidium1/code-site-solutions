import type { Metadata } from "next";

import {
  VsFreelancersView,
  getVsFreelancersContent,
} from "@/components/vs-freelancers";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";

const PATH = "/en/vs-freelancers";
const UK_PATH = "/vs-freelancers";
const URL = pageUrl(PATH);
const CONTENT = getVsFreelancersContent("en");

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
    title: CONTENT.ogTitle,
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
          name: "Studio vs Freelancer",
          item: URL,
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${URL}#service`,
      name: "Studio web development as an alternative to a freelancer",
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

export default function VsFreelancersPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VsFreelancersView locale="en" />
    </>
  );
}
