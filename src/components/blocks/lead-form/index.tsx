"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, type FieldProps } from "formik";
import * as Yup from "yup";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

import { SITE_CONTACT } from "@/lib/site";
import "./lead-form.css";

type LeadValues = {
  name: string;
  contact: string;
  business: string;
  tier: string;
  description: string;
  budget: string;
  timeline: string;
};

const INITIAL: LeadValues = {
  name: "",
  contact: "",
  business: "",
  tier: "",
  description: "",
  budget: "",
  timeline: "",
};

const validationSchema = Yup.object({
  name: Yup.string(),
  contact: Yup.string()
    .min(5, "Вкажіть телефон, Telegram або email")
    .required("Вкажіть телефон, Telegram або email"),
  business: Yup.string(),
  tier: Yup.string(),
  description: Yup.string(),
  budget: Yup.string(),
  timeline: Yup.string(),
});

const BUSINESS_OPTS = [
  { key: "healthcare", label: "Healthcare / клініки і стоматології" },
  { key: "legal", label: "Legal / юридична фірма" },
  { key: "accounting", label: "Accounting / бухгалтерія" },
  { key: "ecommerce", label: "E-commerce / інтернет-магазин" },
  { key: "saas", label: "SaaS / стартап" },
  { key: "construction", label: "Construction / Renovation" },
  { key: "other", label: "Other (вкажіть в описі)" },
];

const TIER_OPTS = [
  { key: "starter", label: "Starter — від $1 000" },
  { key: "business", label: "Business — від $3 000" },
  { key: "industry", label: "Industry Pro — від $3 500" },
  { key: "enterprise", label: "Enterprise — від $14 000" },
  { key: "undecided", label: "Не визначився" },
];

const BUDGET_OPTS = [
  { key: "lt3k", label: "До $3k" },
  { key: "3-7k", label: "$3-7k" },
  { key: "7-15k", label: "$7-15k" },
  { key: "gt15k", label: "$15k+" },
  { key: "unknown", label: "Поки не знаю" },
];

const TIMELINE_OPTS = [
  { key: "urgent", label: "Терміново (1-2 тижні)" },
  { key: "normal", label: "Звичайно (4-8 тижнів)" },
  { key: "relaxed", label: "Не критично" },
];

const SELECT_CLASSNAMES = {
  popoverContent: "lead-form-popover",
  listbox: "lead-form-popover-listbox",
} as const;

const SELECT_ITEM_CLASS = "lead-form-popover-item";

const TIER_ALIASES: Record<string, string> = {
  basic: "starter",
  starter: "starter",
  business: "business",
  multi: "business",
  multipage: "business",
  advanced: "industry",
  industry: "industry",
  industrypro: "industry",
  specialized: "industry",
  premium: "enterprise",
  enterprise: "enterprise",
  custom: "enterprise",
};

function normalizeTier(raw: string | null): string {
  if (!raw) return "";
  return TIER_ALIASES[raw.trim().toLowerCase()] ?? "";
}

type Status = "idle" | "submitting" | "success" | "error";

export type LeadFormVariant = "compact" | "full";

type LeadFormProps = {
  source?: string;
  variant?: LeadFormVariant;
};

function LeadFormInner({ source = "contacts", variant = "full" }: LeadFormProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");

  const initialValues = useMemo<LeadValues>(() => {
    const tier = normalizeTier(searchParams?.get("tier") ?? null);
    return { ...INITIAL, tier };
  }, [searchParams]);

  // URL `?source=` overrides the prop when present so links like
  // /contacts?source=hero-audit get recorded as the real entry point
  // in the Telegram lead message instead of the page-level default.
  const urlSource = searchParams?.get("source");
  const resolvedSource = urlSource && urlSource.trim() ? urlSource : source;

  const isCompact = variant === "compact";
  const [showDetails, setShowDetails] = useState<boolean>(
    !isCompact || Boolean(initialValues.tier),
  );

  if (status === "success") {
    return (
      <div className="lead-form-success" role="status">
        <div className="lead-form-success-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12l5 5L20 6"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="lead-form-success-title">Дякуємо! Заявка отримана.</h3>
        <p className="lead-form-success-body">
          Зв&apos;яжемось з вами протягом 1-2 робочих годин через Telegram або email
          який ви залишили.
        </p>
        <p className="lead-form-success-body">
          Або одразу пишіть в Telegram →{" "}
          <a
            href={SITE_CONTACT.telegram}
            target="_blank"
            rel="noreferrer"
            className="lead-form-link"
          >
            {SITE_CONTACT.telegramHandle}
          </a>
        </p>
      </div>
    );
  }

  return (
    <Formik<LeadValues>
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setStatus("submitting");
        try {
          const res = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, source: resolvedSource }),
          });
          if (!res.ok) throw new Error("API error");
          setStatus("success");
        } catch {
          setStatus("error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
        submitForm,
      }) => (
        <Form
          className={`lead-form${isCompact ? " lead-form-compact" : ""}`}
        >
          {isCompact ? (
            <div className="lead-form-row-2">
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label="Як до вас звертатися"
                    labelPlacement="outside"
                    placeholder="Ваше імʼя (необовʼязково)"
                    variant="bordered"
                    radius="lg"
                  />
                )}
              </Field>
              <Field name="contact">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label="Телефон, Telegram або email"
                    labelPlacement="outside"
                    placeholder="+380..., @username або hello@…"
                    isRequired
                    isInvalid={Boolean(touched.contact && errors.contact)}
                    errorMessage={touched.contact ? errors.contact : undefined}
                    variant="bordered"
                    radius="lg"
                  />
                )}
              </Field>
            </div>
          ) : (
            <>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label="Як до вас звертатися"
                    labelPlacement="outside"
                    placeholder="Ваше імʼя (необовʼязково)"
                    variant="bordered"
                    radius="lg"
                  />
                )}
              </Field>
              <Field name="contact">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label="Телефон, Telegram або email"
                    labelPlacement="outside"
                    placeholder="+380..., @username або hello@example.com"
                    isRequired
                    description="Як з вами зручніше зв'язатися"
                    isInvalid={Boolean(touched.contact && errors.contact)}
                    errorMessage={touched.contact ? errors.contact : undefined}
                    variant="bordered"
                    radius="lg"
                  />
                )}
              </Field>
            </>
          )}

          <Select
            label="Тип бізнесу"
            labelPlacement="outside"
            placeholder="Оберіть галузь (необовʼязково)"
            selectedKeys={values.business ? [values.business] : []}
            onSelectionChange={(keys) => {
              const k = Array.from(keys)[0];
              setFieldValue("business", k ? String(k) : "");
            }}
            variant="bordered"
            radius="lg"
            classNames={SELECT_CLASSNAMES}
          >
            {BUSINESS_OPTS.map((o) => (
              <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>{o.label}</SelectItem>
            ))}
          </Select>

          <Field name="description">
            {({ field }: FieldProps) => (
              <Textarea
                {...field}
                label="Опис задачі"
                labelPlacement="outside"
                placeholder="Розкажіть коротко: який сайт потрібен, що зараз не працює, дедлайн (необовʼязково)"
                minRows={isCompact ? 3 : 5}
                variant="bordered"
                radius="lg"
              />
            )}
          </Field>

          {isCompact && (
            <button
              type="button"
              className="lead-form-toggle"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              aria-controls="lead-form-details"
            >
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`lead-form-toggle-chev${showDetails ? " open" : ""}`}
              />
              <span>
                {showDetails ? "Приховати деталі" : "Додати деталі"}
                <span className="lead-form-toggle-meta">
                  {" "}
                  · тир, бюджет, термін
                </span>
              </span>
            </button>
          )}

          {showDetails && (
            <div className="lead-form-details" id="lead-form-details">
              <Select
                label="Орієнтовний тир"
                labelPlacement="outside"
                placeholder="Оберіть тир"
                selectedKeys={values.tier ? [values.tier] : []}
                onSelectionChange={(keys) => {
                  const k = Array.from(keys)[0];
                  setFieldValue("tier", k ? String(k) : "");
                }}
                variant="bordered"
                radius="lg"
                classNames={SELECT_CLASSNAMES}
                
              >
                {TIER_OPTS.map((o) => (
                  <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>{o.label}</SelectItem>
                ))}
              </Select>

              <div className="lead-form-row-2">
                <Select
                  label="Бюджет"
                  labelPlacement="outside"
                  placeholder="Не обовʼязково"
                  selectedKeys={values.budget ? [values.budget] : []}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys)[0];
                    setFieldValue("budget", k ? String(k) : "");
                  }}
                  variant="bordered"
                  radius="lg"
                  classNames={SELECT_CLASSNAMES}
                  
                >
                  {BUDGET_OPTS.map((o) => (
                    <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>{o.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Коли треба запустити"
                  labelPlacement="outside"
                  placeholder="Не обовʼязково"
                  selectedKeys={values.timeline ? [values.timeline] : []}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys)[0];
                    setFieldValue("timeline", k ? String(k) : "");
                  }}
                  variant="bordered"
                  radius="lg"
                  classNames={SELECT_CLASSNAMES}
                  
                >
                  {TIMELINE_OPTS.map((o) => (
                    <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>{o.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          )}

          <Button
            type="submit"
            onPress={() => {
              void submitForm();
            }}
            isLoading={isSubmitting || status === "submitting"}
            radius="full"
            size="lg"
            className="lead-form-submit"
          >
            Надіслати — відповімо за 1-2 години
          </Button>

          {status === "error" && (
            <div className="lead-form-error" role="alert">
              Щось пішло не так. Спробуйте ще раз або пишіть в Telegram{" "}
              <a
                href={SITE_CONTACT.telegram}
                target="_blank"
                rel="noreferrer"
                className="lead-form-link"
              >
                {SITE_CONTACT.telegramHandle}
              </a>
            </div>
          )}

          <p className="lead-form-privacy">
            Не передаємо ваші дані третім особам. Зберігаємо тільки для
            відповіді на вашу заявку.
          </p>
        </Form>
      )}
    </Formik>
  );
}

export function LeadForm(props: LeadFormProps = {}) {
  return (
    <Suspense fallback={null}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}
