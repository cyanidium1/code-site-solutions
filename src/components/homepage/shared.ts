/**
 * Class-string constants for the shared layout helpers that used to live
 * as `.hp-*` classes in `homepage.css`. They're imported by every homepage
 * block, the calculator, blog, pricing, and the marketing pages that
 * compose homepage components — so changing one of these values shifts
 * the rhythm of every page that uses them. Edit deliberately.
 *
 * Visual fidelity: each string is a 1:1 reproduction of the legacy
 * `.hp-*` rule from `homepage.css` as it existed when the file was
 * deleted (Session 7). The `<em>` text-gradient inside `hpH2Class` uses
 * the `bg-brand-gradient` background-image token registered in @theme;
 * `text-ink-dim` is the canonical Tailwind utility for `--ink-2`.
 */

// Section wrapper — vertical rhythm + horizontal gutter, dark bg, overflow
// hidden so per-section glow halos don't leak. `tight` variant uses the
// shorter tight spacing scale.
//
// Three tiers, not one padding for every section (DESIGN.md → Layout,
// 2026-09-25). Every section used to be 44 / 56 / 100px, so the page read as
// a stack of equal slabs.
//   major   — sections the visitor decides on: cases, prices, closing form
//   (normal)— the default argument sections
//   compact — connective strips: founder note, "where to start" links
export const hpSectionClass =
  "relative py-11 sm:py-14 lg:py-[88px] px-6 sm:px-8 lg:px-12 bg-bg";
export const hpSectionMajorClass =
  "relative py-16 sm:py-20 lg:py-[136px] px-6 sm:px-8 lg:px-12 bg-bg";
export const hpSectionCompactClass =
  "relative py-8 sm:py-10 lg:py-14 px-6 sm:px-8 lg:px-12 bg-bg";

// Max-width container, centred, with positioning context for inner overlays.
export const hpInnerClass = "relative max-w-container mx-auto z-[1]";


// Section-level H2. Mirrors the FONT / SIZE / LEADING of `H2 variant="hp"` in
// `@/components/ui` (Heading.tsx → `sizes[2].hp`) and adds the layout properties
// the legacy `.hp-h2` selector carried (mt-6, max-width, default ink colour).
// Since 2026-09-25 an H2 <em> is not painted (DESIGN.md «The One Highlight
// Rule», enforced unlayered in globals.css). Use `<H2 variant="hp">` when you want ONLY the
// typography; use this constant when you also need the `.hp-h2` layout.
//
// SINGLE SOURCE OF TRUTH — keep the clamp sizes here in sync with
// Heading.tsx `sizes[2].hp`; if you change one, change the other.
// Two DELIBERATE divergences from the `hp` variant, preserved for 1:1 parity
// with the deleted `.hp-h2` CSS (do not "fix" without a design decision):
//   • this constant OMITS the variant's `tracking-[-0.02em]` (legacy `.hp-h2`
//     used default letter-spacing);
//   • `uppercase` is written explicitly here (the `Heading` primitive injects
//     it via GLOBAL_HEADING_STYLE, and globals.css uppercases raw headings).
export const hpH2Class =
  "font-actay font-bold uppercase text-[clamp(24px,6vw,32px)] leading-[1.05] " +
  "mt-0 max-w-container-narrow text-ink md:text-[clamp(34px,4vw,56px)]";

// Standard sub-paragraph beneath an H2. 16px Manrope, ink-2 colour, capped
// at 640px so it doesn't run too wide. `mt-5` mirrors the legacy `20px`.
export const hpSubClass =
  "mt-5 font-sans text-[16px] leading-[1.6] text-ink-dim max-w-[640px]";

// Inline "see all"-style link with a bottom border that picks up the accent
// colour on hover. Arrow icons inside translate-x on hover via Tailwind
// group-hover.
export const hpLinkClass =
  "inline-flex items-center gap-2 mt-9 font-sans text-[14px] font-semibold " +
  "text-ink-dim no-underline border-b border-line pb-2 " +
  "transition-[color,border-color] duration-200 hover:text-ink hover:border-accent " +
  "[&_svg]:transition-transform [&_svg]:duration-[0.25s] [&_svg]:ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:[&_svg]:translate-x-1";

// Section header wrapper — column layout, items at flex-start, 40px bottom
// margin. The `SectionHead` shared component renders this layout.
export const hpSectionHeadClass = "flex flex-col items-start gap-3 mb-7 sm:gap-4 sm:mb-10";

/**
 * Full-width wrapper for a section's decor layer, with a horizontal
 * fade-out at the viewport edges.
 *
 * Decor is placed at fixed px offsets inside a container-mirroring stage
 * (max-w-container, centred). Below the 1440 design width that stage
 * narrows, so a glow anchored near its right edge ends up close to the
 * screen edge and the section's `overflow-x-clip` cuts it while it is still
 * bright — measured at 1280 the Why-Us glow hit the right edge at luminance
 * 110 against an 11 background (job #159).
 *
 * The mask fades the outer 96px to transparent, so decor always dissolves
 * into the page instead of being sliced. It also bounds the layer, so decor
 * never contributes horizontal scroll.
 */
export const hpDecorFadeClass =
  "absolute inset-0 pointer-events-none " +
  "[mask-image:linear-gradient(90deg,transparent_0,black_96px,black_calc(100%-96px),transparent_100%)] " +
  "[-webkit-mask-image:linear-gradient(90deg,transparent_0,black_96px,black_calc(100%-96px),transparent_100%)]";
