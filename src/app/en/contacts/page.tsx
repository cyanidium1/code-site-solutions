import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { ContactSplit } from "@/components/blocks/contact-split";
import { FAQ } from "@/components/blocks/final";
import { HpHeader, HpFooter } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { SITE_ORIGIN, ORG_ID, pageUrl } from "@/constants/site";
import { plainRich, type RichText } from "@/lib/shared/rich-text";

export const metadata: Metadata = {
  title: "Contact us — talk in Telegram or send a brief | Code-Site.Art",
  description:
    "Telegram replies in 30 minutes. Detailed brief — reply in 4 business hours. No bots — Fedir himself writes.",
  alternates: {
    canonical: "/en/contacts",
    languages: {
      uk: "/contacts",
      en: "/en/contacts",
      "x-default": "/contacts",
    },
  },
  openGraph: {
    title: "Contact us — talk in Telegram or send a brief | Code-Site.Art",
    description:
      "Telegram replies in 30 minutes. Detailed brief — reply in 4 business hours.",
    type: "website",
    locale: "en_US",
    url: "/en/contacts",
  },
};

const CONTACTS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "How fast do you reply?",
    a: [
      "Telegram (",
      { em: "@fedirdev" },
      "): within 30 minutes (business hours). Email — 1-2 business hours. Brief form — 4 business hours.",
    ],
  },
  {
    q: "What happens on the 30-min call?",
    a: [
      "You tell us about the project. We ask 5-7 clarifying questions. We give you a ",
      { em: "price range" },
      " and timeline. Total: 30 minutes. No pitching.",
    ],
  },
  {
    q: "I haven't decided on a tier — what do I write in the form?",
    a: [
      "Write \"",
      { em: "I don't know yet" },
      ".\" We'll ask the questions that matter on the call and recommend a tier — Starter / Industry Pro / Pro Plus / Enterprise is our call, not yours.",
    ],
  },
  {
    q: "I'm abroad — do you work with international clients?",
    a: [
      "Yes. Half our work is outside Ukraine — active across ",
      { em: "UA, EU, US, DK" },
      ". Payments via Stripe (USD/EUR), USDT, or bank transfer. Contract in English or Ukrainian — your choice.",
    ],
  },
  {
    q: "What if I want to sign an NDA before you show cases?",
    a: [
      "Standard. We have a one-page ",
      { em: "NDA" },
      " template, signable via Diia.Sign or DocuSign in 1 business day. Most clients don't ask — cases are public in the portfolio.",
    ],
  },
];

const CONTACTS_URL = pageUrl("/en/contacts");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${CONTACTS_URL}#contactpage`,
      url: CONTACTS_URL,
      name: "Contact us — Code-Site.Art",
      about: { "@id": ORG_ID },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_ORIGIN}/en`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: CONTACTS_URL,
        },
      ],
    },
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
  ],
};

export default function EnContactsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/en" },
          { label: "Contact" },
        ]}
        eyebrow="CONTACT"
        headline={
          <>
            Want to discuss your <em>project</em>?
          </>
        }
        sub="Telegram chat within 30 minutes, or send a detailed brief — whichever suits you."
      />

      <ContactSplit source="contacts" variant="compact" locale="en" />

      <section className="bg-bg">
        <FAQ
          heading="Common questions before inquiring"
          items={CONTACTS_FAQ}
          locale="en"
        />
      </section>

      <HpFooter />
    </>
  );
}
