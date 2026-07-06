"use client";

import type * as React from "react";
import { useState } from "react";
import { getAttribution } from "@/lib/client/attribution";
import { HoneypotField } from "@/components/blocks/honeypot-field";
import { btnClass } from "@/components/ui";

// Hoisted module-level class strings. The four <input>s share the same
// 250+ char Tailwind string; extracting prevents the React reconciler
// from re-allocating an identical literal on every render.
const AUDIT_INPUT_CLASS =
  "w-full px-[18px] py-[13px] bg-[oklch(0.16_0.005_300)] border border-line-strong rounded-full text-ink text-[13px] outline-none transition-[border-color,background] duration-200 placeholder:text-ink-3 focus:border-accent-soft focus:bg-[oklch(0.18_0.01_300)]";

// Gradient submit pill via the `gradient` Btn variant; overrides are this
// button's own padding/size + always-uppercase (see Btn.tsx `gradient` note).
const AUDIT_SUBMIT_CLASS = btnClass("gradient", "mt-1.5 px-[22px] text-[12px] uppercase");

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
  source = "audit",
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
  source: string;
}> = {}) {
  const [form, setForm] = useState({ name: "", contact: "", phone: "", url: "" });
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const busy = status === "submitting" || status === "success";

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const description = [
      form.url.trim() ? `Сайт для аудиту: ${form.url.trim()}` : "",
      form.phone.trim() ? `Телефон: ${form.phone.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          contact: form.contact || form.phone || undefined,
          description: description || "Запит на безкоштовний аудит сайту",
          source,
          hp,
          attribution: getAttribution(),
        }),
      });
      if (!res.ok) throw new Error("Lead endpoint returned non-OK");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    // Section wrapper intentionally NOT hpSectionClass: this block overrides the
    // flat `bg-bg` with a vertical gradient (+ scroll-mt-24), so it keeps its own
    // inline utilities rather than layering a background override onto the shared
    // constant.
    <section id="site-audit" className="relative scroll-mt-24 py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-[linear-gradient(180deg,var(--color-bg)_0%,oklch(0.13_0.02_300)_100%)] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_50%_60%_at_0%_50%,oklch(from_var(--color-accent-2)_l_c_h_/_0.18),transparent_70%),radial-gradient(ellipse_40%_50%_at_100%_100%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%)]" />
      <div className="relative z-[2] max-w-container mx-auto grid grid-cols-1 gap-9 items-center xl:grid-cols-[minmax(0,1fr)_minmax(0,460px)] xl:gap-[72px]">
        <div>
          <h2 className="font-display font-bold text-[clamp(24px,8vw,34px)] leading-none tracking-[-0.035em] mb-4 text-ink uppercase text-balance md:text-[clamp(34px,4.4vw,54px)] md:mb-[22px]">
            {heading}
          </h2>
          <p className="text-[13px] leading-[1.6] text-ink-dim mb-[22px] max-w-[46ch] md:text-[15px] md:mb-8 [&_em]:not-italic [&_em]:font-medium">
            {sub}
          </p>
          <ul className="list-none flex flex-col gap-3 mb-7 [&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.5] [&>li]:text-ink [&>li_em]:not-italic [&>li_em]:font-medium md:[&>li]:text-[14px]">
            {list.map((it, i) => (
              <li key={i}>
                <span className="w-[18px] h-[18px] rounded-full shrink-0 mt-px inline-flex items-center justify-center bg-accent-18 text-accent-soft border border-accent-30">
                  <CheckIcon />
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <p className="italic text-[12px] text-ink-3 max-w-[50ch] leading-[1.55] md:text-[13px]">
            {foot}
          </p>
        </div>
        <form
          className="px-5 py-[22px] max-w-[460px] border border-line-strong rounded-2xl bg-[oklch(0.13_0.005_300_/_0.7)] backdrop-blur-[8px] flex flex-col gap-3 md:px-7 md:py-7 md:pt-8 md:rounded-[22px] xl:max-w-none"
          onSubmit={onSubmit}
        >
          <HoneypotField value={hp} onChange={setHp} />
          <input
            className={AUDIT_INPUT_CLASS}
            type="text"
            placeholder={inputName}
            value={form.name}
            onChange={set("name")}
            required
            disabled={busy}
          />
          <input
            className={AUDIT_INPUT_CLASS}
            type="text"
            placeholder={inputContact}
            value={form.contact}
            onChange={set("contact")}
            required
            disabled={busy}
          />
          <input
            className={AUDIT_INPUT_CLASS}
            type="tel"
            placeholder={inputPhone}
            value={form.phone}
            onChange={set("phone")}
            disabled={busy}
          />
          <input
            className={AUDIT_INPUT_CLASS}
            type="url"
            placeholder={inputUrl}
            value={form.url}
            onChange={set("url")}
            disabled={busy}
          />
          <button
            className={AUDIT_SUBMIT_CLASS}
            type="submit"
            disabled={busy}
          >
            {status === "submitting" ? "…" : status === "success" ? "Дякуємо! Скоро напишемо" : submit}
          </button>
          {status === "error" ? (
            <div role="alert" className="text-[12px] text-[oklch(0.78_0.16_25)]">
              Не вдалося надіслати. Спробуйте ще раз або напишіть напряму.
            </div>
          ) : null}
          <div className="text-[11px] leading-[1.5] text-ink-3 mt-2">
            {disclaim}
          </div>
        </form>
      </div>
    </section>
  );
}
