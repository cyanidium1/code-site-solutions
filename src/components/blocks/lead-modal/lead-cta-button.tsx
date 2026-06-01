"use client";

import type { ReactNode } from "react";
import { useLeadModal, type OpenLeadModalOptions } from "./index";

type LeadCtaButtonProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
} & OpenLeadModalOptions;

/**
 * Button that opens the shared lead modal. Use anywhere a contact CTA would
 * otherwise navigate to /contacts; styling is fully controlled by `className`
 * so it can match any existing CTA visual.
 */
export function LeadCtaButton({
  children,
  className,
  source,
  locale,
  tier,
  title,
  sub,
  ...rest
}: LeadCtaButtonProps) {
  const { open } = useLeadModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() => open({ source, locale, tier, title, sub })}
      {...rest}
    >
      {children}
    </button>
  );
}
