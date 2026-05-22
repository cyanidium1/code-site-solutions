"use client";

import { useState } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { Plus } from "lucide-react";

import { renderRich } from "@/lib/shared/rich-text";
import type { FAQItem } from "@/types/faq";

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
    <section className="relative py-[var(--section-y)] px-[var(--gutter-x)] bg-bg">
      <div className="faq-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-[2] max-w-container mx-auto">
        <h2 className="font-display font-bold text-[clamp(34px,4.4vw,56px)] leading-none tracking-[-0.035em] mb-12 text-ink uppercase max-[700px]:text-[clamp(24px,8vw,34px)] max-[700px]:mb-7">
          {heading}
        </h2>
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          className="faq-accordion px-0 gap-3"
          itemClasses={{
            base: "faq-item",
            heading: "faq-item-heading",
            trigger: "faq-item-trigger",
            title: "faq-item-title",
            content: "faq-item-content",
            indicator: "faq-item-indicator",
          }}
        >
          {visible.map((it, i) => (
            <AccordionItem
              key={i}
              aria-label={it.q}
              title={it.q}
              indicator={({ isOpen }) => (
                <span
                  className={`faq-plus${isOpen ? " open" : ""}`}
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
              className="inline-flex items-center gap-2.5 px-6 py-3 border border-[var(--line-2)] rounded-full bg-[oklch(1_0_0_/_0.02)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-2)] hover:border-accent-soft hover:text-ink transition-colors duration-200"
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
