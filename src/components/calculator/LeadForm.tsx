"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Quote, Clock, Phone, FileCheck2 } from "lucide-react";
import type { CalculatorEstimate, CalculatorInput } from "@/types/pricing";
import type { CalculatorConfig } from "@/types/calculator-config";
import { formatEur as formatEurRaw } from "@/lib/shared/format-eur";
import { formatCalculatorSelections } from "@/lib/shared/format-calculator-selections";
import { getAttribution } from "@/lib/client/attribution";
import { HoneypotField } from "@/components/blocks/honeypot-field";
import { H3 } from "@/components/ui";

// HeroUI slot classNames for Calculator inputs. We hit several Input
// slots whose internal classes win at equal specificity, so `!` (which
// becomes `!important`) is needed on the slot strings — same pattern as
// the Session 3 lead-form migration. The custom min-height + focus
// glow are inlined here so the file is self-contained when the legacy
// .calc-ui-* CSS is removed.
const UI_INPUT_WRAPPER =
  "!bg-[oklch(0.14_0.005_300_/_0.9)] !border-line !min-h-[52px] " +
  "transition-[border-color,box-shadow,background] duration-200 " +
  "hover:!border-line-strong " +
  "data-[hover=true]:!border-line-strong " +
  "data-[focus=true]:!border-[oklch(from_var(--color-accent)_l_c_h_/_0.7)] " +
  "data-[focus=true]:!shadow-[0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.35),0_0_18px_oklch(from_var(--color-accent)_l_c_h_/_0.2)] " +
  "data-[focus-visible=true]:!border-[oklch(from_var(--color-accent)_l_c_h_/_0.7)] " +
  "data-[focus-visible=true]:!shadow-[0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.35),0_0_18px_oklch(from_var(--color-accent)_l_c_h_/_0.2)]";

const UI_INPUT =
  "!text-ink placeholder:!text-[oklch(from_var(--color-ink-3)_l_c_h_/_0.75)] " +
  "[&_input]:!outline-none [&_input]:!shadow-none [&_textarea]:!outline-none [&_textarea]:!shadow-none";

const UI_LABEL = "!text-ink-dim";

const UI_TEXTAREA_WRAPPER = UI_INPUT_WRAPPER + " !min-h-[132px]";
const UI_TEXTAREA = UI_INPUT + " !leading-[1.5]";

const UI_SELECT_TRIGGER = UI_INPUT_WRAPPER + " !px-3";
const UI_SELECT_POPOVER = "!bg-[oklch(0.16_0.005_300)] !border !border-line";
const UI_SELECT_LISTBOX =
  "[&_[data-hover=true]]:!bg-accent-20 " +
  "[&_[data-selected=true]]:!bg-accent-20";

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
          labelPlacement="outside"
          placeholder={t("namePlaceholder")}
          variant="bordered"
          radius="lg"
          size="lg"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
          isInvalid={fieldRequired(form.name)}
          classNames={{
            inputWrapper: UI_INPUT_WRAPPER,
            input: UI_INPUT,
            label: UI_LABEL,
          }}
        />

        <Input
          label={t("contact")}
          labelPlacement="outside"
          placeholder={t("contactPlaceholder")}
          variant="bordered"
          radius="lg"
          size="lg"
          value={form.contact}
          onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
          required
          isInvalid={fieldRequired(form.contact)}
          classNames={{
            inputWrapper: UI_INPUT_WRAPPER,
            input: UI_INPUT,
            label: UI_LABEL,
          }}
        />

        <Input
          label={t("company")}
          labelPlacement="outside"
          placeholder={t("companyPlaceholder")}
          variant="bordered"
          radius="lg"
          size="lg"
          value={form.company}
          onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          classNames={{
            inputWrapper: UI_INPUT_WRAPPER,
            input: UI_INPUT,
            label: UI_LABEL,
          }}
        />

        <Textarea
          label={t("brief")}
          labelPlacement="outside"
          placeholder={t("briefPlaceholder")}
          variant="bordered"
          radius="lg"
          size="lg"
          minRows={5}
          value={form.projectBrief}
          onChange={(e) => setForm((prev) => ({ ...prev, projectBrief: e.target.value }))}
          classNames={{
            inputWrapper: UI_TEXTAREA_WRAPPER,
            input: UI_TEXTAREA,
            label: UI_LABEL,
          }}
        />

        <Select
          label={t("methodLabel")}
          labelPlacement="outside"
          placeholder={t("methodPlaceholder")}
          selectedKeys={[form.preferredMethod]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (selected) {
              setForm((prev) => ({ ...prev, preferredMethod: String(selected) as FormState["preferredMethod"] }));
            }
          }}
          variant="bordered"
          radius="lg"
          size="lg"
          disallowEmptySelection
          classNames={{
            trigger: UI_SELECT_TRIGGER,
            value: UI_INPUT,
            label: UI_LABEL,
            popoverContent: UI_SELECT_POPOVER,
            listbox: UI_SELECT_LISTBOX,
          }}
        >
          <SelectItem key="email">{t("methodEmail")}</SelectItem>
          <SelectItem key="telegram">{t("methodTelegram")}</SelectItem>
          <SelectItem key="whatsapp">{t("methodWhatsapp")}</SelectItem>
        </Select>

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
