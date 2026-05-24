"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";

function HeroAuditBannerInner() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  if (searchParams?.get("source") !== "hero-audit") return null;

  const heading =
    locale === "en"
      ? "Free site audit — within 24 hours"
      : "Безкоштовний аудит сайту — за 24 години";
  const body =
    locale === "en"
      ? "Drop a link to your current site — we'll come back with an audit within 24 hours."
      : "Залиште посилання на ваш поточний сайт — повернемось з аудитом за 24 години.";

  return (
    <div
      className="max-w-container mx-auto mb-8 py-[18px] px-[22px] flex gap-[14px] items-start border border-[oklch(from_var(--color-accent)_l_c_h_/_0.4)] bg-[oklch(from_var(--color-accent)_l_c_h_/_0.08)] rounded-[14px] max-[700px]:mb-[22px] max-[700px]:py-[14px] max-[700px]:px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-2 h-2 rounded-full bg-accent-soft mt-[7px] flex-shrink-0 shadow-[0_0_0_4px_oklch(from_var(--color-accent)_l_c_h_/_0.15)]"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <div className="font-sans font-bold text-[14px] tracking-[-0.005em] text-ink mb-1 max-[700px]:text-[13px]">
          {heading}
        </div>
        <p className="text-[13px] leading-[1.5] text-[var(--ink-2)] m-0 max-[700px]:text-[12.5px]">
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
