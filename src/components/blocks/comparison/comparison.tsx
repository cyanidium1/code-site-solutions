"use client";

import type * as React from "react";

import { formatPrice } from "@/lib/shared/format-price";
import type { TableRowData, TierProps } from "@/types/pricing";
import { Tier } from "./tier";
import { TableRow } from "./table-row";

const DEFAULT_TABLE_LABELS = ["Параметр", "Шаблон WP", "Wix", "Кодовий сайт"];
const DEFAULT_ROWS: TableRowData[] = [
  { param: "Швидкість завантаження", wp: "5–8 сек", wix: "3–6 сек", custom: "0,8–1,5 сек" },
  { param: "Онлайн-запис", wp: "плагін (баги)", wix: "через Apps", custom: "кастомна" },
  { param: "Інтеграція з мед. CRM", wp: "обмежена", wix: "немає (Zapier)", custom: "будь-яка" },
  { param: "Локальне SEO", wp: "плагін Yoast", wix: "базове", custom: "закладено" },
  { param: "Безпека даних пацієнтів", wp: "низька", wix: "середня", custom: "висока (GDPR)" },
  { param: "Юр. коректність МОЗ", wp: "залежить від теми", wix: "обмежено", custom: "перевіряємо юристом" },
  { param: "TCO за 3 роки", wp: "$4–6k", wix: "$3,5–5k", custom: "$5–7k" },
];

const DEFAULT_TIERS: TierProps[] = [
  {
    name: <>Базовий сайт<br />клініки</>,
    price: formatPrice(3500, { locale: "uk" }),
    weeks: "4 тижні",
    includes: {
      heading: "Що входить",
      items: [
        "До 8 сторінок",
        "Онлайн-запис",
        "Каталог лікарів і послуг",
        "Прозорий прайс",
        "Відгуки пацієнтів",
        "Базове SEO",
        "Мобільна адаптація",
      ],
    },
    excludes: {
      items: [
        "Створення контенту (тексти послуг, описи лікарів)",
        "Професійна фотозйомка",
        "ДМС-інтеграція",
        "Блог",
      ],
    },
    ctaLabel: "Замовити базовий",
  },
  {
    popular: true,
    name: "Розширений",
    price: formatPrice(6500, { locale: "uk" }),
    weeks: "6 тижнів",
    includes: {
      heading: "Все з базового +",
      items: [
        "Блог і SEO-сторінки",
        "ДМС-інтеграція",
        "Фото-кейси до/після",
        "Історія відвідувань і нагадування",
        "Онлайн-консультація",
        "Інтеграція з медичною CRM",
      ],
    },
    excludes: {
      items: [
        "Фотозйомка (можемо організувати окремо)",
        "Контент для блогу (можемо запропонувати копірайтера)",
        "Багатомовність",
      ],
    },
    ctaLabel: "Замовити розширений",
  },
  {
    name: <>Преміум / мережа<br />клінік</>,
    price: formatPrice(12000, { locale: "uk" }),
    weeks: "8–10 тижнів",
    includes: {
      heading: "Все з розширеного +",
      items: [
        "Багатофіліальна структура",
        "Повна CRM-інтеграція",
        "Багатомовність",
        "Кастомні модулі під вашу спеціалізацію",
        "Підтримка по SLA",
      ],
    },
    excludes: {
      items: [
        "Створення фото/відео контенту",
        "Юридичний консалтинг (тільки технічна юр-коректність)",
      ],
    },
    ctaLabel: "Обговорити мережу",
    ctaGhost: true,
  },
];

const CMP_H2_CLASSES =
  "font-display font-bold text-[clamp(34px,4.4vw,56px)] leading-none tracking-[-0.035em] mb-14 text-ink text-balance max-w-[22ch] uppercase max-[1100px]:text-[clamp(28px,5vw,44px)] max-[1100px]:mb-9 max-[700px]:text-[clamp(24px,8vw,34px)] max-[700px]:mb-7 [&_em]:italic [&_em]:font-light [&_em]:normal-case [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_em]:inline-block [&_em]:pr-[0.12em] [&_em]:[margin-right:-0.04em] [&_.upper-em]:text-accent-soft [&_.upper-em]:uppercase [&_.upper-em]:not-italic [&_.upper-em]:font-bold";

const CMP_INPUT_BASE =
  "w-full px-5 py-3.5 bg-[oklch(0.13_0.005_300_/_0.7)] border border-[var(--line-2)] text-ink text-[14px] outline-none transition-[border-color,background] duration-200 placeholder:text-[var(--ink-3)] focus:border-accent-soft focus:bg-[oklch(0.13_0.005_300_/_0.9)] max-[700px]:px-[18px] max-[700px]:py-[13px] max-[700px]:text-[13px]";

export function Comparison({
  tableHeading = (
    <>
      Чим кодовий сайт
      <br />
      кращий за шаблонну
      <br />
      медицину на <span className="upper-em">WordPress</span> або{" "}
      <span className="upper-em">Wix</span>
    </>
  ),
  tableLabels = DEFAULT_TABLE_LABELS,
  rows = DEFAULT_ROWS,
  tableCtaPrimary = "Детальне порівняння конструкторів",
  tableCtaGhost = "Порівняння з WordPress",
  contactHeading = "Обговорити проєкт",
  contactSub = "Розкажіть коротко про вашу клініку — відповімо в Telegram протягом 1–2 годин у робочий час.",
  contactName = "Як до вас звертатися",
  contactChannel = "Telegram, телефон або email",
  contactBrief = "Яка клініка, який сайт потрібен, що зараз не працює",
  contactSubmit = "Надіслати — відповімо за 1–2 години",
  contactFoot = (
    <>
      Або одразу пишіть у Telegram —{" "}
      <a href="https://t.me/fedirdev" target="_blank" rel="noreferrer">
        @fedirdev
      </a>
    </>
  ),
  pricingHeading = "Скільки коштує сайт для клініки",
  tiers = DEFAULT_TIERS,
}: Partial<{
  tableHeading: React.ReactNode;
  tableLabels: string[];
  rows: TableRowData[];
  tableCtaPrimary: string;
  tableCtaGhost: string;
  contactHeading: string;
  contactSub: string;
  contactName: string;
  contactChannel: string;
  contactBrief: string;
  contactSubmit: string;
  contactFoot: React.ReactNode;
  pricingHeading: React.ReactNode;
  tiers: TierProps[];
}> = {}) {
  return (
    <section className="relative py-[var(--section-y)] px-12 bg-bg overflow-hidden max-[1100px]:px-8 max-[700px]:px-[18px]">
      <div className="cmp-bg absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-[2] max-w-container mx-auto">
        <h2 className={CMP_H2_CLASSES}>{tableHeading}</h2>

        <div className="border border-line rounded-[18px] overflow-hidden mb-8 bg-[oklch(0.155_0.005_300)] max-[700px]:rounded-[14px]">
          <table className="cmp-table">
            <thead>
              <tr>
                <th>{tableLabels[0]}</th>
                <th>{tableLabels[1]}</th>
                <th>{tableLabels[2]}</th>
                <th className="cmp-th-good">{tableLabels[3]}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <TableRow key={i} {...r} labels={tableLabels} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 flex-wrap mb-[120px] max-[1100px]:mb-20 max-[700px]:flex-col max-[700px]:gap-2.5 max-[700px]:mb-14">
          <button className="bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] text-[oklch(1_0_0_/_0.98)] border-0 px-[22px] py-[13px] rounded-full font-sans text-[11px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-[250ms] shadow-[0_8px_24px_oklch(from_var(--accent)_l_c_h_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_oklch(from_var(--accent)_l_c_h_/_0.45)] max-[700px]:w-full max-[700px]:px-[18px] max-[700px]:py-[13px] max-[700px]:text-[10px]">
            {tableCtaPrimary}
          </button>
          <button className="bg-transparent text-ink border border-[var(--line-2)] px-5 py-3 rounded-full font-sans text-[11px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:border-[var(--ink-2)] hover:bg-[oklch(1_0_0_/_0.04)] max-[700px]:w-full max-[700px]:px-[18px] max-[700px]:py-[13px] max-[700px]:text-[10px]">
            {tableCtaGhost}
          </button>
        </div>

        <div className="cmp-contact relative px-12 py-16 mb-[120px] border border-[var(--line-2)] rounded-3xl overflow-hidden text-center max-[1100px]:px-8 max-[1100px]:py-12 max-[1100px]:mb-20 max-[700px]:px-[22px] max-[700px]:py-9 max-[700px]:mb-14 max-[700px]:rounded-[18px]">
          <div className="max-w-[560px] mx-auto">
            <h2 className="font-display font-bold text-[clamp(28px,3.6vw,44px)] leading-none tracking-[-0.03em] mb-3.5 uppercase text-ink max-[700px]:text-[26px]">
              {contactHeading}
            </h2>
            <p className="text-[14px] leading-[1.6] text-[var(--ink-2)] mb-8 text-pretty max-[700px]:text-[13px] max-[700px]:mb-[22px]">
              {contactSub}
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className={`${CMP_INPUT_BASE} rounded-full`}
                type="text"
                placeholder={contactName}
              />
              <input
                className={`${CMP_INPUT_BASE} rounded-full`}
                type="text"
                placeholder={contactChannel}
              />
              <textarea
                className={`${CMP_INPUT_BASE} rounded-[22px] resize-none min-h-[110px] px-5 py-4 max-[700px]:px-[18px] max-[700px]:py-[13px]`}
                placeholder={contactBrief}
              />
              <button
                className="w-full px-[22px] py-4 bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.20_320))] text-[oklch(1_0_0_/_0.85)] border-0 rounded-full font-display text-[12px] font-semibold tracking-[0.04em] cursor-pointer transition-all duration-[250ms] shadow-[0_12px_30px_oklch(from_var(--accent)_l_c_h_/_0.3)] mt-1.5 hover:-translate-y-0.5 max-[700px]:px-[18px] max-[700px]:py-3.5 max-[700px]:text-[11px]"
                type="submit"
              >
                {contactSubmit}
              </button>
            </form>
            <div className="text-[12px] text-[var(--ink-3)] mt-5 [&_a]:text-accent-soft [&_a]:no-underline [&_a]:font-semibold [&_a:hover]:underline">
              {contactFoot}
            </div>
          </div>
        </div>

        <h2 className={CMP_H2_CLASSES}>{pricingHeading}</h2>

        <div className="cmp-pricing-grid">
          {tiers.map((t, i) => (
            <Tier key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
