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
import { buildAlternates } from "@/lib/shared/alternates";

const META_TITLE = "ᐈ Начать проект | Контакты веб-студии Code-Site.Art";
const META_DESCRIPTION =
  "➤ Бесплатная консультация за 24 часа ✔️ Без длинных брифов ✔️ 30-мин стратегический звонок ✔️ Фиксированная цена ➡ Telegram, email или звонок — отвечаем быстро.";

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
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
};

const CONTACTS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Как быстро вы отвечаете?",
    a: [
      "Telegram: в течение 30 минут (в рабочее время). Email: 1-2 рабочих часа. Форма брифа: 4 рабочих часа.",
    ],
  },
  {
    q: "Что происходит на 30-минутном звонке?",
    a: [
      "Вы рассказываете о проекте. Мы задаём 5-7 уточняющих вопросов. Даём ",
      { em: "вилку цены" },
      " и срок. Итого: 30 минут. Без навязывания.",
    ],
  },
  {
    q: "Я не определился с пакетом — что писать в форме?",
    a: [
      "Пишите «",
      { em: "пока не знаю" },
      "». На звонке зададим важные вопросы и порекомендуем пакет. Лендинг / Корпоративный сайт / Кастомная платформа — это наша задача, не ваша.",
    ],
  },
  {
    q: "Я за границей — работаете с международными клиентами?",
    a: [
      "Да. Половина нашей работы — за пределами Украины, активны в ",
      { em: "UA, EU, US, DK" },
      ". Оплата через Stripe (USD/EUR), USDT или банковский перевод. Договор на английском или украинском — на ваш выбор.",
    ],
  },
  {
    q: "Что если я хочу подписать NDA до того, как вы покажете кейсы?",
    a: [
      "Стандартная практика. У нас есть одностраничный шаблон ",
      { em: "NDA" },
      ", подписывается через Дія.Підпис или DocuSign за 1 рабочий день. Большинство клиентов не просят — кейсы публичны в портфолио.",
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
        headline={
          <>
            Хотите обсудить свой <em>проект</em>?
          </>
        }
        sub="Ответ в Telegram за 30 минут — или отправьте подробный бриф, как вам удобнее."
      />

      <ContactSplit source="contacts" variant="compact" locale="ru" />

      <section className="bg-bg">
        <FAQ
          heading="Частые вопросы перед обращением"
          items={CONTACTS_FAQ}
          locale="ru"
        />
      </section>

      <HpFooter />
    </>
  );
}
