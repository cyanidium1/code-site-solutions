"use client";

import { useTranslations } from "next-intl";
import { CalendarCheck, Mail, PhoneCall } from "lucide-react";
import {
  hpEyebrowClass,
  hpEyebrowDotClass,
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSubClass,
} from "@/components/homepage/shared";
import { LeadForm } from "./LeadForm";
import type { CalculatorConfig } from "@/types/calculator-config";
import type {
  CalculatorEstimate,
  CalculatorInput,
} from "@/types/pricing";

const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

type GetFinalCtaProps = {
  config: CalculatorConfig;
  input: CalculatorInput;
  estimate: CalculatorEstimate;
};

export function GetFinalCta({ config, input, estimate }: GetFinalCtaProps) {
  const t = useTranslations("Calculator");
  return (
    <section
      className={`${hpSectionClass} pt-20 pb-30 max-md-wide:pt-16 max-md-wide:pb-20`}
      id="calc-lead-form"
    >
      <div className={hpInnerClass}>
        <div className="mb-14 flex flex-col items-start gap-0 max-md-wide:mb-8">
          <span className={hpEyebrowClass}>
            <span className={hpEyebrowDotClass} />
            <span>{t("getFinal.eyebrow")}</span>
          </span>
          <h2 className={hpH2Class}>{t.rich("getFinal.title", { em: emChunk })}</h2>
          <p className={hpSubClass}>{t("getFinal.sub")}</p>
        </div>
        <LeadForm config={config} input={input} estimate={estimate} />
        <div
          className={
            "mt-[22px] flex flex-wrap gap-y-[10px] gap-x-[14px] items-center justify-center " +
            "px-[18px] py-[14px] border border-dashed border-line-strong rounded-full max-md-wide:rounded-[18px] " +
            "text-[13px] text-ink-3"
          }
        >
          <span className="font-medium text-ink-dim">{t("getFinal.altReady")}</span>
          <a
            href="https://calendly.com/fedirdev"
            className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
            target="_blank"
            rel="noreferrer"
          >
            <CalendarCheck size={14} strokeWidth={1.7} />
            {t("getFinal.altCalendly")}
          </a>
          <span className="text-ink-3 opacity-60">{t("getFinal.altOr")}</span>
          <a
            href="https://t.me/fedirdev"
            className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
            target="_blank"
            rel="noreferrer"
          >
            <PhoneCall size={14} strokeWidth={1.7} />
            {t("getFinal.altTelegram")}
          </a>
          <span className="text-ink-3 opacity-60">{t("getFinal.altOrSep")}</span>
          <a
            href="mailto:hi@code-site.art"
            className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
          >
            <Mail size={14} strokeWidth={1.7} />
            {t("getFinal.altEmail")}
          </a>
        </div>
      </div>
    </section>
  );
}
