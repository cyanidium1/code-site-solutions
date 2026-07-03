export const SITE_ORIGIN = "https://www.code-site.art";

export const GTM_ID = "GTM-TRCVT2FH";

export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export const SITE_CONTACT = {
  email: "hi@code-site.art",
  /** Hyphenated display form — used in footer labels and JSON-LD `telephone`. */
  phone: "+380-97-006-87-07",
  /** Dial-able form for `tel:` / `viber:` URIs. */
  phoneRaw: "+380970068707",
  /** Spaced display form used on the contacts page. */
  phoneDisplay: "+380 97 006 87 07",
  /**
   * WhatsApp is a SEPARATE number from the Ukrainian phone above — the studio
   * answers WhatsApp on an Albanian line. `whatsapp` holds the bare digits for
   * `wa.me/<digits>`; `whatsappDisplay` is the human-readable form.
   */
  whatsapp: "355689286136",
  whatsappDisplay: "+355 68 928 6136",
  telegram: "https://t.me/fedirdev",
  telegramHandle: "@fedirdev",
  linkedin: "https://linkedin.com/in/fedirdev",
  linkedinHandle: "/in/fedirdev",
  github: "https://github.com/fedirdev",
  instagram: "https://instagram.com/fedirdev",
  instagramHandle: "@fedirdev",
  tiktok: "https://tiktok.com/@fedirdev",
  calendly: "https://calendly.com/fedirdev",
} as const;

/**
 * Build an absolute URL from a site-relative path.
 * Co-located with `SITE_ORIGIN` because the two always change together
 * (cf. `localizePath` co-located with route tables in i18n-routes.ts).
 */
export function pageUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_ORIGIN}${path}`;
}
