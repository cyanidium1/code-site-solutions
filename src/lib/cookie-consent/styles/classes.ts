/**
 * Tailwind class-string constants (project convention — see hp-footer.tsx).
 * Colors come from the app's design tokens; when reusing the module in
 * another project, remap these to that project's tokens.
 */

export const bannerClass =
  "fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-bg-raised/95 backdrop-blur-md px-6 sm:px-8 lg:px-12 py-5";

export const bannerInnerClass =
  "mx-auto max-w-container flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between";

export const bannerTitleClass = "font-sans text-[15px] font-bold text-ink";

export const bannerBodyClass =
  "mt-1 font-sans text-[13.5px] leading-[1.55] text-ink-dim max-w-[720px] [&_a]:text-accent-soft [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-ink";

export const bannerActionsClass = "flex flex-wrap items-center gap-3 shrink-0";

/* Buttons: Accept and Reject share size and weight — GDPR requires rejecting
   to be as easy and as prominent as accepting. */
export const buttonBaseClass =
  "inline-flex h-11 items-center justify-center rounded-full px-5 font-sans text-[13.5px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

export const buttonPrimaryClass = "bg-accent text-white hover:bg-accent-soft";

export const buttonSecondaryClass =
  "border border-line-strong bg-[oklch(1_0_0/0.04)] text-ink hover:bg-[oklch(1_0_0/0.09)]";

export const buttonGhostClass =
  "text-ink-dim hover:text-ink underline underline-offset-4 decoration-line-strong px-2";

export const overlayClass =
  "fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-[oklch(0.06_0.005_300/0.6)] backdrop-blur-[6px] p-0 sm:p-6";

export const dialogClass =
  "w-full sm:max-w-[560px] max-h-[85vh] overflow-y-auto rounded-t-[22px] sm:rounded-[22px] border border-line bg-[oklch(0.13_0.005_300)] text-ink p-6 sm:p-7";

export const dialogTitleClass =
  "font-sans text-[22px] font-bold tracking-[-0.01em] text-ink";

export const dialogSubClass = "mt-1 text-[13.5px] leading-[1.5] text-ink-dim";

export const categoryRowClass =
  "flex items-start justify-between gap-4 border-t border-line py-4 first:border-t-0";

export const categoryLabelClass = "font-sans text-[14.5px] font-semibold text-ink";

export const categoryDescClass = "mt-0.5 text-[13px] leading-[1.5] text-ink-dim";

export const alwaysOnClass =
  "font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3 whitespace-nowrap pt-1";

export const dialogFooterClass =
  "mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5";

export const switchTrackClass =
  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft aria-checked:bg-accent bg-[oklch(1_0_0/0.14)] disabled:cursor-not-allowed disabled:opacity-60";

export const switchThumbClass =
  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200";

export const switchThumbCheckedClass = "translate-x-5";

export const settingsLinkClass =
  "inline-flex items-center h-5 font-sans text-[13px] text-ink-dim no-underline transition-colors duration-200 hover:text-ink cursor-pointer bg-transparent border-0 p-0";
