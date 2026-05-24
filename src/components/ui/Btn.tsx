import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "primary" | "ghost" | "play";

const base =
  "inline-flex items-center gap-2.5 rounded-full font-sans text-sm transition cursor-pointer no-underline";

const variantClass: Record<Variant, string> = {
  primary: cn(
    "relative overflow-hidden bg-ink text-bg font-semibold px-6 py-4",
    "shadow-accent-glow",
    "hover:-translate-y-0.5 hover:shadow-[0_8px_30px_oklch(0.55_0.18_295/0.35),0_0_0_1px_oklch(1_0_0/0.1)_inset]",
    // Shimmer pseudo-element — primitive wraps children in a <span> so this paints behind text.
    "before:content-[''] before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_30%,oklch(0.55_0.18_295/0.4)_50%,transparent_70%)] before:transition-transform before:duration-[600ms]",
    "hover:before:translate-x-full",
  ),
  ghost: cn(
    "bg-transparent text-ink border border-line-strong font-medium px-[22px] py-[15px]",
    "hover:border-ink-dim hover:bg-[oklch(1_0_0/0.04)]",
  ),
  play: cn(
    "w-[22px] h-[22px] p-0 justify-center bg-ink text-bg",
  ),
};

type CommonProps = { variant?: Variant; className?: string };
type ButtonProps = { as?: "button" } & CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
type AnchorProps = { as: "a" } & CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className">;
type BtnProps = ButtonProps | AnchorProps;

export function Btn(props: BtnProps) {
  const { variant = "primary", className, children, as, ...rest } = props as BtnProps & {
    children?: React.ReactNode;
    as?: "button" | "a";
  };
  const classes = cn(base, variantClass[variant], className);
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
