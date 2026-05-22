"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Quote, Clock, Phone, FileCheck2 } from "lucide-react";
import type { CalculatorEstimate, CalculatorInput } from "@/constants/calculator-config";
import { formatEur } from "@/lib/shared/format-eur";

type LeadFormProps = {
  input: CalculatorInput;
  estimate: CalculatorEstimate;
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

export function LeadForm({ input, estimate }: LeadFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const t = useTranslations("Calculator.leadForm");

  const summary = useMemo(
    () => ({
      range: `${formatEur(estimate.lowEstimate)} - ${formatEur(estimate.highEstimate)}`,
      maintenanceMonthly: formatEur(estimate.monthlyMaintenance),
    }),
    [estimate],
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
      ? `Brief: ${form.projectBrief.trim()}`
      : "";
    const reachOut = `Preferred contact: ${form.preferredMethod}`;
    const estimateLine = `Estimate: ${summary.range}`;
    const maintenanceLine = `Maintenance: ${summary.maintenanceMonthly} / mo`;
    const inputSnapshot = `Calculator input: ${JSON.stringify(input)}`;
    const description = [
      briefLine,
      reachOut,
      estimateLine,
      maintenanceLine,
      inputSnapshot,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      name: form.name,
      contact: form.contact,
      business: form.company || undefined,
      description,
      source: "calculator",
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
    <div className="calc-lead-layout">
      <form className="calc-lead" onSubmit={onSubmit}>
        <h3>{t("title")}</h3>
        <p>{t("sub")}</p>

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
            inputWrapper: "calc-ui-input-wrapper",
            input: "calc-ui-input",
            label: "calc-ui-label",
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
            inputWrapper: "calc-ui-input-wrapper",
            input: "calc-ui-input",
            label: "calc-ui-label",
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
            inputWrapper: "calc-ui-input-wrapper",
            input: "calc-ui-input",
            label: "calc-ui-label",
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
            inputWrapper: "calc-ui-input-wrapper calc-ui-textarea-wrapper",
            input: "calc-ui-input calc-ui-textarea",
            label: "calc-ui-label",
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
            trigger: "calc-ui-input-wrapper calc-ui-select-trigger",
            value: "calc-ui-input",
            label: "calc-ui-label",
            popoverContent: "calc-ui-select-popover",
            listbox: "calc-ui-select-listbox",
          }}
        >
          <SelectItem key="email">{t("methodEmail")}</SelectItem>
          <SelectItem key="telegram">{t("methodTelegram")}</SelectItem>
          <SelectItem key="whatsapp">{t("methodWhatsapp")}</SelectItem>
        </Select>

        <input type="hidden" name="calculatorPayload" value={payload} />

        <button
          type="submit"
          className="calc-btn-primary calc-lead-submit"
          disabled={status === "submitting" || status === "success"}
        >
          {status === "submitting" ? "…" : t("submit")}
        </button>
        <small className="calc-lead-trust-line">{t("trustLine")}</small>
        {status === "success" ? (
          <div className="calc-success" role="status">{t("success")}</div>
        ) : null}
        {status === "error" ? (
          <div className="calc-error" role="alert">
            Не вдалося надіслати. Спробуйте ще раз або напишіть напряму.
          </div>
        ) : null}
      </form>

      <aside className="calc-side-column">
        <div className="calc-after-submit">
          <h4>{t("afterSubmitTitle")}</h4>
          <ol>
            {afterSubmitSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={i}>
                  <span className="calc-after-icon">
                    <Icon size={14} strokeWidth={1.7} />
                  </span>
                  <span className="calc-after-body">
                    <strong>{step.when}</strong>
                    <span>{step.body}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <figure className="calc-side-testimonial">
          <Quote size={16} strokeWidth={1.6} className="calc-side-testimonial-icon" />
          <blockquote>
            {t.rich("testimonialQuote", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </blockquote>
          <figcaption>
            <span className="calc-side-testimonial-name">{t("testimonialName")}</span>
            <span className="calc-side-testimonial-role">{t("testimonialRole")}</span>
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
