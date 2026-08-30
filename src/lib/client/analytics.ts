import type { LeadAttribution } from "@/types/lead";

type WindowWithDataLayer = Window & { dataLayer?: unknown[] };

/**
 * GA4 recommended event name for a submitted enquiry.
 * https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead
 */
export const LEAD_EVENT = "generate_lead";

/**
 * Push the lead event to the dataLayer so GTM can forward it to GA4.
 *
 * Until 30.08.2026 a submitted form fired no analytics event at all: the lead
 * went to Telegram and nowhere else. GA4 therefore showed zero conversions,
 * and no enquiry could be traced back to a channel, a page or a query — which
 * made every SEO change unmeasurable against the only metric that matters.
 *
 * Pushing before GTM has loaded is safe: the container replays whatever is
 * already in the array. Whether GA4 actually records the hit is decided by
 * Consent Mode, so this must not gate itself on consent — doing that twice
 * would silently drop events for users who did grant analytics.
 *
 * No personal data goes in. The visitor's name and contact stay in the
 * Telegram message; only the source and the channel that brought them travel
 * here.
 */
export function trackLead(source: string | undefined, attribution?: LeadAttribution): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithDataLayer;
  const dl = (w.dataLayer = w.dataLayer ?? []);
  dl.push({
    event: LEAD_EVENT,
    lead_source: source || "unknown",
    lead_channel: attribution?.utm?.utm_source || attribution?.referrer || "direct",
    lead_medium: attribution?.utm?.utm_medium || (attribution?.referrer ? "referral" : "none"),
    lead_landing: attribution?.landingPage,
  });
}
