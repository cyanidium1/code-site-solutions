/**
 * Config-driven package blocks. Every price, term and composition comes from
 * `@/constants/pricing`; labels from `@/content/packages-ui`. Use these
 * instead of typing prices into page copy.
 */

import type { ReactNode } from "react";

import type { Locale } from "@/constants/locales";
import {
  ADDONS,
  ADDON_ORDER,
  ALL_PACKAGES,
  CORE_PACKAGES,
  INDUSTRIES,
  INDUSTRY_ORDER,
  PACKAGES,
  formatAddonPrice,
  formatPackageTerm,
  industryPrice,
  packagePrice,
  showsUahHint,
  uahApprox,
  type AddonId,
  type PackageId,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { PACKAGES_UI } from "@/content/packages-ui";
import type { TierProps } from "@/types/pricing";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSectionHeadClass,
  hpSectionMajorClass,
  hpSubClass,
} from "@/components/homepage/shared";
import { cn } from "@/components/ui";
import { AppImage } from "@/lib/shared/app-image";
import { useTranslations } from "next-intl";

/** Anchor every "get a quote" CTA on a page scrolls to. */
export const LEAD_FORM_ANCHOR = "lead-form";

/** TierProps for one package. CTA opens the lead modal with it preselected. */
export function packageTier(
  id: PackageId,
  locale: Locale,
  opts: { source?: string; compact?: boolean } = {},
): TierProps {
  const ui = PACKAGES_UI[locale];
  const p = PACKAGES[id];
  const excludes = p.excludes[locale];
  return {
    name: p.name[locale],
    price: formatPrice(packagePrice(id, locale), { locale }),
    priceLabel: p.fromPrice ? ui.fromLabel : ui.fixedLabel,
    weeks: formatPackageTerm(id, locale),
    popular: Boolean(p.popular),
    popularLabel: ui.popular,
    includes: { heading: ui.includes, items: p.includes[locale] },
    excludes: excludes.length ? { heading: ui.excludes, items: excludes } : undefined,
    ctaLabel: ui.cta,
    ctaGhost: !p.popular,
    ctaSource: opts.source ?? `package-card-${id}`,
    tierKey: id,
  };
}

/** Three core package cards + the "industry / custom" line under them. */
export function PackageCards({
  locale,
  ids = CORE_PACKAGES,
  compact = false,
  source,
  showMoreLine = true,
}: {
  locale: Locale;
  ids?: readonly PackageId[];
  compact?: boolean;
  source?: string;
  showMoreLine?: boolean;
}) {
  const ui = PACKAGES_UI[locale];
  return (
    <>
      <CmpPricingGrid>
        {ids.map((id) => (
          <Tier key={id} {...packageTier(id, locale, { source })} compact={compact} />
        ))}
      </CmpPricingGrid>
      {showMoreLine ? (
        <p className="mt-6 mb-0 text-center font-sans text-[14.5px] text-ink-dim">
          {ui.moreLine(locale)}
        </p>
      ) : null}
    </>
  );
}

/** One-line USP repeated across pages (TZ v2 §6). */
export function UspLine({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <p
      className={cn(
        "m-0 font-sans text-[13px] leading-[1.7] text-ink-3",
        className,
      )}
    >
      {PACKAGES_UI[locale].usp}
    </p>
  );
}

/** Section with the site-wide lead form; `#lead-form` is the CTA target.
 *  `devices` sets the launch photo beside the form — used where the page used
 *  to close with the form AND a LaunchCta banner whose button opened the same
 *  form (homepage, merged 2026-09-25: one closing CTA, not two). */
export function LeadFormSection({
  locale,
  source,
  tier,
  title,
  sub,
  variant = "full",
  id = LEAD_FORM_ANCHOR,
  className,
  devices = false,
}: {
  locale: Locale;
  source: string;
  tier?: PackageId;
  title?: ReactNode;
  sub?: ReactNode;
  variant?: LeadFormVariant;
  id?: string;
  className?: string;
  devices?: boolean;
}) {
  const ui = PACKAGES_UI[locale];
  const form = (
    <div className={cn(hpInnerClass, devices ? "mx-0 max-w-none" : "max-w-[760px]")}>
      <h2 className={hpH2Class}>{title ?? ui.formTitle}</h2>
      <p className={cn(hpSubClass, "mb-8")}>{sub ?? ui.formSub}</p>
      <div className="rounded-card border border-line-strong bg-surface p-5 md:p-7">
        <LeadForm source={source} locale={locale} tier={tier} variant={variant} />
      </div>
    </div>
  );
  return (
    <section id={id} className={cn(hpSectionMajorClass, "scroll-mt-20", className)}>
      {devices ? (
        <div className="mx-auto grid max-w-container grid-cols-1 items-center gap-10 xl:grid-cols-[minmax(0,760px)_minmax(0,1fr)] xl:gap-12">
          {form}
          <LaunchDevices />
        </div>
      ) : (
        form
      )}
    </section>
  );
}

function LaunchDevices() {
  const t = useTranslations("LaunchCta");
  return (
    <div className="hidden xl:block">
      <AppImage
        src="/home/launch-cta-devices.webp"
        alt={t("imageAlt")}
        width={2074}
        height={1355}
        sizes="(min-width: 1440px) 560px, 40vw"
        className="h-auto w-full"
      />
    </div>
  );
}

/** Just the form card, for placing inside a hero column. */
export function LeadFormCard({
  locale,
  source,
  tier,
  className,
}: {
  locale: Locale;
  source: string;
  tier?: PackageId;
  className?: string;
}) {
  return (
    <div
      id={LEAD_FORM_ANCHOR}
      className={cn(
        "scroll-mt-20 rounded-card border border-line-strong bg-surface p-5 md:p-6",
        className,
      )}
    >
      <LeadForm source={source} locale={locale} tier={tier} variant="compact" />
    </div>
  );
}

const TABLE_WRAP = "overflow-x-auto rounded-card border border-line";
const TABLE = "w-full min-w-[560px] border-collapse text-left font-sans text-[14px]";
const TH = "border-b border-line px-4 py-3 font-mono text-[12px] font-normal uppercase tracking-[0.06em] text-ink-3";
const TD = "border-b border-line px-4 py-3 align-top text-ink-dim";

/** All packages with price, term and composition (for /pricing). */
export function PackagesTable({
  locale,
  ids = ALL_PACKAGES,
}: {
  locale: Locale;
  ids?: readonly PackageId[];
}) {
  const ui = PACKAGES_UI[locale];
  const uah = showsUahHint(locale);
  return (
    <div className={TABLE_WRAP}>
      <table className={TABLE}>
        <thead>
          <tr>
            <th className={TH}>{ui.thPackage}</th>
            <th className={TH}>{ui.thPrice}</th>
            <th className={TH}>{ui.thTerm}</th>
            <th className={TH}>{ui.thIncludes}</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => {
            const p = PACKAGES[id];
            const price = packagePrice(id, locale);
            return (
              <tr key={id}>
                <td className={cn(TD, "font-semibold text-ink")}>
                  {p.name[locale]}
                </td>
                <td className={cn(TD, "whitespace-nowrap text-ink tabular-nums")}>
                  {formatPrice(price, { locale, withPrefix: p.fromPrice })}
                  {uah ? <span className="block text-[12px] text-ink-3">{uahApprox(price)}</span> : null}
                </td>
                <td className={cn(TD, "whitespace-nowrap")}>{formatPackageTerm(id, locale)}</td>
                <td className={TD}>{p.includes[locale].join(", ")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Industry variants of the `industry` package with their prices. */
export function IndustryPricesTable({ locale }: { locale: Locale }) {
  const ui = PACKAGES_UI[locale];
  return (
    <div className={TABLE_WRAP}>
      <table className={TABLE}>
        <thead>
          <tr>
            <th className={TH}>{PACKAGES.industry.name[locale]}</th>
            <th className={TH}>{ui.thPrice}</th>
            <th className={TH}>{ui.thTerm}</th>
          </tr>
        </thead>
        <tbody>
          {INDUSTRY_ORDER.map((id) => (
            <tr key={id}>
              <td className={cn(TD, "text-ink")}>{INDUSTRIES[id].name[locale]}</td>
              <td className={cn(TD, "whitespace-nowrap text-ink tabular-nums")}>
                {formatPrice(industryPrice(id, locale), { locale })}
              </td>
              <td className={cn(TD, "whitespace-nowrap")}>{formatPackageTerm("industry", locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Fixed-price add-ons (all, or the subset offered with one package). */
export function AddonsTable({
  locale,
  ids = ADDON_ORDER,
}: {
  locale: Locale;
  ids?: readonly AddonId[];
}) {
  const ui = PACKAGES_UI[locale];
  return (
    <div className={TABLE_WRAP}>
      <table className={cn(TABLE, "min-w-0")}>
        <thead>
          <tr>
            <th className={TH}>{ui.thAddon}</th>
            <th className={cn(TH, "text-right")}>{ui.thPrice}</th>
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => (
            <tr key={id}>
              <td className={cn(TD, "text-ink")}>{ADDONS[id].name[locale]}</td>
              <td className={cn(TD, "whitespace-nowrap text-right text-ink tabular-nums")}>
                {formatAddonPrice(id, locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Payment terms list, identical everywhere (TZ v2 §2.4). */
export function PaymentTerms({ locale, className }: { locale: Locale; className?: string }) {
  const ui = PACKAGES_UI[locale];
  return (
    <div className={cn("rounded-card border border-line p-5 md:p-6", className)}>
      <h3 className="m-0 mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">
        {ui.paymentTitle}
      </h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[14.5px] leading-[1.55] text-ink-dim">
        {ui.payment(locale).map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

/** Standard section wrapper with H2 + optional sub, for page composition. */
export function PackagesSection({
  id,
  title,
  sub,
  children,
  className,
}: {
  id?: string;
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn(hpSectionClass, className)}>
      <div className={hpInnerClass}>
        <div className={hpSectionHeadClass}>
          <h2 className={hpH2Class}>{title}</h2>
          {sub ? <p className={hpSubClass}>{sub}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
