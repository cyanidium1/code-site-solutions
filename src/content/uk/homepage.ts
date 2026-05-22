import type { TierProps } from "@/types/pricing";
import type { FAQItem } from "@/types/faq";
import { formatPrice } from "@/lib/formatters/price";
import { TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS } from "@/constants/pricing-tiers";

export const HOMEPAGE_TIERS: TierProps[] = [
  {
    name: TIER_NAMES.landing.uk,
    price: formatPrice(TIER_AMOUNTS.landing, { locale: "uk" }),
    weeks: TIER_WEEKS.landing.uk,
    bestFor:
      "Швидкий запуск однієї пропозиції, MVP, тестування гіпотези.",
    includes: {
      heading: "Що входить",
      items: [
        "Адаптивна верстка",
        "SEO-структура",
        "Інтеграція форм",
        "Гарантія 1 рік",
      ],
    },
    ctaLabel: "Обрати Лендінг",
  },
  {
    popular: true,
    popularLabel: "★ НАЙПОПУЛЯРНІШЕ",
    name: TIER_NAMES.corporate.uk,
    price: formatPrice(TIER_AMOUNTS.corporate, { locale: "uk" }),
    weeks: TIER_WEEKS.corporate.uk,
    bestFor:
      "Бізнесу з compliance вимогами (медицина, право, бухгалтерія), що потребує галузевих інтеграцій.",
    includes: {
      heading: "Все з Лендінгу +",
      items: [
        "CMS, блог",
        "5+ інтеграцій",
        "Локальне SEO",
        "Compliance: МОЗ / RODO / HIPAA-aware",
        "UA + RU",
      ],
    },
    ctaLabel: "Обрати Корпоративний",
  },
  {
    name: TIER_NAMES.custom.uk,
    price: formatPrice(TIER_AMOUNTS.custom, { locale: "uk" }),
    weeks: TIER_WEEKS.custom.uk,
    bestFor:
      "Складним продуктам із власною логікою — SaaS, маркетплейс, B2B-портал.",
    includes: {
      heading: "Все з Корпоративного +",
      items: [
        "Архітектурна сесія",
        "Dedicated team",
        "SLA + 24/7 support",
        "Custom integrations",
      ],
    },
    ctaLabel: "Зв'язатися",
    ctaGhost: true,
  },
];

export const HOMEPAGE_FAQ: FAQItem[] = [
  {
    q: "Скільки коштує мій сайт?",
    a: [
      "Залежить від типу. ",
      { em: TIER_NAMES.landing.uk },
      " — від ",
      { em: formatPrice(TIER_AMOUNTS.landing, { locale: "uk" }) },
      ". ",
      { em: TIER_NAMES.corporate.uk },
      " (медицина, юристи, бухгалтерія, нерухомість і т.д.) — від ",
      { em: formatPrice(TIER_AMOUNTS.corporate, { locale: "uk" }) },
      ". ",
      { em: TIER_NAMES.custom.uk },
      " з нестандартною архітектурою — від ",
      { em: formatPrice(TIER_AMOUNTS.custom, { locale: "uk" }) },
      ". Точна цифра — у ",
      { link: { href: "/calculator", text: "калькуляторі" } },
      " або після 30-хв розмови.",
    ],
  },
  {
    q: "Скільки часу від брифу до запуску?",
    a: [
      { em: TIER_NAMES.landing.uk },
      " — ",
      { em: TIER_WEEKS.landing.uk },
      ". ",
      { em: TIER_NAMES.corporate.uk },
      " — ",
      { em: TIER_WEEKS.corporate.uk },
      ". ",
      { em: TIER_NAMES.custom.uk },
      " — ",
      { em: TIER_WEEKS.custom.uk },
      ". Це з усіма правками, контентом і SEO. Без сюрпризів — фіксована дата в договорі.",
    ],
  },
  {
    q: "Що якщо мій бюджет менше за ваш мінімум?",
    a: [
      "Чесно скажемо, що не зробимо за цю ціну, і порадимо, до кого звернутися. Не беремо проєкти, які не можемо зробити якісно за вашими грошима.",
    ],
  },
  {
    q: "Що якщо я не знаю точно, що мені потрібно?",
    a: [
      "Це нормально. На безкоштовній 30-хв розмові ми задамо ",
      { em: "10-15 питань" },
      " і самі сформуємо ТЗ. Ваше завдання — описати бізнес.",
    ],
  },
  {
    q: "Я можу побачити код, перш ніж заплатити повністю?",
    a: [
      "Так. Після першого етапу (дизайн) ви отримуєте доступ до ",
      { em: "репозиторію" },
      ". Дивитеся, ставите коментарі, приймаєте рішення продовжувати.",
    ],
  },
  {
    q: "Що ви робите після запуску?",
    a: [
      "Перші ",
      { em: "2 місяці" },
      " — безкоштовні правки, моніторинг і фікси. Далі — 1 рік гарантії в ціні (баги фіксимо за 4 робочі години). Підтримка/розвиток — за фіксованою ставкою без сюрпризів.",
    ],
  },
  {
    q: "Можна почати з лендінгу і пізніше дорости до повного сайту?",
    a: [
      "Так. Архітектура, яку ми пишемо, ",
      { em: "масштабується" },
      ". Стартуєте з Лендінгу — через рік додаємо CMS, блог, додаткові індустрії — без переписування з нуля.",
    ],
  },
  {
    q: "Що якщо у мене вже є дизайнер / контент / логотип?",
    a: [
      "Тоді працюємо з вашими файлами або Figma. Це ",
      { em: "-10-15% від ціни" },
      " і коротший термін. У договорі прописуємо, що ви даєте і коли.",
    ],
  },
];
