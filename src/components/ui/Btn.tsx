import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "./cn";

export type BtnVariant = "primary" | "ghost" | "gradient" | "solid";
export type BtnSize = "sm" | "md";

// `min-h-11` enforces the WCAG 2.5.5 (AAA) 44px touch-target floor on every
// `<Btn>` instance regardless of the variant's per-breakpoint padding ladder.
// The variants below already meet 44px at every breakpoint, but the floor
// guards against future font/padding tweaks accidentally regressing it.
//
// `cursor-pointer` is baked in here (not merely inherited from the global
// `@layer base` rule in globals.css) so the primitive stays correct in
// isolation. `focus-visible:` gives keyboard users a ring (mirrors the ring in
// filters/pill-classes.ts); `disabled:` makes disabled submit buttons visibly
// inert — both were absent from every hand-rolled button this primitive replaces.
const base =
  "inline-flex items-center gap-2.5 rounded-full font-sans text-sm transition cursor-pointer no-underline min-h-11 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

// Mobile-first padding/sizing mirrors the legacy .btn-primary / .btn-ghost
// rules from buttons.css (now deleted). Mobile is a full-width stacked
// button; sm+ becomes an inline-flex pill that tightens at 2xl.
const variantClass: Record<BtnVariant, string> = {
  primary: cn(
    "relative overflow-hidden bg-ink text-bg font-semibold w-full justify-center text-[13px] px-[18px] py-[14px] sm:w-auto sm:justify-normal sm:py-[13px] 2xl:px-6 2xl:py-4 2xl:text-sm",
    "shadow-accent-glow",
    "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_oklch(0.55_0.18_295/0.35),0_0_0_1px_oklch(1_0_0/0.1)_inset]",
    // Shimmer pseudo-element — primitive wraps children in a <span> so this paints behind text.
    "before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_30%,oklch(0.55_0.18_295/0.4)_50%,transparent_70%)] before:transition-transform before:duration-[600ms]",
    "hover:before:translate-x-full",
  ),
  ghost: cn(
    "bg-transparent text-ink border border-line-strong font-medium w-full justify-center text-[13px] px-[18px] py-[14px] sm:w-auto sm:justify-normal sm:py-[13px] 2xl:px-[22px] 2xl:py-[15px] 2xl:text-sm",
    "hover:border-ink-dim hover:bg-[oklch(1_0_0/0.04)]",
  ),
  // Brand-gradient full-width submit pill. Modeled on the ACTUAL gradient form
  // submits in blocks/final/audit (AUDIT_SUBMIT_CLASS) and blocks/comparison
  // (CMP_CONTACT_SUBMIT_CLASS): 90deg 3-stop gradient, text at oklch .85,
  // font-display, tracking, glow shadow, lift on hover. Base px/text-size and
  // the responsive ladder are left to the call site (audit is always full-width
  // + uppercase; comparison tightens at md:). The lead-form submit uses this
  // variant with its own overrides; the newsletter button (bg-brand-gradient
  // token) and the comparison table CTA (135deg accent) are different
  // gradients, left as documented exceptions.
  gradient: cn(
    "bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.20_320))] text-[oklch(1_0_0/0.85)] font-display font-semibold tracking-[0.04em] w-full justify-center py-3.5",
    "transition-all duration-[250ms] shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h/0.3)]",
    "hover:-translate-y-0.5",
  ),
  // Solid-ink pill WITHOUT the shimmer/full-width of `primary` — an inline,
  // auto-width CTA with an inset-glow shadow. Consolidates the hand-rolled
  // pills in blocks/reasons and blocks/case. The responsive auto-width ladder
  // is intentionally NOT baked in: reasons switches at `sm:`, case at `md:`, so
  // each call site supplies its own `{sm|md}:justify-normal …px …py` override.
  solid: cn(
    "bg-ink text-bg font-semibold justify-center text-[13px] px-[18px] py-3.5",
    "transition-[transform,box-shadow] duration-200",
    "shadow-[0_4px_16px_oklch(from_var(--color-accent)_l_c_h/0.2),inset_0_0_0_1px_oklch(1_0_0/0.1)]",
    "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(from_var(--color-accent)_l_c_h/0.3),inset_0_0_0_1px_oklch(1_0_0/0.1)]",
  ),
};

// Size axis. `md` (default) is a no-op so every existing variant keeps its
// current padding — zero visual change for current call sites. `sm` is the
// compact ladder used by the header nav CTA (layout/hp-header); it overrides
// the variant's px/py/text via tailwind-merge, so it must be applied AFTER the
// variant class and BEFORE any caller `extra`.
const sizeClass: Record<BtnSize, string> = {
  md: "",
  sm: "px-3.5 py-2 text-[10.5px] xl:px-4 xl:py-[9px] xl:text-[11px] 2xl:px-[18px] 2xl:py-2.5 2xl:text-[12px]",
};

/**
 * Small play-icon span used inside `<Btn variant="ghost">` (e.g. hero "Watch
 * demo"). Standalone constant rather than its own primitive because it's
 * only used as a child decoration, never as a button.
 */
export const PLAY_ICON_CLASS =
  "inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent-15 pl-0.5 text-[8px] text-accent";

/**
 * Class-only helper for cases where `<Btn>` can't be used directly — e.g.
 * Next.js `<Link>` which already renders an <a>. Use as:
 *
 *   <Link href="/x" className={btnClass("primary")}>
 *     <span>Label</span>
 *   </Link>
 *
 * For `variant="primary"`, the caller MUST wrap the label in `<span>` so the
 * `::before` shimmer paints behind the text (the `<Btn>` component does this
 * automatically; the helper cannot).
 *
 * `size` is the last, optional arg so the existing `btnClass(variant, extra)`
 * call sites keep working unchanged.
 */
export function btnClass(variant: BtnVariant = "primary", extra?: string, size: BtnSize = "md"): string {
  return cn(base, variantClass[variant], sizeClass[size], extra);
}

/** Border-circle spinner shown by `isLoading`; inherits currentColor. */
const SPINNER_CLASS =
  "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent";

type CommonProps = { variant?: BtnVariant; size?: BtnSize; className?: string; isLoading?: boolean };
type ButtonProps = { as?: "button" } & CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
type AnchorProps = { as: "a" } & CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;
type BtnProps = ButtonProps | AnchorProps;

export function Btn(props: BtnProps) {
  const { variant = "primary", size = "md", className, children, as, isLoading, ...rest } = props as BtnProps & {
    children?: React.ReactNode;
    as?: "button" | "a";
  };
  const classes = btnClass(variant, className, size);
  const content = (
    <>
      {isLoading ? <span className={SPINNER_CLASS} aria-hidden="true" /> : null}
      {children}
    </>
  );
  const label = variant === "primary" ? <span className="relative z-10 flex items-center gap-2.5 justify-center">{content}</span> : content;

  if (as === "a") {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {label}
      </a>
    );
  }
  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type="button"
      className={classes}
      aria-busy={isLoading || undefined}
      {...buttonRest}
      disabled={isLoading || buttonRest.disabled}
    >
      {label}
    </button>
  );
}
