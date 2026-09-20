import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { ContactSplit } from "@/components/blocks/contact-split";
import { FAQ } from "@/components/blocks/final";
import { HpHeader, HpFooter } from "@/components/homepage";
import { formatPackagePrice } from "@/constants/pricing";
import { OG_DEFAULT_IMAGE, ORG_ID } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich, type RichText } from "@/lib/shared/rich-text";
import { buildAlternates } from "@/lib/shared/alternates";

const META_TITLE = "Contact us — free quote within 24 hours | Code-Site.Art";
const META_DESCRIPTION =
  "A free website quote within 24 hours: package, fixed price and timeline. Use the form, Telegram, WhatsApp or email. Mon–Fri 09:00–19:00 EET.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: "en", uaPath: "/contacts" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "en_GB",
    url: "/en/contacts",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

const CONTACTS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "How fast do you reply?",
    a: [
      "Within ",
      { em: "24 hours" },
      " on business days (Mon–Fri, 09:00–19:00 EET). The reply includes the package, a fixed price and the timeline.",
    ],
  },
  {
    q: "What happens after I send the form?",
    a: [
      "We clarify the task wherever suits you: Telegram, email or a call. Then we name ",
      { em: "the price and the timeline" },
      " that go into the contract. No sales decks, no obligation.",
    ],
  },
  {
    q: "I haven't picked a package. What do I write?",
    a: [
      "Choose “Not sure — I need advice” and describe the task in plain words. We pick the package: a landing page is ",
      { em: formatPackagePrice("landing", "en") },
      ", a business website ",
      { em: formatPackagePrice("business", "en") },
      ", an online store ",
      { em: formatPackagePrice("shop", "en") },
      ".",
    ],
  },
  {
    q: "I'm outside Ukraine. Do you work with me?",
    a: [
      "Yes. Clients include companies in ",
      { em: "Denmark, South Africa and Albania" },
      ". Prices in EUR. Invoices in EUR, USD or GBP on request. Contract in English.",
    ],
  },
  {
    q: "Can we sign an NDA before you show cases?",
    a: [
      "Yes, send yours or use our template. A standard ",
      { em: "NDA" },
      " is signed within 1 business day. Most of our cases are public in the portfolio anyway.",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/en/contacts",
    locale: "en",
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "ContactPage",
    extra: { about: { "@id": ORG_ID } },
  }),
  breadcrumbNode([
    { name: "Home", path: "/en" },
    { name: "Contact", path: "/en/contacts" },
  ]),
  {
    "@type": "FAQPage",
    mainEntity: CONTACTS_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: plainRich(it.a),
      },
    })),
  },
]);

export default function EnContactsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/en" },
          { label: "Contact" },
        ]}
        eyebrow="CONTACT"
        headline={<>Free website quote within 24 hours</>}
      />

      {/* The site-wide LeadForm (TZ §5) lives inside ContactSplit. */}
      <ContactSplit source="contacts" variant="compact" foldBrief={false} locale="en" />

      <section className="bg-bg">
        <FAQ heading="Before you get in touch" items={CONTACTS_FAQ} locale="en" />
      </section>

      <HpFooter />
    </>
  );
}
