"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { useLeadModal, type OpenLeadModalOptions } from "./index";

type LeadCtaButtonProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
} & OpenLeadModalOptions;

/**
 * Button that opens the shared lead modal. Use anywhere a contact CTA would
 * otherwise navigate to /contacts; styling is fully controlled by `className`
 * so it can match any existing CTA visual. When `locale` is not passed it
 * follows the page locale (matters for CMS-driven CTAs rendered on both
 * /blog and /en/blog).
 */
export function LeadCtaButton({
  children,
  className,
  source,
  locale,
  tier,
  title,
  sub,
  formVariant,
  ...rest
}: LeadCtaButtonProps) {
  const { open } = useLeadModal();
  const intlLocale = useLocale();
  const resolvedLocale = locale ?? (intlLocale === "en" ? "en" : "uk");
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        open({ source, locale: resolvedLocale, tier, title, sub, formVariant })
      }
      {...rest}
    >
      {children}
    </button>
  );
}
