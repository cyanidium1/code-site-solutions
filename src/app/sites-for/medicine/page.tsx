import type { Metadata } from "next";
import { HpHeader } from "@/components/homepage/hp-header";
import "@/components/homepage/homepage.css";
import { HeroEditorial } from "@/components/blocks/hero";
import { Reasons } from "@/components/blocks/reasons";
import { Case } from "@/components/blocks/case";
import { Outcome } from "@/components/blocks/outcome";
import { Services } from "@/components/blocks/services";
import { Comparison } from "@/components/blocks/comparison";
import { Final } from "@/components/blocks/final";

export const metadata: Metadata = {
  title: "Сайти для медичних клінік — Code-Site.Art",
  description:
    "Сайти для приватних клінік, стоматологій і діагностичних центрів. Online-запис, інтеграції з МІС, локальне SEO. Кейс: клініка «Ефедра» Одеса.",
  alternates: { canonical: "/sites-for/medicine" },
  openGraph: {
    title: "Сайти для медичних клінік — Code-Site.Art",
    description:
      "Сайти для клінік, стоматологій, діагностичних центрів. Online-запис, інтеграції з МІС, локальне SEO.",
    type: "website",
    locale: "uk_UA",
    url: "/sites-for/medicine",
  },
};

const SITE_ORIGIN = "https://code-site.art";
const PAGE_URL = `${SITE_ORIGIN}/sites-for/medicine`;
const ORG_ID = `${SITE_ORIGIN}/#organization`;

const stripHtml = (s: string) =>
  s.replace(/<\/?[^>]+>/g, "").replace(/\s+/g, " ").trim();

/* FAQ items — повторюємо з src/components/blocks/final/index.tsx DEFAULT_FAQ
   щоб structured data відображав те ж саме, що рендериться у секції. */
const MEDICINE_FAQ: { q: string; a: string }[] = [
  {
    q: "Скільки часу займає запуск сайту клініки?",
    a: "Базовий сайт — 4 тижні, розширений — 6 тижнів, преміум для мережі — 8–10 тижнів. Дедлайни фіксуємо у договорі. Кожен тиждень — звіт зі скріншотами та проміжним результатом.",
  },
  {
    q: "Що робити зі старим сайтом?",
    a: "Старий сайт працює до запуску нового — без втрати трафіку. Налаштовуємо 301-редиректи зі старих URL на нові, переносимо мета-теги і Schema-розмітку, передаємо домен. Просідання в Google зазвичай немає.",
  },
  {
    q: "Хто наповнюватиме сайт контентом?",
    a: "Можемо повністю — у нас є копірайтер з медичним досвідом і фотограф (за окрему вартість). Або ви даєте тексти і фото, ми верстаємо. Або гібридно — ви даєте опис послуг, ми переписуємо під SEO і вимоги МОЗ.",
  },
  {
    q: "Які інтеграції з медичними CRM можливі?",
    a: "Працювали з Dental4Windows, Medesk, MedAI, Helsi (НСЗУ), KeyCRM, AmoCRM, Bitrix24. Якщо у вас інша CRM — підключаємо через API або Webhook. Запис із сайту падає у CRM миттєво, лікар отримує сповіщення в Telegram.",
  },
  {
    q: "Як захищені дані пацієнтів?",
    a: "Відповідність GDPR і вимогам МОЗ України: шифрування даних на льоту (HTTPS) і у спокої, IP-обмеження для адмінки, журнал доступів, регулярні бекапи. Сервери — у ЄС. Договір з вами включає DPA.",
  },
  {
    q: "Чи можна розмістити відгуки пацієнтів?",
    a: "Так, але з письмовою згодою пацієнта та без розкриття діагнозу. Підготуємо шаблон згоди разом з юристом. Альтернатива — інтеграція з Google Reviews або Doc.ua, де відгуки модерує платформа.",
  },
  {
    q: "Чи можна за законом розміщувати ціни на медичні послуги?",
    a: "Так — і з 2024 це навіть обовʼязково для приватних клінік (постанова КМУ). Ми робимо прайс структурований, з позначкою «орієнтовна вартість» і застереженням, що остаточна ціна визначається після консультації. Юрист перевіряє формулювання.",
  },
  {
    q: "Чи можна запустити рекламу медичних послуг у Google і Facebook?",
    a: "Можна, але з обмеженнями: не можна обіцяти «гарантоване зцілення», використовувати фото «до/після» в обʼявах, рекламувати рецептурні препарати. Ми готуємо посадкові сторінки, які проходять модерацію Google Ads з першого разу. Налаштування реклами — окремо, але рекомендуємо перевірених підрядників.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}#service`,
      name: "Сайти для медичних клінік",
      description:
        "Custom-coded сайти для приватних клінік, стоматологій і діагностичних центрів. Онлайн-запис, інтеграції з МІС, локальне SEO, compliance МОЗ.",
      provider: { "@id": ORG_ID },
      serviceType: "Web design and development for healthcare",
      areaServed: ["UA", "EU"],
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          "Private clinics, dental practices, diagnostic centers, cosmetology",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Medical clinic website packages",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Базовий сайт клініки",
            description:
              "До 8 сторінок, онлайн-запис, каталог лікарів і послуг, прозорий прайс, відгуки пацієнтів, базове SEO, мобільна адаптація.",
            price: "3500",
            priceCurrency: "USD",
            url: PAGE_URL,
            itemOffered: {
              "@type": "Service",
              name: "Базовий сайт клініки",
              description: "Запуск за 4 тижні",
            },
          },
          {
            "@type": "Offer",
            name: "Розширений сайт клініки",
            description:
              "Все з базового + блог і SEO-сторінки, ДМС-інтеграція, фото-кейси до/після, історія відвідувань і нагадування, онлайн-консультація, інтеграція з медичною CRM.",
            price: "6500",
            priceCurrency: "USD",
            url: PAGE_URL,
            itemOffered: {
              "@type": "Service",
              name: "Розширений сайт клініки",
              description: "Запуск за 6 тижнів",
            },
          },
          {
            "@type": "Offer",
            name: "Преміум / мережа клінік",
            description:
              "Все з розширеного + багатофіліальна структура, повна CRM-інтеграція, багатомовність, кастомні модулі під вашу спеціалізацію, SLA-підтримка.",
            price: "12000",
            priceCurrency: "USD",
            url: PAGE_URL,
            itemOffered: {
              "@type": "Service",
              name: "Преміум сайт мережі клінік",
              description: "Запуск за 8–10 тижнів",
            },
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Головна",
          item: SITE_ORIGIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Рішення",
          item: `${SITE_ORIGIN}/#solutions`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Медицина",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: MEDICINE_FAQ.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(it.a),
        },
      })),
    },
  ],
};

export default function MedicinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />
      <HeroEditorial />
      <Reasons />
      <Case />
      <Outcome />
      <Services />
      <Comparison />
      <Final />
    </>
  );
}
