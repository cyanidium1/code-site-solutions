/**
 * Barrel re-export for the "final" block components.
 *
 * Each component lives in its own file:
 *   - faq.tsx           — FAQ accordion
 *   - audit.tsx         — Audit lead form
 *   - clinic-footer.tsx — ClinicFooter chrome
 *   - social-icon.tsx   — SocialIcon + SocialKind + FOOTER_SOCIAL_HREFS
 *
 * Importers can keep referencing `@/components/blocks/final` for any
 * of these; consumers that want to be more specific can import the
 * sibling files directly.
 */

export { FAQ } from "./faq";
export { Audit } from "./audit";
export { ClinicFooter, type FootColumn } from "./clinic-footer";
export { SocialIcon, FOOTER_SOCIAL_HREFS, type SocialKind } from "./social-icon";
