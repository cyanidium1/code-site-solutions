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

const META_TITLE = "Безкоштовний прорахунок за 24 години | Code-Site.Art";
const META_DESCRIPTION =
  "Безкоштовний прорахунок сайту за 24 години: пакет, фіксована ціна і строк. Форма, Telegram, WhatsApp або email. Пн–Пт 09:00–19:00, Київ.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: "uk", uaPath: "/contacts" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "uk_UA",
    url: "/contacts",
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
    q: "Як швидко ви відповідаєте?",
    a: [
      "Протягом ",
      { em: "24 годин" },
      " у робочий час (Пн–Пт, 09:00–19:00 за Києвом). У відповіді — пакет, фіксована ціна і строк.",
    ],
  },
  {
    q: "Що буде після заявки?",
    a: [
      "Уточнимо задачу там, де вам зручно: Telegram, пошта або дзвінок. Назвемо ",
      { em: "ціну і строк" },
      ", які впишемо в договір. Без презентацій і без зобов'язань.",
    ],
  },
  {
    q: "Я не визначився з пакетом — що писати у формі?",
    a: [
      "Оберіть «Не знаю, потрібна консультація» і опишіть задачу простими словами. Пакет підберемо ми: лендінг — ",
      { em: formatPackagePrice("landing", "uk") },
      ", сайт для бізнесу — ",
      { em: formatPackagePrice("business", "uk") },
      ", інтернет-магазин — ",
      { em: formatPackagePrice("shop", "uk") },
      ".",
    ],
  },
  {
    q: "Я з-за кордону, ви працюєте?",
    a: [
      "Так. Серед клієнтів — компанії з ",
      { em: "Данії, ПАР і Албанії" },
      ". Оплата через Stripe (USD/EUR), USDT або переказ на ФОП. Договір англійською або українською — на ваш вибір.",
    ],
  },
  {
    q: "А якщо я хочу підписати NDA до показу кейсів?",
    a: [
      "Так, надсилайте свій або наш шаблон. Стандартне ",
      { em: "NDA" },
      " підписуємо за 1 робочий день. Більшість кейсів і так публічні в портфоліо.",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/contacts",
    locale: "uk",
    title: META_TITLE,
    description: META_DESCRIPTION,
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
        eyebrow="КОНТАКТИ"
        headline={<>Безкоштовний прорахунок сайту за 24 години</>}
      />

      {/* The site-wide LeadForm (TZ §5) lives inside ContactSplit. */}
      <ContactSplit source="contacts" variant="compact" foldBrief={false} locale="uk" />

      <section className="bg-bg">
        <FAQ heading="Часто запитують перед заявкою" items={CONTACTS_FAQ} locale="uk" />
      </section>

      <HpFooter />
    </>
  );
}
