/**
 * Class strings shared between the desktop header (`hp-header.tsx`) and
 * the mobile drawer (`mobile-menu.tsx`). Lives in its own module so both
 * components can import it without circular dependencies.
 *
 * 2026 redesign: the header is a FLOATING SPLIT GLASS PILL (Figma «код сайт
 * арт», node 1729:1911; audit: docs/home-header-figma-audit.md). Two sibling
 * pills — main (logo+nav+locale) and CTA — approximate the Figma boolean
 * union (user decision: no S-curve junction). Recipe + blur policy are
 * documented in docs/glass-ui-patterns.md.
 */

/** Legacy class: `.hp-header-brand` from `homepage.css`. Kept as a single
 * string export so the Logo's `className` prop keeps working unchanged. */
export const headerBrandClass =
  "inline-flex items-center text-ink no-underline whitespace-nowrap shrink-0";

/** Right-side cluster inside the MAIN pill: desktop nav + divider + locale;
 * mobile locale + burger. */
export const headerEndClass =
  "flex flex-1 items-center justify-end min-w-0 gap-2 lg:gap-4 xl:gap-[18px]";

/** Transparent sticky wrapper. Constant top offset (user decision — no
 * scroll-shrink JS): the pill floats 21px from the viewport top at lg+
 * (Figma y=21), 12px below lg. Page content scrolls behind the pills; the
 * strip around them stays transparent. */
export const headerWrapClass =
  "sticky top-0 z-50 pt-3 lg:pt-[21px] px-4 sm:px-6 lg:px-8 xl:px-12";

/** Row that holds the two pills. `items-stretch` keeps both pills the same
 * height; gap-2 is the visual stand-in for the Figma union's pinch. */
export const headerRowClass =
  "mx-auto max-w-container flex items-stretch gap-2";

/**
 * MAIN glass pill — the «скло 2» surface.
 * Blur ladder (docs/home-header-figma-audit.md §4): the Figma blur 32 runs at
 * lg+ ONLY; below lg blur drops to 12 and the fill switches from white-3%
 * to a 72% bg tint so legibility never depends on the blur (iOS Safari:
 * big backdrop blurs are the known perf killer — no JS device forks).
 */
export const headerPillClass =
  "glass-ring isolate rounded-full flex flex-1 min-w-0 items-center " +
  "h-14 px-4 lg:h-[60px] lg:px-[26px] " +
  "bg-[oklch(from_var(--color-bg)_l_c_h/0.72)] backdrop-blur-[12px] " +
  "lg:bg-[oklch(1_0_0/0.03)] lg:backdrop-blur-[32px] " +
  "shadow-[inset_3px_-1px_8.7px_-1px_oklch(1_0_0/0.12)]";

/** CTA pill (right segment) — same surface family, uniform faint ring (the
 * Figma border gradient has already faded to 17% across this segment, so a
 * plain border is exact enough and cheaper than a second mask). Hidden below
 * lg (mobile CTA stays drawer-only — user decision). */
export const headerCtaPillClass =
  "hidden lg:flex items-center gap-5 shrink-0 rounded-full h-[60px] pl-7 pr-3 " +
  "bg-[oklch(1_0_0/0.03)] backdrop-blur-[32px] " +
  "border border-[oklch(from_var(--color-accent)_l_c_h/0.17)] " +
  "shadow-[inset_3px_-1px_8.7px_-1px_oklch(1_0_0/0.12)] " +
  "cursor-pointer transition-transform duration-200 hover:-translate-y-px " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

/** CTA label — Figma #1729:1919: Montserrat 12px, tracking 0.48px, uppercase. */
export const headerCtaTextClass =
  "font-nav text-[12px] leading-[18px] tracking-[0.48px] uppercase text-ink whitespace-nowrap";

/** 1×20px divider between nav and locale — Figma #1729:1918. */
export const headerDividerClass =
  "hidden lg:block w-px h-5 bg-[oklch(1_0_0/0.14)] shrink-0";
