import type { LeadAttribution } from "@/types/lead";

type WindowWithDataLayer = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * Send the event to GA4 directly, next to the dataLayer push.
 *
 * The dataLayer push alone is not enough: GTM forwards a custom event to GA4
 * only if the container has a trigger and a tag for it, and container
 * GTM-TRCVT2FH has zero triggers — so between 30.08 and 22.09.2026 every
 * `generate_lead` died inside the browser and GA4 reported 0 key events
 * (`code-site.art-audit/ANALYTICS-2026-09-22.md`, §4.1).
 *
 * `gtag` is defined by the consent bootstrap before anything else runs, so a
 * call made before the Google tag has loaded queues in the dataLayer and is
 * replayed once it does. Consent Mode still decides whether GA4 stores
 * anything; a denied visitor sends a cookieless ping, which is the point.
 */
function sendToGa4(event: string, params: Record<string, unknown>): void {
  const w = window as WindowWithDataLayer;
  w.gtag?.("event", event, params);
}

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
export function trackLead(
  source: string | undefined,
  attribution?: LeadAttribution,
  tier?: string,
): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithDataLayer;
  const dl = (w.dataLayer = w.dataLayer ?? []);
  const params = {
    lead_source: source || "unknown",
    lead_tier: tier || undefined,
    lead_channel: attribution?.utm?.utm_source || attribution?.referrer || "direct",
    lead_medium: attribution?.utm?.utm_medium || (attribution?.referrer ? "referral" : "none"),
    lead_landing: attribution?.landingPage,
    lead_gclid: attribution?.gclid,
  };
  dl.push({
    event: LEAD_EVENT,
    ...params,
    // Google Ads conversion target for the GTM Ads tag ("AW-XXX/label").
    // Placeholder until the owner creates the conversion action.
    ads_send_to: ADS_LEAD_SEND_TO || undefined,
  });
  sendToGa4(LEAD_EVENT, params);
}

/** "AW-123456789/AbC-dEfGhIj" — set in Vercel env. Empty = no Ads conversion. */
const ADS_LEAD_SEND_TO = process.env.NEXT_PUBLIC_GADS_LEAD_SEND_TO ?? "";

/** Secondary conversion: a tap on the phone number or a messenger link. */
export const CONTACT_CLICK_EVENT = "contact_click";

/**
 * `cta_id` is the `data-cta` of the link that was clicked (see
 * `@/constants/conversion-ids`), so a campaign can tell the footer
 * WhatsApp from the one in the contacts block instead of seeing one
 * undifferentiated "whatsapp" channel.
 */
export function trackContactClick(
  channel: string,
  page: string,
  ctaId?: string,
): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithDataLayer;
  const params = {
    contact_channel: channel,
    contact_page: page,
    cta_id: ctaId || undefined,
  };
  (w.dataLayer = w.dataLayer ?? []).push({
    event: CONTACT_CLICK_EVENT,
    ...params,
  });
  sendToGa4(CONTACT_CLICK_EVENT, params);
}

/**
 * Micro-conversion: a click on any element carrying `data-cta` that is not
 * itself a contact link — the buttons that open the lead modal or scroll to
 * the form.
 *
 * This is NOT the lead. The lead is `generate_lead` plus the `/thank-you`
 * landing; this event exists so the owner can see which CTA produced the
 * session that converted, and so Ads has a signal to optimise on while the
 * lead volume is still too low to train on.
 */
export const CTA_CLICK_EVENT = "cta_click";

export function trackCtaClick(ctaId: string, page: string): void {
  if (typeof window === "undefined") return;
  const w = window as WindowWithDataLayer;
  const params = { cta_id: ctaId, cta_page: page };
  (w.dataLayer = w.dataLayer ?? []).push({ event: CTA_CLICK_EVENT, ...params });
  sendToGa4(CTA_CLICK_EVENT, params);
}
