import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import { REDESIGN_UK as CONTENT } from "@/content/uk/redesign";

const PATH = "/redesign";
const URL = pageUrl(PATH);

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "uk", uaPath: PATH }),
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
    { name: "Головна", path: "/" },
    { name: "Редизайн сайту", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Редизайн сайту зі збереженням SEO",
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    offers: [
      {
        "@type": "Offer",
        name: "Редизайн лендінгу",
        price: "800",
        priceCurrency: "USD",
        url: URL,
      },
      {
        "@type": "Offer",
        name: "Редизайн багатосторінкового сайту",
        price: "2500",
        priceCurrency: "USD",
        url: URL,
      },
    ],
  },
  {
    "@type": "FAQPage",
    mainEntity: CONTENT.faq.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function RedesignServicePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="uk" content={CONTENT} source="redesign-page" />
      <HpFooter />
    </>
  );
}
