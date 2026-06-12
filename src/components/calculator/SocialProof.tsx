"use client";

import { AppImage } from "@/lib/shared/app-image";
import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import {
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
} from "@/components/homepage/shared";

export function SocialProof() {
  const t = useTranslations("Calculator");
  const socialLogos = t.raw("social.logos") as string[];
  return (
    <section className={`${hpSectionClass} py-10`}>
      <div className={hpInnerClass}>
        <div className="relative px-7 py-8 flex flex-col gap-[18px] items-center text-center">
          <AppImage
            src="/calculator/social-left.webp"
            alt=""
            aria-hidden="true"
            width={733}
            height={861}
            sizes="(max-width: 900px) 0px, (max-width: 1100px) 220px, 280px"
            className="hidden min-[900px]:block pointer-events-none absolute left-0 bottom-[6%] z-0 w-[clamp(220px,20vw,280px)] h-auto [filter:drop-shadow(0_30px_40px_oklch(0_0_0_/_0.45))]"
          />
          <div className="relative z-[1] flex flex-col items-center gap-[18px] max-w-[820px] mx-auto">
            <h2
              className={`${hpH2Class} text-center mt-0 [&_strong]:font-bold [&_strong]:bg-brand-gradient [&_strong]:bg-clip-text [&_strong]:text-transparent`}
            >
              {t.rich("social.line", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </h2>
            <div className="inline-flex flex-wrap justify-center gap-3">
              {socialLogos.map((logo) => (
                <span
                  key={logo}
                  className="font-sans font-bold text-[13px] tracking-[0.04em] uppercase px-[14px] py-2 border border-line rounded-[10px] text-ink-dim bg-[oklch(1_0_0_/_0.02)]"
                >
                  {logo}
                </span>
              ))}
            </div>
            <figure className="mt-[6px] max-w-[720px] flex flex-col items-center gap-[14px] px-[22px] pt-[18px] pb-[22px] border border-line rounded-2xl bg-[oklch(0.18_0.008_300)]">
              <Quote size={18} strokeWidth={1.6} className="text-accent-soft" />
              <blockquote className="m-0 font-sans text-[18px] leading-[1.5] text-ink font-medium italic [&>strong]:text-accent-soft [&>strong]:font-bold [&>strong]:not-italic">
                {t.rich("social.testimonialQuote", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </blockquote>
              <figcaption className="flex flex-col gap-[2px]">
                <span className="text-[13px] text-ink font-semibold">{t("social.testimonialName")}</span>
                <span className="text-[11px] text-ink-3 tracking-[0.04em] uppercase">{t("social.testimonialRole")}</span>
              </figcaption>
            </figure>
          </div>
          <AppImage
            src="/calculator/social-right.webp"
            alt=""
            aria-hidden="true"
            width={1000}
            height={910}
            sizes="(max-width: 900px) 0px, (max-width: 1100px) 300px, 380px"
            className="hidden min-[900px]:block pointer-events-none absolute right-0 bottom-[10%] z-0 w-[clamp(300px,28vw,380px)] h-auto [filter:drop-shadow(0_30px_40px_oklch(0_0_0_/_0.45))]"
          />
        </div>
      </div>
    </section>
  );
}
