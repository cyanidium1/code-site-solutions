import type * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { H2 } from "@/components/ui";
import { LeadCtaButton } from "@/components/blocks/lead-modal/lead-cta-button";

/**
 * Launch-CTA — bottom-of-page consultation CTA with an overflowing device
 * image. Design source: 1920px wide. Image left edge sits at calc(50% - 140px)
 * of the inner container; section uses overflow:hidden so the image flows
 * off the right edge into the gutter. Below `lg` the layout stacks
 * single-column with the image rendered statically beneath the text.
 */
export function LaunchCta({
  locale = "uk",
  heading,
  sub,
}: {
  locale?: "uk" | "en";
  // Optional per-page copy overrides — fall back to the translated defaults
  // so existing call sites (homepage, comparison pages) stay unchanged.
  heading?: React.ReactNode;
  sub?: React.ReactNode;
} = {}) {
  const t = useTranslations("LaunchCta");

  return (
    <section
      className="relative py-14 lg:py-[100px] px-6 sm:px-8 lg:px-12 bg-bg overflow-hidden"
      aria-labelledby="launch-cta-heading"
    >
      <div className="relative mx-auto max-w-container grid grid-cols-[minmax(0,1fr)] items-center gap-10 min-h-0 lg:min-h-[420px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-0 xl:min-h-[480px]">
        <div className="relative z-[2] flex max-w-none flex-col gap-[18px] md:gap-6 lg:max-w-[570px]">
          <div className="flex flex-col gap-7">
            <div className="flex flex-row items-center gap-2" aria-hidden="true">
              <span className="block w-3 h-3 rounded-[3px] bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]" />
              <span className="block w-3 h-3 rounded-[3px] bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]" />
              <span className="block w-3 h-3 rounded-[3px] bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]" />
            </div>
            <H2 id="launch-cta-heading" variant="launch-cta" className="text-ink">
              {heading ?? t("heading")}
            </H2>
          </div>
          <p className="m-0 font-sans text-[13.5px] leading-[1.6] text-ink-dim max-w-[50ch] md:text-[14px]">
            {sub ?? t("sub")}
          </p>
          <LeadCtaButton
            source="launch-cta"
            locale={locale}
            className="self-start inline-flex items-center gap-2.5 px-[22px] py-3 rounded-full bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] text-white font-sans font-semibold text-[13px] tracking-[0.01em] no-underline cursor-pointer transition-[transform,box-shadow] duration-200 shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.25)] hover:-translate-y-px hover:shadow-[0_16px_36px_oklch(from_var(--color-accent)_l_c_h_/_0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-[3px] md:px-7 md:py-3.5 md:text-[14px]"
          >
            {t("button")}
          </LeadCtaButton>
        </div>
        <div
          className="relative left-1/2 w-[115%] max-w-[720px] -translate-x-1/2 pointer-events-none [&_img]:block [&_img]:h-auto [&_img]:w-full lg:absolute lg:top-1/2 lg:left-[calc(50%-24px)] lg:w-[calc(50%+24px+48px)] lg:max-w-[1120px] lg:translate-x-0 lg:-translate-y-1/2 xl:left-[calc(50%-140px)] xl:w-[calc(50%+270px+48px)]"
          aria-hidden="false"
        >
          <Image
            src="/home/launch-cta-devices.webp"
            alt={t("imageAlt")}
            width={2074}
            height={1355}
            sizes="(max-width: 1024px) 90vw, 60vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
