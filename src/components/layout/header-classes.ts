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
 * below xl locale + burger. */
export const headerEndClass =
  "flex flex-1 items-center justify-end min-w-0 gap-2 xl:gap-3 2xl:gap-[18px]";

/** Transparent sticky wrapper. Constant top offset (user decision — no
 * scroll-shrink JS): the pill floats 21px from the viewport top at xl+
 * (Figma y=21), 12px below. Page content scrolls behind the pills; the
 * strip around them stays transparent.
 *
 * Breakpoint note (verified 01.08.2026, job #132): the Figma typography
 * (Montserrat 11px/1.32px + 231px CTA pill) physically cannot fit between
 * 800–1100 — nav alone measured 598px vs a 482px pill. So desktop mode
 * starts at `xl` (1100), not `lg` (800): tablets keep the burger pill.
 * 1100–1440 runs a compressed ladder (gap-2.5, text-only CTA); the full
 * Figma layout (gap 18, CTA circle) unlocks at `2xl` (1440). */
export const headerWrapClass =
  "sticky top-0 z-50 pt-3 xl:pt-[21px] px-4 sm:px-6 lg:px-8 xl:px-12";

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
  "h-14 px-4 xl:h-[60px] xl:px-5 2xl:px-[26px] " +
  "bg-[oklch(from_var(--color-bg)_l_c_h/0.72)] backdrop-blur-[12px] " +
  "xl:bg-[oklch(1_0_0/0.03)] xl:backdrop-blur-[32px] " +
  "shadow-[inset_3px_-1px_8.7px_-1px_oklch(1_0_0/0.12)]";

/** CTA pill (right segment) — same surface family, uniform faint ring (the
 * Figma border gradient has already faded to 17% across this segment, so a
 * plain border is exact enough and cheaper than a second mask). Hidden below
 * xl (mobile CTA stays drawer-only — user decision); text-only until 2xl
 * (the ↗ circle needs the full 1440 container to fit — see headerWrapClass
 * breakpoint note). */
export const headerCtaPillClass =
  "hidden xl:flex items-center gap-5 shrink-0 rounded-full h-[60px] px-5 2xl:pl-7 2xl:pr-3 " +
  "bg-[oklch(1_0_0/0.03)] backdrop-blur-[32px] " +
  "border border-[oklch(from_var(--color-accent)_l_c_h/0.17)] " +
  "shadow-[inset_3px_-1px_8.7px_-1px_oklch(1_0_0/0.12)] " +
  "cursor-pointer transition-transform duration-200 hover:-translate-y-px " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

/** CTA label — Figma #1729:1919: Montserrat 12px, tracking 0.48px, uppercase. */
export const headerCtaTextClass =
  "font-nav text-[12px] leading-[18px] tracking-[0.48px] uppercase text-ink whitespace-nowrap";

/** ↗ circle inside the CTA pill — 2xl+ only (space ladder). */
export const headerCtaArrowClass = "hidden 2xl:block size-9 shrink-0";

/** 1×20px divider between nav and locale — Figma #1729:1918. Space ladder:
 * only at 2xl, where the full Figma layout runs. */
export const headerDividerClass =
  "hidden 2xl:block w-px h-5 bg-[oklch(1_0_0/0.14)] shrink-0";
