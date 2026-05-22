"use client";

import { useState } from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@heroui/react";
import { Plus } from "lucide-react";

import { SITE_CONTACT } from "@/lib/site";
import { renderRich } from "@/lib/shared/rich-text";
import "./final.css";

const FAQ_INITIAL_VISIBLE = 5;

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type SocialKind = "li" | "ig" | "tg" | "tt";

const FOOTER_SOCIAL_HREFS: Record<SocialKind, string> = {
  li: "https://linkedin.com/in/fedirdev",
  ig: "https://instagram.com/fedirdev",
  tg: "https://t.me/fedirdev",
  tt: "https://tiktok.com/@fedirdev",
};

export function SocialIcon({ kind }: { kind: SocialKind }) {
  const paths: Record<SocialKind, React.ReactElement> = {
    li: (
      <path
        d="M4 4h4v4H4zM4 10h4v10H4zM10 10h4v2c.6-1.2 2-2 4-2 3 0 4 2 4 5v5h-4v-4c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V20h-4z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    ig: (
      <>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
        />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" />
      </>
    ),
    tg: (
      <path
        d="M21 4L3 11l5 2 2 6 3-3 5 4 3-16z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    tt: (
      <path
        d="M14 4v10.5a2.5 2.5 0 11-2.5-2.5M14 4c.5 2 2 3.5 4.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      {paths[kind]}
    </svg>
  );
}

import type { FAQItem } from "@/types/faq";

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

const DEFAULT_AUDIT_LIST: React.ReactNode[] = [
  "Список з 7–12 помилок, через які клініка втрачає пацієнтів",
  "Технічний звіт зі швидкості та SEO (PageSpeed + Schema)",
  "План покращень з пріоритетами",
  "Орієнтовну вартість переробки або нового сайту",
  "2–3 кейси клінік з нашого портфоліо",
];

export function Audit({
  heading = "Отримайте безкоштовний розбір сайту вашої клініки",
  sub = (
    <>
      Залиште посилання на ваш поточний сайт. Протягом 24 годин надішлемо розбір.
    </>
  ),
  list = DEFAULT_AUDIT_LIST,
  foot = "Жодних зобов'язань. Корисно, навіть якщо вирішите працювати з іншим підрядником.",
  inputName = "Як до вас звертатися",
  inputContact = "Імейл або нік у Telegram",
  inputPhone = "+380 (__) ___-__-__",
  inputUrl = "https://...",
  submit = "Отримати розбір за 24 години",
  disclaim = "Не надсилаємо нічого, окрім розбору і одного листа з прикладами наших робіт. Без спаму.",
}: Partial<{
  heading: string;
  sub: React.ReactNode;
  list: React.ReactNode[];
  foot: string;
  inputName: string;
  inputContact: string;
  inputPhone: string;
  inputUrl: string;
  submit: string;
  disclaim: string;
}> = {}) {
  return (
    <section className="relative py-[var(--section-y)] px-[var(--gutter-x)] bg-[linear-gradient(180deg,var(--bg)_0%,oklch(0.13_0.02_300)_100%)] overflow-hidden">
      <div className="audit-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-[2] max-w-container mx-auto grid grid-cols-[minmax(0,1fr)_minmax(0,460px)] gap-[72px] items-center max-[1100px]:grid-cols-1 max-[1100px]:gap-9">
        <div>
          <h2 className="font-display font-bold text-[clamp(34px,4.4vw,54px)] leading-none tracking-[-0.035em] mb-[22px] text-ink uppercase text-balance max-[700px]:text-[clamp(24px,8vw,34px)] max-[700px]:mb-4">
            {heading}
          </h2>
          <p className="text-[15px] leading-[1.6] text-[var(--ink-2)] mb-8 max-w-[46ch] max-[700px]:text-[13px] max-[700px]:mb-[22px] [&_em]:not-italic [&_em]:font-medium">
            {sub}
          </p>
          <ul className="list-none flex flex-col gap-3 mb-7 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[14px] [&>li]:leading-[1.5] [&>li]:text-ink [&>li_em]:not-italic [&>li_em]:font-medium max-[700px]:[&>li]:text-[13px]">
            {list.map((it, i) => (
              <li key={i}>
                <span className="w-[18px] h-[18px] rounded-full shrink-0 mt-px inline-flex items-center justify-center bg-[oklch(from_var(--accent)_l_c_h_/_0.18)] text-accent-soft border border-[oklch(from_var(--accent)_l_c_h_/_0.3)]">
                  <CheckIcon />
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <p className="italic text-[13px] text-[var(--ink-3)] max-w-[50ch] leading-[1.55] max-[700px]:text-[12px]">
            {foot}
          </p>
        </div>
        <form
          className="pt-8 px-7 pb-7 border border-[var(--line-2)] rounded-[22px] bg-[oklch(0.13_0.005_300_/_0.7)] backdrop-blur-[8px] flex flex-col gap-3 max-[1100px]:max-w-[460px] max-[700px]:px-5 max-[700px]:py-[22px] max-[700px]:rounded-2xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="w-full px-[18px] py-[13px] bg-[oklch(0.16_0.005_300)] border border-[var(--line-2)] rounded-full text-ink text-[13px] outline-none transition-[border-color,background] duration-200 placeholder:text-[var(--ink-3)] focus:border-accent-soft focus:bg-[oklch(0.18_0.01_300)]"
            type="text"
            placeholder={inputName}
          />
          <input
            className="w-full px-[18px] py-[13px] bg-[oklch(0.16_0.005_300)] border border-[var(--line-2)] rounded-full text-ink text-[13px] outline-none transition-[border-color,background] duration-200 placeholder:text-[var(--ink-3)] focus:border-accent-soft focus:bg-[oklch(0.18_0.01_300)]"
            type="text"
            placeholder={inputContact}
          />
          <input
            className="w-full px-[18px] py-[13px] bg-[oklch(0.16_0.005_300)] border border-[var(--line-2)] rounded-full text-ink text-[13px] outline-none transition-[border-color,background] duration-200 placeholder:text-[var(--ink-3)] focus:border-accent-soft focus:bg-[oklch(0.18_0.01_300)]"
            type="tel"
            placeholder={inputPhone}
          />
          <input
            className="w-full px-[18px] py-[13px] bg-[oklch(0.16_0.005_300)] border border-[var(--line-2)] rounded-full text-ink text-[13px] outline-none transition-[border-color,background] duration-200 placeholder:text-[var(--ink-3)] focus:border-accent-soft focus:bg-[oklch(0.18_0.01_300)]"
            type="url"
            placeholder={inputUrl}
          />
          <button
            className="w-full px-[22px] py-3.5 bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.20_320))] text-[oklch(1_0_0_/_0.85)] border-0 rounded-full font-display text-[12px] font-semibold tracking-[0.04em] cursor-pointer transition-all duration-[250ms] shadow-[0_12px_30px_oklch(from_var(--accent)_l_c_h_/_0.3)] mt-1.5 uppercase hover:-translate-y-0.5"
            type="submit"
          >
            {submit}
          </button>
          <div className="text-[11px] leading-[1.5] text-[var(--ink-3)] mt-2">
            {disclaim}
          </div>
        </form>
      </div>
    </section>
  );
}

export type FootColumn = {
  h: string;
  items: React.ReactNode[];
};

const DEFAULT_FOOT_COLS: FootColumn[] = [
  {
    h: SITE_CONTACT.phone,
    items: [
      <span key="phone-note" className="nolink">Для дзвінка</span>,
      <span key="email" className="nolink">Hi@code-site.art</span>,
      <span key="write-note" className="nolink">Для письмового зв&#39;язку</span>,
      <a
        key="tg-link"
        href="https://t.me/fedirdev"
        target="_blank"
        rel="noreferrer"
      >
        @fedirdev
      </a>,
      <span key="tg-note" className="nolink">Telegram — швидкий зв&#39;язок</span>,
    ],
  },
  {
    h: "Меню",
    items: [
      <Link key="portfolio" href="/portfolio">
        Портфоліо
      </Link>,
      <Link key="home" href="/">
        Головна
      </Link>,
      <Link key="services" href="/#solutions">
        Послуги
      </Link>,
      <Link key="blog" href="/blog">
        Блог
      </Link>,
      <Link key="contacts" href="/#contact">
        Контакти
      </Link>,
    ],
  },
  {
    h: "Юридичні дані",
    items: [
      <a key="public-contract" href="#">Публічний договір</a>,
      <a key="offer" href="#">Оферта</a>,
      <a key="privacy" href="#">Конфіденційність</a>,
    ],
  },
];

const EN_FOOT_COLS: FootColumn[] = [
  {
    h: SITE_CONTACT.phone,
    items: [
      <span key="phone-note" className="nolink">For calls</span>,
      <span key="email" className="nolink">Hi@code-site.art</span>,
      <span key="write-note" className="nolink">For written contact</span>,
      <a
        key="tg-link"
        href="https://t.me/fedirdev"
        target="_blank"
        rel="noreferrer"
      >
        @fedirdev
      </a>,
      <span key="tg-note" className="nolink">Telegram — fast channel</span>,
    ],
  },
  {
    h: "Menu",
    items: [
      <Link key="portfolio" href="/portfolio">Portfolio</Link>,
      <Link key="home" href="/en">Home</Link>,
      <Link key="services" href="/en#solutions">Services</Link>,
      <Link key="blog" href="/blog">Blog</Link>,
      <Link key="contacts" href="/en#contact">Contact</Link>,
    ],
  },
  {
    h: "Legal",
    items: [
      <a key="public-contract" href="#">Public contract</a>,
      <a key="offer" href="#">Terms of service</a>,
      <a key="privacy" href="#">Privacy policy</a>,
    ],
  },
];

export function ClinicFooter({
  brandName = (
    <>
      <em>Code-Site</em>.Art
    </>
  ),
  brandDesc,
  socials = ["li", "ig", "tg", "tt"] as SocialKind[],
  cols,
  bottomText = "© Code-site.art, 2026",
  locale = "uk",
}: Partial<{
  brandName: React.ReactNode;
  brandDesc: string;
  socials: SocialKind[];
  cols: FootColumn[];
  bottomText: string;
  locale: "uk" | "en";
}> = {}) {
  const resolvedCols = cols ?? (locale === "en" ? EN_FOOT_COLS : DEFAULT_FOOT_COLS);
  const resolvedBrandDesc =
    brandDesc ??
    (locale === "en"
      ? "Code-site.art — boutique custom website studio. 47 projects in 3 years across 4 regions: UA · EU · US · DK."
      : "Code-site.art — кастомна розробка сайтів. 47 проєктів за 3 роки у 4 країнах: UA · EU · US · DK.");
  const labels: Record<SocialKind, string> = {
    li: "LinkedIn",
    ig: "Instagram",
    tg: "Telegram",
    tt: "TikTok",
  };
  return (
    <footer className="bg-[oklch(0.10_0.005_300)] pt-14 px-12 pb-8 border-t border-line relative max-[1100px]:px-8 max-[700px]:pt-10 max-[700px]:px-[18px] max-[700px]:pb-6">
      <div className="max-w-container mx-auto grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-9 max-[1100px]:grid-cols-2 max-[1100px]:gap-8 max-[700px]:grid-cols-1 max-[700px]:gap-7 max-[700px]:mb-6">
        <div>
          <div className="font-display font-bold text-[15px] tracking-[0.18em] uppercase text-ink mb-[18px] [&_em]:not-italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
            {brandName}
          </div>
          <p className="text-[12px] leading-[1.65] text-[var(--ink-3)] max-w-[30ch] mb-5">
            {resolvedBrandDesc}
          </p>
          <div className="flex gap-2 [&>a]:w-8 [&>a]:h-8 [&>a]:border [&>a]:border-line [&>a]:rounded-lg [&>a]:inline-flex [&>a]:items-center [&>a]:justify-center [&>a]:text-[var(--ink-2)] [&>a]:transition-all [&>a]:duration-200 [&>a:hover]:text-accent-soft [&>a:hover]:border-[oklch(from_var(--accent)_l_c_h_/_0.4)]">
            {socials.map((kind) => (
              <a
                key={kind}
                href={FOOTER_SOCIAL_HREFS[kind]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={labels[kind]}
              >
                <SocialIcon kind={kind} />
              </a>
            ))}
          </div>
        </div>
        {resolvedCols.map((col, i) => (
          <div key={i}>
            <div className="font-display text-[11px] font-bold tracking-[0.14em] uppercase text-ink mb-3.5">
              {col.h}
            </div>
            <ul className="list-none flex flex-col gap-2 [&>li>a]:text-[12px] [&>li>a]:text-[var(--ink-2)] [&>li>a]:no-underline [&>li>a]:tracking-[0.02em] [&>li>a]:uppercase [&>li>a]:transition-colors [&>li>a]:duration-200 [&>li>a:hover]:text-accent-soft [&>li_.nolink]:text-[12px] [&>li_.nolink]:text-[var(--ink-2)] [&>li_.nolink]:tracking-[0.02em] [&>li_.nolink]:uppercase">
              {col.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-container mx-auto pt-[22px] border-t border-line text-[11px] text-[var(--ink-3)] tracking-[0.04em]">
        {bottomText}
      </div>
    </footer>
  );
}
