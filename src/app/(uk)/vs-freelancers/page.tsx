import type { Metadata } from "next";

import {
  VsFreelancersView,
  getVsFreelancersContent,
} from "@/components/vs-freelancers";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

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
  twitter: {
    card: "summary_large_image",
    title: CONTENT.ogTitle,
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
    { name: "Студія vs Фрілансер", path: PATH },
  ]),
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
]);

export default function VsFreelancersPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <VsFreelancersView locale="uk" />
    </>
  );
}
