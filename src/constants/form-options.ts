/**
 * Locale-keyed option arrays for the standalone lead-form block.
 *
 * The calculator's lead form (`src/components/calculator/LeadForm.tsx`)
 * uses a different, calculator-specific form shape and does not share
 * these arrays.
 */

export type LeadFormLocale = "uk" | "en";

export type LeadFormOption = { key: string; label: string };

export const BUSINESS_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = {
  uk: [
    { key: "healthcare", label: "Healthcare / клініки і стоматології" },
    { key: "legal", label: "Legal / юридична фірма" },
    { key: "accounting", label: "Accounting / бухгалтерія" },
    { key: "ecommerce", label: "E-commerce / інтернет-магазин" },
    { key: "saas", label: "SaaS / стартап" },
    { key: "construction", label: "Будівництво / ремонт" },
    { key: "other", label: "Інше (вкажіть в описі)" },
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

export const TIER_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = {
  uk: [
    { key: "landing", label: "Лендінг — від $800" },
    { key: "corporate", label: "Корпоративний сайт — від $3 500" },
    { key: "custom", label: "Кастомна платформа — від $6 000" },
    { key: "undecided", label: "Не визначився" },
  ],
  en: [
    { key: "landing", label: "Landing — from £800" },
    { key: "corporate", label: "Corporate Website — from £3,500" },
    { key: "custom", label: "Custom Platform — from £6,000" },
    { key: "undecided", label: "I don't know yet" },
  ],
};

export const BUDGET_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = {
  uk: [
    { key: "lt3k", label: "До $3k" },
    { key: "3-7k", label: "$3-7k" },
    { key: "7-15k", label: "$7-15k" },
    { key: "gt15k", label: "$15k+" },
    { key: "unknown", label: "Поки не знаю" },
  ],
  en: [
    { key: "lt3k", label: "Under £3k" },
    { key: "3-7k", label: "£3-7k" },
    { key: "7-15k", label: "£7-15k" },
    { key: "gt15k", label: "£15k+" },
    { key: "unknown", label: "I don't know yet" },
  ],
};

export const TIMELINE_OPTS_BY_LOCALE: Record<LeadFormLocale, LeadFormOption[]> = {
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
