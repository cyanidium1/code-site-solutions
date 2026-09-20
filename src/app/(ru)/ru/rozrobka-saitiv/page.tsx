import type { Metadata } from "next";

import { MoneyPageView } from "@/components/money-page";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE, ORG_ID, pageUrl } from "@/constants/site";
import { packageOffers } from "@/lib/shared/city-page";
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
    // One Offer per core package, prices from the pricing config.
    offers: packageOffers("ru", URL),
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
      <MoneyPageView locale="ru" content={CONTENT} source="web-development-page" />
      <HpFooter />
    </>
  );
}
