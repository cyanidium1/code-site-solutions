/**
 * Locale-aware price formatter.
 *
 * UA locale uses NBSP ( ) as thousands separator → "$1 000".
 * EN locale (UK market) uses comma and GBP → "£1,000".
 * Currency defaults to the locale market (en → GBP, uk → USD); pass an
 * explicit `currency` to override. Currency symbol always leads. No trailing "+" or "до" — callers add
 * range prefixes via separate keys ("from", "від").
 */

export type PriceLocale = "uk" | "en";
export type PriceCurrency = "USD" | "EUR" | "UAH" | "GBP";

const CURRENCY_SYMBOL: Record<PriceCurrency, string> = {
  USD: "$",
  EUR: "€",
  UAH: "₴",
  GBP: "£",
};

/** Market currency per locale: EN targets the UK (£), UA stays on $. */
const LOCALE_CURRENCY: Record<PriceLocale, PriceCurrency> = {
  uk: "USD",
  en: "GBP",
};

const FROM_LABEL: Record<PriceLocale, string> = {
  uk: "від",
  en: "from",
};

export interface FormatPriceOptions {
  locale: PriceLocale;
  currency?: PriceCurrency;
  /** Prepend the locale "from"/"від" word, e.g. "від $1 000". */
  withPrefix?: boolean;
}

export function formatPrice(amount: number, opts: FormatPriceOptions): string {
  const { locale, currency = LOCALE_CURRENCY[locale], withPrefix = false } = opts;

  // Round to whole units; we don't show cents in marketing copy.
  const whole = Math.round(amount);

  const symbol = CURRENCY_SYMBOL[currency];
  const groupSep = locale === "uk" ? " " : ",";
  const grouped = whole
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);

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
