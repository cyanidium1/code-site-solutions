import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { ContactSplit } from "@/components/blocks/contact-split";
import { FAQ } from "@/components/blocks/final";
import { HpHeader, HpFooter } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { SITE_ORIGIN, ORG_ID, pageUrl } from "@/lib/site";
import { plainRich, type RichText } from "@/lib/rich-text";

const UK_PATH = "/contacts";
const EN_PATH = "/en/contacts";
const CONTACTS_URL = pageUrl(EN_PATH);

export const metadata: Metadata = {
  title: "Contact us — talk in Telegram or send a brief | Code-Site.Art",
  description:
    "Telegram replies in 30 minutes. Detailed brief — reply in 4 business hours. No bots — Fedir himself writes.",
  alternates: {
    canonical: EN_PATH,
    languages: { uk: UK_PATH, en: EN_PATH, "x-default": UK_PATH },
  },
  openGraph: {
    title: "Contact us — talk in Telegram or send a brief | Code-Site.Art",
    description:
      "Telegram replies in 30 minutes. Detailed brief — reply in 4 business hours. No bots — Fedir himself writes.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: EN_PATH,
  },
};

const CONTACTS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "How fast do you reply?",
    a: [
      "Telegram — within 30 minutes (business hours). Email — 1-2 business hours. Brief form — 4 business hours.",
    ],
  },
  {
    q: "What happens on the 30-min call?",
    a: [
      "You tell us about the project. We ask 5-7 clarifying questions. We give you a price range and timeline. Total: 30 minutes. No pitching.",
    ],
  },
  {
    q: "I haven't decided on a tier — what do I write in the form?",
    a: [
      "Write “I don't know yet.” We'll ask the questions that matter on the call and recommend a tier.",
    ],
  },
  {
    q: "I'm abroad — do you work with international clients?",
    a: [
      "Yes. Half our work is outside Ukraine. We work in your timezone for daily comms.",
    ],
  },
  {
    q: "What if I want to sign an NDA before you show cases?",
    a: [
      "Standard. We have a one-page NDA template, signable via Diia.Sign or DocuSign. Email us — we'll send it.",
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${CONTACTS_URL}#contactpage`,
      url: CONTACTS_URL,
      name: "Contact — Code-Site.Art",
      about: { "@id": ORG_ID },
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

export default function ContactsPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/en" }, { label: "Contact" }]}
        eyebrow="/ CONTACT"
        headline={
          <>
            Want to discuss your <em>project</em>?
          </>
        }
        sub="Telegram chat within 30 minutes, or send a detailed brief — whichever suits you."
      />

      <ContactSplit source="contacts" variant="compact" locale="en" />

      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Common questions before inquiring" items={CONTACTS_FAQ} />
      </section>

      <HpFooter />
    </>
  );
}
