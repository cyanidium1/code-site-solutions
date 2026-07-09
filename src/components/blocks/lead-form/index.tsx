"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, type FieldProps } from "formik";
import { ChevronDown } from "lucide-react";

import { Btn, Input, Select, Textarea } from "@/components/ui";

import { SITE_CONTACT } from "@/constants/site";

import type { LeadValues } from "@/types/lead";
import {
  BUDGET_OPTS_BY_LOCALE,
  BUSINESS_OPTS_BY_LOCALE,
  TIER_OPTS_BY_LOCALE,
  TIMELINE_OPTS_BY_LOCALE,
  type LeadFormLocale,
} from "@/constants/form-options";
import { LEAD_FORM_STRINGS_BY_LOCALE as STRINGS_BY_LOCALE } from "@/content/lead-form";
import { HoneypotField } from "@/components/blocks/honeypot-field";
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
  /** Preselects the tier dropdown when not already set via `?tier=` in the URL. */
  tier?: string;
};

function LeadFormInner({
  source = "contacts",
  variant = "full",
  locale = "uk",
  tier,
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
  const [showDetails, setShowDetails] = useState<boolean>(
    !isCompact || Boolean(initialValues.tier),
  );

  if (status === "success") {
    return (
      <div
        className="flex flex-col gap-3 p-8 border border-accent-40 rounded-[18px] bg-accent-6"
        role="status"
      >
        <div
          className="w-11 h-11 rounded-[14px] inline-flex items-center justify-center bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] mb-1"
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
        <p className="text-[14px] leading-[1.6] text-ink-dim m-0">
          {strings.successOrTg}{" "}
          <a
            href={
              locale === "en"
                ? `https://wa.me/${SITE_CONTACT.whatsapp}`
                : SITE_CONTACT.telegram
            }
            target="_blank"
            rel="noreferrer"
            className="text-accent-soft no-underline font-semibold hover:underline"
          >
            {locale === "en"
              ? SITE_CONTACT.whatsappDisplay
              : SITE_CONTACT.telegramHandle}
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
          await submitLead(values, resolvedSource);
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
      }) => (
        <Form className={`flex flex-col ${isCompact ? "gap-[18px]" : "gap-[22px]"}`}>
          <HoneypotField
            value={values.hp}
            onChange={(v) => setFieldValue("hp", v)}
          />
          {isCompact ? (
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

          <Select
            label={strings.businessLabel}
            placeholder={strings.businessPlaceholder}
            options={BUSINESS_OPTS}
            value={values.business}
            onChange={(v) => setFieldValue("business", v)}
          />

          <Field name="description">
            {({ field }: FieldProps) => (
              <Textarea
                {...field}
                label={strings.descriptionLabel}
                placeholder={strings.descriptionPlaceholder}
                minRows={isCompact ? 3 : 5}
              />
            )}
          </Field>

          {isCompact && (
            <button
              type="button"
              className={TOGGLE_CLASS}
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              aria-controls="lead-form-details"
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

          {showDetails && (
            <div
              className="flex flex-col gap-[18px] p-[18px] border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)]"
              id="lead-form-details"
            >
              <Select
                label={strings.tierLabel}
                placeholder={strings.tierPlaceholder}
                options={TIER_OPTS}
                value={values.tier}
                onChange={(v) => setFieldValue("tier", v)}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select
                  label={strings.budgetLabel}
                  placeholder={strings.budgetPlaceholder}
                  options={BUDGET_OPTS}
                  value={values.budget}
                  onChange={(v) => setFieldValue("budget", v)}
                />

                <Select
                  label={strings.timelineLabel}
                  placeholder={strings.timelinePlaceholder}
                  options={TIMELINE_OPTS}
                  value={values.timeline}
                  onChange={(v) => setFieldValue("timeline", v)}
                />
              </div>
            </div>
          )}

          <Btn
            variant="gradient"
            type="submit"
            isLoading={isSubmitting || status === "submitting"}
            className={SUBMIT_BUTTON_CLASS}
          >
            {strings.submit}
          </Btn>

          {status === "error" && (
            <div
              className="py-3 px-4 rounded-xl bg-[oklch(0.30_0.12_25_/_0.18)] border border-[oklch(0.55_0.18_25_/_0.4)] text-[oklch(0.85_0.08_25)] text-[13px] leading-[1.5]"
              role="alert"
            >
              {strings.errorBody}{" "}
              <a
                href={
                  locale === "en"
                    ? `https://wa.me/${SITE_CONTACT.whatsapp}`
                    : SITE_CONTACT.telegram
                }
                target="_blank"
                rel="noreferrer"
                className="text-accent-soft no-underline font-semibold hover:underline"
              >
                {locale === "en"
                  ? SITE_CONTACT.whatsappDisplay
                  : SITE_CONTACT.telegramHandle}
              </a>
            </div>
          )}

          <p className="font-mono text-[11px] leading-[1.55] tracking-[0.02em] text-ink-3 mt-1 mb-0">
            {strings.privacy}
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

export type { LeadFormProps };
