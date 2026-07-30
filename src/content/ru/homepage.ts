import {
  Building,
  Calculator,
  Car,
  GraduationCap,
  Home,
  Scale,
  ShoppingCart,
  Stethoscope,
} from "lucide-react";

import type { TierProps } from "@/types/pricing";
import type { FAQItem } from "@/types/faq";
import type { Industry } from "@/types/homepage";
import { formatPrice } from "@/lib/shared/format-price";
import {
  TIER_AMOUNTS,
  TIER_NAMES,
  TIER_WEEKS,
  type HomepagePlanInfo,
  type TierKey,
} from "@/constants/pricing-tiers";

export const RU_TIERS: TierProps[] = [
  {
    name: TIER_NAMES.landing.ru,
    price: formatPrice(TIER_AMOUNTS.landing, { locale: "ru" }),
    weeks: TIER_WEEKS.landing.ru,
    bestFor: "Быстрый запуск одного предложения, MVP, тестирование гипотезы.",
    includes: {
      heading: "Что входит",
      items: [
        "Адаптивная вёрстка",
        "SEO-структура",
        "Интеграция форм",
        "Гарантия 1 год",
      ],
    },
    ctaLabel: "Выбрать Лендинг",
  },
  {
    popular: true,
    popularLabel: "★ САМОЕ ПОПУЛЯРНОЕ",
    name: TIER_NAMES.corporate.ru,
    price: formatPrice(TIER_AMOUNTS.corporate, { locale: "ru" }),
    weeks: TIER_WEEKS.corporate.ru,
    bestFor:
      "Бизнесу с compliance-требованиями (медицина, право, бухгалтерия), которому нужны отраслевые интеграции.",
    includes: {
      heading: "Всё из Лендинга +",
      items: [
        "CMS, блог",
        "5+ интеграций",
        "Локальное SEO",
        "Compliance: МОЗ / RODO / HIPAA-aware",
        "Многоязычность",
      ],
    },
    ctaLabel: "Выбрать Корпоративный",
  },
  {
    name: TIER_NAMES.custom.ru,
    price: formatPrice(TIER_AMOUNTS.custom, { locale: "ru" }),
    weeks: TIER_WEEKS.custom.ru,
    bestFor:
      "Сложным продуктам с собственной логикой — SaaS, маркетплейс, B2B-портал.",
    includes: {
      heading: "Всё из Корпоративного +",
      items: [
        "Архитектурная сессия",
        "Dedicated team",
        "SLA + 24/7 support",
        "Custom integrations",
      ],
    },
    ctaLabel: "Связаться",
    ctaGhost: true,
  },
];

/**
 * Build the RU homepage FAQ. Pass an `override` map (typically derived from
 * CMS pricingPlan docs) to substitute plan name/price/weeks per tier; missing
 * keys fall back to the static constants in `pricing-tiers.ts`.
 */
export function buildRuHomepageFaq(
  override?: Partial<Record<TierKey, HomepagePlanInfo>>,
): FAQItem[] {
  const get = (key: TierKey): HomepagePlanInfo =>
    override?.[key] ?? {
      name: TIER_NAMES[key].ru,
      priceFrom: TIER_AMOUNTS[key],
      weeks: TIER_WEEKS[key].ru,
    };
  const fmt = (n: number) => formatPrice(n, { locale: "ru" });
  const L = get("landing");
  const C = get("corporate");
  const X = get("custom");

  return [
    {
      q: "Сколько будет стоить мой сайт?",
      a: [
        "От ",
        { em: fmt(L.priceFrom) },
        " за лендинг до ",
        { em: `${fmt(X.priceFrom)}+` },
        " за платформу. Точную цифру назовём после короткого разговора и зафиксируем в договоре до старта. Быстрая оценка — ",
        { link: { href: "/ru/contacts", text: "оставьте заявку" } },
        ".",
      ],
    },
    {
      q: "Что если я не знаю точно, что мне нужно?",
      a: [
        "Это нормально — и это наша работа. Вы рассказываете о бизнесе; мы предлагаем решение и объясняем, на что не стоит тратить деньги.",
      ],
    },
    {
      q: "Могу ли я увидеть код до полной оплаты?",
      a: [
        "Да. Код, доступы и сайт — ваши с самого начала. Смотрите в любой момент.",
      ],
    },
    {
      q: "Что если что-то сломается после запуска?",
      a: [
        "Год поддержки включён. Ответ — до 4 часов. Исправляем проблемы и помогаем расти.",
      ],
    },
    {
      q: "Что если вы сорвёте срок?",
      a: [
        "Мы платим неустойку. Поэтому уложиться в дедлайн нам важно так же, как и вам.",
      ],
    },
    {
      q: "Сколько времени от брифа до запуска?",
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
        ". Это со всеми правками, контентом и SEO. Без сюрпризов — фиксированная дата в договоре.",
      ],
    },
    {
      q: "Что если мой бюджет меньше вашего минимума?",
      a: [
        "Честно скажем, что не сделаем за эту цену, и посоветуем, к кому обратиться. Не берём проекты, которые не можем сделать качественно за ваши деньги.",
      ],
    },
    {
      q: "Можно начать с лендинга и позже дорасти до полного сайта?",
      a: [
        "Да. Архитектура, которую мы пишем, ",
        { em: "масштабируется" },
        ". Стартуете с Лендинга — через год добавляем CMS, блог, дополнительные индустрии — без переписывания с нуля.",
      ],
    },
    {
      q: "Что если у меня уже есть дизайнер / контент / логотип?",
      a: [
        "Тогда работаем с вашими файлами или Figma. Это ",
        { em: "-10-15% от цены" },
        " и более короткий срок. В договоре прописываем, что вы даёте и когда.",
      ],
    },
  ];
}

/**
 * Homepage industry cards. Hrefs point at the UA industry pages until the
 * CMS gets ru content (title.ru) — then flip to /ru/sites-for/<slug>.
 * TODO(ru-translation): switch hrefs once industry docs carry ru.
 */
export const RU_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    title: "Медицина",
    description: "Сайты для клиник, стоматологий, диагностических центров",
    tags: ["МИС", "GDPR", "Онлайн-запись"],
    price: "От $3 500 · 4–10 недель",
    href: "/sites-for/medicine",
  },
  {
    icon: Building,
    title: "Строительство / ремонт",
    description: "Сайты для строительных и ремонтных компаний",
    tags: ["CRM", "Калькулятор", "Локальное SEO"],
    price: "От $3 500 · 4–8 недель",
    href: "/sites-for/renovation",
  },
  {
    icon: Scale,
    title: "Юристы и адвокаты",
    description: "Сайты для юридических фирм, адвокатских бюро, частных практик",
    tags: ["Clio", "DocuSign", "Онлайн-консультации"],
    price: "От $3 500 · 4–8 недель",
    href: "/sites-for/legal",
  },
  {
    icon: Calculator,
    title: "Финансы и бухгалтерия",
    description: "Сайты для бухгалтерских фирм, финансовых советников, трейдинга",
    tags: ["Xero", "Stripe", "1С"],
    price: "От $3 500 · 4–8 недель",
    href: "/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Интернет-магазины, маркетплейсы, B2B-каталоги",
    tags: ["Stripe", "LiqPay", "Нова пошта"],
    price: "От $3 000 · 6–10 недель",
    href: "/sites-for/ecommerce",
  },
  {
    icon: Car,
    title: "Авто-индустрия",
    description: "Сайты для автоимпортёров, автосалонов, СТО и автосервисов",
    tags: ["Аукционы", "PDF-счёт", "Мультиязычность"],
    price: "От $3 000 · 6–10 недель",
    href: "/sites-for/auto",
  },
  {
    icon: Home,
    title: "Недвижимость",
    description: "Сайты для агентств недвижимости, застройщиков, частных объявлений",
    tags: ["Каталог", "Карта", "Ипотека"],
    price: "От $3 500 · 4–8 недель",
    href: "/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    title: "Курсы и лендинги",
    description: "Сайты для онлайн-школ, курсов, продуктовых лендингов",
    tags: ["LMS", "Оплата", "Вебинары"],
    price: "От $1 500 · 1–4 недели",
    href: "/sites-for/courses",
  },
];
