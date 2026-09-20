import type { Metadata } from "next";

import { AuditPageView } from "@/components/audit/audit-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, faqNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";
import { AUDIT_RU as CONTENT } from "@/content/ru/audit";

const PATH = "/ru/audit";
const URL = pageUrl(PATH);

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "ru", uaPath: "/audit" }),
  openGraph: {
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    type: "website",
    locale: "ru_UA",
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
    locale: "ru",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
  }),
  breadcrumbNode([
    { name: CONTENT.breadcrumbHome, path: "/ru" },
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

export default function RuAuditServicePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <AuditPageView locale="ru" content={CONTENT} />
      <HpFooter />
    </>
  );
}
