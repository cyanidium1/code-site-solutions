/**
 * Labels for the config-driven package blocks (cards, tables, USP line,
 * payment terms). Prices and compositions come from `@/constants/pricing`.
 */

import type { Locale } from "@/constants/locales";
import {
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  formatPackagePrice,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

export type PackagesUi = {
  fixedLabel: string;
  fromLabel: string;
  includes: string;
  excludes: string;
  popular: string;
  cta: string;
  moreLine: (l: Locale) => string;
  usp: string;
  thPackage: string;
  thPrice: string;
  thTerm: string;
  thIncludes: string;
  thAddon: string;
  paymentTitle: string;
  payment: (l: Locale) => string[];
  formTitle: string;
  formSub: string;
  afterLaunchSeo: (l: Locale) => string;
};

const pct = PAYMENT_TERMS;
const minDays = PACKAGES.landing.days.min;
const months = SERVICES.includedSupportMonths;

export const PACKAGES_UI: Record<Locale, PackagesUi> = {
  uk: {
    fixedLabel: "фікс-ціна",
    fromLabel: "від",
    includes: "Що входить",
    excludes: "Не входить",
    popular: "★ Найпопулярніше",
    cta: "Отримати прорахунок",
    moreLine: (l) =>
      `Галузеве рішення ${formatPackagePrice("industry", l)} · Custom ${formatPackagePrice("custom", l)}`,
    usp: `Фікс-ціна в договорі · Строк від ${minDays} днів · Код ваш · Гарантія і підтримка рік — включені · Без підписок`,
    thPackage: "Пакет",
    thPrice: "Ціна",
    thTerm: "Строк",
    thIncludes: "Що входить",
    thAddon: "Додаток",
    paymentTitle: "Умови оплати",
    payment: () => [
      `${pct.prepaymentPercent}% передоплата, ${100 - pct.prepaymentPercent}% після запуску.`,
      `100% передоплата — знижка ${pct.fullPrepaymentDiscountPercent}%.`,
      "Ціна фіксується в договорі.",
      `Неустойка за зрив строку з нашої вини — ${pct.latePenaltyPercentPerDay}% за кожен робочий день, до ${pct.latePenaltyCapPercent}%.`,
      "Оплата: ФОП (безготівка), картка, USDT.",
    ],
    formTitle: "Безкоштовний прорахунок за 24 години",
    formSub: "Опишіть задачу — відповімо з ціною, строком і складом робіт. Без зобов'язань.",
    afterLaunchSeo: (l) =>
      `Після запуску: просування від ${formatPrice(servicePrice("seoServicesFrom", l), { locale: l })}/міс`,
  },
  ru: {
    fixedLabel: "фикс-цена",
    fromLabel: "от",
    includes: "Что входит",
    excludes: "Не входит",
    popular: "★ Самый популярный",
    cta: "Получить расчёт",
    moreLine: (l) =>
      `Отраслевое решение ${formatPackagePrice("industry", l)} · Custom ${formatPackagePrice("custom", l)}`,
    usp: `Фикс-цена в договоре · Срок от ${minDays} дней · Код ваш · Гарантия и поддержка год — включены · Без подписок`,
    thPackage: "Пакет",
    thPrice: "Цена",
    thTerm: "Срок",
    thIncludes: "Что входит",
    thAddon: "Дополнение",
    paymentTitle: "Условия оплаты",
    payment: () => [
      `${pct.prepaymentPercent}% предоплата, ${100 - pct.prepaymentPercent}% после запуска.`,
      `100% предоплата — скидка ${pct.fullPrepaymentDiscountPercent}%.`,
      "Цена фиксируется в договоре.",
      `Неустойка за срыв срока по нашей вине — ${pct.latePenaltyPercentPerDay}% за каждый рабочий день, до ${pct.latePenaltyCapPercent}%.`,
      "Оплата: ФЛП (безнал), карта, USDT.",
    ],
    formTitle: "Бесплатный расчёт за 24 часа",
    formSub: "Опишите задачу — ответим с ценой, сроком и составом работ. Без обязательств.",
    afterLaunchSeo: (l) =>
      `После запуска: продвижение от ${formatPrice(servicePrice("seoServicesFrom", l), { locale: l })}/мес`,
  },
  en: {
    fixedLabel: "fixed price",
    fromLabel: "from",
    includes: "What's included",
    excludes: "Not included",
    popular: "★ Most popular",
    cta: "Get a quote",
    moreLine: (l) =>
      `Industry solution ${formatPackagePrice("industry", l)} · Custom ${formatPackagePrice("custom", l)}`,
    usp: `Fixed price in the contract · From ${minDays} business days · You own the code · ${months} months of warranty and support included · No subscriptions`,
    thPackage: "Package",
    thPrice: "Price",
    thTerm: "Timeline",
    thIncludes: "What's included",
    thAddon: "Add-on",
    paymentTitle: "Payment terms",
    payment: () => [
      `${pct.prepaymentPercent}% upfront, ${100 - pct.prepaymentPercent}% after launch.`,
      `Pay 100% upfront and get ${pct.fullPrepaymentDiscountPercent}% off.`,
      "The price is fixed in the contract.",
      `If we miss the deadline through our fault, we pay ${pct.latePenaltyPercentPerDay}% per business day, up to ${pct.latePenaltyCapPercent}%.`,
      "Prices in EUR. Invoices in EUR, USD or GBP on request.",
    ],
    formTitle: "Free quote within 24 hours",
    formSub: "Tell us what you need — we reply with a price, a timeline and the scope. No obligation.",
    afterLaunchSeo: (l) =>
      `After launch: search marketing from ${formatPrice(servicePrice("seoServicesFrom", l), { locale: l })}/month`,
  },
};

