/**
 * Chrome strings for the package calculator (TZ v2 §3.3). Prices, package
 * names and add-on names come from `@/constants/pricing`; only labels live
 * here. Mirrored shape across locales.
 */

import type { Locale } from "@/constants/locales";

export type CalculatorUi = {
  step1: string;
  step1Hint: string;
  industryLabel: string;
  step2: string;
  step2Hint: string;
  step3: string;
  packageLine: string;
  total: string;
  term: string;
  rushNote: string;
  fix: string;
  fixNote: string;
  reset: string;
  formTitle: string;
  formSub: string;
  configPackage: string;
  configTotal: string;
  mobileTotal: string;
  qtyMinus: string;
  qtyPlus: string;
  pricingLink: string;
  pricingLinkText: string;
};

export const CALCULATOR_UI: Record<Locale, CalculatorUi> = {
  uk: {
    step1: "Крок 1 — пакет",
    step1Hint: "Ціна і строк пакета фіксовані.",
    industryLabel: "Галузь",
    step2: "Крок 2 — додатки",
    step2Hint: "Тільки те, що потрібно саме вам. Кожен додаток — фікс-ціна.",
    step3: "Крок 3 — ваша ціна",
    packageLine: "Пакет",
    total: "Разом",
    term: "Строк",
    rushNote: "терміново: +30% до ціни пакета",
    fix: "Зафіксувати цю ціну",
    fixNote: "Ціна потрапить у договір без змін.",
    reset: "Скинути додатки",
    formTitle: "Зафіксуйте ціну",
    formSub: "Конфігурація вже в заявці. Відповімо за 24 години і надішлемо договір з цією сумою.",
    configPackage: "Пакет",
    configTotal: "Разом",
    mobileTotal: "Ваша ціна",
    qtyMinus: "Менше",
    qtyPlus: "Більше",
    pricingLink: "Потрібна вся таблиця цін?",
    pricingLinkText: "Прайс із пакетами і додатками",
  },
  ru: {
    step1: "Шаг 1 — пакет",
    step1Hint: "Цена и срок пакета фиксированные.",
    industryLabel: "Отрасль",
    step2: "Шаг 2 — дополнения",
    step2Hint: "Только то, что нужно именно вам. У каждого дополнения фикс-цена.",
    step3: "Шаг 3 — ваша цена",
    packageLine: "Пакет",
    total: "Итого",
    term: "Срок",
    rushNote: "срочно: +30% к цене пакета",
    fix: "Зафиксировать эту цену",
    fixNote: "Цена попадёт в договор без изменений.",
    reset: "Сбросить дополнения",
    formTitle: "Зафиксируйте цену",
    formSub: "Конфигурация уже в заявке. Ответим за 24 часа и пришлём договор с этой суммой.",
    configPackage: "Пакет",
    configTotal: "Итого",
    mobileTotal: "Ваша цена",
    qtyMinus: "Меньше",
    qtyPlus: "Больше",
    pricingLink: "Нужна вся таблица цен?",
    pricingLinkText: "Прайс с пакетами и дополнениями",
  },
  en: {
    step1: "Step 1 — package",
    step1Hint: "Package price and timeline are fixed.",
    industryLabel: "Industry",
    step2: "Step 2 — add-ons",
    step2Hint: "Only what you actually need. Every add-on has a fixed price.",
    step3: "Step 3 — your price",
    packageLine: "Package",
    total: "Total",
    term: "Timeline",
    rushNote: "rush: +30% on the package price",
    fix: "Lock in this price",
    fixNote: "This exact figure goes into the contract.",
    reset: "Clear add-ons",
    formTitle: "Lock in your price",
    formSub: "Your configuration is already attached. We reply within 24 hours with a contract at this price.",
    configPackage: "Package",
    configTotal: "Total",
    mobileTotal: "Your price",
    qtyMinus: "Fewer",
    qtyPlus: "More",
    pricingLink: "Want the full price list?",
    pricingLinkText: "Packages and add-ons",
  },
};
