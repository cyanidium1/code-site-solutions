"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, type FieldProps } from "formik";
import * as Yup from "yup";

import { Btn, Input, Select, Textarea } from "@/components/ui";
import { BUDGET_OPTS_BY_LOCALE } from "@/constants/form-options";
import { SITE_CONTACT } from "@/constants/site";
import { HoneypotField } from "@/components/blocks/honeypot-field";
import { submitLead } from "@/components/blocks/lead-form/submit";
import { goToThankYou } from "@/lib/client/go-to-thank-you";
import { INITIAL_LEAD_VALUES } from "@/components/blocks/lead-form/validation";
import type { LeadValues } from "@/types/lead";

/**
 * Free-audit request form (TZ v2 §3.9): site URL is required here, unlike the
 * site-wide LeadForm where it only appears after "yes, I have a site". Same
 * API route, same visual primitives; leads arrive with source "audit".
 */

type AuditFormLocale = "uk" | "ru";

const STRINGS: Record<AuditFormLocale, Record<string, string>> = {
  uk: {
    siteUrlLabel: "Адреса сайту",
    siteUrlPlaceholder: "https://вашсайт.com.ua",
    siteUrlError: "Вкажіть адресу сайту, який розбираємо",
    contactLabel: "Телефон, Telegram або email",
    contactPlaceholder: "+380..., @username або email",
    contactError: "Вкажіть телефон, Telegram або email",
    nameLabel: "Ім'я",
    namePlaceholder: "Необовʼязково",
    descriptionLabel: "Що зараз не працює",
    descriptionPlaceholder: "Мало заявок, повільний, не видно в Google… (необовʼязково)",
    budgetLabel: "Бюджет на зміни",
    budgetPlaceholder: "Оберіть діапазон",
    budgetError: "Оберіть бюджет — так план буде реалістичним",
    submit: "Отримати безкоштовний аудит",
    successTitle: "Заявку прийнято",
    successBody: "Надішлемо аудит протягом 24 годин у робочий час.",
    successOrTg: "Написати в Telegram",
    errorBody: "Щось пішло не так. Спробуйте ще раз або пишіть в Telegram",
    privacy: "Дані потрібні лише для відповіді на заявку, третім особам не передаємо.",
    privacyLink: "Політика конфіденційності",
    privacyHref: "/policy",
  },
  ru: {
    siteUrlLabel: "Адрес сайта",
    siteUrlPlaceholder: "https://вашсайт.com.ua",
    siteUrlError: "Укажите адрес сайта, который разбираем",
    contactLabel: "Телефон, Telegram или email",
    contactPlaceholder: "+380..., @username или email",
    contactError: "Укажите телефон, Telegram или email",
    nameLabel: "Имя",
    namePlaceholder: "Необязательно",
    descriptionLabel: "Что сейчас не работает",
    descriptionPlaceholder: "Мало заявок, медленный, не видно в Google… (необязательно)",
    budgetLabel: "Бюджет на изменения",
    budgetPlaceholder: "Выберите диапазон",
    budgetError: "Выберите бюджет — так план будет реалистичным",
    submit: "Получить бесплатный аудит",
    successTitle: "Заявка принята",
    successBody: "Пришлём аудит в течение 24 часов в рабочее время.",
    successOrTg: "Написать в Telegram",
    errorBody: "Что-то пошло не так. Попробуйте ещё раз или пишите в Telegram",
    privacy: "Данные нужны только для ответа на заявку, третьим лицам не передаём.",
    privacyLink: "Политика конфиденциальности",
    privacyHref: "/policy",
  },
};

/* Same treatment as the site-wide LeadForm submit (blocks/lead-form). */
const SUBMIT_BUTTON_CLASS =
  "mt-1.5 min-h-12 bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] " +
  "text-[oklch(1_0_0_/_0.95)] font-sans font-semibold text-[13px] tracking-[0.04em] " +
  "shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.32)] " +
  "transition-[transform,box-shadow] duration-[250ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:-translate-y-px hover:shadow-[0_16px_36px_oklch(from_var(--color-accent)_l_c_h_/_0.4)]";

/** Accepts "site.com.ua" as well as full URLs — people rarely type the scheme. */
const URL_LIKE = /^(https?:\/\/)?[^\s/.]+\.[^\s]{2,}$/i;

export function AuditForm({
  locale,
  source = "audit",
}: {
  locale: AuditFormLocale;
  source?: string;
}) {
  const t = STRINGS[locale];
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const schema = Yup.object({
    siteUrl: Yup.string().trim().matches(URL_LIKE, t.siteUrlError).required(t.siteUrlError),
    contact: Yup.string().min(5, t.contactError).required(t.contactError),
    budget: Yup.string().required(t.budgetError),
  });

  if (status === "success") {
    return (
      <div
        className="flex flex-col gap-3 p-8 border border-accent-40 rounded-card bg-accent-6"
        role="status"
      >
        <h3 className="font-sans text-[22px] font-bold text-ink m-0 tracking-[-0.01em]">
          {t.successTitle}
        </h3>
        <p className="text-[14px] leading-[1.6] text-ink-dim m-0">{t.successBody}</p>
        <a
          href={SITE_CONTACT.telegram}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex min-h-11 items-center justify-center self-start rounded-full border border-accent-40 px-5 font-sans text-[14px] font-semibold text-accent-soft no-underline transition-colors duration-200 hover:bg-accent-6"
        >
          {t.successOrTg}
        </a>
      </div>
    );
  }

  return (
    <Formik<LeadValues>
      initialValues={{ ...INITIAL_LEAD_VALUES, hasSite: "yes", tier: "unknown" }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await submitLead({ ...values, siteUrl: values.siteUrl.trim() }, source);
          setStatus("success");
          goToThankYou(locale);
        } catch {
          setStatus("error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting }) => (
        <Form noValidate className="flex flex-col gap-[18px]">
          <HoneypotField value={values.hp} onChange={(v) => setFieldValue("hp", v)} />
          <Field name="siteUrl">
            {({ field }: FieldProps) => (
              <Input
                {...field}
                type="text"
                inputMode="url"
                autoComplete="url"
                label={t.siteUrlLabel}
                placeholder={t.siteUrlPlaceholder}
                isRequired
                isInvalid={Boolean(touched.siteUrl && errors.siteUrl)}
                errorMessage={touched.siteUrl ? errors.siteUrl : undefined}
              />
            )}
          </Field>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field name="contact">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  label={t.contactLabel}
                  placeholder={t.contactPlaceholder}
                  isRequired
                  isInvalid={Boolean(touched.contact && errors.contact)}
                  errorMessage={touched.contact ? errors.contact : undefined}
                />
              )}
            </Field>
            <Field name="name">
              {({ field }: FieldProps) => (
                <Input {...field} label={t.nameLabel} placeholder={t.namePlaceholder} />
              )}
            </Field>
          </div>
          <Select
            label={t.budgetLabel}
            placeholder={t.budgetPlaceholder}
            options={BUDGET_OPTS_BY_LOCALE[locale]}
            value={values.budget}
            onChange={(v) => {
              setFieldValue("budget", v);
              setFieldTouched("budget", true, false);
            }}
            isRequired
            isInvalid={Boolean(touched.budget && errors.budget)}
            errorMessage={touched.budget ? errors.budget : undefined}
          />
          <Field name="description">
            {({ field }: FieldProps) => (
              <Textarea
                {...field}
                label={t.descriptionLabel}
                placeholder={t.descriptionPlaceholder}
                minRows={3}
              />
            )}
          </Field>
          <Btn variant="gradient" type="submit" isLoading={isSubmitting} className={SUBMIT_BUTTON_CLASS}>
            {t.submit}
          </Btn>
          {status === "error" && (
            <div
              className="py-3 px-4 rounded-ctl bg-[oklch(0.30_0.12_25_/_0.18)] border border-[oklch(0.55_0.18_25_/_0.4)] text-[oklch(0.85_0.08_25)] text-[13px] leading-[1.5]"
              role="alert"
            >
              {t.errorBody}{" "}
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
          <p className="font-mono text-[12px] leading-[1.55] tracking-[0.02em] text-ink-3 mt-1 mb-0">
            {t.privacy}{" "}
            <Link
              href={t.privacyHref}
              className="text-ink-3 underline underline-offset-[3px] hover:text-ink-dim"
            >
              {t.privacyLink}
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  );
}
