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
 * Config-driven lines shared by the uk city pages. The city copy stays
 * hand-written per city (anti-doorway); only prices, terms and the offer
 * come from here so a price change never needs five edits.
 */
const L = "uk" as const;

export const CITY_MIN_PRICE_UK = formatPrice(packagePrice("landing", L), { locale: L, withPrefix: true });
export const CITY_MIN_DAYS_UK = PACKAGES.landing.days.min;

/** `metaTitle` ≤ 60 chars: "Розробка сайтів у Києві — від $600, строк від 3 днів". */
export function cityMetaTitleUk(inCity: string): string {
  return `Розробка сайтів ${inCity} — ${CITY_MIN_PRICE_UK}, строк від ${CITY_MIN_DAYS_UK} днів`;
}

/** H1 `[plain, em]` with product + price + term (TZ v2 §6). */
export function cityHeadlineUk(inCity: string): [string, string] {
  return [`Розробка сайтів ${inCity} — `, `${CITY_MIN_PRICE_UK}, строк від ${CITY_MIN_DAYS_UK} днів`];
}

/** One-sentence offer used at the end of hero subs and descriptions. */
export const CITY_OFFER_UK =
  `Лендінг — ${formatPackagePrice("landing", L)}, сайт для бізнесу — ${formatPackagePrice("business", L)} ` +
  `за ${formatPackageTerm("business", L)}, магазин — ${formatPackagePrice("shop", L)}. Ціна фіксується в договорі.`;

export function cityMetaDescriptionUk(inCity: string, proof: string): string {
  return (
    `Сайт ${inCity} під ключ: лендінг ${formatPackagePrice("landing", L)}, сайт для бізнесу ` +
    `${formatPackagePrice("business", L)} за ${PACKAGES.business.days.min} днів. ${proof}`
  );
}

export const CITY_PRICE_ANSWER_UK: MoneyPageContent["faq"]["items"][number]["a"] = [
  "Лендінг — ",
  { em: formatPackagePrice("landing", L) },
  `, сайт для бізнесу — ${formatPackagePrice("business", L)}, інтернет-магазин — ${formatPackagePrice("shop", L)}, ` +
    `галузеве рішення — ${formatPackagePrice("industry", L)}. Ціна однакова для всіх міст і фіксується в договорі. ` +
    "Повний прайс і додатки — ",
  { link: { href: "/pricing", text: "на сторінці цін" } },
  ".",
];

export const CITY_TERM_ANSWER_UK: MoneyPageContent["faq"]["items"][number]["a"] = [
  `Лендінг — ${formatPackageTerm("landing", L)}, сайт для бізнесу — ${formatPackageTerm("business", L)}, ` +
    `магазин — ${formatPackageTerm("shop", L)}. Строк рахується від брифу і передоплати та прописується в договорі. ` +
    "Що відбувається по днях — у блоці процесу вище.",
];

export const CITY_AUDIT_FOOT_UK =
  `Якщо сайт уже є і незрозуміло, чому він не працює, — почніть із безкоштовного аудиту: відповідь за ${SERVICES.auditResponseHours} години.`;

export const CITY_RELATED_UK: NonNullable<MoneyPageContent["related"]> = {
  heading: "Перед замовленням",
  links: [
    { label: "Ціни і додатки", href: "/pricing" },
    { label: "Калькулятор вартості", href: "/calculator" },
    { label: "Безкоштовний аудит сайту", href: "/audit" },
    { label: "Розробка сайтів під ключ", href: "/rozrobka-saitiv" },
  ],
};

/** Add-on prices quoted inside the city FAQ answers. */
export const CITY_LANG_ADDON_UK = formatAddonPrice("lang", L);
export const CITY_PAGE_ADDON_UK = formatAddonPrice("extra_page", L);
export const CITY_COPY_ADDON_UK = formatAddonPrice("copy_pro", L);
