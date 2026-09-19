/**
 * Single source of truth for every price, term and package composition on
 * the site (TZ v2, Sept 2026): packages, add-ons, out-of-package services,
 * payment terms. Pages, the calculator, FAQ builders, meta titles and
 * JSON-LD all read from here — never type a price into copy by hand.
 *
 * Amounts in the tables are the UA market (USD, uk + ru). The EN locale is a
 * separate international market in EUR with its own list (INTL below).
 * Read amounts only through the helpers (`packagePrice`, `addonPrice`, …),
 * never from the tables directly.
 */

import type { Locale } from "@/constants/locales";
import { formatPrice, FROM_LABEL } from "@/lib/shared/format-price";

type L = Record<Locale, string>;
type LL = Record<Locale, string[]>;

/* ------------------------------------------------------------------ */
/* Packages                                                            */
/* ------------------------------------------------------------------ */

export type PackageId = "landing" | "business" | "shop" | "industry" | "custom";
export type IndustryId =
  | "medicine"
  | "legal"
  | "finance"
  | "renovation"
  | "auto"
  | "real-estate";

/** Working days. `max` > `min` only for packages sold with a range. */
export type DayRange = { min: number; max: number };

export type PackageDef = {
  id: PackageId;
  name: L;
  /** UA market, USD. For `industry` and `custom` this is the floor ("від"). */
  price: number;
  /** Only `industry` and `custom` are sold "від"; everything else is fixed. */
  fromPrice: boolean;
  /** Custom quotes top out here; drives the "$4 000–…" range copy. */
  days: DayRange;
  /** Custom is sold in weeks; everything else in working days. */
  weeks?: DayRange;
  popular?: boolean;
  includes: LL;
  excludes: LL;
  /** Page that sells this package on its own. */
  href: string;
};

export const PACKAGES: Record<PackageId, PackageDef> = {
  landing: {
    id: "landing",
    name: { uk: "Лендінг", ru: "Лендинг", en: "Landing page" },
    price: 600,
    fromPrice: false,
    days: { min: 3, max: 3 },
    href: "/landing",
    includes: {
      uk: [
        "1 сторінка-лонгрід",
        "Адаптив під телефон і планшет",
        "Форма + заявки в Telegram",
        "Базове SEO",
        "Тексти на основі вашого брифу",
        "Хостинг і SSL на рік",
        "Гарантія рік",
        "Код ваш",
      ],
      ru: [
        "1 страница-лонгрид",
        "Адаптив под телефон и планшет",
        "Форма + заявки в Telegram",
        "Базовое SEO",
        "Тексты на основе вашего брифа",
        "Хостинг и SSL на год",
        "Гарантия год",
        "Код ваш",
      ],
      en: [
        "One long-form page",
        "Works on phone and tablet",
        "Contact form with Telegram alerts",
        "Basic SEO",
        "Copy written from your brief",
        "Hosting and SSL for a year",
        "One-year warranty",
        "You own the code",
      ],
    },
    excludes: {
      uk: ["CMS", "Багатомовність", "Блог"],
      ru: ["CMS", "Мультиязычность", "Блог"],
      en: ["CMS", "Multiple languages", "Blog"],
    },
  },
  business: {
    id: "business",
    name: { uk: "Сайт для бізнесу", ru: "Сайт для бизнеса", en: "Business website" },
    price: 1000,
    fromPrice: false,
    days: { min: 7, max: 7 },
    popular: true,
    href: "/corporate-site",
    includes: {
      uk: [
        "До 5 сторінок",
        "Sanity CMS — редагуєте самі, навіть з телефона",
        "Форми + заявки в Telegram",
        "SEO-структура",
        "Тексти на основі брифу",
        "Google Analytics + Search Console",
        "Хостинг і SSL на рік",
        "Гарантія рік",
        "Код ваш",
      ],
      ru: [
        "До 5 страниц",
        "Sanity CMS — редактируете сами, даже с телефона",
        "Формы + заявки в Telegram",
        "SEO-структура",
        "Тексты на основе брифа",
        "Google Analytics + Search Console",
        "Хостинг и SSL на год",
        "Гарантия год",
        "Код ваш",
      ],
      en: [
        "Up to 5 pages",
        "Sanity CMS — edit it yourself, even from your phone",
        "Forms with Telegram alerts",
        "SEO-ready structure",
        "Copy written from your brief",
        "Google Analytics + Search Console",
        "Hosting and SSL for a year",
        "One-year warranty",
        "You own the code",
      ],
    },
    excludes: {
      uk: ["Інтернет-магазин", "Інтеграції з CRM і сервісами — див. додатки"],
      ru: ["Интернет-магазин", "Интеграции с CRM и сервисами — см. дополнения"],
      en: ["Online shop", "CRM and service integrations — see add-ons"],
    },
  },
  shop: {
    id: "shop",
    name: { uk: "Інтернет-магазин", ru: "Интернет-магазин", en: "Online shop" },
    price: 1500,
    fromPrice: false,
    days: { min: 14, max: 14 },
    href: "/online-store",
    includes: {
      uk: [
        "Каталог до 100 товарів",
        "Картки з варіантами",
        "Кошик і замовлення за 2 кліки",
        "Оплата LiqPay або Monobank",
        "Нова Пошта",
        "Адмінка Sanity",
        "SEO категорій",
        "Сповіщення про замовлення в Telegram",
        "Хостинг і SSL на рік",
        "Гарантія рік",
        "0 підписок і комісій",
      ],
      ru: [
        "Каталог до 100 товаров",
        "Карточки с вариантами",
        "Корзина и заказ в 2 клика",
        "Оплата LiqPay или Monobank",
        "Новая Почта",
        "Админка Sanity",
        "SEO категорий",
        "Уведомления о заказах в Telegram",
        "Хостинг и SSL на год",
        "Гарантия год",
        "0 подписок и комиссий",
      ],
      en: [
        "Catalogue of up to 100 products",
        "Product cards with variants",
        "Basket and two-click checkout",
        "Online card payments",
        "Delivery integration",
        "Sanity admin panel",
        "Category SEO",
        "Order alerts in Telegram",
        "Hosting and SSL for a year",
        "One-year warranty",
        "No subscriptions, no commission",
      ],
    },
    excludes: {
      uk: ["Понад 100 товарів — див. додатки", "Фіди для маркетплейсів", "Складський облік"],
      ru: ["Больше 100 товаров — см. дополнения", "Фиды для маркетплейсов", "Складской учёт"],
      en: ["Over 100 products — see add-ons", "Marketplace feeds", "Stock management"],
    },
  },
  industry: {
    id: "industry",
    name: { uk: "Галузеве рішення", ru: "Отраслевое решение", en: "Industry solution" },
    price: 1800,
    fromPrice: true,
    days: { min: 14, max: 21 },
    href: "/sites-for/medicine",
    includes: {
      uk: [
        "Усе з пакета «Сайт для бізнесу»",
        "Галузева інтеграція: Helsi / Medesk, MEDoc / BAS, Diia.Sign, Copart, онлайн-запис або калькулятор",
        "Compliance: вимоги МОЗ, GDPR",
      ],
      ru: [
        "Всё из пакета «Сайт для бизнеса»",
        "Отраслевая интеграция: Helsi / Medesk, MEDoc / BAS, Diia.Sign, Copart, онлайн-запись или калькулятор",
        "Compliance: требования МОЗ, GDPR",
      ],
      en: [
        "Everything in the Business website package",
        "An industry integration: booking systems, accounting software, e-signature, auction feeds or a calculator",
        "Compliance: GDPR and sector rules",
      ],
    },
    excludes: { uk: [], ru: [], en: [] },
  },
  custom: {
    id: "custom",
    name: { uk: "Custom / платформа", ru: "Custom / платформа", en: "Custom platform" },
    price: 4000,
    fromPrice: true,
    days: { min: 30, max: 30 },
    weeks: { min: 6, max: 6 },
    href: "/contacts",
    includes: {
      uk: [
        "Архітектурна сесія",
        "Без ліміту сторінок",
        "Особисті кабінети",
        "Інтеграції під ваші системи",
      ],
      ru: [
        "Архитектурная сессия",
        "Без лимита страниц",
        "Личные кабинеты",
        "Интеграции под ваши системы",
      ],
      en: [
        "Architecture session",
        "No page limit",
        "User accounts",
        "Integrations with your systems",
      ],
    },
    excludes: {
      uk: ["Контент-продакшн", "Брендинг"],
      ru: ["Контент-продакшн", "Брендинг"],
      en: ["Content production", "Branding"],
    },
  },
};

/** Order the three headline packages appear in on cards. */
export const CORE_PACKAGES = ["landing", "business", "shop"] as const satisfies readonly PackageId[];
export const ALL_PACKAGES = ["landing", "business", "shop", "industry", "custom"] as const satisfies readonly PackageId[];

/* ------------------------------------------------------------------ */
/* Industry variants of the `industry` package                         */
/* ------------------------------------------------------------------ */

export type IndustryDef = {
  id: IndustryId;
  name: L;
  /** "для [галузі]" form used in H1s. */
  forName: L;
  price: number;
  /** What the industry integration is, for H1 / cards. */
  integration: L;
};

export const INDUSTRIES: Record<IndustryId, IndustryDef> = {
  medicine: {
    id: "medicine",
    name: { uk: "Медицина", ru: "Медицина", en: "Medical" },
    forName: { uk: "клініки", ru: "клиники", en: "clinics" },
    price: 1800,
    integration: { uk: "Helsi / Medesk", ru: "Helsi / Medesk", en: "online booking" },
  },
  legal: {
    id: "legal",
    name: { uk: "Юристи", ru: "Юристы", en: "Legal" },
    forName: { uk: "юристів", ru: "юристов", en: "law firms" },
    price: 1800,
    integration: { uk: "Diia.Sign", ru: "Diia.Sign", en: "e-signature" },
  },
  finance: {
    id: "finance",
    name: { uk: "Фінанси і бухгалтерія", ru: "Финансы и бухгалтерия", en: "Finance & accounting" },
    forName: { uk: "бухгалтерів", ru: "бухгалтеров", en: "accountants" },
    price: 1800,
    integration: { uk: "MEDoc / BAS", ru: "MEDoc / BAS", en: "accounting software" },
  },
  renovation: {
    id: "renovation",
    name: { uk: "Будівництво і ремонт", ru: "Строительство и ремонт", en: "Construction & renovation" },
    forName: { uk: "будівельної компанії", ru: "строительной компании", en: "builders" },
    price: 1800,
    integration: { uk: "калькулятором кошторису", ru: "калькулятором сметы", en: "a quote calculator" },
  },
  auto: {
    id: "auto",
    name: { uk: "Авто", ru: "Авто", en: "Automotive" },
    forName: { uk: "авто-бізнесу", ru: "авто-бизнеса", en: "car dealers" },
    price: 2000,
    integration: { uk: "Copart", ru: "Copart", en: "auction feeds" },
  },
  "real-estate": {
    id: "real-estate",
    name: { uk: "Нерухомість", ru: "Недвижимость", en: "Real estate" },
    forName: { uk: "агентства нерухомості", ru: "агентства недвижимости", en: "estate agents" },
    price: 2200,
    integration: { uk: "каталогом об'єктів", ru: "каталогом объектов", en: "a property catalogue" },
  },
};

export const INDUSTRY_ORDER: IndustryId[] = [
  "medicine",
  "renovation",
  "legal",
  "finance",
  "auto",
  "real-estate",
];

/* ------------------------------------------------------------------ */
/* Add-ons                                                             */
/* ------------------------------------------------------------------ */

export type AddonId =
  | "extra_page"
  | "lang"
  | "blog"
  | "cases"
  | "crm"
  | "booking"
  | "payments"
  | "sku_500"
  | "sku_1000"
  | "filters"
  | "copy_pro"
  | "photo_stock"
  | "rush"
  | "migration"
  | "ads_setup";

export type AddonDef = {
  id: AddonId;
  name: L;
  /** USD. For `rush` this is a percent of the package price, not dollars. */
  price: number;
  kind: "flat" | "perUnit" | "percentOfPackage";
  /** Unit label for per-unit add-ons ("/ стор.", "за мову"). */
  unit?: L;
  /** Max quantity for per-unit add-ons in the calculator. */
  maxQty?: number;
  /** Mutually exclusive with these add-ons. */
  excludes?: AddonId[];
};

export const ADDONS: Record<AddonId, AddonDef> = {
  extra_page: {
    id: "extra_page",
    name: { uk: "Додаткова сторінка", ru: "Дополнительная страница", en: "Extra page" },
    price: 150,
    kind: "perUnit",
    unit: { uk: "за сторінку", ru: "за страницу", en: "per page" },
    maxQty: 20,
  },
  lang: {
    id: "lang",
    name: { uk: "Друга мова (ru або en)", ru: "Второй язык (uk или en)", en: "Another language" },
    price: 200,
    kind: "perUnit",
    unit: { uk: "за мову", ru: "за язык", en: "per language" },
    maxQty: 2,
  },
  blog: {
    id: "blog",
    name: { uk: "Блог / новини з CMS", ru: "Блог / новости с CMS", en: "Blog / news with CMS" },
    price: 200,
    kind: "flat",
  },
  cases: {
    id: "cases",
    name: { uk: "Розділ кейсів / портфоліо", ru: "Раздел кейсов / портфолио", en: "Case studies / portfolio section" },
    price: 150,
    kind: "flat",
  },
  crm: {
    id: "crm",
    name: {
      uk: "Інтеграція з CRM (KeyCRM, HubSpot, Bitrix24)",
      ru: "Интеграция с CRM (KeyCRM, HubSpot, Bitrix24)",
      en: "CRM integration (HubSpot, Pipedrive and others)",
    },
    price: 300,
    kind: "flat",
  },
  booking: {
    id: "booking",
    name: { uk: "Онлайн-запис / календар", ru: "Онлайн-запись / календарь", en: "Online booking / calendar" },
    price: 300,
    kind: "flat",
  },
  payments: {
    id: "payments",
    name: {
      uk: "Онлайн-оплата на сайті послуг (LiqPay / Mono / Stripe)",
      ru: "Онлайн-оплата на сайте услуг (LiqPay / Mono / Stripe)",
      en: "Online payments on a services site (Stripe and others)",
    },
    price: 200,
    kind: "flat",
  },
  sku_500: {
    id: "sku_500",
    name: { uk: "Каталог 100–500 товарів", ru: "Каталог 100–500 товаров", en: "Catalogue of 100–500 products" },
    price: 300,
    kind: "flat",
    excludes: ["sku_1000"],
  },
  sku_1000: {
    id: "sku_1000",
    name: {
      uk: "Каталог 500–1 000 товарів + імпорт з Excel",
      ru: "Каталог 500–1 000 товаров + импорт из Excel",
      en: "Catalogue of 500–1,000 products + Excel import",
    },
    price: 600,
    kind: "flat",
    excludes: ["sku_500"],
  },
  filters: {
    id: "filters",
    name: { uk: "Розширені фільтри та пошук", ru: "Расширенные фильтры и поиск", en: "Advanced filters and search" },
    price: 250,
    kind: "flat",
  },
  copy_pro: {
    id: "copy_pro",
    name: {
      uk: "Професійний копірайтинг (редактор, інтерв'ю з вами)",
      ru: "Профессиональный копирайтинг (редактор, интервью с вами)",
      en: "Professional copywriting (an editor interviews you)",
    },
    price: 300,
    kind: "flat",
  },
  photo_stock: {
    id: "photo_stock",
    name: { uk: "Підбір і обробка стокових фото", ru: "Подбор и обработка стоковых фото", en: "Stock photo selection and editing" },
    price: 100,
    kind: "flat",
  },
  rush: {
    id: "rush",
    name: { uk: "Терміново: строк −40%", ru: "Срочно: срок −40%", en: "Rush: 40% shorter timeline" },
    price: 30,
    kind: "percentOfPackage",
  },
  migration: {
    id: "migration",
    name: {
      uk: "Перенос з WordPress / Tilda / Wix зі збереженням SEO",
      ru: "Перенос с WordPress / Tilda / Wix с сохранением SEO",
      en: "Move from WordPress / Wix / Squarespace keeping your SEO",
    },
    price: 200,
    kind: "flat",
  },
  ads_setup: {
    id: "ads_setup",
    name: {
      uk: "Налаштування Google Ads + аналітика (без бюджету)",
      ru: "Настройка Google Ads + аналитика (без бюджета)",
      en: "Google Ads + analytics setup (ad budget not included)",
    },
    price: 250,
    kind: "flat",
  },
};

export const ADDON_ORDER: AddonId[] = [
  "extra_page",
  "lang",
  "blog",
  "cases",
  "crm",
  "booking",
  "payments",
  "sku_500",
  "sku_1000",
  "filters",
  "copy_pro",
  "photo_stock",
  "migration",
  "ads_setup",
  "rush",
];

const COMMON_ADDONS: AddonId[] = ["copy_pro", "photo_stock", "migration", "ads_setup", "rush"];

/** Add-ons offered with each package (calculator step 2, package pages). */
export const PACKAGE_ADDONS: Record<Exclude<PackageId, "custom">, AddonId[]> = {
  landing: ["lang", "crm", "booking", "payments", ...COMMON_ADDONS],
  business: ["extra_page", "lang", "blog", "cases", "crm", "booking", "payments", ...COMMON_ADDONS],
  shop: ["sku_500", "sku_1000", "filters", "extra_page", "lang", "crm", ...COMMON_ADDONS],
  industry: ["extra_page", "lang", "blog", "cases", "crm", "booking", "payments", ...COMMON_ADDONS],
};

/* ------------------------------------------------------------------ */
/* Services outside packages, payment terms                            */
/* ------------------------------------------------------------------ */

export const SERVICES = {
  /** Free audit / quote; answer within this many hours. */
  auditPrice: 0,
  auditResponseHours: 24,
  auditsPerWeek: 5,
  /** Warranty, hosting and support included for this many months. */
  includedSupportMonths: 12,
  /** Hosting renewal after the included year, per year. */
  hostingRenewalPerYear: 60,
  /** SEO retainer floors, per month. */
  seoServicesFrom: 400,
  seoShopFrom: 600,
  /** A new page after launch takes this many working days. */
  newPageDays: { min: 1, max: 2 } satisfies DayRange,
} as const;

export const PAYMENT_TERMS = {
  prepaymentPercent: 50,
  fullPrepaymentDiscountPercent: 5,
  latePenaltyPercentPerDay: 5,
  latePenaltyCapPercent: 30,
  /** Packages at or above this USD price can be paid in instalments. */
  instalmentsFrom: 1800,
  instalmentsCount: 3,
} as const;

/* ------------------------------------------------------------------ */
/* Markets                                                             */
/* ------------------------------------------------------------------ */

/**
 * Two markets with their own price lists — never a currency conversion of
 * one another (owner, 2026-09-20). uk/ru sell to Ukraine in USD (the tables
 * above); en sells to European small businesses in EUR (INTL below).
 */
export type Market = "ua" | "intl";

export const LOCALE_MARKET: Record<Locale, Market> = {
  uk: "ua",
  ru: "ua",
  en: "intl",
};

type MarketPrices = {
  packages: Record<PackageId, number>;
  industries: Record<IndustryId, number>;
  addons: Record<Exclude<AddonId, "rush">, number>;
  services: Record<"hostingRenewalPerYear" | "seoServicesFrom" | "seoShopFrom", number>;
};

/**
 * EUR list for the international market. Package and most add-on figures
 * are the owner's; the ones marked (×2) were not in the owner's list and
 * follow the list's own UA×2 ratio — confirm before running ads on /en.
 */
const INTL: MarketPrices = {
  packages: { landing: 1200, business: 2500, shop: 3900, industry: 4500, custom: 9000 },
  industries: {
    medicine: 4500,
    legal: 4500,
    finance: 4500,
    renovation: 4500,
    auto: 5000, // (×UA ratio)
    "real-estate": 5500, // (×UA ratio)
  },
  addons: {
    extra_page: 300,
    lang: 400,
    blog: 400,
    cases: 300, // (×2)
    crm: 600,
    booking: 600,
    payments: 400,
    sku_500: 600,
    sku_1000: 1200, // (×2)
    filters: 500,
    copy_pro: 600,
    photo_stock: 200, // (×2)
    migration: 400,
    ads_setup: 500, // (×2)
  },
  services: {
    hostingRenewalPerYear: 120, // (×2)
    seoServicesFrom: 800, // (×2)
    seoShopFrom: 1200, // (×2)
  },
};

const MARKET_PRICES: Partial<Record<Market, MarketPrices>> = { intl: INTL };

/* ------------------------------------------------------------------ */
/* Read helpers — always go through these                              */
/* ------------------------------------------------------------------ */

const market = (locale: Locale) => MARKET_PRICES[LOCALE_MARKET[locale]];

export function packagePrice(id: PackageId, locale: Locale): number {
  return market(locale)?.packages[id] ?? PACKAGES[id].price;
}

export function industryPrice(id: IndustryId, locale: Locale): number {
  return market(locale)?.industries[id] ?? INDUSTRIES[id].price;
}

export function addonPrice(id: AddonId, locale: Locale): number {
  if (id === "rush") return ADDONS.rush.price;
  return market(locale)?.addons[id] ?? ADDONS[id].price;
}

export function servicePrice(
  key: "hostingRenewalPerYear" | "seoServicesFrom" | "seoShopFrom",
  locale: Locale,
): number {
  return market(locale)?.services[key] ?? SERVICES[key];
}

/** "$1 000", or "від $1 800" for packages sold from a floor. */
export function formatPackagePrice(id: PackageId, locale: Locale): string {
  return formatPrice(packagePrice(id, locale), {
    locale,
    withPrefix: PACKAGES[id].fromPrice,
  });
}

/** Lowest industry variant, e.g. "від $1 800". */
export function industryFloor(locale: Locale): number {
  return Math.min(...INDUSTRY_ORDER.map((i) => industryPrice(i, locale)));
}

/** "+$200", "$150 за сторінку", "+30% до ціни пакета". */
export function formatAddonPrice(id: AddonId, locale: Locale): string {
  const a = ADDONS[id];
  if (a.kind === "percentOfPackage") return `+${a.price}% ${RUSH_SUFFIX[locale]}`;
  const p = `+${formatPrice(addonPrice(id, locale), { locale })}`;
  return a.kind === "perUnit" && a.unit ? `${p} ${a.unit[locale]}` : p;
}

const RUSH_SUFFIX: L = {
  uk: "до ціни пакета",
  ru: "к цене пакета",
  en: "on the package price",
};

const DAY_WORD: Record<Locale, (n: number) => string> = {
  uk: (n) => pluralUk(n, "робочий день", "робочі дні", "робочих днів"),
  ru: (n) => pluralUk(n, "рабочий день", "рабочих дня", "рабочих дней"),
  en: (n) => (n === 1 ? "working day" : "working days"),
};

const WEEK_WORD: Record<Locale, (n: number) => string> = {
  uk: (n) => pluralUk(n, "тиждень", "тижні", "тижнів"),
  ru: (n) => pluralUk(n, "неделя", "недели", "недель"),
  en: (n) => (n === 1 ? "week" : "weeks"),
};

function pluralUk(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/** "7 робочих днів", "14–21 робочий день", "від 6 тижнів". */
export function formatDays(range: DayRange, locale: Locale): string {
  if (range.min === range.max) return `${range.min} ${DAY_WORD[locale](range.min)}`;
  return `${range.min}–${range.max} ${DAY_WORD[locale](range.max)}`;
}

export function formatPackageTerm(id: PackageId, locale: Locale): string {
  const p = PACKAGES[id];
  if (p.weeks) return `${FROM_LABEL[locale]} ${p.weeks.min} ${WEEK_WORD[locale](p.weeks.min)}`;
  return formatDays(p.days, locale);
}

/* ------------------------------------------------------------------ */
/* Estimate (calculator + "fix this price" config line)                */
/* ------------------------------------------------------------------ */

export type EstimateInput = {
  pkg: Exclude<PackageId, "custom">;
  industry?: IndustryId;
  /** Selected add-ons with quantity (1 for flat add-ons). */
  addons: Partial<Record<AddonId, number>>;
};

export type EstimateResult = {
  packagePrice: number;
  addonsTotal: number;
  rushFee: number;
  total: number;
  days: DayRange;
  lines: { id: AddonId; qty: number; amount: number }[];
};

/** Extra working days for every started group of this many add-ons. */
const ADDON_GROUP = 3;
const DAYS_PER_ADDON_GROUP = 2;
/** Rush shortens the term by this share. */
const RUSH_TERM_CUT = 0.4;

/**
 * Price = package + add-ons (+30% of the package when rush).
 * Term = package days + 2 per started group of 3 add-ons (rush itself not
 * counted), then −40% on rush, rounded up to whole days.
 */
export function estimate(input: EstimateInput, locale: Locale): EstimateResult {
  const base =
    input.pkg === "industry"
      ? industryPrice(input.industry ?? "medicine", locale)
      : packagePrice(input.pkg, locale);
  const allowed = new Set(PACKAGE_ADDONS[input.pkg]);

  const lines: EstimateResult["lines"] = [];
  let rush = false;
  for (const id of ADDON_ORDER) {
    const qty = input.addons[id] ?? 0;
    if (qty <= 0 || !allowed.has(id)) continue;
    if (id === "rush") {
      rush = true;
      continue;
    }
    const q = ADDONS[id].kind === "perUnit" ? Math.min(qty, ADDONS[id].maxQty ?? qty) : 1;
    lines.push({ id, qty: q, amount: addonPrice(id, locale) * q });
  }

  const addonsTotal = lines.reduce((s, l) => s + l.amount, 0);
  const rushFee = rush ? Math.round((base * ADDONS.rush.price) / 100) : 0;
  const extra = Math.ceil(lines.length / ADDON_GROUP) * DAYS_PER_ADDON_GROUP;
  const pkgDays = PACKAGES[input.pkg].days;
  const term = (d: number) => {
    const withAddons = d + extra;
    return rush ? Math.ceil(withAddons * (1 - RUSH_TERM_CUT)) : withAddons;
  };

  return {
    packagePrice: base,
    addonsTotal,
    rushFee,
    total: base + addonsTotal + rushFee,
    days: { min: term(pkgDays.min), max: term(pkgDays.max) },
    lines,
  };
}
