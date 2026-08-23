import { buildAlternates } from "@/lib/shared/alternates";
import type { Metadata } from "next";

import {
  VsFreelancersView,
  getVsFreelancersContent,
} from "@/components/vs-freelancers";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";

const PATH = "/en/vs-freelancers";
const UK_PATH = "/vs-freelancers";
const URL = pageUrl(PATH);
const CONTENT = getVsFreelancersContent("en");

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "en", uaPath: UK_PATH }),
  openGraph: {
    title: CONTENT.ogTitle,
    description: CONTENT.metaDescription,
    type: "website",
    locale: "en_GB",
    alternateLocale: ["uk_UA"],
    url: URL,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.ogTitle,
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
    { name: "Studio vs Freelancer", path: PATH },
  ]),
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
]);

export default function VsFreelancersPageEn() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <VsFreelancersView locale="en" />
    </>
  );
}
