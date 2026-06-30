import type { ReactNode } from "react";
import { cn } from "@/components/ui";

type OptionCardProps = {
  title: string;
  description?: string;
  priceLabel?: string;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  as?: "button" | "div";
};

// Shared base + selected ring for OptionCard. The button variant adds
// text-align/hover/translate; the div variant skips the interactive bits.
const CARD_BASE =
  "border border-line rounded-[14px] bg-[oklch(0.18_0.008_300)] p-[14px]";
const CARD_BUTTON =
  "text-left text-ink cursor-pointer transition-[border-color,transform] duration-200 " +
  "hover:border-line-strong hover:-translate-y-[1px]";
const CARD_SELECTED =
  "border-accent-55 !bg-accent-12 shadow-[inset_0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.3)]";

export function OptionCard({
  title,
  description,
  priceLabel,
  selected = false,
  onClick,
  children,
  as = "button",
}: OptionCardProps) {
  const header = (
    <div className="flex justify-between items-center gap-[10px]">
      <h4 className="m-0 text-[14px]">{title}</h4>
      {priceLabel ? <span className="text-[12px] text-accent-soft">{priceLabel}</span> : null}
    </div>
  );

  const body = description ? (
    <p className="mt-2 mb-0 text-ink-dim text-[13px] leading-[1.45]">{description}</p>
  ) : null;

  if (as === "div") {
    return (
      <div className={cn(CARD_BASE, selected && CARD_SELECTED)}>
        {header}
        {body}
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(CARD_BASE, CARD_BUTTON, selected && CARD_SELECTED)}
    >
      {header}
      {body}
      {children}
    </button>
  );
}
