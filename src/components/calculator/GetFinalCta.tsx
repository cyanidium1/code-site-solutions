"use client";

import { useLocale, useTranslations } from "next-intl";
import { Mail, PhoneCall } from "lucide-react"; // CalendarCheck removed — see docs/calendly-disabled.md
import { SITE_CONTACT } from "@/constants/site";
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
  /** Called after a successful lead submit (clears persisted selections). */
  onSubmitted?: () => void;
};

export function GetFinalCta({ config, input, estimate, onSubmitted }: GetFinalCtaProps) {
  const t = useTranslations("Calculator");
  const locale = useLocale();
  return (
    <section
      className={`${hpSectionClass} pt-16 pb-20 md-wide:pt-20 md-wide:pb-30`}
      id="calc-lead-form"
    >
      <div className={hpInnerClass}>
        <div className="mb-8 flex flex-col items-start gap-0 md-wide:mb-14">
          <span className={hpEyebrowClass}>
            <span className={hpEyebrowDotClass} />
            <span>{t("getFinal.eyebrow")}</span>
          </span>
          <h2 className={hpH2Class}>{t.rich("getFinal.title", { em: emChunk })}</h2>
          <p className={hpSubClass}>{t("getFinal.sub")}</p>
        </div>
        <LeadForm
          config={config}
          input={input}
          estimate={estimate}
          onSubmitted={onSubmitted}
        />
        <div
          className={
            "mt-[22px] flex flex-wrap gap-y-[10px] gap-x-[14px] items-center justify-center " +
            "px-[18px] py-[14px] border border-dashed border-line-strong rounded-[18px] md-wide:rounded-full " +
            "text-[13px] text-ink-3"
          }
        >
          <span className="font-medium text-ink-dim">{t("getFinal.altReady")}</span>
          {/* CALENDLY DISABLED — see docs/calendly-disabled.md
          <a
            href={SITE_CONTACT.calendly}
            className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
            target="_blank"
            rel="noreferrer"
          >
            <CalendarCheck size={14} strokeWidth={1.7} />
            {t("getFinal.altCalendly")}
          </a>
          <span className="text-ink-3 opacity-60">{t("getFinal.altOr")}</span>
          */}
          <a
            href={
              locale === "en"
                ? `https://wa.me/${SITE_CONTACT.whatsapp}`
                : SITE_CONTACT.telegram
            }
            className="inline-flex items-center gap-[6px] text-ink no-underline font-medium border-b border-transparent transition-[color,border-color] duration-200 hover:text-accent-soft hover:border-b-accent-soft [&_svg]:text-accent-soft"
            target="_blank"
            rel="noreferrer"
          >
            <PhoneCall size={14} strokeWidth={1.7} />
            {t("getFinal.altTelegram")}
          </a>
          <span className="text-ink-3 opacity-60">{t("getFinal.altOrSep")}</span>
          <a
            href={`mailto:${SITE_CONTACT.email}`}
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
