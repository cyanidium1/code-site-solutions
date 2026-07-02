export const SITE_ORIGIN = "https://www.code-site.art";

export const GTM_ID = "GTM-TRCVT2FH";

/**
 * CookieYes site ID — the hex string from the install snippet
 * (`cdn-cookieyes.com/client_data/<ID>/script.js`), found in the CookieYes
 * dashboard under Sites → Install. Left empty until the free account is set
 * up; `<CookieYes />` renders nothing while it is blank, so the site is
 * unaffected in the meantime. Loaded before GTM so Consent Mode defaults
 * (denied) are set before any GTM tag fires. Enable "Support GCM" in the
 * CookieYes dashboard — do NOT also add the CookieYes GTM template, or the
 * two consent workflows conflict.
 */
export const COOKIEYES_ID = "b2f05a6eedb40166223ebd28ff9591e5";

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
