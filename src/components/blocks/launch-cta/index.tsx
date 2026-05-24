import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { localizePath } from "@/constants/i18n-routes";
import { H2 } from "@/components/ui";

/**
 * Launch-CTA — bottom-of-page consultation CTA with an overflowing device
 * image. Design source: 1920px wide. Image left edge sits at calc(50% - 140px)
 * of the inner container; section uses overflow:hidden so the image flows
 * off the right edge into the gutter. Below 1024px the layout stacks
 * single-column with the image rendered statically beneath the text.
 */
export function LaunchCta({ locale = "uk" }: { locale?: "uk" | "en" } = {}) {
  const t = useTranslations("LaunchCta");
  const href = localizePath("/contacts", locale === "en");

  return (
    <section
      className="relative py-[var(--section-y)] px-[var(--gutter-x)] bg-bg overflow-hidden"
      aria-labelledby="launch-cta-heading"
    >
      <div className="relative mx-auto max-w-container min-h-[480px] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center max-[1280px]:min-h-[420px] max-[1024px]:grid-cols-[minmax(0,1fr)] max-[1024px]:min-h-0 max-[1024px]:gap-10">
        <div className="relative z-[2] max-w-[570px] flex flex-col gap-6 max-[1024px]:max-w-none max-[700px]:gap-[18px]">
          <div className="flex flex-col gap-7">
            <div className="flex flex-row items-center gap-2" aria-hidden="true">
              <span className="block w-3 h-3 rounded-[3px] bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]" />
              <span className="block w-3 h-3 rounded-[3px] bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]" />
              <span className="block w-3 h-3 rounded-[3px] bg-[#7c54cd] shadow-[0_0_8px_rgba(124,84,205,0.6)]" />
            </div>
            <H2 id="launch-cta-heading" variant="launch-cta" className="text-ink">
              {t("heading")}
            </H2>
          </div>
          <p className="m-0 font-sans text-[14px] leading-[1.6] text-[var(--ink-2)] max-w-[50ch] max-[700px]:text-[13.5px]">
            {t("sub")}
          </p>
          <Link
            href={href}
            className="self-start inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[linear-gradient(180deg,var(--accent-soft)_0%,var(--accent)_100%)] text-white font-sans font-semibold text-[14px] tracking-[0.01em] no-underline cursor-pointer transition-[transform,box-shadow] duration-200 shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.25)] hover:-translate-y-px hover:shadow-[0_16px_36px_oklch(from_var(--color-accent)_l_c_h_/_0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-[3px] max-[700px]:px-[22px] max-[700px]:py-3 max-[700px]:text-[13px]"
          >
            {t("button")}
          </Link>
        </div>
        <div
          className="absolute top-1/2 left-[calc(50%-140px)] -translate-y-1/2 w-[calc(50%+270px+var(--gutter-x))] max-w-[1120px] pointer-events-none max-[1280px]:left-[calc(50%-24px)] max-[1280px]:w-[calc(50%+24px+var(--gutter-x))] max-[1024px]:static max-[1024px]:translate-y-0 max-[1024px]:w-full max-[1024px]:max-w-[720px] max-[1024px]:mx-auto [&_img]:block [&_img]:w-full [&_img]:h-auto"
          aria-hidden="false"
        >
          <Image
            src="/home/launch-cta-devices.webp"
            alt={t("imageAlt")}
            width={1119}
            height={549}
            sizes="(max-width: 1024px) 90vw, 60vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
