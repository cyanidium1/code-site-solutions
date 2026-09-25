import { THANK_YOU_PATH } from "@/constants/conversion-ids";
import { localizePath } from "@/constants/i18n-routes";
import { DEFAULT_LOCALE, LOCALE_CONFIG, LOCALES, type Locale } from "@/constants/locales";

/**
 * Locale of the page the visitor is on, read off the URL prefix.
 *
 * Several forms (the closing audit block, for one) take their copy as props
 * and never learn which locale rendered them. Rather than thread a `locale`
 * prop through every call site — and have the one that forgets silently send
 * a Russian visitor to the Ukrainian thank-you page — we read the prefix that
 * is already in the address bar.
 */
export function localeFromPath(pathname?: string): Locale {
  const path =
    pathname ?? (typeof window === "undefined" ? "/" : window.location.pathname);
  const prefixed = LOCALES.find((locale) => {
    const prefix = LOCALE_CONFIG[locale].urlPrefix;
    return prefix && (path === prefix || path.startsWith(`${prefix}/`));
  });
  return prefixed ?? DEFAULT_LOCALE;
}

/**
 * Send the visitor to the thank-you page after a successful submit.
 *
 * A FULL page load, not `router.push`: the conversion Google Ads counts is
 * the destination URL `/thank-you`, and a soft navigation does not reliably
 * produce the page_view that a destination conversion and GA4 both key on.
 *
 * The short delay lets the `generate_lead` beacon leave the page. GA4 sends
 * on `navigator.sendBeacon`, which survives unload — but when the visitor
 * submits before gtag.js has finished loading, the event is still sitting in
 * the dataLayer queue and a navigation would drop it. The form's own success
 * card is already on screen during those milliseconds, so nothing flashes
 * empty.
 *
 * Deliberately NOT wired to anything phone-shaped. A `tel:` click hands the
 * visitor to the dialer and never comes back, so a redirect would either do
 * nothing or yank the page out from under a call being placed — and counting
 * it as a lead would double-count the person who then also sends the form.
 */
export function goToThankYou(locale?: Locale): void {
  if (typeof window === "undefined") return;
  const url = localizePath(THANK_YOU_PATH, locale ?? localeFromPath());
  window.setTimeout(() => window.location.assign(url), 350);
}
