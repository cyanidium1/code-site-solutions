"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import type { Locale } from "@/constants/locales";

const COPY: Record<Locale, { heading: string; body: string }> = {
  uk: {
    heading: "Аудит сайту — $150",
    body: "Година розбору на відеодзвінку, запис і PDF. Перед оплатою — безкоштовний 30-хвилинний дзвінок-знайомство: скажемо, чи потрібен вам аудит.",
  },
  en: {
    heading: "Website audit — $150",
    body: "An hour on a video call, the recording and a PDF. Before you pay, a free 30-minute intro call: we'll tell you whether you need the audit at all.",
  },
  ru: {
    heading: "Аудит сайта — $150",
    body: "Час разбора на видеозвонке, запись и PDF. Перед оплатой — бесплатный 30-минутный звонок-знакомство: скажем, нужен ли вам аудит.",
  },
};

function HeroAuditBannerInner() {
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;
  if (searchParams?.get("source") !== "hero-audit") return null;

  const { heading, body } = COPY[locale];

  return (
    <div
      className="max-w-container mx-auto mb-[22px] py-[14px] px-4 flex gap-[14px] items-start border border-accent-40 bg-accent-8 rounded-[14px] md:mb-8 md:py-[18px] md:px-[22px]"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-2 h-2 rounded-full bg-accent-soft mt-[7px] flex-shrink-0 shadow-[0_0_0_4px_oklch(from_var(--color-accent)_l_c_h_/_0.15)]"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="font-sans font-bold text-[13px] tracking-[-0.005em] text-ink mb-1 md:text-[14px]">
          {heading}
        </div>
        <p className="text-[12.5px] leading-[1.5] text-ink-dim m-0 md:text-[13px]">
          {body}
        </p>
      </div>
    </div>
  );
}

export function HeroAuditBanner() {
  return (
    <Suspense fallback={null}>
      <HeroAuditBannerInner />
    </Suspense>
  );
}
