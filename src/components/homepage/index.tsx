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
 *   - process.tsx       — process timeline (already its own file)
 *   - pull-quote-swiper/ — Sanity-driven testimonial swiper
 *   - newsletter.tsx    — newsletter signup
 *
 * Site chrome (header, footer, mobile menu, locale switcher) lives under
 * `@/components/layout/` — re-exported here for back-compat.
 *
 * Styling: as of Session 7 there is no sidecar `homepage.css`. Shared
 * layout class strings (section, eyebrow, h2, sub, link, etc.) live in
 * `@/components/homepage/shared` and are composed at each call site with
 * regular Tailwind utilities. The barrel file therefore has no CSS
 * dependency and can be imported from RSC and client components alike.
 */

// Section components
export { Marquee } from "./marquee";
export { Industries } from "./industries";
export { Bento } from "./bento";
export { BusinessValue } from "./business-value";
export { Cases } from "./cases";
export { Stack } from "./stack";
export { PullQuote } from "./pull-quote";
export { Process } from "./process";
export { PainPoints } from "./pain-points";
export { PerformanceProof } from "./performance-proof";
export { PullQuoteSwiper } from "./pull-quote-swiper";
export { Newsletter } from "./newsletter";

// Site chrome (lives in components/layout/, re-exported here for back-compat)
export { HpHeader } from "@/components/layout/hp-header";
export { HpFooter } from "@/components/layout/hp-footer";

// Type re-exports for back-compat
export type { BentoCell, Industry, MarqueeLogo } from "@/types/homepage";
