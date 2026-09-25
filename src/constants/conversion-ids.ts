/**
 * Conversion identifiers for ads and analytics.
 *
 * Every element a paid campaign needs to count carries `data-cta="<id>"`.
 * GTM targets it with the CSS selector `[data-cta="cta-header-lead"]` — the
 * same thing an `#id` selector does, except it stays valid when a block
 * repeats on a page (a blog post can hold three inline CTAs, `/pricing`
 * renders five package buttons). Elements that are structurally unique per
 * page ALSO carry `id="<id>"`, so an Ads/GTM setup written against ids works
 * for the header, the footer and the contacts block.
 *
 * Reading the ids:
 *
 *   cta-<placement>-<intent>   a click that leads towards an enquiry
 *   form-<placement>           a submitted form — the real conversion
 *   msg-<channel>-<placement>  a messenger, phone or e-mail link
 *
 * The real conversion in Google Ads is the destination URL `/thank-you`
 * (see `THANK_YOU_PATH`), which every submitted form lands on. Everything
 * else here is a secondary event: useful for optimisation and for seeing
 * which CTA does the work, not for counting leads twice.
 *
 * Never type an id into JSX by hand — build it through the helpers so a
 * typo can't silently detach a campaign from its button.
 */

/** Where on the page the element sits. Extend deliberately, not per page. */
export type ConversionPlacement =
  | "header"
  | "mobile-menu"
  | "hero"
  | "final"
  | "footer"
  | "contacts"
  | "pricing"
  | "package"
  | "industry"
  | "calculator"
  | "blog"
  | "case"
  | "modal"
  | "offer"
  | "audit"
  | "reasons"
  | "thank-you"
  | "faq";

/** What the visitor is trying to do. */
export type ConversionIntent =
  | "lead"
  | "calc"
  | "cases"
  | "pricing"
  | "demo"
  | "audit";

/**
 * Contact channel behind a `tel:` / `mailto:` / messenger link. Mirrors
 * `ChannelKind` in `@/content/contacts`: the contacts block renders all of
 * them, and the social profiles count here too — someone who writes on
 * Instagram is an enquiry, not a follower.
 */
export type ConversionChannel =
  | "telegram"
  | "whatsapp"
  | "viber"
  | "phone"
  | "email"
  | "instagram"
  | "linkedin";

/**
 * `cta-header-lead`, `cta-hero-lead-secondary` — a CTA click.
 *
 * `role` separates the two buttons of a block whose destinations happen to
 * share an intent: the homepage hero offers "discuss the project" and "free
 * audit", both of which are enquiries, and without the suffix they would
 * emit the same id — and, where the block marks them unique, the same DOM id.
 */
export function ctaId(
  placement: ConversionPlacement,
  intent: ConversionIntent,
  role?: "secondary",
): string {
  return role ? `cta-${placement}-${intent}-${role}` : `cta-${placement}-${intent}`;
}

/**
 * `form-contacts`, `form-industry-real-estate-uk` — a form, keyed by the same
 * `source` string the lead carries into Telegram and into `generate_lead`.
 * Taking the source rather than a placement keeps one vocabulary across the
 * Telegram message, GA4 and the ads platform, so a campaign can be matched to
 * an enquiry without a translation table.
 */
export function formId(source: string): string {
  const slug = source
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `form-${slug || "unknown"}`;
}

/**
 * What a CTA is for, read off its destination.
 *
 * Shared blocks (the closing banner, the page hero) take an href from the
 * page rather than a hand-written label, so the intent has to come from the
 * link itself — otherwise every page would have to remember to pass one, and
 * the ones that forgot would all report as `cta-final-lead` whether they
 * opened the form or the calculator.
 */
export function intentFromHref(href: string): ConversionIntent {
  if (href.includes("/calculator")) return "calc";
  if (href.includes("/portfolio")) return "cases";
  if (href.includes("/pricing")) return "pricing";
  if (href.includes("/audit")) return "audit";
  return "lead";
}

/** `msg-whatsapp-footer` — a messenger / phone / e-mail link. */
export function msgId(
  channel: ConversionChannel,
  placement: ConversionPlacement,
): string {
  return `msg-${channel}-${placement}`;
}

/**
 * Spread onto a conversion element.
 *
 * `unique: true` adds the matching `id`. Pass it only where the element
 * cannot repeat on one page — a duplicate id is invalid HTML and breaks
 * `aria-labelledby`/`aria-describedby` lookups elsewhere on the page.
 */
export function ctaAttrs(
  id: string,
  opts?: { unique?: boolean },
): { "data-cta": string; id?: string } {
  return opts?.unique ? { "data-cta": id, id } : { "data-cta": id };
}

/**
 * Thank-you page, same path in every locale (`/thank-you`, `/ru/thank-you`,
 * `/en/thank-you`), so Google Ads needs one destination-URL conversion
 * matching `/thank-you` rather than three.
 */
export const THANK_YOU_PATH = "/thank-you";

/** FAQ page, same path in every locale. */
export const FAQ_PATH = "/faq";
