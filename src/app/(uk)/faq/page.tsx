import type { Metadata } from "next";

import { FaqPage } from "@/components/faq-page";
import { JsonLd } from "@/components/shared/json-ld";
import { FAQ_PAGE_COPY, faqPageItems } from "@/content/faq-page";
import { FAQ_PATH } from "@/constants/conversion-ids";
import { buildAlternates } from "@/lib/shared/alternates";
import { OG_DEFAULT_IMAGE } from "@/constants/site";
import { buildJsonLd, breadcrumbNode, webPageNode } from "@/lib/shared/jsonld";
import { plainRich } from "@/lib/shared/rich-text";

const LOC = "uk" as const;
const COPY = FAQ_PAGE_COPY[LOC];

export const metadata: Metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
  alternates: buildAlternates({ locale: LOC, uaPath: FAQ_PATH }),
  openGraph: {
    title: COPY.metaTitle,
    description: COPY.metaDescription,
    type: "website",
    locale: "uk_UA",
    url: FAQ_PATH,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: COPY.metaTitle,
    description: COPY.metaDescription,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

/** Every question on the page goes into one FAQPage node — the hub is the
 *  one place on the site where the whole set belongs to a single URL. */
const jsonLd = buildJsonLd([
  webPageNode({
    path: FAQ_PATH,
    locale: LOC,
    title: COPY.metaTitle,
    description: COPY.metaDescription,
  }),
  breadcrumbNode([
    { name: COPY.breadcrumb.home, path: "/" },
    { name: COPY.breadcrumb.faq, path: FAQ_PATH },
  ]),
  {
    "@type": "FAQPage",
    mainEntity: faqPageItems(LOC).map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
    })),
  },
]);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <FaqPage locale={LOC} />
    </>
  );
}
