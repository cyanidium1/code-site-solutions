"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Quote, Clock, Phone, FileCheck2 } from "lucide-react";
import type { CalculatorEstimate, CalculatorInput } from "@/types/pricing";
import type { CalculatorConfig } from "@/types/calculator-config";
import { formatEur as formatEurRaw } from "@/lib/shared/format-eur";
import { formatCalculatorSelections } from "@/lib/shared/format-calculator-selections";
import { getAttribution } from "@/lib/client/attribution";
import { HoneypotField } from "@/components/blocks/honeypot-field";
import { H3, Input, Select, Textarea } from "@/components/ui";

// Calculator visual identity, layered over the ui primitives' lead-form
// defaults via `classNames` (tailwind-merge resolves the conflicts). The
// custom bits: slightly different field bg, softer border, 52px min-height,
// and an accent glow on focus.
const CALC_FOCUS_GLOW =
  "focus-within:border-[oklch(from_var(--color-accent)_l_c_h_/_0.7)] " +
  "focus-within:shadow-[0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.35),0_0_18px_oklch(from_var(--color-accent)_l_c_h_/_0.2)] " +
  "focus-within:bg-[oklch(0.14_0.005_300_/_0.9)]";

const UI_INPUT_WRAPPER =
  "bg-[oklch(0.14_0.005_300_/_0.9)] border-line min-h-[52px] " +
  "transition-[border-color,box-shadow,background] duration-200 " +
  "hover:border-line-strong hover:bg-[oklch(0.14_0.005_300_/_0.9)] " +
  CALC_FOCUS_GLOW;

const UI_INPUT =
  "placeholder:text-[oklch(from_var(--color-ink-3)_l_c_h_/_0.75)]";

const UI_TEXTAREA_WRAPPER = UI_INPUT_WRAPPER + " min-h-[132px]";

// Select trigger: same treatment; the glow also applies while the listbox is
// open (aria-expanded) — parity with HeroUI keeping the trigger focused.
const UI_SELECT_TRIGGER =
  "bg-[oklch(0.14_0.005_300_/_0.9)] border-line min-h-[52px] " +
  "transition-[border-color,box-shadow,background] duration-200 " +
  "hover:border-line-strong hover:bg-[oklch(0.14_0.005_300_/_0.9)] " +
  "focus-visible:border-[oklch(from_var(--color-accent)_l_c_h_/_0.7)] " +
  "focus-visible:shadow-[0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.35),0_0_18px_oklch(from_var(--color-accent)_l_c_h_/_0.2)] " +
  "focus-visible:bg-[oklch(0.14_0.005_300_/_0.9)] " +
  "aria-expanded:border-[oklch(from_var(--color-accent)_l_c_h_/_0.7)] " +
  "aria-expanded:shadow-[0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.35),0_0_18px_oklch(from_var(--color-accent)_l_c_h_/_0.2)] " +
  "aria-expanded:bg-[oklch(0.14_0.005_300_/_0.9)]";

const UI_SELECT_LISTBOX = "bg-[oklch(0.16_0.005_300)] border-line";
const UI_SELECT_OPTION = "data-[active=true]:bg-accent-20";

type LeadFormProps = {
  config: CalculatorConfig;
  input: CalculatorInput;
  estimate: CalculatorEstimate;
  /** Called once the lead is accepted (clears persisted calculator state). */
  onSubmitted?: () => void;
};

type FormState = {
  name: string;
  contact: string;
  company: string;
  projectBrief: string;
  preferredMethod: "email" | "telegram" | "whatsapp";
};

const INITIAL_FORM: FormState = {
  name: "",
  contact: "",
  company: "",
  projectBrief: "",
  preferredMethod: "email",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function LeadForm({ config, input, estimate, onSubmitted }: LeadFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const t = useTranslations("Calculator.leadForm");
  const locale = useLocale() as "uk" | "en";

  const summary = useMemo(
    () => ({
      estimate: formatEurRaw(estimate.oneTimeEstimate, locale),
    }),
    [estimate, locale],
  );

  const payload = useMemo(
    () =>
      JSON.stringify(
        { form, calculator: { input, estimate, summary } },
        null,
        2,
      ),
    [estimate, form, input, summary],
  );

  /**
   * Flattens the calculator's nested form+calculator payload to the flat
   * shape `/api/lead` accepts (name/contact/business/description/source).
   * Estimate summary + breakdown are serialised into description so the
   * Telegram message keeps the full quote context.
   */
  const buildLeadBody = () => {
    const briefLine = form.projectBrief.trim()
      ? `Бриф: ${form.projectBrief.trim()}`
      : "";
    const reachOut = `Бажаний канал: ${form.preferredMethod}`;
    const estimateLine = `Оцінка: ${summary.estimate}`;
    const selections = formatCalculatorSelections(input, config);
    const selectionsBlock = selections
      ? `Конфігурація з калькулятора:\n${selections}`
      : "";
    const description = [
      briefLine,
      reachOut,
      estimateLine,
      selectionsBlock,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      name: form.name,
      contact: form.contact,
      business: form.company || undefined,
      description,
      source: "calculator",
      hp,
      attribution: getAttribution(),
    };
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildLeadBody()),
      });
      if (!res.ok) throw new Error("Lead endpoint returned non-OK");
      setStatus("success");
      onSubmitted?.();
    } catch {
      setStatus("error");
    }
  };

  const fieldRequired = (val: string) =>
    status !== "idle" && status !== "submitting" && !val.trim();

  const afterSubmitSteps = [
    {
      icon: Clock,
      when: t("after4hWhen"),
      body: t("after4hBody"),
    },
    {
      icon: Phone,
      when: t("after2dWhen"),
      body: t("after2dBody"),
    },
    {
      icon: FileCheck2,
      when: t("after1wWhen"),
      body: t("after1wBody"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-[18px] items-stretch xl:grid-cols-[minmax(0,1.2fr)_minmax(0,380px)]">
      <form
        className="border border-line rounded-[22px] bg-[oklch(0.16_0.005_300)] p-6 grid gap-3 h-full [&_input:focus-visible]:outline-2 [&_input:focus-visible]:outline-accent-soft [&_input:focus-visible]:outline-offset-2 [&_textarea:focus-visible]:outline-2 [&_textarea:focus-visible]:outline-accent-soft [&_textarea:focus-visible]:outline-offset-2 [&_select:focus-visible]:outline-2 [&_select:focus-visible]:outline-accent-soft [&_select:focus-visible]:outline-offset-2"
        onSubmit={onSubmit}
      >
        <HoneypotField value={hp} onChange={setHp} />
        <H3 variant="calc-lead">{t("title")}</H3>
        <p className="m-0 mb-1 text-ink-3 text-[13px]">{t("sub")}</p>

        <Input
          label={t("name")}
          placeholder={t("namePlaceholder")}
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
          isInvalid={fieldRequired(form.name)}
          classNames={{ wrapper: UI_INPUT_WRAPPER, input: UI_INPUT }}
        />

        <Input
          label={t("contact")}
          placeholder={t("contactPlaceholder")}
          value={form.contact}
          onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
          required
          isInvalid={fieldRequired(form.contact)}
          classNames={{ wrapper: UI_INPUT_WRAPPER, input: UI_INPUT }}
        />

        <Input
          label={t("company")}
          placeholder={t("companyPlaceholder")}
          value={form.company}
          onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          classNames={{ wrapper: UI_INPUT_WRAPPER, input: UI_INPUT }}
        />

        <Textarea
          label={t("brief")}
          placeholder={t("briefPlaceholder")}
          minRows={5}
          value={form.projectBrief}
          onChange={(e) => setForm((prev) => ({ ...prev, projectBrief: e.target.value }))}
          classNames={{ wrapper: UI_TEXTAREA_WRAPPER, input: UI_INPUT }}
        />

        <Select
          label={t("methodLabel")}
          placeholder={t("methodPlaceholder")}
          options={[
            { key: "email", label: t("methodEmail") },
            { key: "telegram", label: t("methodTelegram") },
            { key: "whatsapp", label: t("methodWhatsapp") },
          ]}
          value={form.preferredMethod}
          onChange={(v) => {
            if (v) {
              setForm((prev) => ({ ...prev, preferredMethod: v as FormState["preferredMethod"] }));
            }
          }}
          disallowEmptySelection
          classNames={{
            trigger: UI_SELECT_TRIGGER,
            listbox: UI_SELECT_LISTBOX,
            option: UI_SELECT_OPTION,
          }}
        />

        <input type="hidden" name="calculatorPayload" value={payload} />

        <button
          type="submit"
          className={
            "inline-flex items-center justify-center w-full border-none rounded-full " +
            "bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] " +
            "px-[18px] py-[14px] font-sans text-[12px] uppercase tracking-[0.1em] font-bold no-underline cursor-pointer " +
            "transition-[transform,filter,box-shadow] duration-200 shadow-[0_6px_18px_oklch(from_var(--color-accent)_l_c_h_/_0.3)] " +
            "hover:-translate-y-[1px] hover:shadow-[0_10px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.4)] " +
            "active:[filter:brightness(0.93)] focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2 " +
            "min-h-[52px]"
          }
          disabled={status === "submitting" || status === "success"}
        >
          {status === "submitting" ? "…" : t("submit")}
        </button>
        <small className="text-ink-3 text-[11px]">{t("trustLine")}</small>
        {status === "success" ? (
          <div className="text-[12px] text-accent-soft" role="status">{t("success")}</div>
        ) : null}
        {status === "error" ? (
          <div className="text-[12px] text-[oklch(0.78_0.16_25)] mt-[6px]" role="alert">
            Не вдалося надіслати. Спробуйте ще раз або напишіть напряму.
          </div>
        ) : null}
      </form>

      <aside className="flex flex-col gap-[14px] h-auto xl:h-full">
        <div className="border border-line rounded-[22px] bg-[oklch(0.16_0.005_300)] px-[22px] pt-[22px] pb-5 flex-1 flex flex-col gap-[14px]">
          <h4 className="m-0 font-sans text-[15px] font-bold tracking-[-0.01em] text-ink">{t("afterSubmitTitle")}</h4>
          <ol className="list-none m-0 p-0 grid gap-[14px]">
            {afterSubmitSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={i} className="grid grid-cols-[32px_1fr] gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] bg-accent-12 text-accent-soft">
                    <Icon size={14} strokeWidth={1.7} />
                  </span>
                  <span className="flex flex-col gap-[3px]">
                    <strong className="text-[12.5px] text-ink font-semibold">{step.when}</strong>
                    <span className="text-[12.5px] text-ink-3 leading-[1.5]">{step.body}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <figure className="m-0 border border-line rounded-[22px] bg-[oklch(0.16_0.005_300)] px-5 py-[18px] flex flex-col gap-[10px]">
          <Quote size={16} strokeWidth={1.6} className="text-accent-soft" />
          <blockquote className="m-0 font-sans text-[14px] leading-[1.5] text-ink italic [&>strong]:text-accent-soft [&>strong]:font-bold [&>strong]:not-italic">
            {t.rich("testimonialQuote", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </blockquote>
          <figcaption className="flex flex-col gap-[2px]">
            <span className="text-[12px] text-ink font-semibold">{t("testimonialName")}</span>
            <span className="text-[10.5px] text-ink-3 tracking-[0.04em] uppercase">{t("testimonialRole")}</span>
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
