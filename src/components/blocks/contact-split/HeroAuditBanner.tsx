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
    <div className="hero-audit-banner" role="status" aria-live="polite">
      <div className="hero-audit-banner-dot" aria-hidden="true" />
      <div className="hero-audit-banner-body">
        <div className="hero-audit-banner-title">{heading}</div>
        <p className="hero-audit-banner-text">{body}</p>
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
