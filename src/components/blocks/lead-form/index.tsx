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

import type { LeadValues } from "@/types/lead";

const INITIAL: LeadValues = {
  name: "",
  contact: "",
  business: "",
  tier: "",
  description: "",
  budget: "",
  timeline: "",
};

function buildValidationSchema(contactErr: string) {
  return Yup.object({
    name: Yup.string(),
    contact: Yup.string().min(5, contactErr).required(contactErr),
    business: Yup.string(),
    tier: Yup.string(),
    description: Yup.string(),
    budget: Yup.string(),
    timeline: Yup.string(),
  });
}

export type LeadFormLocale = "uk" | "en";

const BUSINESS_OPTS_BY_LOCALE: Record<LeadFormLocale, { key: string; label: string }[]> = {
  uk: [
    { key: "healthcare", label: "Healthcare / клініки і стоматології" },
    { key: "legal", label: "Legal / юридична фірма" },
    { key: "accounting", label: "Accounting / бухгалтерія" },
    { key: "ecommerce", label: "E-commerce / інтернет-магазин" },
    { key: "saas", label: "SaaS / стартап" },
    { key: "construction", label: "Construction / Renovation" },
    { key: "other", label: "Other (вкажіть в описі)" },
  ],
  en: [
    { key: "healthcare", label: "Healthcare / clinics and dental" },
    { key: "legal", label: "Legal / law firm" },
    { key: "accounting", label: "Accounting / bookkeeping" },
    { key: "ecommerce", label: "E-commerce / online store" },
    { key: "saas", label: "SaaS / startup" },
    { key: "construction", label: "Construction / Renovation" },
    { key: "other", label: "Other (describe in the brief)" },
  ],
};

const TIER_OPTS_BY_LOCALE: Record<LeadFormLocale, { key: string; label: string }[]> = {
  uk: [
    { key: "starter", label: "Starter — від $1 000" },
    { key: "industry", label: "Industry Pro — від $3 500" },
    { key: "proplus", label: "Pro Plus — від $7 500" },
    { key: "enterprise", label: "Enterprise — від $14 000" },
    { key: "undecided", label: "Не визначився" },
  ],
  en: [
    { key: "starter", label: "Starter — from $1,000" },
    { key: "industry", label: "Industry Pro — from $3,500" },
    { key: "proplus", label: "Pro Plus — from $7,500" },
    { key: "enterprise", label: "Enterprise — from $14,000" },
    { key: "undecided", label: "I don't know yet" },
  ],
};

const BUDGET_OPTS_BY_LOCALE: Record<LeadFormLocale, { key: string; label: string }[]> = {
  uk: [
    { key: "lt3k", label: "До $3k" },
    { key: "3-7k", label: "$3-7k" },
    { key: "7-15k", label: "$7-15k" },
    { key: "gt15k", label: "$15k+" },
    { key: "unknown", label: "Поки не знаю" },
  ],
  en: [
    { key: "lt3k", label: "Under $3k" },
    { key: "3-7k", label: "$3-7k" },
    { key: "7-15k", label: "$7-15k" },
    { key: "gt15k", label: "$15k+" },
    { key: "unknown", label: "I don't know yet" },
  ],
};

const TIMELINE_OPTS_BY_LOCALE: Record<LeadFormLocale, { key: string; label: string }[]> = {
  uk: [
    { key: "urgent", label: "Терміново (1-2 тижні)" },
    { key: "normal", label: "Звичайно (4-8 тижнів)" },
    { key: "relaxed", label: "Не критично" },
  ],
  en: [
    { key: "urgent", label: "Urgent (1-2 weeks)" },
    { key: "normal", label: "Normal (4-8 weeks)" },
    { key: "relaxed", label: "Not critical" },
  ],
};

const STRINGS_BY_LOCALE = {
  uk: {
    nameLabel: "Як до вас звертатися",
    namePlaceholder: "Ваше імʼя (необовʼязково)",
    namePlaceholderShort: "Ваше імʼя (необовʼязково)",
    contactLabel: "Телефон, Telegram або email",
    contactPlaceholder: "+380..., @username або hello@example.com",
    contactPlaceholderShort: "+380..., @username або hello@…",
    contactDescription: "Як з вами зручніше зв'язатися",
    contactValidation: "Вкажіть телефон, Telegram або email",
    businessLabel: "Тип бізнесу",
    businessPlaceholder: "Оберіть галузь (необовʼязково)",
    descriptionLabel: "Опис задачі",
    descriptionPlaceholder:
      "Розкажіть коротко: який сайт потрібен, що зараз не працює, дедлайн (необовʼязково)",
    tierLabel: "Орієнтовний тир",
    tierPlaceholder: "Оберіть тир",
    budgetLabel: "Бюджет",
    budgetPlaceholder: "Не обовʼязково",
    timelineLabel: "Коли треба запустити",
    timelinePlaceholder: "Не обовʼязково",
    showDetails: "Додати деталі",
    hideDetails: "Приховати деталі",
    detailsMeta: "тир, бюджет, термін",
    submit: "Надіслати — відповімо за 1-2 години",
    successTitle: "Дякуємо! Заявка отримана.",
    successBody:
      "Зв'яжемось з вами протягом 1-2 робочих годин через Telegram або email який ви залишили.",
    successOrTg: "Або одразу пишіть в Telegram →",
    errorBody: "Щось пішло не так. Спробуйте ще раз або пишіть в Telegram",
    privacy:
      "Не передаємо ваші дані третім особам. Зберігаємо тільки для відповіді на вашу заявку.",
  },
  en: {
    nameLabel: "How should we address you?",
    namePlaceholder: "Your name (optional)",
    namePlaceholderShort: "Your name (optional)",
    contactLabel: "Phone, Telegram, or email",
    contactPlaceholder: "+44..., @username, or hello@example.com",
    contactPlaceholderShort: "+44..., @username, or hello@…",
    contactDescription: "How's it easiest to reach you",
    contactValidation: "Please enter a phone, Telegram, or email",
    businessLabel: "Business type",
    businessPlaceholder: "Pick an industry (optional)",
    descriptionLabel: "Project description",
    descriptionPlaceholder:
      "A short summary: what site you need, what's not working now, deadline (optional)",
    tierLabel: "Approximate tier",
    tierPlaceholder: "Pick a tier",
    budgetLabel: "Budget",
    budgetPlaceholder: "Optional",
    timelineLabel: "Launch timeline",
    timelinePlaceholder: "Optional",
    showDetails: "Add details",
    hideDetails: "Hide details",
    detailsMeta: "tier, budget, timeline",
    submit: "Send — we reply within 1-2 hours",
    successTitle: "Thanks! Your message was received.",
    successBody:
      "We'll get back within 1-2 business hours via the Telegram or email you provided.",
    successOrTg: "Or message Telegram directly →",
    errorBody:
      "Something went wrong. Try again or message Telegram",
    privacy:
      "We don't share your data with third parties. We only store it to reply to your inquiry.",
  },
} as const;

const SELECT_CLASSNAMES = {
  popoverContent: "lead-form-popover",
  listbox: "lead-form-popover-listbox",
} as const;

const SELECT_ITEM_CLASS = "lead-form-popover-item";

// `business` is the deprecated Multi-page tier (dropped Sprint 1). The alias
// stays so old emails/sitemap URLs with ?tier=business still resolve to a
// real form option — they now route to Industry Pro since that is the closest
// match in the new ladder.
const TIER_ALIASES: Record<string, string> = {
  basic: "starter",
  starter: "starter",
  business: "industry",
  multi: "industry",
  multipage: "industry",
  advanced: "industry",
  industry: "industry",
  industrypro: "industry",
  specialized: "industry",
  proplus: "proplus",
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
  locale?: LeadFormLocale;
};

function LeadFormInner({
  source = "contacts",
  variant = "full",
  locale = "uk",
}: LeadFormProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");

  const strings = STRINGS_BY_LOCALE[locale];
  const BUSINESS_OPTS = BUSINESS_OPTS_BY_LOCALE[locale];
  const TIER_OPTS = TIER_OPTS_BY_LOCALE[locale];
  const BUDGET_OPTS = BUDGET_OPTS_BY_LOCALE[locale];
  const TIMELINE_OPTS = TIMELINE_OPTS_BY_LOCALE[locale];
  const validationSchema = buildValidationSchema(strings.contactValidation);

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
        <h3 className="lead-form-success-title">{strings.successTitle}</h3>
        <p className="lead-form-success-body">{strings.successBody}</p>
        <p className="lead-form-success-body">
          {strings.successOrTg}{" "}
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
                    label={strings.nameLabel}
                    labelPlacement="outside"
                    placeholder={strings.namePlaceholderShort}
                    variant="bordered"
                    radius="lg"
                  />
                )}
              </Field>
              <Field name="contact">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label={strings.contactLabel}
                    labelPlacement="outside"
                    placeholder={strings.contactPlaceholderShort}
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
                    label={strings.nameLabel}
                    labelPlacement="outside"
                    placeholder={strings.namePlaceholder}
                    variant="bordered"
                    radius="lg"
                  />
                )}
              </Field>
              <Field name="contact">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label={strings.contactLabel}
                    labelPlacement="outside"
                    placeholder={strings.contactPlaceholder}
                    isRequired
                    description={strings.contactDescription}
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
            label={strings.businessLabel}
            labelPlacement="outside"
            placeholder={strings.businessPlaceholder}
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
                label={strings.descriptionLabel}
                labelPlacement="outside"
                placeholder={strings.descriptionPlaceholder}
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
                {showDetails ? strings.hideDetails : strings.showDetails}
                <span className="lead-form-toggle-meta">
                  {" "}
                  · {strings.detailsMeta}
                </span>
              </span>
            </button>
          )}

          {showDetails && (
            <div className="lead-form-details" id="lead-form-details">
              <Select
                label={strings.tierLabel}
                labelPlacement="outside"
                placeholder={strings.tierPlaceholder}
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
                  label={strings.budgetLabel}
                  labelPlacement="outside"
                  placeholder={strings.budgetPlaceholder}
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
                  label={strings.timelineLabel}
                  labelPlacement="outside"
                  placeholder={strings.timelinePlaceholder}
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
            {strings.submit}
          </Button>

          {status === "error" && (
            <div className="lead-form-error" role="alert">
              {strings.errorBody}{" "}
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

          <p className="lead-form-privacy">{strings.privacy}</p>
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
