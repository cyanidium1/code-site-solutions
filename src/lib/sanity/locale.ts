import type { LocalizedString, Locale } from "./types";

export function loc(
  value: LocalizedString | undefined | null,
  locale: Locale = "uk",
): string {
  if (!value) return "";
  return value[locale] ?? value.uk ?? value.en ?? value.ru ?? "";
}
