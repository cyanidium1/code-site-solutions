"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocale } from "next-intl";

import { renderRich } from "@/lib/shared/rich-text";
import type { FAQItem } from "@/types/faq";
import { H2 } from "@/components/ui";
import { hpSectionClass } from "@/components/homepage/shared";

const FAQ_INITIAL_VISIBLE = 5;

/** Fallback when a UK page omits `items` (e.g. legacy industry templates). */
const DEFAULT_FAQ_UK: FAQItem[] = [
  {
    q: "Скільки часу займає запуск сайту клініки?",
    a: [
      "Базовий сайт — ",
      { em: "4 тижні" },
      ", розширений — 6 тижнів, преміум для мережі — 8–10 тижнів. Дедлайни фіксуємо у договорі. Кожен тиждень — звіт зі скріншотами та проміжним результатом.",
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

// FAQ section backdrop — layered relative-color OKLCH radial gradients.
// Same `oklch(from var(--color-accent) l c h / 0.06)` pattern as the
// rest of the refactor; uses `--color-*` (the `@theme` tokens), not
// the legacy `--accent` aliases.
const FAQ_BG =
  "bg-[radial-gradient(ellipse_40%_50%_at_5%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),radial-gradient(ellipse_40%_60%_at_95%_80%,oklch(from_var(--color-accent-2)_l_c_h_/_0.05),transparent_70%)]";

// Native <details> accordion. Open-state styling uses Tailwind's `open:`
// variant (matches details[open]) and `group-open/faq:` on descendants.
// Animation: `interpolate-size` + ::details-content transition — Chromium
// 131+/Safari 18.2+ animate the expand; older browsers toggle instantly.
const FAQ_ITEM =
  "group/faq border border-line rounded-[14px] bg-[oklch(0.16_0.005_300)] overflow-hidden transition-[border-color] duration-200 open:border-line-strong " +
  "[interpolate-size:allow-keywords] " +
  "[&::details-content]:[transition:height_250ms_ease,content-visibility_250ms_allow-discrete] [&::details-content]:overflow-hidden [&::details-content]:h-0 open:[&::details-content]:h-auto " +
  // Respect prefers-reduced-motion: collapse the expand/collapse to an
  // instant toggle (HeroUI's framer-motion Accordion honored this; the
  // native rewrite must too).
  "motion-reduce:[&::details-content]:[transition:none]";

const FAQ_ITEM_TRIGGER =
  "flex items-center justify-between gap-3 p-[18px] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden md:py-[22px] md:px-6 md:gap-4";

const FAQ_ITEM_TITLE =
  "font-sans text-[13px] font-semibold text-ink leading-[1.35] md:text-[15px]";

const FAQ_ITEM_CONTENT =
  "px-[18px] pt-0 pb-[18px] text-[13px] leading-[1.65] text-ink-dim text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "[&_.rich-link]:text-accent-soft [&_.rich-link]:font-medium [&_.rich-link]:underline [&_.rich-link]:decoration-[oklch(0.7_0.14_295_/_0.4)] [&_.rich-link]:underline-offset-[3px] [&_.rich-link]:transition-[color,text-decoration-color] [&_.rich-link]:duration-200 [&_.rich-link:hover]:text-ink [&_.rich-link:hover]:decoration-ink " +
  "md:px-6 md:pb-[22px] md:text-[14px]";

// The +/× indicator pill. Sits inside <summary>; hover via the summary's
// group/trigger, open-state via the parent <details>' group/faq — all styled
// in src/app/homepage-cards.css as `.hp-faq-plus` (this 651 B stack repeated
// per FAQ row cost ~6.5 KB of document; see docs/rsc-payload-report.md).
const FAQ_PLUS = "hp-faq-plus";

export function FAQ({
  heading,
  items,
  showAllLabel,
  locale: localeProp,
}: {
  heading?: string;
  items?: FAQItem[];
  showAllLabel?: string;
  locale?: "uk" | "en";
} = {}) {
  const intlLocale = useLocale();
  const locale: "uk" | "en" =
    localeProp ?? (intlLocale === "en" ? "en" : "uk");
  const resolvedItems = items ?? (locale === "en" ? [] : DEFAULT_FAQ_UK);
  const resolvedHeading =
    heading ?? (locale === "en" ? "FAQ" : "Часті питання");
  const resolvedShowAllLabel =
    showAllLabel ?? (locale === "en" ? "Show more" : "Показати ще");

  const [expanded, setExpanded] = useState(false);

  if (resolvedItems.length === 0) {
    return null;
  }

  const hasOverflow = resolvedItems.length > FAQ_INITIAL_VISIBLE;
  const visible = expanded
    ? resolvedItems
    : resolvedItems.slice(0, FAQ_INITIAL_VISIBLE);
  const toggleLabel = expanded
    ? locale === "en"
      ? "Show fewer"
      : "Згорнути"
    : locale === "en" && resolvedShowAllLabel === "Show more"
      ? `Show all ${resolvedItems.length} questions`
      : resolvedShowAllLabel;

  return (
    <section className={hpSectionClass}>
      <div className={`absolute inset-0 z-0 pointer-events-none ${FAQ_BG}`} />
      <div className="relative z-[2] max-w-container mx-auto">
        <H2 variant="comparison" className="mb-7 text-ink uppercase md:mb-12">
          {resolvedHeading}
        </H2>
        <div className="flex flex-col gap-3">
          {visible.map((it, i) => (
            <details key={i} className={FAQ_ITEM}>
              <summary className={`group/trigger ${FAQ_ITEM_TRIGGER}`}>
                <span className={FAQ_ITEM_TITLE}>{it.q}</span>
                <span className={FAQ_PLUS} aria-hidden="true">
                  <Plus size={13} strokeWidth={2.2} />
                </span>
              </summary>
              <div className={FAQ_ITEM_CONTENT}>{renderRich(it.a)}</div>
            </details>
          ))}
        </div>
        {hasOverflow ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2.5 min-h-11 px-6 py-3 border border-line-strong rounded-full bg-[oklch(1_0_0_/_0.02)] font-mono text-[11px] tracking-[0.14em] uppercase text-ink-dim cursor-pointer hover:border-accent-soft hover:text-ink transition-colors duration-200"
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
