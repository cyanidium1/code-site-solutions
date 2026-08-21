"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Check,
  Database,
  Lock,
  MessageSquareText,
  Timer,
  UserCheck,
} from "lucide-react";

import type { Locale } from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import { MED_COPY } from "./copy";

import "./medicine.css";

/**
 * Interactive booking demo for the medicine industry page.
 *
 * The pitch: a clinic owner has seen a hundred screenshots of booking forms.
 * What they have never seen is what happens *behind* one. So the section is
 * built as two synchronised panels — the patient's view on the left, the
 * clinic's view on the right — and every tap on the left fires a real-looking
 * event on the right. The argument is made by the mechanism, not by a bullet
 * list claiming the mechanism exists.
 *
 * Reference lock:
 *  - Ease Health supplies the light island: cream canvas, forest-green primary,
 *    mint tints, 14px radii. Those tokens are scoped to `W` below and must not
 *    leak onto the studio's dark canvas.
 *  - code-site-frontend's MockupArt supplies the browser chrome, so the island
 *    reads as "your clinic's site", not as a floating white card.
 *  - Impilo supplies the event rail's register: --med-vital for a confirmed
 *    state, --med-signal for data, hairlines instead of shadows.
 *
 * Nothing is submitted anywhere.
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

type EventKey = "service" | "doctor" | "slot" | "confirm" | "sms" | "crm";

type Copy = {
  eyebrow: string;
  heading: [string, string];
  sub: string;
  tryNote: string;
  ctaLabel: string;
  patientSide: string;
  widget: {
    clinicName: string;
    clinicUrl: string;
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
    moreServices: string;
    priceListLink: string;
  };
};

const COPY: Record<Locale, Copy> = {
  uk: {
    eyebrow: "ЖИВЕ ДЕМО",
    heading: ["Потикайте віджет запису і подивіться, ", "що бачить клініка"],
    sub: "Ліворуч — те, що бачить пацієнт. Праворуч — те, що в цю саму секунду відбувається в адмінці, CRM і Telegram. Це той самий віджет, який ми вбудовуємо в сайти клінік.",
    tryNote: "Інтерактивне демо — жодні дані нікуди не надсилаються.",
    ctaLabel: "Хочу такий на свій сайт",
    patientSide: "СТОРОНА ПАЦІЄНТА",
    widget: {
      clinicName: "Клініка «Приклад» · Онлайн-запис",
      clinicUrl: "klinika-pryklad.ua/zapys",
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
      successTitle: "Запис підтверджено",
      successSms: "SMS-підтвердження надіслано пацієнту",
      successTg: "Адміністратор отримав сповіщення в Telegram",
      again: "Спробувати ще раз",
      privacy: "Дані пацієнтів захищені · GDPR",
      demoNote: "У вашої клініки це працюватиме з вашими послугами, лікарями і графіком.",
      moreServices: "Ще 14 послуг клініки",
      priceListLink: "Повний прайс →",
    },
  },
  ru: {
    eyebrow: "ЖИВОЕ ДЕМО",
    heading: ["Потыкайте виджет записи и посмотрите, ", "что видит клиника"],
    sub: "Слева — то, что видит пациент. Справа — то, что в эту же секунду происходит в админке, CRM и Telegram. Это тот самый виджет, который мы встраиваем в сайты клиник.",
    tryNote: "Интерактивное демо — никакие данные никуда не отправляются.",
    ctaLabel: "Хочу такой на свой сайт",
    patientSide: "СТОРОНА ПАЦИЕНТА",
    widget: {
      clinicName: "Клиника «Пример» · Онлайн-запись",
      clinicUrl: "klinika-primer.ua/zapis",
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
      successTitle: "Запись подтверждена",
      successSms: "SMS-подтверждение отправлено пациенту",
      successTg: "Администратор получил уведомление в Telegram",
      again: "Попробовать ещё раз",
      privacy: "Данные пациентов защищены · GDPR",
      demoNote: "У вашей клиники это будет работать с вашими услугами, врачами и графиком.",
      moreServices: "Ещё 14 услуг клиники",
      priceListLink: "Полный прайс →",
    },
  },
  en: {
    eyebrow: "LIVE DEMO",
    heading: ["Poke the booking widget and watch ", "what the clinic sees"],
    sub: "On the left, what the patient sees. On the right, what happens that same second in the admin panel, the CRM and Telegram. It is the widget we build into clinic websites.",
    tryNote: "Interactive demo — nothing is sent anywhere.",
    ctaLabel: "I want this on my site",
    patientSide: "PATIENT SIDE",
    widget: {
      clinicName: "Example Clinic · Online booking",
      clinicUrl: "example-clinic.co.uk/book",
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
      successTitle: "Booking confirmed",
      successSms: "An SMS confirmation was sent to the patient",
      successTg: "Reception got a Telegram notification",
      again: "Try it again",
      privacy: "Patient data protected · UK GDPR",
      demoNote: "On your clinic's site this runs with your services, practitioners and schedule.",
      moreServices: "14 more clinic services",
      priceListLink: "Full price list →",
    },
  },
};

/** Rail order — the sequence a real booking fires them in. */
const EVENT_ORDER: EventKey[] = [
  "service",
  "doctor",
  "slot",
  "confirm",
  "sms",
  "crm",
];

/** Event rail rows. `tone` binds to the page's role-locked accents. */
const EVENT_META: Record<
  EventKey,
  { icon: typeof Timer; tone: "signal" | "vital"; stamp: string }
> = {
  service: { icon: Database, tone: "signal", stamp: "+0.1s" },
  doctor: { icon: UserCheck, tone: "signal", stamp: "+0.2s" },
  slot: { icon: Timer, tone: "signal", stamp: "+0.2s" },
  confirm: { icon: Check, tone: "vital", stamp: "+0.4s" },
  sms: { icon: MessageSquareText, tone: "vital", stamp: "+1.1s" },
  crm: { icon: Bell, tone: "vital", stamp: "+1.3s" },
};

export function MedBookingDemo({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const w = c.widget;
  const rail = MED_COPY[locale].demo;

  const [step, setStep] = useState<Step>(0);
  const [service, setService] = useState<number | null>(null);
  const [doctor, setDoctor] = useState<number | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [events, setEvents] = useState<EventKey[]>([]);

  /** Appends an event once — replaying a step must not duplicate the rail. */
  const fire = (...keys: EventKey[]) =>
    setEvents((prev) => [...prev, ...keys.filter((k) => !prev.includes(k))]);

  const reset = () => {
    setStep(0);
    setService(null);
    setDoctor(null);
    setSlot(null);
    setEvents([]);
  };

  return (
    <section className="med relative overflow-hidden bg-bg px-6 py-14 sm:px-8 lg:px-12 lg:py-[100px]">
      <div className="med-streaks" />

      <div className="relative mx-auto max-w-container">
        {/* ── Heading, full width ─────────────────────────────────────── */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="med-label">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {c.eyebrow}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            {c.tryNote}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end">
          <h2 className="m-0 font-actay text-[clamp(24px,3vw,40px)] font-bold uppercase leading-[1.1] text-ink [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent">
            {c.heading[0]}
            <em>{c.heading[1]}</em>
          </h2>
          <p className="m-0 max-w-[56ch] font-sans text-[14.5px] leading-[1.65] text-ink-dim lg:pb-1.5">
            {c.sub}
          </p>
        </div>

        {/* ── Two synchronised panels ─────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8">
          {/* Patient side — the light island in browser chrome */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                {c.patientSide}
              </span>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-line-strong bg-[oklch(1_0_0_/_0.03)] p-2 shadow-[0_0_60px_oklch(from_var(--color-accent)_l_c_h_/_0.12)]">
              {/* Browser chrome — the old site's MockupArt frame, in DOM */}
              <div className="flex items-center gap-2.5 px-2 pb-2 pt-1">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-[7px] w-[7px] rounded-full bg-[oklch(1_0_0_/_0.16)]" />
                  <span className="h-[7px] w-[7px] rounded-full bg-[oklch(1_0_0_/_0.16)]" />
                  <span className="h-[7px] w-[7px] rounded-full bg-[oklch(1_0_0_/_0.16)]" />
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
                  <Lock size={9} className="shrink-0 text-ink-3" aria-hidden="true" />
                  <span className="truncate font-mono text-[10px] text-ink-3">
                    {w.clinicUrl}
                  </span>
                </span>
              </div>

              <div
                className="overflow-hidden rounded-[12px]"
                // eslint-disable-next-line react/forbid-dom-props -- light-island tokens are deliberately hardcoded (see component docblock)
                style={{ background: W.canvas, color: W.ink }}
              >
                {/* Widget header */}
                <div
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                  // eslint-disable-next-line react/forbid-dom-props -- light-island token
                  style={{ borderBottom: `1px solid ${W.border}` }}
                >
                  <span className="font-sans text-[13px] font-semibold">
                    {w.clinicName}
                  </span>
                  <span
                    className="hidden items-center rounded-full px-2.5 py-1 font-sans text-[10.5px] font-medium sm:inline-flex"
                    // eslint-disable-next-line react/forbid-dom-props -- light-island token
                    style={{ background: W.mint, color: W.green }}
                  >
                    {w.privacy}
                  </span>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2 px-5 pt-4">
                  {w.steps.map((label, i) => (
                    <div key={label} className="flex min-w-0 items-center gap-2">
                      <span
                        className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-semibold"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={
                          step >= i
                            ? { background: W.green, color: W.canvas }
                            : { background: "#f0f1ef", color: W.inkSoft }
                        }
                      >
                        {step > i || step === 3 ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span
                        className="hidden truncate font-sans text-[11.5px] md:block"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ color: step >= i ? W.ink : W.inkSoft }}
                      >
                        {label}
                      </span>
                      {i < 2 && (
                        <span
                          className="h-px w-4 shrink-0 md:w-6"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{ background: W.border }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div className="min-h-[300px] p-5">
                  {step === 0 && (
                    <>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {w.services.map((s, i) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            setService(i);
                            setStep(1);
                            fire("service");
                          }}
                          className="cursor-pointer rounded-[14px] p-3.5 text-left transition-[transform,box-shadow] duration-150 hover:-translate-y-px"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{
                            background: service === i ? W.mint : "#fff",
                            border: `1px solid ${service === i ? W.mintDeep : W.border}`,
                          }}
                        >
                          <span
                            className="block font-sans text-[13.5px] font-semibold"
                            // eslint-disable-next-line react/forbid-dom-props -- light-island token
                            style={{ color: W.ink }}
                          >
                            {s.name}
                          </span>
                          <span
                            className="mt-1 flex items-center justify-between font-sans text-[12px]"
                            // eslint-disable-next-line react/forbid-dom-props -- light-island token
                            style={{ color: W.inkSoft }}
                          >
                            <span>{s.dur}</span>
                            <span
                              className="font-semibold"
                              // eslint-disable-next-line react/forbid-dom-props -- light-island token
                              style={{ color: W.green }}
                            >
                              {s.price}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                    {/* A real clinic list runs long — showing the tail keeps
                        the panel honest and stops step 0 from sitting empty. */}
                    <div
                      className="mt-4 flex items-center justify-between gap-3 border-t pt-4"
                      // eslint-disable-next-line react/forbid-dom-props -- light-island token
                      style={{ borderColor: W.border }}
                    >
                      <span
                        className="font-sans text-[12.5px]"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ color: W.inkSoft }}
                      >
                        {w.moreServices}
                      </span>
                      <span
                        className="font-sans text-[12.5px] font-semibold"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ color: W.green }}
                      >
                        {w.priceListLink}
                      </span>
                    </div>
                    </>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {w.doctors.map((d, i) => (
                          <button
                            key={d.name}
                            type="button"
                            onClick={() => {
                              setDoctor(i);
                              fire("doctor");
                            }}
                            className="flex cursor-pointer items-center gap-3 rounded-[14px] p-3 text-left"
                            // eslint-disable-next-line react/forbid-dom-props -- light-island token
                            style={{
                              background: doctor === i ? W.mint : "#fff",
                              border: `1px solid ${doctor === i ? W.mintDeep : W.border}`,
                            }}
                          >
                            <span
                              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-bold"
                              // eslint-disable-next-line react/forbid-dom-props -- light-island token
                              style={{ background: W.green, color: W.canvas }}
                            >
                              {d.initials}
                            </span>
                            <span className="min-w-0">
                              <span
                                className="block truncate font-sans text-[13px] font-semibold"
                                // eslint-disable-next-line react/forbid-dom-props -- light-island token
                                style={{ color: W.ink }}
                              >
                                {d.name}
                              </span>
                              <span
                                className="block truncate font-sans text-[11.5px]"
                                // eslint-disable-next-line react/forbid-dom-props -- light-island token
                                style={{ color: W.inkSoft }}
                              >
                                {d.role}
                              </span>
                            </span>
                          </button>
                        ))}
                      </div>
                      <div>
                        <div
                          className="mb-2 font-sans text-[12px] font-medium"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{ color: W.inkSoft }}
                        >
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
                                onClick={() => {
                                  setSlot(i);
                                  fire("slot");
                                }}
                                className="cursor-pointer rounded-[10px] py-2 font-sans text-[13px] font-medium disabled:cursor-default disabled:line-through disabled:opacity-40"
                                // eslint-disable-next-line react/forbid-dom-props -- light-island token
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
                          className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[12.5px]"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{ color: W.inkSoft }}
                        >
                          <ArrowLeft size={14} /> {w.back}
                        </button>
                        <button
                          type="button"
                          disabled={doctor === null || slot === null}
                          onClick={() => setStep(2)}
                          className="cursor-pointer rounded-full px-6 py-2.5 font-sans text-[13px] font-semibold disabled:cursor-default disabled:opacity-40"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{ background: W.green, color: W.canvas }}
                        >
                          {w.next}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && service !== null && doctor !== null && slot !== null && (
                    <div className="flex flex-col gap-4">
                      <div className="font-sans text-[15px] font-semibold">
                        {w.confirmTitle}
                      </div>
                      <div
                        className="flex flex-col gap-2.5 rounded-[14px] p-4"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ background: W.mint }}
                      >
                        {(
                          [
                            [
                              w.summaryLabels.service,
                              `${w.services[service].name} · ${w.services[service].price}`,
                            ],
                            [w.summaryLabels.doctor, w.doctors[doctor].name],
                            [w.summaryLabels.time, `${w.slotsTitle}, ${w.slots[slot]}`],
                          ] as const
                        ).map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-baseline justify-between gap-3"
                          >
                            <span
                              className="font-sans text-[12px]"
                              // eslint-disable-next-line react/forbid-dom-props -- light-island token
                              style={{ color: W.inkSoft }}
                            >
                              {label}
                            </span>
                            <span
                              className="text-right font-sans text-[13px] font-semibold"
                              // eslint-disable-next-line react/forbid-dom-props -- light-island token
                              style={{ color: W.ink }}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-sans text-[12.5px]"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{ color: W.inkSoft }}
                        >
                          <ArrowLeft size={14} /> {w.back}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStep(3);
                            fire("confirm", "sms", "crm");
                          }}
                          className="cursor-pointer rounded-full px-6 py-2.5 font-sans text-[13.5px] font-semibold transition-transform duration-150 hover:-translate-y-px"
                          // eslint-disable-next-line react/forbid-dom-props -- light-island token
                          style={{ background: W.green, color: W.canvas }}
                        >
                          {w.confirmBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col items-center gap-3 pt-8 text-center">
                      <span
                        className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ background: W.mint }}
                      >
                        <Check
                          size={28}
                          strokeWidth={2.5}
                          style={{ color: W.green }}
                        />
                      </span>
                      <div
                        className="font-sans text-[17px] font-bold"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ color: W.ink }}
                      >
                        {w.successTitle}
                      </div>
                      <p
                        className="m-0 max-w-[38ch] font-sans text-[12.5px] leading-[1.5]"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ color: W.inkSoft }}
                      >
                        {w.successSms}. {w.successTg}.
                      </p>
                      <button
                        type="button"
                        onClick={reset}
                        className="mt-2 cursor-pointer border-0 bg-transparent p-0 font-sans text-[12.5px] underline"
                        // eslint-disable-next-line react/forbid-dom-props -- light-island token
                        style={{ color: W.inkSoft }}
                      >
                        {w.again}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-3 m-0 font-mono text-[11px] leading-[1.5] text-ink-3">
              {w.demoNote}
            </p>
          </div>

          {/* Clinic side — the event rail */}
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                {rail.railTitle}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-ink-3">
                {events.length} / 6
              </span>
            </div>

            {/* All six events are listed from the start — pending ones sit
                dimmed with a hollow pip, so the panel is never an empty box
                and the visitor can see what the widget is about to do. */}
            <div className="rounded-[18px] border border-line bg-[var(--med-panel)] p-5">
              <ol className="m-0 flex list-none flex-col gap-0 p-0" aria-live="polite">
                {EVENT_ORDER.map((key, i) => {
                  const meta = EVENT_META[key];
                  const Icon = meta.icon;
                  const done = events.includes(key);
                  const last = i === EVENT_ORDER.length - 1;
                  const tone =
                    meta.tone === "vital"
                      ? "text-[var(--med-vital)]"
                      : "text-[var(--med-signal)]";
                  return (
                    <li
                      key={key}
                      className={`grid grid-cols-[18px_minmax(0,1fr)] gap-x-3 ${last ? "" : "pb-4"}`}
                    >
                      <span className="relative flex justify-center">
                        {done ? (
                          <Icon
                            size={14}
                            strokeWidth={1.6}
                            className={`med-event mt-[3px] shrink-0 ${tone}`}
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full border border-line-strong"
                            aria-hidden="true"
                          />
                        )}
                        {last ? null : (
                          <span
                            className="absolute bottom-[-6px] left-1/2 top-[22px] w-px -translate-x-1/2 bg-line"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block font-sans text-[13px] leading-[1.5] ${
                            done ? "med-event text-ink" : "text-ink-3"
                          }`}
                        >
                          {rail.events[key]}
                        </span>
                        {done ? (
                          <span className="med-event mt-0.5 block font-mono text-[10px] tabular-nums text-ink-3">
                            {meta.stamp}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <p className="mt-5 mb-0 border-t border-line pt-4 font-mono text-[10.5px] leading-[1.5] text-ink-3">
                {rail.railIdle}
              </p>
            </div>

            <Link
              href={localizePath("/contacts", locale)}
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] px-6 py-2.5 font-sans text-[13px] font-semibold tracking-[0.03em] text-[oklch(1_0_0_/_0.95)] no-underline shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.32)] transition-transform duration-200 hover:-translate-y-px"
            >
              {c.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
