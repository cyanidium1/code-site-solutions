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
export const hpSectionClass =
  "relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 overflow-hidden bg-bg";
export const hpSectionTightClass =
  "relative py-9 lg:py-14 px-6 sm:px-8 lg:px-12 overflow-hidden bg-bg";

// Max-width container, centred, with positioning context for inner overlays.
export const hpInnerClass = "max-w-container mx-auto relative z-[1]";

// Eyebrow pill — small uppercase mono label with a glowing dot. Pair
// `hpEyebrowClass` (the pill) with `hpEyebrowDotClass` (the dot) inside it.
export const hpEyebrowClass =
  "inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full " +
  "bg-[oklch(1_0_0/0.03)] font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase";
export const hpEyebrowDotClass =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h/0.6)]";

// Section-level H2 — typography matches the existing `H2 variant="hp"`
// from `@/components/ui` but also includes the layout properties
// (mt-6, max-width, default ink color, italic `<em>` text-gradient) that
// the legacy `.hp-h2` selector applied. Use the `<H2 variant="hp">`
// primitive when the consumer wants only the typography; use this class
// when migrating away from `className="hp-h2"` so the visual is identical.
export const hpH2Class =
  "font-actay font-bold text-[clamp(28px,7vw,40px)] leading-[1.05] tracking-[-0.02em] " +
  "mt-6 max-w-container-narrow text-ink md:text-[clamp(34px,4vw,56px)] " +
  "[&_em]:not-italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent";

// Standard sub-paragraph beneath an H2. 16px Manrope, ink-2 colour, capped
// at 640px so it doesn't run too wide. `mt-5` mirrors the legacy `20px`.
export const hpSubClass =
  "mt-5 font-sans text-[16px] leading-[1.6] text-ink-dim max-w-[640px]";

// Inline "see all"-style link with a bottom border that picks up the accent
// colour on hover. Arrow icons inside translate-x on hover via Tailwind
// group-hover.
export const hpLinkClass =
  "inline-flex items-center gap-2 mt-9 font-mono text-[12px] uppercase tracking-[0.1em] " +
  "text-ink-dim no-underline border-b border-line pb-2 " +
  "transition-[color,border-color] duration-200 hover:text-ink hover:border-accent " +
  "[&_svg]:transition-transform [&_svg]:duration-[0.25s] [&_svg]:ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:[&_svg]:translate-x-1";

// CTA wrapper used inside Process / Cases blocks so the shared `.btn-primary`
// button anchors at the inner container's left edge with the same top spacing
// the old `.hp-link` used to have.
export const hpSectionCtaClass = "mt-9 self-start";

// Section header wrapper — column layout, items at flex-start, 40px bottom
// margin. The `SectionHead` shared component renders this layout.
export const hpSectionHeadClass = "flex flex-col items-start gap-0 mb-10";
