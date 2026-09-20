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

const META_TITLE = "Бесплатный расчет сайта за 24 часа | Code-Site.Art";
const META_DESCRIPTION =
  "Бесплатный расчет сайта за 24 часа: пакет, фиксированная цена и срок. Форма, Telegram, WhatsApp или email. Пн–Пт 09:00–19:00, Киев.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: "ru", uaPath: "/contacts" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "ru_UA",
    url: "/ru/contacts",
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
    q: "Как быстро вы отвечаете?",
    a: [
      "В течение ",
      { em: "24 часов" },
      " в рабочее время (Пн–Пт, 09:00–19:00 по Киеву). В ответе — пакет, фиксированная цена и срок.",
    ],
  },
  {
    q: "Что будет после заявки?",
    a: [
      "Уточним задачу там, где вам удобно: Telegram, почта или звонок. Назовем ",
      { em: "цену и срок" },
      ", которые впишем в договор. Без презентаций и без обязательств.",
    ],
  },
  {
    q: "Я не определился с пакетом — что писать в форме?",
    a: [
      "Выберите «Не знаю, нужна консультация» и опишите задачу простыми словами. Пакет подберем мы: лендинг — ",
      { em: formatPackagePrice("landing", "ru") },
      ", сайт для бизнеса — ",
      { em: formatPackagePrice("business", "ru") },
      ", интернет-магазин — ",
      { em: formatPackagePrice("shop", "ru") },
      ".",
    ],
  },
  {
    q: "Я из-за границы, вы работаете?",
    a: [
      "Да. Среди клиентов — компании из ",
      { em: "Дании, ЮАР и Албании" },
      ". Оплата через Stripe (USD/EUR), USDT или перевод на ФОП. Договор на английском или украинском — на ваш выбор.",
    ],
  },
  {
    q: "А если я хочу подписать NDA до показа кейсов?",
    a: [
      "Да, присылайте свой или наш шаблон. Стандартное ",
      { em: "NDA" },
      " подписываем за 1 рабочий день. Большинство кейсов и так публичны в портфолио.",
    ],
  },
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/ru/contacts",
    locale: "ru",
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "ContactPage",
    extra: { about: { "@id": ORG_ID } },
  }),
  breadcrumbNode([
    { name: "Главная", path: "/ru" },
    { name: "Контакты", path: "/ru/contacts" },
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

export default function RuContactsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Главная", href: "/ru" },
          { label: "Контакты" },
        ]}
        eyebrow="КОНТАКТЫ"
        headline={<>Бесплатный расчет сайта за 24 часа</>}
      />

      {/* The site-wide LeadForm (TZ §5) lives inside ContactSplit. */}
      <ContactSplit source="contacts" variant="compact" foldBrief={false} locale="ru" />

      <section className="bg-bg">
        <FAQ heading="Частые вопросы перед обращением" items={CONTACTS_FAQ} locale="ru" />
      </section>

      <HpFooter />
    </>
  );
}
