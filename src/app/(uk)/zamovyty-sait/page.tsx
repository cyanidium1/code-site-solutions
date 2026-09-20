import type { Metadata } from "next";

import { AdsLandingView, pickAdsLandingCases } from "@/components/ads-landing";
import { fetchCaseStudies } from "@/components/case-page/data";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { OG_DEFAULT_IMAGE, pageUrl } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, faqNode, webPageNode } from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/shared/alternates";
import { ADS_LANDING_UK as CONTENT } from "@/content/uk/ads-landing";

/**
 * Google Ads landing (TZ v2 §4). uk /zamovyty-sait <-> ru /ru/zakazat-sait,
 * no en version. Indexable, canonical to itself, no site menu.
 */
const PATH = "/zamovyty-sait";

export const metadata: Metadata = {
  title: CONTENT.metaTitle,
  description: CONTENT.metaDescription,
  robots: { index: true, follow: true },
  alternates: buildAlternates({
    locale: "uk",
    uaPath: "/zamovyty-sait",
    available: ["ru"],
    paths: { ru: "/ru/zakazat-sait" },
  }),
  openGraph: {
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
    type: "website",
    locale: "uk_UA",
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
    locale: "uk",
    title: CONTENT.metaTitle,
    description: CONTENT.metaDescription,
  }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Замовити сайт", path: PATH },
  ]),
  faqNode(CONTENT.faq.items),
]);

export default async function AdsLandingPage() {
  const [allCases, testimonials] = await Promise.all([
    fetchCaseStudies(),
    fetchTestimonialSlides("uk"),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <AdsLandingView
        locale="uk"
        content={CONTENT}
        source="ads-zamovyty-sait"
        cases={pickAdsLandingCases(allCases)}
        testimonials={testimonials}
      />
    </>
  );
}
