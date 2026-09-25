"use client";

import type { Locale } from "@/constants/locales";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { useLeadModal, type OpenLeadModalOptions } from "./index";
import { ctaAttrs } from "@/constants/conversion-ids";

type LeadCtaButtonProps = {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  /**
   * Conversion id for ads (see `@/constants/conversion-ids`). Defaults to
   * `cta-<source>`, which is right for nearly every call site: the source is
   * already the name the lead travels under. Pass an explicit id only when
   * two buttons share a source but a campaign has to tell them apart.
   */
  ctaId?: string;
  /** Adds a matching `id`. Only where the button cannot repeat on a page. */
  ctaUnique?: boolean;
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
  ctaId,
  ctaUnique,
  ...rest
}: LeadCtaButtonProps) {
  const { open } = useLeadModal();
  const intlLocale = useLocale();
  const resolvedLocale = locale ?? ((intlLocale as Locale));
  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        open({ source, locale: resolvedLocale, tier, title, sub, formVariant })
      }
      {...ctaAttrs(ctaId ?? `cta-${source ?? "unknown"}`, { unique: ctaUnique })}
      {...rest}
    >
      {children}
    </button>
  );
}
