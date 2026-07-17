import type { TierProps } from "@/types/pricing";
import type { FAQItem } from "@/types/faq";
import { formatPrice } from "@/lib/shared/format-price";
import {
  TIER_AMOUNTS,
  TIER_NAMES,
  TIER_WEEKS,
  type HomepagePlanInfo,
  type TierKey,
} from "@/constants/pricing-tiers";

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
        "Багатомовність",
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

/**
 * Build the homepage FAQ. Pass an `override` map (typically derived from CMS
 * pricingPlan docs) to substitute plan name/price/weeks per tier; missing
 * keys fall back to the static constants in `pricing-tiers.ts`.
 */
export function buildHomepageFaq(
  override?: Partial<Record<TierKey, HomepagePlanInfo>>,
): FAQItem[] {
  const get = (key: TierKey): HomepagePlanInfo =>
    override?.[key] ?? {
      name: TIER_NAMES[key].uk,
      priceFrom: TIER_AMOUNTS[key],
      weeks: TIER_WEEKS[key].uk,
    };
  const fmt = (n: number) => formatPrice(n, { locale: "uk" });
  const L = get("landing");
  const C = get("corporate");
  const X = get("custom");

  return [
  {
    q: "Скільки коштуватиме мій сайт?",
    a: [
      "Від ",
      { em: fmt(L.priceFrom) },
      " за лендінг до ",
      { em: `${fmt(X.priceFrom)}+` },
      " за платформу. Точну цифру назвемо після короткої розмови й зафіксуємо в договорі до старту. Швидка оцінка — у ",
      { link: { href: "/calculator", text: "калькуляторі" } },
      ".",
    ],
  },
  {
    q: "Що як я не знаю точно, що мені потрібно?",
    a: [
      "Це нормально — і це наша робота. Ви розповідаєте про бізнес; ми пропонуємо рішення й пояснюємо, на що не варто витрачати гроші.",
    ],
  },
  {
    q: "Чи можу я побачити код до повної оплати?",
    a: [
      "Так. Код, доступи й сайт — ваші від самого початку. Дивіться будь-коли.",
    ],
  },
  {
    q: "Що як щось зламається після запуску?",
    a: [
      "Рік підтримки включено. Відповідь — до 4 годин. Виправляємо проблеми й допомагаємо рости.",
    ],
  },
  {
    q: "Що як ви зірвете термін?",
    a: [
      "Ми платимо неустойку. Тому вкластися в дедлайн нам важливо так само, як і вам.",
    ],
  },
  // Збережені з попереднього FAQ — їх немає в лендинг-документі 2026-07.
  {
    q: "Скільки часу від брифу до запуску?",
    a: [
      { em: L.name },
      " — ",
      { em: L.weeks },
      ". ",
      { em: C.name },
      " — ",
      { em: C.weeks },
      ". ",
      { em: X.name },
      " — ",
      { em: X.weeks },
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
}

/** Back-compat constant export: equivalent to `buildHomepageFaq()`. */
export const HOMEPAGE_FAQ: FAQItem[] = buildHomepageFaq();
