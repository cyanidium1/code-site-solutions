"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, type FieldProps } from "formik";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

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
import { INITIAL_LEAD_VALUES as INITIAL, buildValidationSchema } from "./validation";
import { submitLead } from "./submit";

// ─── HeroUI classNames (replaces lead-form.css scoped overrides) ───────────
//
// HeroUI's data-slot architecture is reached two ways:
//   1. The `classNames` prop merges utility strings into the per-slot class.
//   2. The element exposes data-* attributes (`data-focus`, `data-hover`,
//      `data-invalid`, `data-open`) that Tailwind reaches via the
//      `data-[focus=true]:` variant — applied on the SAME slot.
// We use `!important` utilities where HeroUI's internal class collides at
// equal specificity (label color, input text color/font, placeholder).
// Same pattern Session 2 used for the FAQ accordion slots.

const LABEL_CLASS =
  "!text-[var(--color-ink-dim)] font-medium !text-[13px] tracking-[0.005em] " +
  "after:!text-accent-soft";

const WRAPPER_CLASS =
  "border border-line-strong bg-[oklch(0.16_0.005_300_/_0.7)] shadow-none transition-[border-color,background-color] duration-200 " +
  "hover:!border-[var(--color-ink-3)] hover:!bg-[oklch(0.16_0.005_300_/_0.9)] " +
  "data-[focus=true]:!border-accent-soft data-[focus=true]:!bg-[oklch(0.18_0.01_300_/_0.95)] " +
  "data-[focus-visible=true]:!border-accent-soft data-[focus-visible=true]:!bg-[oklch(0.18_0.01_300_/_0.95)] " +
  "group-data-[invalid=true]:!border-[oklch(0.65_0.18_25)]";

const INPUT_CLASS =
  "!text-ink !font-sans !text-[14px] tracking-[0.005em] " +
  "placeholder:!text-[var(--color-ink-3)] placeholder:!font-sans";

const TEXTAREA_INPUT_CLASS = `${INPUT_CLASS} leading-[1.5]`;

const DESCRIPTION_CLASS = "!text-[var(--color-ink-3)]";

const ERROR_MESSAGE_CLASS = "!text-[oklch(0.78_0.14_25)]";

const INPUT_CLASSNAMES = {
  label: LABEL_CLASS,
  inputWrapper: WRAPPER_CLASS,
  input: INPUT_CLASS,
  description: DESCRIPTION_CLASS,
  errorMessage: ERROR_MESSAGE_CLASS,
} as const;

const TEXTAREA_CLASSNAMES = {
  label: LABEL_CLASS,
  inputWrapper: WRAPPER_CLASS,
  input: TEXTAREA_INPUT_CLASS,
  description: DESCRIPTION_CLASS,
  errorMessage: ERROR_MESSAGE_CLASS,
} as const;

// Select trigger element parallels Input's inputWrapper. The trigger gets the
// same border/bg treatment; additionally `data-[open=true]` (popover open)
// reuses the focus styling so the trigger reads as active while the menu is
// shown. `value` is the visible text inside the trigger.
const SELECT_TRIGGER_CLASS =
  "border border-line-strong !bg-[oklch(0.16_0.005_300_/_0.7)] !shadow-none transition-[border-color,background-color] duration-200 " +
  "hover:!border-[var(--color-ink-3)] hover:!bg-[oklch(0.16_0.005_300_/_0.9)] " +
  "data-[focus=true]:!border-accent-soft data-[focus=true]:!bg-[oklch(0.18_0.01_300_/_0.95)] " +
  "data-[focus-visible=true]:!border-accent-soft data-[focus-visible=true]:!bg-[oklch(0.18_0.01_300_/_0.95)] " +
  "data-[open=true]:!border-accent-soft data-[open=true]:!bg-[oklch(0.18_0.01_300_/_0.95)] " +
  "data-[invalid=true]:!border-[oklch(0.65_0.18_25)]";

const SELECT_VALUE_CLASS =
  "!text-ink !font-sans !text-[14px] tracking-[0.005em]";

// Select popover is portaled into <body>; styling reaches it via the
// `popoverContent` slot. Background, border, deep shadow + backdrop-blur.
const SELECT_POPOVER_CLASS =
  "!bg-[oklch(0.13_0.005_300_/_0.98)] border border-line-strong " +
  "!shadow-[0_18px_48px_oklch(0_0_0_/_0.5),0_0_0_1px_oklch(1_0_0_/_0.04)_inset] " +
  "backdrop-blur-[16px]";

// SelectItem className per option. Default ink-2 text; hover/focus → ink with
// translucent white bg; selected → accent-tinted bg + ink text; selected+hover
// deepens accent. Same effects the legacy `.lead-form-popover-item[…]` rules
// produced, reached via data-* variants on the item itself.
const SELECT_ITEM_CLASS =
  "!text-[var(--color-ink-dim)] rounded-lg transition-[background-color,color] duration-150 " +
  "data-[hover=true]:!bg-[rgba(255,255,255,0.06)] data-[hover=true]:!text-ink " +
  "data-[focus=true]:!bg-[rgba(255,255,255,0.06)] data-[focus=true]:!text-ink " +
  "data-[focus-visible=true]:!bg-[rgba(255,255,255,0.06)] data-[focus-visible=true]:!text-ink " +
  "data-[selected=true]:!bg-[oklch(from_var(--color-accent)_l_c_h_/_0.2)] data-[selected=true]:!text-ink " +
  "data-[selected=true]:data-[hover=true]:!bg-[oklch(from_var(--color-accent)_l_c_h_/_0.28)]";

const SELECT_CLASSNAMES = {
  label: LABEL_CLASS,
  trigger: SELECT_TRIGGER_CLASS,
  value: SELECT_VALUE_CLASS,
  popoverContent: SELECT_POPOVER_CLASS,
  description: DESCRIPTION_CLASS,
  errorMessage: ERROR_MESSAGE_CLASS,
} as const;

// Submit button — pill with brand-gradient bg, glow shadow, lift on hover.
const SUBMIT_BUTTON_CLASS =
  "mt-1.5 !bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] " +
  "!text-[oklch(1_0_0_/_0.95)] font-sans font-semibold !text-[13px] tracking-[0.04em] " +
  "shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.32)] " +
  "transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:-translate-y-px hover:shadow-[0_16px_36px_oklch(from_var(--color-accent)_l_c_h_/_0.4)]";

// Compact-form "more details" toggle pill.
const TOGGLE_CLASS =
  "inline-flex items-center gap-2 self-start py-2.5 px-[14px] border border-dashed border-line-strong rounded-full bg-[oklch(1_0_0_/_0.02)] text-[var(--color-ink-dim)] font-mono text-[12px] tracking-[0.04em] cursor-pointer " +
  "transition-[color,border-color,background-color] duration-200 " +
  "hover:text-accent-soft hover:border-[oklch(from_var(--color-accent)_l_c_h_/_0.4)] hover:bg-[oklch(from_var(--color-accent)_l_c_h_/_0.05)]";

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
      <div
        className="flex flex-col gap-3 p-8 border border-[oklch(from_var(--color-accent)_l_c_h_/_0.4)] rounded-[18px] bg-[oklch(from_var(--color-accent)_l_c_h_/_0.06)]"
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
        <p className="text-[14px] leading-[1.6] text-[var(--color-ink-dim)] m-0">
          {strings.successBody}
        </p>
        <p className="text-[14px] leading-[1.6] text-[var(--color-ink-dim)] m-0">
          {strings.successOrTg}{" "}
          <a
            href={SITE_CONTACT.telegram}
            target="_blank"
            rel="noreferrer"
            className="text-accent-soft no-underline font-semibold hover:underline"
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
        submitForm,
      }) => (
        <Form className={`flex flex-col ${isCompact ? "gap-[18px]" : "gap-[22px]"}`}>
          {isCompact ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    label={strings.nameLabel}
                    labelPlacement="outside"
                    placeholder={strings.namePlaceholderShort}
                    variant="bordered"
                    radius="lg"
                    classNames={INPUT_CLASSNAMES}
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
                    classNames={INPUT_CLASSNAMES}
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
                    classNames={INPUT_CLASSNAMES}
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
                    classNames={INPUT_CLASSNAMES}
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
              <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>
                {o.label}
              </SelectItem>
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
                classNames={TEXTAREA_CLASSNAMES}
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
                <span className="text-[var(--color-ink-3)] lowercase">
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
                  <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>
                    {o.label}
                  </SelectItem>
                ))}
              </Select>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>
                      {o.label}
                    </SelectItem>
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
                    <SelectItem key={o.key} className={SELECT_ITEM_CLASS}>
                      {o.label}
                    </SelectItem>
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
            className={SUBMIT_BUTTON_CLASS}
          >
            {strings.submit}
          </Button>

          {status === "error" && (
            <div
              className="py-3 px-4 rounded-xl bg-[oklch(0.30_0.12_25_/_0.18)] border border-[oklch(0.55_0.18_25_/_0.4)] text-[oklch(0.85_0.08_25)] text-[13px] leading-[1.5]"
              role="alert"
            >
              {strings.errorBody}{" "}
              <a
                href={SITE_CONTACT.telegram}
                target="_blank"
                rel="noreferrer"
                className="text-accent-soft no-underline font-semibold hover:underline"
              >
                {SITE_CONTACT.telegramHandle}
              </a>
            </div>
          )}

          <p className="font-mono text-[11px] leading-[1.55] tracking-[0.02em] text-[var(--color-ink-3)] mt-1 mb-0">
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
