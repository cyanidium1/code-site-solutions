import type { Metadata } from "next";

import { AuditPageView } from "@/components/audit/audit-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, faqNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";
import { AUDIT_UK as CONTENT } from "@/content/uk/audit";

const PATH = "/audit";
const URL = pageUrl(PATH);

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "uk", uaPath: "/audit" }),
  openGraph: {
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    type: "website",
    locale: "uk_UA",
    url: URL,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    images: [OG_DEFAULT_IMAGE.url],
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
    { name: CONTENT.breadcrumbHome, path: "/" },
    { name: CONTENT.breadcrumbSelf, path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: CONTENT.breadcrumbSelf,
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: URL,
    },
  },
  faqNode(CONTENT.faq.items),
]);

export default function AuditServicePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <AuditPageView locale="uk" content={CONTENT} />
      <HpFooter />
    </>
  );
}
