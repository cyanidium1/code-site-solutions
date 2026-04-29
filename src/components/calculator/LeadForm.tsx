"use client";

import { useMemo, useState } from "react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Mail, MessageCircleMore, Phone, ShieldCheck } from "lucide-react";
import type { CalculatorEstimate, CalculatorInput } from "@/lib/pricing-calculator-config";
import { formatEur } from "./formatters";

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

export function LeadForm({ input, estimate }: LeadFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const payload = useMemo(
    () =>
      JSON.stringify(
        {
          form,
          calculator: {
            input,
            estimate,
            summary: {
              range: `${formatEur(estimate.lowEstimate)} - ${formatEur(estimate.highEstimate)}`,
              maintenanceMonthly: formatEur(estimate.monthlyMaintenance),
            },
          },
        },
        null,
        2,
      ),
    [estimate, form, input],
  );

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: connect this payload to existing API/contact endpoint when backend is ready.
    console.info("Website calculator lead payload", {
      form,
      input,
      estimate,
    });
    setStatus("success");
  };

  return (
    <div className="calc-lead-layout">
      <form className="calc-lead" onSubmit={onSubmit}>
        <h3>Get final estimate</h3>
        <p>We will review your calculator result and send a realistic project plan, timeline, and final price range.</p>

        <Input
          label="Name"
          labelPlacement="outside"
          placeholder="Your name"
          variant="bordered"
          radius="lg"
          size="lg"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
          classNames={{
            inputWrapper: "calc-ui-input-wrapper",
            input: "calc-ui-input",
            label: "calc-ui-label",
          }}
        />

        <Input
          label="Contact: email / Telegram / WhatsApp"
          labelPlacement="outside"
          placeholder="name@company.com or @username"
          variant="bordered"
          radius="lg"
          size="lg"
          value={form.contact}
          onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
          required
          classNames={{
            inputWrapper: "calc-ui-input-wrapper",
            input: "calc-ui-input",
            label: "calc-ui-label",
          }}
        />

        <Input
          label="Company / project name"
          labelPlacement="outside"
          placeholder="Company or product name"
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
          label="Short project description"
          labelPlacement="outside"
          placeholder="Tell us goals, timeline, and required integrations"
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
          label="Preferred contact method"
          labelPlacement="outside"
          placeholder="Select preferred contact method"
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
          <SelectItem key="email">Email</SelectItem>
          <SelectItem key="telegram">Telegram</SelectItem>
          <SelectItem key="whatsapp">WhatsApp</SelectItem>
        </Select>

        <input type="hidden" name="calculatorPayload" value={payload} />

        <button type="submit" className="calc-btn-primary calc-lead-submit">
          Get final estimate
        </button>
        <small className="calc-lead-trust-line">
          No spam. You will receive a structured project response, not a generic sales script.
        </small>
        {status === "success" ? <div className="calc-success">Saved locally. We can now connect this form to API.</div> : null}
      </form>

      <aside className="calc-contact-card">
        <h4>Prefer to talk directly?</h4>
        <p>
          Send us your calculator result or describe your project. We will help define the structure before
          development.
        </p>
        <ul>
          <li><Mail size={13} /> Email: hi@code-site.art</li>
          <li><MessageCircleMore size={13} /> Telegram: @fedirdev</li>
          <li><Phone size={13} /> WhatsApp: +380-97-006-87-07</li>
        </ul>
        <div className="calc-contact-links">
          <a href="mailto:hi@code-site.art">Email us</a>
          <a href="https://t.me/fedirdev" target="_blank" rel="noreferrer">
            Message on Telegram
          </a>
          <a href="tel:+380970068707">WhatsApp</a>
        </div>
        <ul className="calc-contact-trust">
          <li><ShieldCheck size={13} /> Custom-coded websites</li>
          <li><ShieldCheck size={13} /> CMS-ready architecture</li>
          <li><ShieldCheck size={13} /> SEO-first structure</li>
          <li><ShieldCheck size={13} /> No builders or templates</li>
        </ul>
      </aside>
    </div>
  );
}
