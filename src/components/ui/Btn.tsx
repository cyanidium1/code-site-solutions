import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "./cn";

export type BtnVariant = "primary" | "ghost";

const base =
  "inline-flex items-center gap-2.5 rounded-full font-sans text-sm transition cursor-pointer no-underline";

// Responsive padding/sizing mirror the legacy .btn-primary / .btn-ghost
// rules from buttons.css (now deleted). Phase 2 will re-express these as
// mobile-first utilities; for Phase 1 we preserve the desktop-first shape.
const variantClass: Record<BtnVariant, string> = {
  primary: cn(
    "relative overflow-hidden bg-ink text-bg font-semibold px-6 py-4 max-[1440px]:px-[18px] max-[1440px]:py-[13px] max-[1440px]:text-[13px] max-[640px]:w-full max-[640px]:justify-center max-[640px]:px-[18px] max-[640px]:py-[14px]",
    "shadow-accent-glow",
    "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_oklch(0.55_0.18_295/0.35),0_0_0_1px_oklch(1_0_0/0.1)_inset]",
    // Shimmer pseudo-element — primitive wraps children in a <span> so this paints behind text.
    "before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_30%,oklch(0.55_0.18_295/0.4)_50%,transparent_70%)] before:transition-transform before:duration-[600ms]",
    "hover:before:translate-x-full",
  ),
  ghost: cn(
    "bg-transparent text-ink border border-line-strong font-medium px-[22px] py-[15px] max-[1440px]:px-[18px] max-[1440px]:py-[13px] max-[1440px]:text-[13px] max-[640px]:w-full max-[640px]:justify-center max-[640px]:px-[18px] max-[640px]:py-[14px]",
    "hover:border-ink-dim hover:bg-[oklch(1_0_0/0.04)]",
  ),
};

/**
 * Small play-icon span used inside `<Btn variant="ghost">` (e.g. hero "Watch
 * demo"). Standalone constant rather than its own primitive because it's
 * only used as a child decoration, never as a button.
 */
export const PLAY_ICON_CLASS =
  "inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[oklch(from_var(--color-accent)_l_c_h_/_0.15)] pl-0.5 text-[8px] text-accent";

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
 */
export function btnClass(variant: BtnVariant = "primary", extra?: string): string {
  return cn(base, variantClass[variant], extra);
}

type CommonProps = { variant?: BtnVariant; className?: string };
type ButtonProps = { as?: "button" } & CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
type AnchorProps = { as: "a" } & CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;
type BtnProps = ButtonProps | AnchorProps;

export function Btn(props: BtnProps) {
  const { variant = "primary", className, children, as, ...rest } = props as BtnProps & {
    children?: React.ReactNode;
    as?: "button" | "a";
  };
  const classes = btnClass(variant, className);
  const label = variant === "primary" ? <span className="relative z-10">{children}</span> : children;

  if (as === "a") {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {label}
      </a>
    );
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {label}
    </button>
  );
}
