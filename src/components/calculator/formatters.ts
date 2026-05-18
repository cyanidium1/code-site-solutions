import { formatPrice, type PriceLocale } from "@/lib/formatters/price";

/**
 * @deprecated misnamed legacy export — formatPrice is the canonical
 * formatter. Kept for back-compat; new callers should import formatPrice
 * directly. Output is the same string the EN locale would have produced.
 */
export const formatEur = (value: number, locale: PriceLocale = "en") =>
  formatPrice(value, { locale, currency: "USD" });

export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
