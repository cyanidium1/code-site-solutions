import type { Metadata } from "next";

import { LandingPageView } from "@/components/landing-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";
import { WEB_DEVELOPMENT_RU as CONTENT } from "@/content/ru/web-development";

const PATH = "/ru/rozrobka-saitiv";
const URL = pageUrl(PATH);

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  alternates: buildAlternates({ locale: "ru", uaPath: "/rozrobka-saitiv" }),
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
    { name: "Разработка сайтов", path: PATH },
  ]),
  {
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "Разработка сайтов под ключ",
    description: CONTENT.metaDescription,
    provider: { "@id": ORG_ID },
    areaServed: ["UA", "EU", "US", "DK"],
    // Із цього Google будує ціновий сніпет — у видачі за «розробка сайтів»
    // діапазон показують ifish.com.ua і webnauts.pro, обидва вище нас.
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: 800,
      highPrice: 6000,
      offerCount: 3,
      url: URL,
    },
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

export default function WebDevelopmentPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />
      <LandingPageView locale="ru" content={CONTENT} source="web-development-page" />
      <HpFooter />
    </>
  );
}
