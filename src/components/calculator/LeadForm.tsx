"use client";

import { useMemo, useState } from "react";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { Quote, Clock, Phone, FileCheck2 } from "lucide-react";
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

const AFTER_SUBMIT_STEPS = [
  {
    icon: Clock,
    when: "Within 4 hours",
    body: "You get a reply with a confirmed price and clarifying questions.",
  },
  {
    icon: Phone,
    when: "Within 2 days",
    body: "30-minute call: we walk through the project and show relevant cases.",
  },
  {
    icon: FileCheck2,
    when: "Within a week",
    body: "Final proposal — fixed price, fixed deadline, penalty clause for delays.",
  },
];

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
        <h3>Project brief</h3>
        <p>We'll review your calculator result and reply with a confirmed range, timeline, and next steps.</p>

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

      <aside className="calc-side-column">
        <div className="calc-after-submit">
          <h4>What happens after you submit</h4>
          <ol>
            {AFTER_SUBMIT_STEPS.map((step, i) => {
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
            Before the new site we got 3 enquiries a month. Now we get
            <strong> 24</strong>.
          </blockquote>
          <figcaption>
            <span className="calc-side-testimonial-name">Søren Hansen</span>
            <span className="calc-side-testimonial-role">Owner, NBYG Bornholm Aps</span>
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
