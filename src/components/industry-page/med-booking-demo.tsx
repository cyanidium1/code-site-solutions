"use client";

import { useState } from "react";
import { ArrowLeft, Bell, Check, MessageSquareText } from "lucide-react";

import type { Locale } from "@/constants/locales";

/**
 * Interactive booking-widget demo for the medicine industry page.
 *
 * Design intent (reference-locked): the widget is a deliberately LIGHT
 * "window into the clinic's own site" sitting on our dark studio canvas —
 * cream surface, ink text, forest-green CTA, mint tints (healthcare-trust
 * palette). Those tokens live only inside this card; the surrounding
 * section stays on site tokens. Step flow follows the common healthcare
 * booking wizard: service → practitioner & slot → confirmation.
 *
 * It is a demo: nothing is submitted anywhere.
 */

/* Light-island tokens (used inside the widget only) */
const W = {
  canvas: "#fffefc",
  ink: "#1f2421",
  inkSoft: "#5b6360",
  border: "#e5e7eb",
  green: "#0f3e17",
  mint: "#e1f4df",
  mintDeep: "#cfe7d3",
};

type Step = 0 | 1 | 2 | 3;

type Copy = {
  eyebrow: string;
  heading: [string, string];
  sub: string;
  bullets: { title: string; line: string }[];
  tryNote: string;
  ctaLabel: string;
  widget: {
    clinicName: string;
    steps: [string, string, string];
    services: { name: string; price: string; dur: string }[];
    doctors: { initials: string; name: string; role: string }[];
    slotsTitle: string;
    slots: string[];
    disabledSlots: number[];
    confirmTitle: string;
    summaryLabels: { service: string; doctor: string; time: string };
    confirmBtn: string;
    back: string;
    next: string;
    successTitle: string;
    successSms: string;
    successTg: string;
    again: string;
    privacy: string;
    demoNote: string;
  };
};

const COPY: Record<Locale, Copy> = {
  uk: {
    eyebrow: "/ ЖИВЕ ДЕМО",
    heading: ["Ось що отримують ", "пацієнти вашої клініки"],
    sub: "Не скріншот і не відео — робочий віджет запису, який ми вбудовуємо в сайти клінік. Потикайте його прямо тут.",
    bullets: [
      { title: "Запис за 3 кроки", line: "послуга → лікар і час → підтвердження" },
      { title: "SMS пацієнту", line: "підтвердження і нагадування за день" },
      { title: "Сповіщення вам", line: "Telegram адміністратору або одразу в CRM" },
    ],
    tryNote: "Це інтерактивне демо — жодні дані нікуди не надсилаються.",
    ctaLabel: "Хочу такий на свій сайт",
    widget: {
      clinicName: "Клініка «Приклад» · Онлайн-запис",
      steps: ["Послуга", "Лікар і час", "Підтвердження"],
      services: [
        { name: "Консультація стоматолога", price: "₴500", dur: "30 хв" },
        { name: "Професійна гігієна", price: "₴1 400", dur: "60 хв" },
        { name: "Лікування карієсу", price: "від ₴1 800", dur: "60 хв" },
        { name: "Відбілювання", price: "₴4 200", dur: "90 хв" },
      ],
      doctors: [
        { initials: "ОК", name: "Ольга Коваленко", role: "терапевт, 12 р. досвіду" },
        { initials: "АМ", name: "Андрій Мельник", role: "хірург-імплантолог" },
      ],
      slotsTitle: "Завтра, 17 серпня",
      slots: ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"],
      disabledSlots: [1, 3],
      confirmTitle: "Перевірте запис",
      summaryLabels: { service: "Послуга", doctor: "Лікар", time: "Час" },
      confirmBtn: "Підтвердити запис",
      back: "Назад",
      next: "Далі",
      successTitle: "Запис підтверджено!",
      successSms: "SMS-підтвердження надіслано пацієнту",
      successTg: "Адміністратор отримав сповіщення в Telegram",
      again: "Спробувати ще раз",
      privacy: "Дані пацієнтів захищені · GDPR",
      demoNote: "У вашої клініки це працюватиме з вашими послугами, лікарями і графіком.",
    },
  },
  ru: {
    eyebrow: "/ ЖИВОЕ ДЕМО",
    heading: ["Вот что получают ", "пациенты вашей клиники"],
    sub: "Не скриншот и не видео — рабочий виджет записи, который мы встраиваем в сайты клиник. Потыкайте его прямо здесь.",
    bullets: [
      { title: "Запись за 3 шага", line: "услуга → врач и время → подтверждение" },
      { title: "SMS пациенту", line: "подтверждение и напоминание за день" },
      { title: "Уведомление вам", line: "Telegram администратору или сразу в CRM" },
    ],
    tryNote: "Это интерактивное демо — никакие данные никуда не отправляются.",
    ctaLabel: "Хочу такой на свой сайт",
    widget: {
      clinicName: "Клиника «Пример» · Онлайн-запись",
      steps: ["Услуга", "Врач и время", "Подтверждение"],
      services: [
        { name: "Консультация стоматолога", price: "₴500", dur: "30 мин" },
        { name: "Профессиональная гигиена", price: "₴1 400", dur: "60 мин" },
        { name: "Лечение кариеса", price: "от ₴1 800", dur: "60 мин" },
        { name: "Отбеливание", price: "₴4 200", dur: "90 мин" },
      ],
      doctors: [
        { initials: "ОК", name: "Ольга Коваленко", role: "терапевт, 12 лет опыта" },
        { initials: "АМ", name: "Андрей Мельник", role: "хирург-имплантолог" },
      ],
      slotsTitle: "Завтра, 17 августа",
      slots: ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"],
      disabledSlots: [1, 3],
      confirmTitle: "Проверьте запись",
      summaryLabels: { service: "Услуга", doctor: "Врач", time: "Время" },
      confirmBtn: "Подтвердить запись",
      back: "Назад",
      next: "Далее",
      successTitle: "Запись подтверждена!",
      successSms: "SMS-подтверждение отправлено пациенту",
      successTg: "Администратор получил уведомление в Telegram",
      again: "Попробовать ещё раз",
      privacy: "Данные пациентов защищены · GDPR",
      demoNote: "У вашей клиники это будет работать с вашими услугами, врачами и графиком.",
    },
  },
  en: {
    eyebrow: "/ LIVE DEMO",
    heading: ["This is what ", "your clinic's patients get"],
    sub: "Not a screenshot, not a video — the working booking widget we build into clinic websites. Try it right here.",
    bullets: [
      { title: "Booking in 3 steps", line: "service → practitioner & time → confirmation" },
      { title: "SMS to the patient", line: "confirmation plus a reminder the day before" },
      { title: "A ping to you", line: "Telegram to reception, or straight into your CRM" },
    ],
    tryNote: "This is an interactive demo — nothing is sent anywhere.",
    ctaLabel: "I want this on my site",
    widget: {
      clinicName: "Example Clinic · Online booking",
      steps: ["Service", "Practitioner & time", "Confirmation"],
      services: [
        { name: "Dental consultation", price: "£45", dur: "30 min" },
        { name: "Hygiene appointment", price: "£95", dur: "60 min" },
        { name: "Filling", price: "from £120", dur: "60 min" },
        { name: "Whitening", price: "£280", dur: "90 min" },
      ],
      doctors: [
        { initials: "OK", name: "Olha Kovalenko", role: "GDP, 12 yrs experience" },
        { initials: "AM", name: "Andrii Melnyk", role: "implant surgeon" },
      ],
      slotsTitle: "Tomorrow, 17 August",
      slots: ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"],
      disabledSlots: [1, 3],
      confirmTitle: "Check your booking",
      summaryLabels: { service: "Service", doctor: "Practitioner", time: "Time" },
      confirmBtn: "Confirm booking",
      back: "Back",
      next: "Next",
      successTitle: "Booking confirmed!",
      successSms: "An SMS confirmation was sent to the patient",
      successTg: "Reception got a Telegram notification",
      again: "Try it again",
      privacy: "Patient data protected · UK GDPR",
      demoNote: "On your clinic's site this runs with your services, practitioners and schedule.",
    },
  },
};

const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 py-1.5 px-3 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase " +
  "before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]";

export function MedBookingDemo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const w = c.widget;
  const [step, setStep] = useState<Step>(0);
  const [service, setService] = useState<number | null>(null);
  const [doctor, setDoctor] = useState<number | null>(null);
  const [slot, setSlot] = useState<number | null>(null);

  const reset = () => {
    setStep(0);
    setService(null);
    setDoctor(null);
    setSlot(null);
  };

  return (
    <section className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_44%_40%_at_80%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.07),transparent_70%)]" />
      <div className="relative max-w-container mx-auto grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 items-center">
        {/* Left: pitch */}
        <div>
          <span className={EYEBROW_CLASS}>{c.eyebrow}</span>
          <h2 className="mt-6 mb-0 font-actay uppercase font-bold text-[clamp(24px,3.2vw,40px)] leading-[1.15] text-ink [&_em]:not-italic [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent">
            {c.heading[0]}
            <em>{c.heading[1]}</em>
          </h2>
          <p className="mt-5 font-sans text-[15px] leading-[1.65] text-ink-dim max-w-[480px]">
            {c.sub}
          </p>
          <ul className="mt-7 list-none m-0 p-0 flex flex-col gap-4">
            {c.bullets.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-accent-40 bg-[oklch(from_var(--color-accent)_l_c_h_/_0.1)]">
                  <Check size={13} strokeWidth={2.5} className="text-accent-soft" />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-[14px] font-semibold text-ink">
                    {b.title}
                  </span>
                  <span className="block font-sans text-[13px] text-ink-3">
                    {b.line}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[11.5px] text-ink-3">{c.tryNote}</p>
          <a
            href={locale === "uk" ? "/contacts" : `/${locale}/contacts`}
            className="mt-5 inline-flex items-center min-h-11 py-2.5 px-6 rounded-full font-sans font-semibold text-[13px] tracking-[0.03em] text-[oklch(1_0_0_/_0.95)] no-underline bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.32)] transition-transform duration-200 hover:-translate-y-px"
          >
            {c.ctaLabel}
          </a>
        </div>

        {/* Right: the light "clinic site" widget island */}
        <div>
          <div
            className="rounded-[22px] overflow-hidden shadow-[0_36px_90px_oklch(0_0_0_/_0.55)]"
            // eslint-disable-next-line react/forbid-dom-props -- light-island tokens are deliberately hardcoded (see component docblock)
            style={{ background: W.canvas, color: W.ink }}
          >
            {/* Widget header */}
            <div
              className="flex items-center justify-between gap-3 px-5 py-3.5"
              style={{ borderBottom: `1px solid ${W.border}` }}
            >
              <span className="font-sans text-[13px] font-semibold">{w.clinicName}</span>
              <span
                className="hidden sm:inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[10.5px] font-medium"
                style={{ background: W.mint, color: W.green }}
              >
                {w.privacy}
              </span>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 px-5 pt-4">
              {w.steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-semibold"
                    style={
                      step >= i
                        ? { background: W.green, color: W.canvas }
                        : { background: "#f0f1ef", color: W.inkSoft }
                    }
                  >
                    {step > i || step === 3 ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className="hidden md:block font-sans text-[11.5px] truncate"
                    style={{ color: step >= i ? W.ink : W.inkSoft }}
                  >
                    {label}
                  </span>
                  {i < 2 && (
                    <span
                      className="h-px w-4 md:w-6 shrink-0"
                      style={{ background: W.border }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="p-5 min-h-[320px]">
              {step === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {w.services.map((s, i) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setService(i);
                        setStep(1);
                      }}
                      className="text-left rounded-[14px] p-3.5 cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-px"
                      style={{
                        background: service === i ? W.mint : "#fff",
                        border: `1px solid ${service === i ? W.mintDeep : W.border}`,
                      }}
                    >
                      <span className="block font-sans text-[13.5px] font-semibold" style={{ color: W.ink }}>
                        {s.name}
                      </span>
                      <span className="mt-1 flex items-center justify-between font-sans text-[12px]" style={{ color: W.inkSoft }}>
                        <span>{s.dur}</span>
                        <span className="font-semibold" style={{ color: W.green }}>{s.price}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {w.doctors.map((d, i) => (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => setDoctor(i)}
                        className="flex items-center gap-3 text-left rounded-[14px] p-3 cursor-pointer"
                        style={{
                          background: doctor === i ? W.mint : "#fff",
                          border: `1px solid ${doctor === i ? W.mintDeep : W.border}`,
                        }}
                      >
                        <span
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-bold"
                          style={{ background: W.green, color: W.canvas }}
                        >
                          {d.initials}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-sans text-[13px] font-semibold truncate" style={{ color: W.ink }}>
                            {d.name}
                          </span>
                          <span className="block font-sans text-[11.5px] truncate" style={{ color: W.inkSoft }}>
                            {d.role}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <div>
                    <div className="font-sans text-[12px] font-medium mb-2" style={{ color: W.inkSoft }}>
                      {w.slotsTitle}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {w.slots.map((t, i) => {
                        const disabled = w.disabledSlots.includes(i);
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={disabled}
                            onClick={() => setSlot(i)}
                            className="rounded-[10px] py-2 font-sans text-[13px] font-medium cursor-pointer disabled:cursor-default disabled:opacity-40 disabled:line-through"
                            style={{
                              background: slot === i ? W.green : "#fff",
                              color: slot === i ? W.canvas : W.ink,
                              border: `1px solid ${slot === i ? W.green : W.border}`,
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-1.5 font-sans text-[12.5px] cursor-pointer bg-transparent border-0 p-0"
                      style={{ color: W.inkSoft }}
                    >
                      <ArrowLeft size={14} /> {w.back}
                    </button>
                    <button
                      type="button"
                      disabled={doctor === null || slot === null}
                      onClick={() => setStep(2)}
                      className="rounded-full px-6 py-2.5 font-sans text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-default"
                      style={{ background: W.green, color: W.canvas }}
                    >
                      {w.next}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && service !== null && doctor !== null && slot !== null && (
                <div className="flex flex-col gap-4">
                  <div className="font-sans text-[15px] font-semibold">{w.confirmTitle}</div>
                  <div
                    className="rounded-[14px] p-4 flex flex-col gap-2.5"
                    style={{ background: W.mint }}
                  >
                    {(
                      [
                        [w.summaryLabels.service, w.services[service].name + " · " + w.services[service].price],
                        [w.summaryLabels.doctor, w.doctors[doctor].name],
                        [w.summaryLabels.time, w.slotsTitle + ", " + w.slots[slot]],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="flex items-baseline justify-between gap-3">
                        <span className="font-sans text-[12px]" style={{ color: W.inkSoft }}>{label}</span>
                        <span className="font-sans text-[13px] font-semibold text-right" style={{ color: W.ink }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 font-sans text-[12.5px] cursor-pointer bg-transparent border-0 p-0"
                      style={{ color: W.inkSoft }}
                    >
                      <ArrowLeft size={14} /> {w.back}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="rounded-full px-6 py-2.5 font-sans text-[13.5px] font-semibold cursor-pointer transition-transform duration-150 hover:-translate-y-px"
                      style={{ background: W.green, color: W.canvas }}
                    >
                      {w.confirmBtn}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center text-center gap-3 pt-4">
                  <span
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: W.mint }}
                  >
                    <Check size={28} strokeWidth={2.5} style={{ color: W.green }} />
                  </span>
                  <div className="font-sans text-[17px] font-bold" style={{ color: W.ink }}>
                    {w.successTitle}
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-[340px]">
                    <div
                      className="flex items-center gap-2.5 rounded-[12px] px-3.5 py-2.5 text-left"
                      style={{ background: "#fff", border: `1px solid ${W.border}` }}
                    >
                      <MessageSquareText size={16} style={{ color: W.green }} className="shrink-0" />
                      <span className="font-sans text-[12.5px]" style={{ color: W.ink }}>{w.successSms}</span>
                    </div>
                    <div
                      className="flex items-center gap-2.5 rounded-[12px] px-3.5 py-2.5 text-left"
                      style={{ background: "#fff", border: `1px solid ${W.border}` }}
                    >
                      <Bell size={16} style={{ color: W.green }} className="shrink-0" />
                      <span className="font-sans text-[12.5px]" style={{ color: W.ink }}>{w.successTg}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-2 font-sans text-[12.5px] underline cursor-pointer bg-transparent border-0 p-0"
                    style={{ color: W.inkSoft }}
                  >
                    {w.again}
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-ink-3">
            {w.demoNote}
          </p>
        </div>
      </div>
    </section>
  );
}
