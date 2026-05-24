"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Database,
  SearchCheck,
  Layers3,
  SlidersHorizontal,
  ClipboardCheck,
  Rocket,
  Mail,
  PhoneCall,
  CalendarCheck,
  Quote,
} from "lucide-react";
import { calculateWebsiteEstimate } from "@/lib/shared/calculate-website-estimate";
import {
  DEFAULT_CALCULATOR_INPUT,
  MAINTENANCE_OPTIONS,
  SEO_GROWTH_OPTIONS,
} from "@/constants/calculator-config";
import type { MaintenancePlan, SeoGrowthPlan } from "@/types/pricing";
import { FAQ } from "@/components/blocks/final";
import type { FAQItem } from "@/types/faq";
import { CalculatorControls } from "./CalculatorControls";
import { EstimateSummary } from "./EstimateSummary";
import { LeadForm } from "./LeadForm";
import { formatEur } from "@/lib/shared/format-eur";
import { H3 } from "@/components/ui";
import "./calculator.css";

// Renders <em>…</em> chunks inside next-intl rich messages. Reused for every
// section heading on the calculator that uses italic emphasis on one phrase.
const emChunk = (chunks: React.ReactNode) => <em>{chunks}</em>;

/* ─── Reusable info-card grid (no outer border, matches /about VALUES) ──── */

type InfoCard = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
};

function InfoCardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <article
            key={c.title}
            className="border border-line rounded-[22px] bg-[radial-gradient(220px_140px_at_0%_0%,oklch(from_var(--accent)_l_c_h_/_0.06),transparent_70%),oklch(0.16_0.005_300)] px-[22px] py-6 flex flex-col gap-3 transition-[border-color,transform] duration-200"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-[12px] bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] text-accent-soft">
              <Icon size={18} strokeWidth={1.6} />
            </span>
            <H3 variant="calc-card">{c.title}</H3>
            <p className="m-0 text-ink-dim text-[14px] leading-[1.55]">{c.body}</p>
          </article>
        );
      })}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */

export function WebsiteCalculator() {
  const [input, setInput] = useState(DEFAULT_CALCULATOR_INPUT);
  const estimate = useMemo(() => calculateWebsiteEstimate(input), [input]);
  const t = useTranslations("Calculator");

  const howItWorks: InfoCard[] = [
    {
      icon: Layers3,
      title: t("howItWorks.cards.base.title"),
      body: t("howItWorks.cards.base.body"),
    },
    {
      icon: SlidersHorizontal,
      title: t("howItWorks.cards.scope.title"),
      body: t("howItWorks.cards.scope.body"),
    },
    {
      icon: ClipboardCheck,
      title: t("howItWorks.cards.final.title"),
      body: t("howItWorks.cards.final.body"),
    },
  ];

  const whyPackages: InfoCard[] = [
    {
      icon: Rocket,
      title: t("whyPackages.cards.starter.title"),
      body: t("whyPackages.cards.starter.body"),
    },
    {
      icon: SearchCheck,
      title: t("whyPackages.cards.growth.title"),
      body: t("whyPackages.cards.growth.body"),
    },
    {
      icon: Database,
      title: t("whyPackages.cards.ecommerce.title"),
      body: t("whyPackages.cards.ecommerce.body"),
    },
  ];

  const whyEstimate: InfoCard[] = [
    {
      icon: SearchCheck,
      title: t("underHood.cards.seo.title"),
      body: t("underHood.cards.seo.body"),
    },
    {
      icon: Database,
      title: t("underHood.cards.cms.title"),
      body: t("underHood.cards.cms.body"),
    },
    {
      icon: Rocket,
      title: t("underHood.cards.conversion.title"),
      body: t("underHood.cards.conversion.body"),
    },
  ];

  const faqItems: FAQItem[] = (t.raw("faq.items") as { q: string; a: string }[]).map(
    (it) => ({ q: it.q, a: [it.a] }),
  );

  const socialLogos = t.raw("social.logos") as string[];

  const monthSuffixMaintenance = t("afterLaunch.maintenance.monthSuffix");
  const monthSuffixGrowth = t("afterLaunch.growth.monthSuffix");

  return (
    <>
      {/* Section: How this estimate works */}
      <section className="hp-section py-24 max-[760px]:py-16">
        <div className="hp-inner">
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8 [&>.hp-h2]:mt-6 [&>.hp-sub]:mt-[18px]">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>{t("howItWorks.eyebrow")}</span>
            </span>
            <h2 className="hp-h2">{t.rich("howItWorks.title", { em: emChunk })}</h2>
            <p className="hp-sub">{t("howItWorks.sub")}</p>
          </div>
          <InfoCardGrid cards={howItWorks} />
        </div>
      </section>

      {/* Section: Why these packages */}
      <section className="hp-section py-24 max-[760px]:py-16">
        <div className="hp-inner">
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8 [&>.hp-h2]:mt-6 [&>.hp-sub]:mt-[18px]">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>{t("whyPackages.eyebrow")}</span>
            </span>
            <h2 className="hp-h2">{t.rich("whyPackages.title", { em: emChunk })}</h2>
            <p className="hp-sub">{t("whyPackages.sub")}</p>
          </div>
          <InfoCardGrid cards={whyPackages} />
        </div>
      </section>

      {/* Section: Calculator (controls + sticky summary) */}
      <section className="hp-section pt-20 pb-24 max-[760px]:pt-16 max-[760px]:pb-20">
        <div className="hp-inner">
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8 [&>.hp-h2]:mt-6 [&>.hp-sub]:mt-[18px]">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>{t("customizer.eyebrow")}</span>
            </span>
            <h2 className="hp-h2">{t.rich("customizer.title", { em: emChunk })}</h2>
            <p className="hp-sub">{t("customizer.sub")}</p>
          </div>

          <div className="calc-layout">
            <CalculatorControls value={input} onChange={setInput} />
            <EstimateSummary
              input={input}
              estimate={estimate}
              seoGrowthMonthly={SEO_GROWTH_OPTIONS[input.seoGrowthPlan].monthlyPrice}
            />
          </div>
        </div>
      </section>

      {/* Section: After-launch (Maintenance + SEO/Growth) */}
      <section className="hp-section py-24 max-[760px]:py-16">
        <div className="hp-inner">
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8 [&>.hp-h2]:mt-6 [&>.hp-sub]:mt-[18px]">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>{t("afterLaunch.eyebrow")}</span>
            </span>
            <h2 className="hp-h2">{t.rich("afterLaunch.title", { em: emChunk })}</h2>
            <p className="hp-sub">{t("afterLaunch.sub")}</p>
          </div>

          <div className="calc-after-launch-grid">
            <div className="calc-after-block">
              <h3 className="calc-after-title">{t("afterLaunch.maintenance.title")}</h3>
              <p className="calc-note">{t("afterLaunch.maintenance.note")}</p>
              <div className="calc-segment">
                {Object.entries(MAINTENANCE_OPTIONS).map(([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    className={input.maintenancePlan === id ? "active" : ""}
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        maintenancePlan: id as MaintenancePlan,
                      }))
                    }
                  >
                    {t(`options.maintenance.${id}` as `options.maintenance.${MaintenancePlan}`)}
                    <small>
                      {formatEur(option.monthlyPrice)}
                      {monthSuffixMaintenance}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-after-block">
              <h3 className="calc-after-title">{t("afterLaunch.growth.title")}</h3>
              <p className="calc-note">{t("afterLaunch.growth.note")}</p>
              <div className="calc-growth-grid">
                {Object.entries(SEO_GROWTH_OPTIONS).map(([id, plan]) => {
                  const includes = t.raw(
                    `options.seoGrowth.${id}.includes`,
                  ) as string[];
                  const priceLabel =
                    id === "contentEngine"
                      ? t("options.seoGrowth.contentEngine.priceLabel")
                      : undefined;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`calc-growth-plan${
                        input.seoGrowthPlan === id ? " active" : ""
                      }${plan.badge ? " is-recommended" : ""}`}
                      onClick={() =>
                        setInput((prev) => ({
                          ...prev,
                          seoGrowthPlan: id as SeoGrowthPlan,
                        }))
                      }
                    >
                      <div className="calc-growth-plan-head">
                        <strong>
                          {t(`options.seoGrowth.${id}.label` as `options.seoGrowth.${SeoGrowthPlan}.label`)}
                        </strong>
                        {plan.badge ? <span>{t("options.seoGrowth.badgeRecommended")}</span> : null}
                      </div>
                      <h4>
                        {priceLabel ? (
                          priceLabel
                        ) : (
                          <>
                            {formatEur(plan.monthlyPrice)}
                            <small>{monthSuffixGrowth}</small>
                          </>
                        )}
                      </h4>
                      <p>
                        {t(`options.seoGrowth.${id}.bestFor` as `options.seoGrowth.${SeoGrowthPlan}.bestFor`)}
                      </p>
                      <ul>
                        {includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why we estimate this way */}
      <section className="hp-section py-24 max-[760px]:py-16">
        <div className="hp-inner">
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8 [&>.hp-h2]:mt-6 [&>.hp-sub]:mt-[18px]">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>{t("underHood.eyebrow")}</span>
            </span>
            <h2 className="hp-h2">{t.rich("underHood.title", { em: emChunk })}</h2>
            <p className="hp-sub">{t("underHood.sub")}</p>
          </div>
          <InfoCardGrid cards={whyEstimate} />
        </div>
      </section>

      {/* Section: Social proof */}
      <section className="hp-section py-10">
        <div className="hp-inner">
          <div className="calc-social-card">
            <p className="calc-social-line">
              {t.rich("social.line", {
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <div className="calc-social-logos">
              {socialLogos.map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
            <figure className="calc-testimonial">
              <Quote size={18} strokeWidth={1.6} className="calc-testimonial-icon" />
              <blockquote>
                {t.rich("social.testimonialQuote", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </blockquote>
              <figcaption>
                <span className="calc-testimonial-name">{t("social.testimonialName")}</span>
                <span className="calc-testimonial-role">{t("social.testimonialRole")}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section: FAQ — HeroUI accordion via shared component */}
      <section className="bg-bg">
        <FAQ heading={t("faq.heading")} items={faqItems} />
      </section>

      {/* Section: Lead form + after-submit + alt CTA */}
      <section className="hp-section pt-20 pb-30 max-[760px]:pt-16 max-[760px]:pb-20" id="calc-lead-form">
        <div className="hp-inner">
          <div className="mb-14 flex flex-col items-start gap-0 max-[760px]:mb-8 [&>.hp-h2]:mt-6 [&>.hp-sub]:mt-[18px]">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>{t("getFinal.eyebrow")}</span>
            </span>
            <h2 className="hp-h2">{t.rich("getFinal.title", { em: emChunk })}</h2>
            <p className="hp-sub">{t("getFinal.sub")}</p>
          </div>
          <LeadForm input={input} estimate={estimate} />

          <div className="calc-alt-cta-row">
            <span className="calc-alt-cta-text">{t("getFinal.altReady")}</span>
            <a
              href="https://calendly.com/fedirdev"
              className="calc-alt-cta-link"
              target="_blank"
              rel="noreferrer"
            >
              <CalendarCheck size={14} strokeWidth={1.7} />
              {t("getFinal.altCalendly")}
            </a>
            <span className="calc-alt-cta-or">{t("getFinal.altOr")}</span>
            <a
              href="https://t.me/fedirdev"
              className="calc-alt-cta-link"
              target="_blank"
              rel="noreferrer"
            >
              <PhoneCall size={14} strokeWidth={1.7} />
              {t("getFinal.altTelegram")}
            </a>
            <span className="calc-alt-cta-or">{t("getFinal.altOrSep")}</span>
            <a href="mailto:hi@code-site.art" className="calc-alt-cta-link">
              <Mail size={14} strokeWidth={1.7} />
              {t("getFinal.altEmail")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
