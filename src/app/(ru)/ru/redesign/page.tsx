import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import { REDESIGN_RU as CONTENT } from "@/content/ru/redesign";

const PATH = "/ru/redesign";
const URL = pageUrl(PATH);

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "ru", uaPath: "/redesign" }),
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
    { name: "Главная", path: "/ru" },
    { name: "Редизайн сайта", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Редизайн сайта с сохранением SEO",
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    offers: [
      {
        "@type": "Offer",
        name: "Редизайн лендинга",
        price: "800",
        priceCurrency: "USD",
        url: URL,
      },
      {
        "@type": "Offer",
        name: "Редизайн многостраничного сайта",
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

export default function RuRedesignServicePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="ru" content={CONTENT} source="redesign-page" />
      <HpFooter />
    </>
  );
}
