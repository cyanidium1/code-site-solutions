/**
 * Tailwind class-string constants (project convention — see hp-footer.tsx).
 * Colors come from the app's design tokens; when reusing the module in
 * another project, remap these to that project's tokens.
 */

/* Vertical rhythm is tighter below sm: measured at 375x812 the banner took
   267px — a third of the screen — and on /contacts it sat over the list of
   contact channels, which is the one thing that page exists for.
   Design audit 2026-09-06 (C7) measured 232px at 390x844 — still 27% of the
   screen, sitting over the homepage hero copy. The stacked action rows are
   now one wrapping row and the body sets tighter below sm, which brings the
   banner to roughly 160px without touching the copy or the button sizes. */
export const bannerClass =
  "fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-bg-raised/95 backdrop-blur-md px-5 sm:px-8 lg:px-12 py-3.5 pb-[calc(14px+env(safe-area-inset-bottom))] sm:py-5 sm:pb-5";

export const bannerInnerClass =
  "mx-auto max-w-container flex flex-col gap-2.5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between";

export const bannerTitleClass = "font-sans text-[15px] font-bold text-ink";

export const bannerBodyClass =
  "mt-0.5 font-sans text-[13px] leading-[1.5] text-ink-dim max-w-[720px] sm:mt-1 sm:text-[13.5px] sm:leading-[1.55] [&_a]:text-accent-soft [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-ink";

/* One row on every viewport: Customise (ghost, intrinsic width) then
   Reject + Accept sharing the rest in equal halves. `flex-wrap` is the
   safety valve — on a very narrow screen the two pills drop to their own
   line instead of overflowing. */
export const bannerActionsClass =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5 shrink-0 sm:gap-3";

export const bannerChoiceRowClass =
  "flex flex-1 gap-2 sm:gap-3 lg:flex-none [&>button]:flex-1 lg:[&>button]:flex-none";

/* Buttons: Accept and Reject share size and weight — GDPR requires rejecting
   to be as easy and as prominent as accepting. 44px tall on every viewport;
   only the horizontal padding compresses below sm so all three controls fit
   one row at 375px. */
export const buttonBaseClass =
  "inline-flex h-11 items-center justify-center rounded-full px-3 font-sans text-[13px] font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft sm:px-5 sm:text-[13.5px]";

export const buttonPrimaryClass = "bg-accent text-white hover:bg-accent-soft";

export const buttonSecondaryClass =
  "border border-line-strong bg-[oklch(1_0_0/0.04)] text-ink hover:bg-[oklch(1_0_0/0.09)]";

/* No underline: it sits in a row with two pill buttons and reads as a third
   control, so an underline made it look like a link that had lost its styling. */
export const buttonGhostClass =
  "text-ink-dim hover:text-ink no-underline !px-1.5 sm:!px-2";

export const overlayClass =
  "fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-[oklch(0.06_0.005_300/0.6)] backdrop-blur-[6px] p-0 sm:p-6";

/* Flex column with an overflow-hidden shell: the category list scrolls and
   the action row stays pinned to the bottom edge. It used to be one
   `overflow-y-auto` box, so on a short viewport the Save button scrolled out
   of the dialog and was cut off by the screen edge (audit 2026-09-06, C7).
   Padding lives on the three slots below, not here. */
export const dialogClass =
  "flex w-full flex-col overflow-hidden sm:max-w-[560px] max-h-[92vh] sm:max-h-[85vh] rounded-t-[22px] sm:rounded-[22px] border border-line bg-[oklch(0.13_0.005_300)] text-ink";

export const dialogHeadClass = "shrink-0 px-6 pt-6 pb-2 sm:px-7 sm:pt-7";

export const dialogBodyClass = "min-h-0 flex-1 overflow-y-auto px-6 sm:px-7";

export const dialogTitleClass =
  "font-sans text-[22px] font-bold tracking-[-0.01em] text-ink";

export const dialogSubClass = "mt-1 text-[13.5px] leading-[1.5] text-ink-dim";

export const categoryRowClass =
  "flex items-start justify-between gap-4 border-t border-line py-4 first:border-t-0";

export const categoryLabelClass = "font-sans text-[14.5px] font-semibold text-ink";

export const categoryDescClass = "mt-0.5 text-[13px] leading-[1.5] text-ink-dim";

export const alwaysOnClass =
  "font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3 whitespace-nowrap pt-1";

/* Below sm the three actions form a 2-row grid — Reject | Accept share the
   first row, Save spans the second — so every label has room at 375px.
   From sm they collapse back to one right-aligned row. */
export const dialogFooterClass =
  "shrink-0 grid grid-cols-2 gap-2.5 border-t border-line px-6 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))] sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:px-7 sm:pt-5 sm:pb-7";

/* Save is the primary action: full width under the two choices on mobile. */
export const dialogFooterPrimaryClass = "col-span-2 sm:col-span-1";

export const switchTrackClass =
  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft aria-checked:bg-accent bg-[oklch(1_0_0/0.14)] disabled:cursor-not-allowed disabled:opacity-60";

export const switchThumbClass =
  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200";

export const switchThumbCheckedClass = "translate-x-5";

export const settingsLinkClass =
  "inline-flex items-center h-5 font-sans text-[13px] text-ink-dim no-underline transition-colors duration-200 hover:text-ink cursor-pointer bg-transparent border-0 p-0";
