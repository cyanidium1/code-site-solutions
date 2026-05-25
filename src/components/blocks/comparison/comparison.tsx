"use client";

import type * as React from "react";

import { formatPrice } from "@/lib/shared/format-price";
import type { TableRowData, TierProps } from "@/types/pricing";
import { H2 } from "@/components/ui";
import { Tier } from "./tier";
import { TableRow } from "./table-row";
import { CmpTable, CmpThead, CmpTh, CmpPricingGrid } from "./cmp-table";

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

const CMP_H2_EXTRA =
  "mb-7 text-ink text-balance max-w-[22ch] uppercase md:mb-9 xl:mb-14 " +
  "[&_em]:italic [&_em]:font-light [&_em]:normal-case [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_em]:inline-block [&_em]:pr-[0.12em] [&_em]:[margin-right:-0.04em] " +
  "[&_.upper-em]:text-accent-soft [&_.upper-em]:uppercase [&_.upper-em]:not-italic [&_.upper-em]:font-bold";

const CMP_INPUT_BASE =
  "w-full px-[18px] py-[13px] bg-[oklch(0.13_0.005_300_/_0.7)] border border-line-strong text-ink text-[13px] outline-none transition-[border-color,background] duration-200 placeholder:text-ink-3 focus:border-accent-soft focus:bg-[oklch(0.13_0.005_300_/_0.9)] md:px-5 md:py-3.5 md:text-[14px]";

// Section + contact-card relative-color OKLCH backdrops. Both were `.cmp-bg`
// and `.cmp-contact` in the legacy CSS; reproduced here as arbitrary `bg-[...]`
// utilities. Use `--color-accent` / `--color-accent-2` (the `@theme` tokens),
// not the legacy `--accent` aliases.
const CMP_BG =
  "bg-[radial-gradient(ellipse_50%_40%_at_90%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_40%_50%_at_5%_80%,oklch(from_var(--color-accent-2)_l_c_h_/_0.07),transparent_70%)]";

const CMP_CONTACT_BG =
  "bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%),linear-gradient(180deg,oklch(0.18_0.01_300),oklch(0.14_0.005_300))]";

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
    <section className="relative py-14 lg:py-[100px] px-[18px] md:px-8 xl:px-12 bg-bg overflow-hidden">
      <div className={`absolute inset-0 z-0 pointer-events-none ${CMP_BG}`} />
      <div className="relative z-[2] max-w-container mx-auto">
        <H2 variant="comparison" className={CMP_H2_EXTRA}>{tableHeading}</H2>

        <div className="border border-line rounded-[14px] overflow-hidden mb-8 bg-[oklch(0.155_0.005_300)] md:rounded-[18px]">
          <CmpTable>
            <CmpThead>
              <tr>
                <CmpTh>{tableLabels[0]}</CmpTh>
                <CmpTh>{tableLabels[1]}</CmpTh>
                <CmpTh>{tableLabels[2]}</CmpTh>
                <CmpTh good>{tableLabels[3]}</CmpTh>
              </tr>
            </CmpThead>
            <tbody>
              {rows.map((r, i) => (
                <TableRow key={i} {...r} labels={tableLabels} />
              ))}
            </tbody>
          </CmpTable>
        </div>

        <div className="flex flex-col gap-2.5 flex-wrap mb-14 md:flex-row md:gap-3 md:mb-20 xl:mb-[120px]">
          <button className="bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] text-[oklch(1_0_0_/_0.98)] border-0 w-full px-[18px] py-[13px] rounded-full font-sans text-[10px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-[250ms] shadow-[0_8px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_oklch(from_var(--color-accent)_l_c_h_/_0.45)] md:w-auto md:px-[22px] md:text-[11px]">
            {tableCtaPrimary}
          </button>
          <button className="bg-transparent text-ink border border-line-strong w-full px-[18px] py-[13px] rounded-full font-sans text-[10px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:border-ink-dim hover:bg-[oklch(1_0_0_/_0.04)] md:w-auto md:px-5 md:py-3 md:text-[11px]">
            {tableCtaGhost}
          </button>
        </div>

        <div className={`relative px-[22px] py-9 mb-14 border border-line-strong rounded-[18px] overflow-hidden text-center md:px-8 md:py-12 md:mb-20 md:rounded-3xl xl:px-12 xl:py-16 xl:mb-[120px] ${CMP_CONTACT_BG}`}>
          <div className="max-w-[560px] mx-auto">
            <H2
              variant="comparison-contact"
              className="mb-3.5 uppercase text-ink"
            >
              {contactHeading}
            </H2>
            <p className="text-[13px] leading-[1.6] text-ink-dim mb-[22px] text-pretty md:text-[14px] md:mb-8">
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
                className={`${CMP_INPUT_BASE} rounded-[22px] resize-none min-h-[110px] md:py-4`}
                placeholder={contactBrief}
              />
              <button
                className="w-full px-[18px] py-3.5 bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.20_320))] text-[oklch(1_0_0_/_0.85)] border-0 rounded-full font-display text-[11px] font-semibold tracking-[0.04em] cursor-pointer transition-all duration-[250ms] shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] mt-1.5 hover:-translate-y-0.5 md:px-[22px] md:py-4 md:text-[12px]"
                type="submit"
              >
                {contactSubmit}
              </button>
            </form>
            <div className="text-[12px] text-ink-3 mt-5 [&_a]:text-accent-soft [&_a]:no-underline [&_a]:font-semibold [&_a:hover]:underline">
              {contactFoot}
            </div>
          </div>
        </div>

        <H2 variant="comparison" className={CMP_H2_EXTRA}>{pricingHeading}</H2>

        <CmpPricingGrid>
          {tiers.map((t, i) => (
            <Tier key={i} {...t} />
          ))}
        </CmpPricingGrid>
      </div>
    </section>
  );
}
