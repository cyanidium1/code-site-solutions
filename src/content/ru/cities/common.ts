import {
  PACKAGES,
  SERVICES,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import type { MoneyPageContent } from "@/types/money-page";

/**
 * Config-driven lines shared by the ru city pages (twin of
 * `src/content/uk/cities/common.ts`). City copy stays hand-written per city.
 */
const L = "ru" as const;

export const CITY_MIN_PRICE_RU = formatPrice(packagePrice("landing", L), { locale: L, withPrefix: true });
export const CITY_MIN_DAYS_RU = PACKAGES.landing.days.min;

/** `metaTitle` ≤ 60 chars: "Разработка сайтов в Киеве — от $600, срок от 3 дней". */
export function cityMetaTitleRu(inCity: string): string {
  return `Разработка сайтов ${inCity} — ${CITY_MIN_PRICE_RU}, срок от ${CITY_MIN_DAYS_RU} дней`;
}

export function cityHeadlineRu(inCity: string): [string, string] {
  return [`Разработка сайтов ${inCity} — `, `${CITY_MIN_PRICE_RU}, срок от ${CITY_MIN_DAYS_RU} дней`];
}

export const CITY_OFFER_RU =
  `Лендинг — ${formatPackagePrice("landing", L)}, сайт для бизнеса — ${formatPackagePrice("business", L)} ` +
  `за ${formatPackageTerm("business", L)}, магазин — ${formatPackagePrice("shop", L)}. Цена фиксируется в договоре.`;

export function cityMetaDescriptionRu(inCity: string, proof: string): string {
  return (
    `Сайт ${inCity} под ключ: лендинг ${formatPackagePrice("landing", L)}, сайт для бизнеса ` +
    `${formatPackagePrice("business", L)} за ${PACKAGES.business.days.min} дней. ${proof}`
  );
}

export const CITY_PRICE_ANSWER_RU: MoneyPageContent["faq"]["items"][number]["a"] = [
  "Лендинг — ",
  { em: formatPackagePrice("landing", L) },
  `, сайт для бизнеса — ${formatPackagePrice("business", L)}, интернет-магазин — ${formatPackagePrice("shop", L)}, ` +
    `отраслевое решение — ${formatPackagePrice("industry", L)}. Цена одинакова для всех городов и фиксируется в договоре. ` +
    "Полный прайс и дополнения — ",
  { link: { href: "/ru/pricing", text: "на странице цен" } },
  ".",
];

export const CITY_TERM_ANSWER_RU: MoneyPageContent["faq"]["items"][number]["a"] = [
  `Лендинг — ${formatPackageTerm("landing", L)}, сайт для бизнеса — ${formatPackageTerm("business", L)}, ` +
    `магазин — ${formatPackageTerm("shop", L)}. Срок считается от брифа и предоплаты и прописывается в договоре. ` +
    "Что происходит по дням — в блоке процесса выше.",
];

export const CITY_AUDIT_FOOT_RU =
  `Если сайт уже есть и непонятно, почему он не работает, — начните с бесплатного аудита: ответ за ${SERVICES.auditResponseHours} часа.`;

export const CITY_RELATED_RU: NonNullable<MoneyPageContent["related"]> = {
  heading: "Перед заказом",
  links: [
    { label: "Сколько стоит сделать сайт", href: "/ru/pricing" },
    { label: "Калькулятор стоимости", href: "/ru/calculator" },
    { label: "Бесплатный аудит сайта", href: "/ru/audit" },
    { label: "Разработка сайтов под ключ", href: "/ru/rozrobka-saitiv" },
  ],
};

/** Add-on prices quoted inside the city FAQ answers. */
export const CITY_LANG_ADDON_RU = formatAddonPrice("lang", L);
export const CITY_PAGE_ADDON_RU = formatAddonPrice("extra_page", L);
export const CITY_COPY_ADDON_RU = formatAddonPrice("copy_pro", L);
