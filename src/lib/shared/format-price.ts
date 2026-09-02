/**
 * Locale-aware price formatter.
 *
 * UA locale uses NBSP ( ) as thousands separator → "$1 000".
 * EN locale (UK market) uses comma and GBP → "£1,000".
 * Currency defaults to the locale market (en → GBP, uk → USD); pass an
 * explicit `currency` to override. Currency symbol always leads. No trailing "+" or "до" — callers add
 * range prefixes via separate keys ("from", "від").
 */

import type { Locale } from "@/constants/locales";

export type PriceLocale = Locale;
export type PriceCurrency = "USD" | "EUR" | "UAH" | "GBP";

const CURRENCY_SYMBOL: Record<PriceCurrency, string> = {
  USD: "$",
  EUR: "€",
  UAH: "₴",
  GBP: "£",
};

/** Market currency per locale: EN targets the UK (£), UA stays on $. */
export const LOCALE_CURRENCY: Record<PriceLocale, PriceCurrency> = {
  uk: "USD",
  en: "GBP",
  ru: "USD",
};

/** "from"/"від" range-prefix word per locale. */
export const FROM_LABEL: Record<PriceLocale, string> = {
  uk: "від",
  en: "from",
  ru: "от",
};

/** Thousands separator per locale (NBSP for UA, comma for EN). */
const GROUP_SEP: Record<PriceLocale, string> = {
  uk: " ",
  en: ",",
  ru: " ",
};

export interface FormatPriceOptions {
  locale: PriceLocale;
  currency?: PriceCurrency;
  /** Prepend the locale "from"/"від" word, e.g. "від $1 000". */
  withPrefix?: boolean;
}

/**
 * Locale-grouped digits with no currency symbol — for the currencies this
 * market writes as a suffix ("105 000 грн"). Hand-rolled rather than Intl so
 * server and client produce the identical separator and hydration stays clean.
 */
export function groupDigits(amount: number, locale: PriceLocale): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEP[locale]);
}

export function formatPrice(amount: number, opts: FormatPriceOptions): string {
  const { locale, currency = LOCALE_CURRENCY[locale], withPrefix = false } = opts;

  const symbol = CURRENCY_SYMBOL[currency];
  // Round to whole units; we don't show cents in marketing copy.
  const grouped = groupDigits(amount, locale);

  const body = `${symbol}${grouped}`;
  return withPrefix ? `${FROM_LABEL[locale]} ${body}` : body;
}

/**
 * Format a price range like "$1,000 – $3,500" / "$1 000 – $3 500".
 * Uses en-dash with NBSP on both sides for typographic correctness.
 */
export function formatPriceRange(
  from: number,
  to: number,
  opts: FormatPriceOptions,
): string {
  const a = formatPrice(from, { ...opts, withPrefix: false });
  const b = formatPrice(to, { ...opts, withPrefix: false });
  return `${a} – ${b}`;
}
