/**
 * Barrel re-export for homepage section components.
 *
 * Each section lives in its own file under `components/homepage/`:
 *   - marquee.tsx       — partner-logo marquee
 *   - industries.tsx    — 8 industry cards
 *   - bento.tsx         — "Why us" bento grid (+ all sub-visual components)
 *   - cases.tsx         — Sanity-driven case-study cards
 *   - stack.tsx         — tech-stack tile grid
 *   - pull-quote.tsx    — pull-quote testimonial
 *   - final-cta-3.tsx   — three-card final CTA
 *   - process.tsx       — process timeline (already its own file)
 *   - pull-quote-swiper/ — Sanity-driven testimonial swiper
 *   - newsletter.tsx    — newsletter signup
 *
 * Site chrome (header, footer, mobile menu, locale switcher) lives under
 * `@/components/layout/` — re-exported here for back-compat.
 *
 * CSS is loaded by consumers via `import "@/components/homepage/homepage.css"`
 * (this file does not import it so it can be imported from RSC and client
 * components without forcing a CSS dependency at the barrel boundary).
 */

// Section components
export { Marquee } from "./marquee";
export { Industries } from "./industries";
export { Bento } from "./bento";
export { Cases } from "./cases";
export { Stack } from "./stack";
export { PullQuote } from "./pull-quote";
export { FinalCta3 } from "./final-cta-3";
export { Process } from "./process";
export { PullQuoteSwiper } from "./pull-quote-swiper";
export { Newsletter } from "./newsletter";

// Site chrome (lives in components/layout/, re-exported here for back-compat)
export { HpHeader } from "@/components/layout/hp-header";
export { HpFooter } from "@/components/layout/hp-footer";

// Type re-exports for back-compat
export type { BentoCell, Industry, MarqueeLogo } from "@/types/homepage";
