"use client";

import type { Locale } from "@/constants/locales";
import { useState } from "react";
import { useLocale } from "next-intl";

import type { FAQItem } from "@/types/faq";
import { FaqAccordionItem } from "./faq-item";
import { H2 } from "@/components/ui";
import { hpSectionClass } from "@/components/homepage/shared";

const FAQ_INITIAL_VISIBLE = 5;

/** Fallback when a UK page omits `items` (e.g. legacy industry templates). */
const DEFAULT_FAQ_UK: FAQItem[] = [
  {
    q: "Скільки часу займає запуск сайту клініки?",
    a: [
      "Сайт для бізнесу — ",
      { em: "7 робочих днів" },
      ", галузеве рішення з інтеграцією — 14–21 робочий день. Дедлайни фіксуємо у договорі. Кожен тиждень — звіт зі скріншотами та проміжним результатом.",
    ],
  },
  {
    q: "Що робити зі старим сайтом?",
    a: [
      "Старий сайт працює до запуску нового — без втрати трафіку. Налаштовуємо ",
      { em: "301-редиректи" },
      " зі старих URL на нові, переносимо мета-теги і Schema-розмітку, передаємо домен. Просідання в Google зазвичай немає.",
    ],
  },
  {
    q: "Хто наповнюватиме сайт контентом?",
    a: [
      "Можемо повністю — у нас є копірайтер з медичним досвідом і фотограф (за окрему вартість). Або ви даєте тексти і фото, ми верстаємо. Або гібридно — ви даєте опис послуг, ми переписуємо під ",
      { em: "SEO" },
      " і вимоги МОЗ.",
    ],
  },
  {
    q: "Які інтеграції з медичними CRM можливі?",
    a: [
      "Працювали з ",
      { em: "Dental4Windows" },
      ", Medesk, MedAI, Helsi (НСЗУ), KeyCRM, AmoCRM, Bitrix24. Якщо у вас інша CRM — підключаємо через API або Webhook. Запис із сайту падає у CRM миттєво, лікар отримує сповіщення в Telegram.",
    ],
  },
  {
    q: "Як захищені дані пацієнтів?",
    a: [
      "Відповідність ",
      { em: "GDPR" },
      " і вимогам МОЗ України: шифрування даних на льоту (HTTPS) і у спокої, IP-обмеження для адмінки, журнал доступів, регулярні бекапи. Сервери — у ЄС. Договір з вами включає DPA.",
    ],
  },
  {
    q: "Чи можна розмістити відгуки пацієнтів?",
    a: [
      "Так, але ",
      { em: "з письмовою згодою пацієнта" },
      " та без розкриття діагнозу. Підготуємо шаблон згоди разом з юристом. Альтернатива — інтеграція з Google Reviews або Doc.ua, де відгуки модерує платформа.",
    ],
  },
  {
    q: "Чи можна за законом розміщувати ціни на медичні послуги?",
    a: [
      "Так — і з 2024 це навіть обовʼязково для приватних клінік (постанова КМУ). Ми робимо прайс структурований, з позначкою «",
      { em: "орієнтовна вартість" },
      "» і застереженням, що остаточна ціна визначається після консультації. Юрист перевіряє формулювання.",
    ],
  },
  {
    q: "Чи можна запустити рекламу медичних послуг у Google і Facebook?",
    a: [
      "Можна, але з обмеженнями: не можна обіцяти «гарантоване зцілення», використовувати фото «до/після» в обʼявах, рекламувати рецептурні препарати. Ми готуємо посадкові сторінки, які проходять модерацію Google Ads з першого разу. Налаштування реклами — окремо, але рекомендуємо перевірених підрядників.",
    ],
  },
];

// Row markup + its class stack live in ./faq-item so the /faq hub page
// renders identical accordions.

/**
 * Per-locale chrome + default items. The default locale ships hardcoded
 * homepage FAQ items; other locales pass their own `items` (empty default
 * hides the section). `showAllCount` renders the counted toggle label when
 * the caller didn't override `showAllLabel`.
 */
const FAQ_LABELS: Record<
  Locale,
  {
    heading: string;
    showAll: string;
    showFewer: string;
    defaultItems: FAQItem[];
    showAllCount?: (n: number) => string;
  }
> = {
  uk: {
    heading: "Часті питання",
    showAll: "Показати ще",
    showFewer: "Згорнути",
    defaultItems: DEFAULT_FAQ_UK,
  },
  en: {
    heading: "FAQ",
    showAll: "Show more",
    showFewer: "Show fewer",
    defaultItems: [],
    showAllCount: (n) => `Show all ${n} questions`,
  },
  ru: {
    heading: "Частые вопросы",
    showAll: "Показать ещё",
    showFewer: "Свернуть",
    defaultItems: [],
  },
};

export function FAQ({
  heading,
  items,
  showAllLabel,
  locale: localeProp,
}: {
  heading?: string;
  items?: FAQItem[];
  showAllLabel?: string;
  locale?: Locale;
} = {}) {
  const intlLocale = useLocale();
  const locale: Locale = localeProp ?? (intlLocale as Locale);
  const labels = FAQ_LABELS[locale];
  const resolvedItems = items ?? labels.defaultItems;
  const resolvedHeading = heading ?? labels.heading;
  const resolvedShowAllLabel = showAllLabel ?? labels.showAll;

  const [expanded, setExpanded] = useState(false);

  if (resolvedItems.length === 0) {
    return null;
  }

  const hasOverflow = resolvedItems.length > FAQ_INITIAL_VISIBLE;
  const toggleLabel = expanded
    ? labels.showFewer
    : showAllLabel === undefined && labels.showAllCount
      ? labels.showAllCount(resolvedItems.length)
      : resolvedShowAllLabel;

  return (
    <section className={hpSectionClass}>
      <div className="relative z-[2] max-w-container mx-auto">
        <H2 variant="comparison" className="mb-7 text-ink uppercase md:mb-12">
          {resolvedHeading}
        </H2>
        <div className="flex flex-col gap-3">
          {/* Every item is rendered, and the overflow is hidden with CSS rather
              than sliced out of the array. Slicing kept the extras out of the
              server HTML entirely: /pricing shipped 18 questions in its
              FAQPage markup and only 5 in the document, so thirteen answers
              written specifically for price queries were not indexable at all.
              Content collapsed behind a control is still crawled; content that
              never renders is not. */}
          {resolvedItems.map((it, i) => (
            <FaqAccordionItem
              key={i}
              item={it}
              className={!expanded && i >= FAQ_INITIAL_VISIBLE ? "hidden" : undefined}
            />
          ))}
        </div>
        {hasOverflow ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2.5 min-h-11 px-6 py-3 border border-line-strong rounded-full bg-[oklch(1_0_0_/_0.02)] font-sans font-semibold text-[13px] text-ink-dim cursor-pointer hover:border-accent-soft hover:text-ink transition-colors duration-200"
              aria-expanded={expanded}
            >
              {toggleLabel}
              <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
