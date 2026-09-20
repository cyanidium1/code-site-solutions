import type { Metadata } from "next";

import { AdsLandingView, pickAdsLandingCases } from "@/components/ads-landing";
import { fetchCaseStudies } from "@/components/case-page/data";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { OG_DEFAULT_IMAGE, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, faqNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";
import { ADS_LANDING_RU as CONTENT } from "@/content/ru/ads-landing";

/**
 * Google Ads landing (TZ v2 §4). uk /zamovyty-sait <-> ru /ru/zakazat-sait,
 * no en version. Indexable, canonical to itself, no site menu.
 */
const PATH = "/ru/zakazat-sait";

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  robots: { index: true, follow: true },
  alternates: buildAlternates({
    locale: "ru",
    uaPath: "/zamovyty-sait",
    available: ["ru"],
    paths: { ru: "/ru/zakazat-sait" },
  }),
  openGraph: {
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    type: "website",
    locale: "ru_UA",
    url: pageUrl(PATH),
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
    { name: "Заказать сайт", path: PATH },
  ]),
  faqNode(CONTENT.faq.items),
]);

export default async function AdsLandingPage() {
  const [allCases, testimonials] = await Promise.all([
    fetchCaseStudies(),
    fetchTestimonialSlides("ru"),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <AdsLandingView
        locale="ru"
        content={CONTENT}
        source="ads-zakazat-sait"
        cases={pickAdsLandingCases(allCases)}
        testimonials={testimonials}
      />
    </>
  );
}
