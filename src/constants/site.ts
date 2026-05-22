export const SITE_ORIGIN = "https://code-site.art";

export const ORG_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export const SITE_CONTACT = {
  email: "hi@code-site.art",
  phone: "+380-97-006-87-07",
  telegram: "https://t.me/fedirdev",
  telegramHandle: "@fedirdev",
  linkedin: "https://linkedin.com/in/fedirdev",
  github: "https://github.com/fedirdev",
  instagram: "https://instagram.com/fedirdev",
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
