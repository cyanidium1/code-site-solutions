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
  title: "Контакти — обговоримо ваш проєкт | Code-Site.Art",
  description:
    "Безкоштовна 30-хв консультація. Telegram, WhatsApp, дзвінок або форма брифу. Відповідаємо за 30 хв – 2 години.",
  alternates: {
    canonical: "/contacts",
    languages: {
      uk: "/contacts",
      en: "/en/contacts",
      "x-default": "/contacts",
    },
  },
  openGraph: {
    title: "Контакти — обговоримо ваш проєкт | Code-Site.Art",
    description:
      "Безкоштовна 30-хв консультація. Telegram, WhatsApp або форма брифу.",
    type: "website",
    locale: "uk_UA",
    url: "/contacts",
  },
};

const CONTACTS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Як швидко ви відповідаєте?",
    a: [
      "Telegram (",
      { em: "@fedirdev" },
      "): 30 хв в робочий час, до 2-4 годин у вихідні. Email (hi@code-site.art): 1-2 робочі години. Calendly: бронюєте слот напряму.",
    ],
  },
  {
    q: "Що буде на 30-хв дзвінку?",
    a: [
      "Слухаємо вашу задачу 15-20 хв. Показуємо 1-2 релевантні кейси. Озвучуємо ",
      { em: "вилку ціни" },
      " і термін. Без презентацій і pitch-deck — просто розмова.",
    ],
  },
  {
    q: "Я не визначився з тиром — що писати у формі?",
    a: [
      "Поставте «",
      { em: "Не визначився" },
      "» і опишіть задачу простими словами. На дзвінку розберемось — Starter / Business / Industry Pro / Enterprise підбираємо ми, не клієнт.",
    ],
  },
  {
    q: "Я з-за кордону, ви працюєте?",
    a: [
      "Так. Активно працюємо з ",
      { em: "UA, EU, US, DK" },
      ". Платежі через Stripe (USD/EUR), USDT, або bank transfer на ФОП. Договір англійською або українською — на ваш вибір.",
    ],
  },
  {
    q: "А якщо я хочу підписати NDA до показу кейсів?",
    a: [
      "Так, надсилайте свій або наш шаблон. Стандартне ",
      { em: "NDA" },
      " підписуємо за 1 робочий день. Більшість клієнтів NDA не підписують — кейси публічні в портфоліо.",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/contacts",
    locale: "uk",
    title: "Контакти — Code-Site.Art",
    description:
      "Безкоштовна 30-хв консультація. Telegram, WhatsApp, дзвінок або форма брифу. Відповідаємо за 30 хв – 2 години.",
    type: "ContactPage",
    extra: { about: { "@id": ORG_ID } },
  }),
  breadcrumbNode([
    { name: "Головна", path: "/" },
    { name: "Контакти", path: "/contacts" },
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

export default function ContactsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Контакти" },
        ]}
        eyebrow="/ CONTACTS"
        headline={
          <>
            Обговоримо ваш <em>проєкт</em>?
          </>
        }
        sub="Telegram-чат за 30 хвилин або детальний бриф — як вам зручніше."
      />

      <ContactSplit source="contacts" variant="compact" />

      <section className="bg-bg">
        <FAQ heading="Часто запитують перед заявкою" items={CONTACTS_FAQ} />
      </section>

      <HpFooter />
    </>
  );
}
