"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Plus } from "lucide-react";

import { renderRich } from "@/lib/shared/rich-text";
import type { FAQItem } from "@/types/faq";
import { H2 } from "@/components/ui";

const FAQ_INITIAL_VISIBLE = 5;

const DEFAULT_FAQ: FAQItem[] = [
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

const FAQ_MOTION_PROPS = {
  variants: {
    enter: {
      y: 0,
      opacity: 1,
      height: "auto",
      overflowY: "hidden" as const,
      transition: {
        height: { type: "spring" as const, stiffness: 500, damping: 30, duration: 0.3 },
        opacity: { easings: "ease", duration: 0.25 },
      },
    },
    exit: {
      y: -6,
      opacity: 0,
      height: 0,
      overflowY: "hidden" as const,
      transition: {
        height: { easings: "ease", duration: 0.25 },
        opacity: { easings: "ease", duration: 0.2 },
      },
    },
  },
};

// FAQ section backdrop — layered relative-color OKLCH radial gradients.
// Same `oklch(from var(--color-accent) l c h / 0.06)` pattern as the
// rest of the refactor; uses `--color-*` (the `@theme` tokens), not
// the legacy `--accent` aliases.
const FAQ_BG =
  "bg-[radial-gradient(ellipse_40%_50%_at_5%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),radial-gradient(ellipse_40%_60%_at_95%_80%,oklch(from_var(--color-accent-2)_l_c_h_/_0.05),transparent_70%)]";

// HeroUI itemClasses — utility strings that merge with HeroUI's internal
// class on the same element. We rely on Tailwind's data-attribute variant
// (`data-[open=true]:`) for the open-state border, and `group/trigger` +
// `group-hover/trigger:` on the indicator for the +/× hover hand-off (the
// trigger is a HeroUI <button> that hosts the indicator slot as a child;
// we add `group/trigger` to the trigger via itemClasses so descendant
// utilities can react).
const FAQ_ITEM =
  "border border-line rounded-[14px] bg-[oklch(0.16_0.005_300)] !shadow-none overflow-hidden transition-[border-color] duration-200 !m-0 data-[open=true]:border-line-strong";

const FAQ_ITEM_TRIGGER =
  "group/trigger py-[22px] px-6 gap-4 cursor-pointer max-[700px]:p-[18px] max-[700px]:gap-3";

const FAQ_ITEM_TITLE =
  "font-sans !text-[15px] font-semibold !text-ink leading-[1.35] max-[700px]:!text-[13px]";

// HeroUI puts content padding via internal class; we override with !important
// (px-6 pt-0 pb-[22px]) because the data-* slot specificity is identical to
// HeroUI's. Same caveat as the legacy CSS file noted (`!important` retained
// for content padding because data-attribute selectors collide).
const FAQ_ITEM_CONTENT =
  "!px-6 !pt-0 !pb-[22px] text-[14px] leading-[1.65] text-[var(--ink-2)] text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "[&_.rich-link]:text-accent-soft [&_.rich-link]:font-medium [&_.rich-link]:underline [&_.rich-link]:decoration-[oklch(0.7_0.14_295_/_0.4)] [&_.rich-link]:underline-offset-[3px] [&_.rich-link]:transition-[color,text-decoration-color] [&_.rich-link]:duration-200 [&_.rich-link:hover]:text-ink [&_.rich-link:hover]:decoration-ink " +
  "max-[700px]:!px-[18px] max-[700px]:!pb-[18px] max-[700px]:text-[13px]";

// HeroUI's default indicator slot animates rotation; we render our own
// indicator via render-prop, so disable any built-in motion.
const FAQ_ITEM_INDICATOR = "!rotate-0 !transition-none";

// The +/× indicator pill. Adjacent to the trigger button (HeroUI renders the
// indicator slot inside the trigger), so we can use `group-hover/trigger:`
// for the hover colour swap.
const FAQ_PLUS_BASE =
  "w-8 h-8 rounded-full border border-line-strong bg-transparent text-[var(--ink-2)] " +
  "inline-flex items-center justify-center shrink-0 " +
  "transition-[background-color,color,border-color,transform] duration-[250ms] " +
  "group-hover/trigger:text-accent-soft group-hover/trigger:border-[oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
  "[&_svg]:transition-transform [&_svg]:duration-[250ms] " +
  "max-[700px]:w-[26px] max-[700px]:h-[26px] max-[700px]:[&_svg]:w-[11px] max-[700px]:[&_svg]:h-[11px]";

const FAQ_PLUS_OPEN =
  "!bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] !border-transparent !text-[oklch(1_0_0_/_0.98)] [&_svg]:rotate-45";

export function FAQ({
  heading = "Часті питання",
  items = DEFAULT_FAQ,
  showAllLabel = "Показати ще",
  locale = "uk",
}: {
  heading?: string;
  items?: FAQItem[];
  showAllLabel?: string;
  locale?: "uk" | "en";
} = {}) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = items.length > FAQ_INITIAL_VISIBLE;
  const visible = expanded ? items : items.slice(0, FAQ_INITIAL_VISIBLE);
  const toggleLabel = expanded
    ? locale === "en"
      ? "Show fewer"
      : "Згорнути"
    : showAllLabel === "Показати ще" && locale === "en"
      ? `Show all ${items.length} questions`
      : showAllLabel;

  return (
    <section className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-bg">
      <div className={`absolute inset-0 z-0 pointer-events-none ${FAQ_BG}`} />
      <div className="relative z-[2] max-w-container mx-auto">
        <H2 variant="comparison" className="mb-12 text-ink uppercase max-[700px]:mb-7">
          {heading}
        </H2>
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          className="flex flex-col !px-0 gap-3"
          itemClasses={{
            base: FAQ_ITEM,
            trigger: FAQ_ITEM_TRIGGER,
            title: FAQ_ITEM_TITLE,
            content: FAQ_ITEM_CONTENT,
            indicator: FAQ_ITEM_INDICATOR,
          }}
        >
          {visible.map((it, i) => (
            <AccordionItem
              key={i}
              aria-label={it.q}
              title={it.q}
              indicator={({ isOpen }) => (
                <span
                  className={`${FAQ_PLUS_BASE}${isOpen ? ` ${FAQ_PLUS_OPEN}` : ""}`}
                  aria-hidden="true"
                >
                  <Plus size={13} strokeWidth={2.2} />
                </span>
              )}
              motionProps={FAQ_MOTION_PROPS}
            >
              {renderRich(it.a)}
            </AccordionItem>
          ))}
        </Accordion>
        {hasOverflow ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2.5 px-6 py-3 border border-line-strong rounded-full bg-[oklch(1_0_0_/_0.02)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-2)] hover:border-accent-soft hover:text-ink transition-colors duration-200"
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
