import type { ReactNode } from "react";

type OptionCardProps = {
  title: string;
  description?: string;
  priceLabel?: string;
  selected?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  as?: "button" | "div";
};

export function OptionCard({
  title,
  description,
  priceLabel,
  selected = false,
  onClick,
  children,
  as = "button",
}: OptionCardProps) {
  if (as === "div") {
    return (
      <div className={`calc-option-card${selected ? " is-selected" : ""}`}>
        <div className="calc-option-head">
          <h4>{title}</h4>
          {priceLabel ? <span>{priceLabel}</span> : null}
        </div>
        {description ? <p>{description}</p> : null}
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`calc-option-card calc-option-button${selected ? " is-selected" : ""}`}
    >
      <div className="calc-option-head">
        <h4>{title}</h4>
        {priceLabel ? <span>{priceLabel}</span> : null}
      </div>
      {description ? <p>{description}</p> : null}
      {children}
    </button>
  );
}
