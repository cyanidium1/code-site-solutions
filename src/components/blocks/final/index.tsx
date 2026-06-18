/**
 * Barrel re-export for the "final" block components.
 *
 * Each component lives in its own file:
 *   - faq.tsx   — FAQ accordion
 *   - audit.tsx — Audit lead form
 *
 * Importers can keep referencing `@/components/blocks/final` for any
 * of these; consumers that want to be more specific can import the
 * sibling files directly.
 */

export { FAQ } from "./faq";
export { Audit } from "./audit";
