"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { formatEur as formatEurRaw } from "@/lib/shared/format-eur";
import type { CalculatorEstimate } from "@/types/pricing";

/**
 * Compact fixed estimate bar for small screens. On desktop the estimate is
 * always visible in the sticky summary aside, so this is `xl:hidden`. It shows
 * only while the controls are on screen but the summary readout is not — which
 * also keeps it clear of the footer (the controls are well above it).
 *
 * Relies on `#calc-controls` (CalculatorControls root) and `#calc-summary`
 * (EstimateSummary aside) being present in the DOM.
 */
export function MobileEstimateBar({ estimate }: { estimate: CalculatorEstimate }) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("Calculator");
  const locale = useLocale() as "uk" | "en";

  useEffect(() => {
    const controls = document.getElementById("calc-controls");
    const summary = document.getElementById("calc-summary");
    if (!controls || !summary) return;

    let controlsIn = false;
    let summaryIn = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === controls) controlsIn = e.isIntersecting;
          if (e.target === summary) summaryIn = e.isIntersecting;
        }
        setVisible(controlsIn && !summaryIn);
      },
      { threshold: 0 },
    );
    io.observe(controls);
    io.observe(summary);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={
        "fixed inset-x-0 bottom-0 z-40 xl:hidden " +
        "border-t border-line bg-[oklch(0.14_0.005_300_/_0.92)] backdrop-blur-md " +
        "shadow-[0_-8px_24px_oklch(0_0_0_/_0.3)] pb-[env(safe-area-inset-bottom)] " +
        "transition-transform duration-300 ease-out " +
        (visible ? "translate-y-0" : "translate-y-full pointer-events-none")
      }
    >
      <a
        href="#calc-lead-form"
        className="flex items-center justify-between gap-3 px-4 py-[10px] no-underline"
      >
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
            {t("summary.rangeLabel")}
          </span>
          <strong className="font-sans text-[19px] font-bold tracking-[-0.01em] bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))] bg-clip-text text-transparent">
            {formatEurRaw(estimate.oneTimeEstimate, locale)}
          </strong>
        </span>
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] text-[oklch(1_0_0_/_0.98)] shrink-0">
          <ChevronRight size={18} strokeWidth={2} />
        </span>
      </a>
    </div>
  );
}
