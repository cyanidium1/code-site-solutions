"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

import type { Locale } from "@/constants/locales";

const COPY: Record<Locale, { heading: string; body: string }> = {
  uk: {
    heading: "Безкоштовний аудит сайту за 24 години",
    body: "Вкажіть у формі адресу сайту. За 24 години надішлемо 5 головних проблем, що заважають заявкам, і що з цим робити. Без зобов'язань.",
  },
  en: {
    heading: "Free website audit within 24 hours",
    body: "Add your site's URL in the form. Within 24 hours we'll send the 5 main problems that cost you enquiries and what to do about them. No obligation.",
  },
  ru: {
    heading: "Бесплатный аудит сайта за 24 часа",
    body: "Укажите в форме адрес сайта. За 24 часа пришлем 5 главных проблем, которые мешают заявкам, и что с этим делать. Без обязательств.",
  },
};

function HeroAuditBannerInner() {
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;
  if (searchParams?.get("source") !== "hero-audit") return null;

  const { heading, body } = COPY[locale];

  return (
    <div
      className="max-w-container mx-auto mb-[22px] py-[14px] px-4 flex gap-[14px] items-start border border-accent-40 bg-accent-8 rounded-card md:mb-8 md:py-[18px] md:px-[22px]"
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
