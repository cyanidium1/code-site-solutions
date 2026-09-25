"use client";

import { Suspense, useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, useFormikContext, type FieldProps } from "formik";
import { ChevronDown } from "lucide-react";

import { Btn, Input, Select, Textarea } from "@/components/ui";

import { SITE_CONTACT } from "@/constants/site";

import type { LeadValues } from "@/types/lead";
import {
  BUDGET_OPTS_BY_LOCALE,
  HAS_SITE_OPTS_BY_LOCALE,
  TIER_OPTS_BY_LOCALE,
  type LeadFormLocale,
} from "@/constants/form-options";
import { LEAD_FORM_STRINGS_BY_LOCALE as STRINGS_BY_LOCALE } from "@/content/lead-form";
import { HoneypotField } from "@/components/blocks/honeypot-field";
import { ctaAttrs, formId } from "@/constants/conversion-ids";
import { goToThankYou } from "@/lib/client/go-to-thank-you";
import { INITIAL_LEAD_VALUES as INITIAL, buildValidationSchema } from "./validation";
import { submitLead } from "./submit";

// The ui primitives' defaults ARE this form's visual treatment (they were
// modelled on it — see src/components/ui/Field.tsx / Select.tsx), so inputs
// and selects below need no classNames overrides.

// Submit button — pill with brand-gradient bg, glow shadow, lift on hover.
// Layered over Btn's `gradient` variant; tailwind-merge lets these win.
const SUBMIT_BUTTON_CLASS =
  "mt-1.5 min-h-12 bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] " +
  "text-[oklch(1_0_0_/_0.95)] font-sans font-semibold text-[13px] tracking-[0.04em] " +
  "shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.32)] " +
  "transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:-translate-y-px hover:shadow-[0_16px_36px_oklch(from_var(--color-accent)_l_c_h_/_0.4)]";

// Compact-form "more details" toggle pill.
const TOGGLE_CLASS =
  "inline-flex items-center gap-2 self-start min-h-11 py-2.5 px-[14px] border border-dashed border-line-strong rounded-full bg-[oklch(1_0_0_/_0.02)] text-ink-dim font-mono text-[12px] tracking-[0.04em] cursor-pointer " +
  "transition-[color,border-color,background-color] duration-200 " +
  "hover:text-accent-soft hover:border-accent-40 hover:bg-[oklch(from_var(--color-accent)_l_c_h_/_0.05)]";

// Canonical keys are PackageId from `@/constants/pricing`. Keys from the
// old ladders (corporate, custom, starter, proplus, …) stay as aliases so
// old links with ?tier=<old> still preselect the closest package.
const TIER_ALIASES: Record<string, string> = {
  landing: "landing",
  basic: "landing",
  starter: "landing",
  business: "business",
  corporate: "business",
  multi: "business",
  multipage: "business",
  advanced: "business",
  shop: "shop",
  store: "shop",
  ecommerce: "shop",
  industry: "industry",
  industrypro: "industry",
  specialized: "industry",
  custom: "unknown",
  proplus: "unknown",
  premium: "unknown",
  enterprise: "unknown",
  unknown: "unknown",
};

function normalizeTier(raw: string | null): string {
  if (!raw) return "";
  return TIER_ALIASES[raw.trim().toLowerCase()] ?? "";
}

type Status = "idle" | "submitting" | "success" | "error";

export type LeadFormVariant = "compact" | "full" | "demo";

type LeadFormProps = {
  source?: string;
  variant?: LeadFormVariant;
  locale?: LeadFormLocale;
  /** Preselects "Що потрібно" when not already set via `?tier=` in the URL. */
  tier?: string;
  /** Calculator configuration text, sent as a hidden field. */
  config?: string;
  /** DOM id for in-page anchors ("#lead-form"). */
  id?: string;
};

/** Primary chat channel per market: default locale leads with Telegram. */
const PRIMARY_CHAT: Record<LeadFormLocale, { href: string; label: string }> = {
  uk: { href: SITE_CONTACT.telegram, label: SITE_CONTACT.telegramHandle },
  en: { href: `https://wa.me/${SITE_CONTACT.whatsapp}`, label: SITE_CONTACT.whatsappDisplay },
  ru: { href: SITE_CONTACT.telegram, label: SITE_CONTACT.telegramHandle },
};

function LeadFormInner({
  source = "contacts",
  variant = "full",
  locale = "uk",
  tier,
  config,
  id,
}: LeadFormProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");

  const strings = STRINGS_BY_LOCALE[locale];
  const TIER_OPTS = TIER_OPTS_BY_LOCALE[locale];
  const BUDGET_OPTS = BUDGET_OPTS_BY_LOCALE[locale];
  const HAS_SITE_OPTS = HAS_SITE_OPTS_BY_LOCALE[locale];

  const initialValues = useMemo<LeadValues>(() => {
    const urlTier = normalizeTier(searchParams?.get("tier") ?? null);
    const propTier = normalizeTier(tier ?? null);
    return { ...INITIAL, tier: urlTier || propTier };
  }, [searchParams, tier]);

  // URL `?source=` overrides the prop when present so links like
  // /contacts?source=hero-audit get recorded as the real entry point
  // in the Telegram lead message instead of the page-level default.
  const urlSource = searchParams?.get("source");
  const resolvedSource = urlSource && urlSource.trim() ? urlSource : source;

  const isCompact = variant === "compact";
  // "demo" — trimmed request-demo-access form: name + contact only.
  const isDemo = variant === "demo";
  const validationSchema = buildValidationSchema(
    strings.contactValidation,
    strings.budgetValidation,
    { requireBudget: !isDemo },
  );
  // The comment is the only optional free-text field; compact forms fold it.
  const [showDetails, setShowDetails] = useState<boolean>(!isCompact);
  // Unique per instance: a page can carry two forms (hero + bottom).
  const detailsId = useId();

  if (status === "success") {
    return (
      <div
        id={id}
        className="flex flex-col gap-3 p-8 border border-accent-40 rounded-card bg-accent-6"
        role="status"
      >
        <div
          className="w-11 h-11 rounded-card inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] mb-1"
          aria-hidden="true"
        >
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
        <h3 className="font-sans text-[22px] font-bold text-ink m-0 tracking-[-0.01em]">
          {strings.successTitle}
        </h3>
        <p className="text-[14px] leading-[1.6] text-ink-dim m-0">
          {strings.successBody}
        </p>
        <a
          href={PRIMARY_CHAT[locale].href}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex min-h-11 items-center justify-center self-start rounded-full border border-accent-40 px-5 font-sans text-[14px] font-semibold text-accent-soft no-underline transition-colors duration-200 hover:bg-accent-6"
        >
          {strings.successOrTg}
        </a>
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
          await submitLead(values, resolvedSource);
          setStatus("success");
          goToThankYou(locale);
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
      }) => (
        // noValidate: the `required` contact field otherwise triggers the
        // browser's own bubble ("Please fill out this field.") in the UI
        // language of the browser, not the page — Formik + Yup render the
        // localized error below the field instead (audit 2026-09-06, C9).
        <Form id={id} noValidate className={`flex flex-col ${isCompact || isDemo ? "gap-[18px]" : "gap-[22px]"}`}>
          <ConfigSync config={config} />
          <HoneypotField
            value={values.hp}
            onChange={(v) => setFieldValue("hp", v)}
          />
          {isCompact || isDemo ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label={strings.nameLabel}
                    placeholder={strings.namePlaceholderShort}
                  />
                )}
              </Field>
              <Field name="contact">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label={strings.contactLabel}
                    placeholder={strings.contactPlaceholderShort}
                    isRequired
                    isInvalid={Boolean(touched.contact && errors.contact)}
                    errorMessage={touched.contact ? errors.contact : undefined}
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
                    placeholder={strings.namePlaceholder}
                  />
                )}
              </Field>
              <Field name="contact">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label={strings.contactLabel}
                    placeholder={strings.contactPlaceholder}
                    isRequired
                    description={strings.contactDescription}
                    isInvalid={Boolean(touched.contact && errors.contact)}
                    errorMessage={touched.contact ? errors.contact : undefined}
                  />
                )}
              </Field>
            </>
          )}

          {!isDemo && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label={strings.tierLabel}
                placeholder={strings.tierPlaceholder}
                options={TIER_OPTS}
                value={values.tier}
                onChange={(v) => setFieldValue("tier", v)}
              />
              <Select
                label={strings.budgetLabel}
                placeholder={strings.budgetPlaceholder}
                options={BUDGET_OPTS}
                value={values.budget}
                onChange={(v) => setFieldValue("budget", v)}
                isRequired
                isInvalid={Boolean(touched.budget && errors.budget)}
                errorMessage={touched.budget ? errors.budget : undefined}
              />
            </div>
          )}

          {!isDemo && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select
                label={strings.hasSiteLabel}
                placeholder={strings.hasSitePlaceholder}
                options={HAS_SITE_OPTS}
                value={values.hasSite}
                onChange={(v) => setFieldValue("hasSite", v)}
              />
              {values.hasSite === "yes" && (
                <Field name="siteUrl">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      type="url"
                      inputMode="url"
                      label={strings.siteUrlLabel}
                      placeholder={strings.siteUrlPlaceholder}
                    />
                  )}
                </Field>
              )}
            </div>
          )}

          {!isDemo && values.config && (
            <div className="flex flex-col gap-1.5 p-[14px] border border-line rounded-card bg-[oklch(1_0_0_/_0.02)]">
              <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
                {strings.configLabel}
              </span>
              <pre className="m-0 whitespace-pre-wrap font-sans text-[13px] leading-[1.55] text-ink-dim">
                {values.config}
              </pre>
            </div>
          )}

          {isCompact && !isDemo && (
            <button
              type="button"
              className={TOGGLE_CLASS}
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              aria-controls={detailsId}
            >
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform duration-200${showDetails ? " rotate-180" : ""}`}
              />
              <span>
                {showDetails ? strings.hideDetails : strings.showDetails}
                <span className="text-ink-3 lowercase">
                  {" "}
                  · {strings.detailsMeta}
                </span>
              </span>
            </button>
          )}

          {!isDemo && showDetails && (
            <div id={detailsId}>
              <Field name="description">
                {({ field }: FieldProps) => (
                  <Textarea
                    {...field}
                    label={strings.descriptionLabel}
                    placeholder={strings.descriptionPlaceholder}
                    minRows={isCompact ? 3 : 4}
                  />
                )}
              </Field>
            </div>
          )}

          {/* The submitted form is the conversion; the id carries the same
              `source` the lead reaches Telegram with. Not `unique`: a page
              can hold two forms (hero + bottom). */}
          <Btn
            variant="gradient"
            type="submit"
            isLoading={isSubmitting || status === "submitting"}
            className={SUBMIT_BUTTON_CLASS}
            {...ctaAttrs(formId(resolvedSource))}
          >
            {isDemo ? strings.submitDemo : strings.submit}
          </Btn>

          {status === "error" && (
            <div
              className="py-3 px-4 rounded-ctl bg-[oklch(0.30_0.12_25_/_0.18)] border border-[oklch(0.55_0.18_25_/_0.4)] text-[oklch(0.85_0.08_25)] text-[13px] leading-[1.5]"
              role="alert"
            >
              {strings.errorBody}{" "}
              <a
                href={PRIMARY_CHAT[locale].href}
                target="_blank"
                rel="noreferrer"
                className="text-accent-soft no-underline font-semibold hover:underline"
              >
                {PRIMARY_CHAT[locale].label}
              </a>
            </div>
          )}

          <p className="font-mono text-[12px] leading-[1.55] tracking-[0.02em] text-ink-3 mt-1 mb-0">
            {strings.privacy}{" "}
            {/*
              GDPR Art. 13 wants the notice available where the data is
              actually collected, not only in the footer. One line, one link.
            */}
            <Link
              href={strings.privacyHref}
              className="text-ink-3 underline underline-offset-[3px] hover:text-ink-dim"
            >
              {strings.privacyLink}
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}

/**
 * Keeps the hidden `config` field in step with the calculator without
 * reinitialising the form — a reinit would wipe what the visitor typed.
 */
function ConfigSync({ config }: { config?: string }) {
  const { setFieldValue } = useFormikContext<LeadValues>();
  useEffect(() => {
    setFieldValue("config", config ?? "", false);
  }, [config, setFieldValue]);
  return null;
}

export function LeadForm(props: LeadFormProps = {}) {
  return (
    <Suspense fallback={null}>
      <LeadFormInner {...props} />
    </Suspense>
  );
}

export type { LeadFormProps };
