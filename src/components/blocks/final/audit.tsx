"use client";

import type * as React from "react";

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
    <section className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-[linear-gradient(180deg,var(--bg)_0%,oklch(0.13_0.02_300)_100%)] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_0%_50%,oklch(from_var(--color-accent-2)_l_c_h_/_0.18),transparent_70%),radial-gradient(ellipse_40%_50%_at_100%_100%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%)]" />
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
