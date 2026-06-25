import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { ContactSplit } from "@/components/blocks/contact-split";
import { FAQ } from "@/components/blocks/final";
import { HpHeader, HpFooter } from "@/components/homepage";
import { ORG_ID } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich, type RichText } from "@/lib/shared/rich-text";

export const metadata: Metadata = {
  title: "ᐈ Start a Project | Contact Code-Site.Art Web Studio",
  description:
    "➤ Get a free consultation in 24 hours ✔️ No lengthy briefs ✔️ 30-min strategy call ✔️ Fixed price quote ➡ Email, WhatsApp or book a call — we reply fast.",
  alternates: {
    canonical: "/en/contacts",
    languages: {
      uk: "/contacts",
      "en-GB": "/en/contacts",
      "x-default": "/contacts",
    },
  },
  openGraph: {
    title: "ᐈ Start a Project | Contact Code-Site.Art Web Studio",
    description:
      "➤ Get a free consultation in 24 hours ✔️ No lengthy briefs ✔️ 30-min strategy call ✔️ Fixed price quote ➡ Email, WhatsApp or book a call — we reply fast.",
    type: "website",
    locale: "en_GB",
    url: "/en/contacts",
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Start a Project | Contact Code-Site.Art Web Studio",
    description:
      "➤ Get a free consultation in 24 hours ✔️ No lengthy briefs ✔️ 30-min strategy call ✔️ Fixed price quote ➡ Email, WhatsApp or book a call — we reply fast.",
  },
};

const CONTACTS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "How fast do you reply?",
    a: [
      "WhatsApp: within 30 minutes (business hours). Email: 1-2 business hours. Brief form: 4 business hours.",
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
      ".\" We'll ask the questions that matter on the call and recommend a tier. Starter / Industry Pro / Pro Plus / Enterprise is our call, not yours.",
    ],
  },
  {
    q: "I'm abroad — do you work with international clients?",
    a: [
      "Yes. Half our work is outside Ukraine, active across ",
      { em: "UA, EU, US, DK" },
      ". Payments via Stripe (USD/EUR), USDT, or bank transfer. Contract in English or Ukrainian, your choice.",
    ],
  },
  {
    q: "What if I want to sign an NDA before you show cases?",
    a: [
      "Standard. We have a one-page ",
      { em: "NDA" },
      " template, signable via Diia.Sign or DocuSign in 1 business day. Most clients don't ask, since cases are public in the portfolio.",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/en/contacts",
    locale: "en",
    title: "ᐈ Start a Project | Contact Code-Site.Art Web Studio",
    description:
      "➤ Get a free consultation in 24 hours ✔️ No lengthy briefs ✔️ 30-min strategy call ✔️ Fixed price quote ➡ Email, WhatsApp or book a call — we reply fast.",
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
        headline={
          <>
            Want to discuss your <em>project</em>?
          </>
        }
        sub="WhatsApp chat within 30 minutes, or send a detailed brief, whichever suits you."
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
