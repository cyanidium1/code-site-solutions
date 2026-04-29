"use client";

import { useMemo, useState } from "react";
import { ChartNoAxesCombined, Database, SearchCheck, Code2, Layers3, SlidersHorizontal, ClipboardCheck, Rocket } from "lucide-react";
import { calculateWebsiteEstimate } from "@/lib/calculate-website-estimate";
import {
  DEFAULT_CALCULATOR_INPUT,
  MAINTENANCE_OPTIONS,
  SEO_GROWTH_OPTIONS,
  type MaintenancePlan,
  type SeoGrowthPlan,
} from "@/lib/pricing-calculator-config";
import { CalculatorControls } from "./CalculatorControls";
import { EstimateSummary } from "./EstimateSummary";
import { LeadForm } from "./LeadForm";
import { formatEur } from "./formatters";
import "./calculator.css";

const CALCULATOR_FAQ = [
  {
    q: "Why does a custom-coded website cost more than a template?",
    a: "Because we build performance, SEO structure, CMS, responsive layouts, and long-term scalability specifically for your business instead of forcing a generic template.",
  },
  {
    q: "Is a CMS included?",
    a: "Yes. Basic CMS setup is included in all packages. Advanced builder and complex structures are priced separately.",
  },
  {
    q: "Can you build a multilingual website?",
    a: "Yes. We implement localized routing, CMS fields, language switcher, and SEO metadata for each language.",
  },
  {
    q: "Do I need to know the exact number of pages?",
    a: "No. Start with a recommended package and we will define the final structure during scope review.",
  },
  {
    q: "Why is the final price shown as a range?",
    a: "Exact price depends on design references, content volume, integrations, page structure, and technical requirements.",
  },
  {
    q: "Do you work with SEO landing pages?",
    a: "Yes. We build scalable SEO architecture for services, cities, languages, categories, niches, and programmatic pages.",
  },
  {
    q: "Can you integrate CRM, Telegram, analytics, or ads tracking?",
    a: "Yes. We connect forms to Telegram, email, CRM systems, analytics events, Meta Pixel, Google Ads, booking tools, and payments.",
  },
  {
    q: "Is maintenance included?",
    a: "Maintenance is separate. You can choose no maintenance, basic care, growth support, or dedicated improvement plan.",
  },
  {
    q: "Do you offer ongoing SEO after launch?",
    a: "Yes. SEO & Growth monthly packages can include blog posts, keyword research, landing expansion, analytics, and conversion improvements.",
  },
] as const;

export function WebsiteCalculator() {
  const [input, setInput] = useState(DEFAULT_CALCULATOR_INPUT);
  const estimate = useMemo(() => calculateWebsiteEstimate(input), [input]);

  return (
    <section className="calc-section">
      <div className="hp-inner">
        <div className="calc-hero">
          <div className="hp-eyebrow">
            <span className="hp-eyebrow-dot" />
            <span>/ CALCULATOR</span>
          </div>
          <h1 className="hp-h2">Website Development Cost Calculator</h1>
          <p className="hp-sub">
            Get a realistic estimate for a custom-coded website. Choose a recommended package or build
            your own configuration.
          </p>
          <div className="calc-trust-row">
            <span><Code2 size={14} /> Custom code, no builders</span>
            <span><SearchCheck size={14} /> SEO-first structure</span>
            <span><ChartNoAxesCombined size={14} /> Transparent project range</span>
          </div>
        </div>

        <section className="calc-how-estimate">
          <h3>How this estimate works</h3>
          <div className="calc-how-estimate-grid">
            <article>
              <Layers3 size={16} />
              <h4>Base project</h4>
              <p>Website type, CMS setup, responsive layout, and launch-ready structure.</p>
            </article>
            <article>
              <SlidersHorizontal size={16} />
              <h4>Scope add-ons</h4>
              <p>Pages, languages, design level, integrations, and content increase the project scope.</p>
            </article>
            <article>
              <ClipboardCheck size={16} />
              <h4>Final review</h4>
              <p>The calculator gives a realistic range. Final price is confirmed after scope review.</p>
            </article>
          </div>
        </section>

        <div className="calc-layout">
          <CalculatorControls value={input} onChange={setInput} />
          <EstimateSummary input={input} estimate={estimate} seoGrowthMonthly={SEO_GROWTH_OPTIONS[input.seoGrowthPlan].monthlyPrice} />
        </div>

        <div className="calc-group calc-maintenance-group">
          <h3>6. Maintenance / after-launch</h3>
          <p className="calc-note">Monthly support is separate from one-time project estimate.</p>
          <div className="calc-segment">
            {Object.entries(MAINTENANCE_OPTIONS).map(([id, option]) => (
              <button
                key={id}
                type="button"
                className={input.maintenancePlan === id ? "active" : ""}
                onClick={() => setInput((prev) => ({ ...prev, maintenancePlan: id as MaintenancePlan }))}
              >
                {option.label}
                <small>{formatEur(option.monthlyPrice)} / mo</small>
              </button>
            ))}
          </div>
        </div>

        <section className="calc-group calc-growth-monthly">
          <h3>7. SEO & Growth monthly</h3>
          <div className="calc-group-content">
            <p className="calc-note">
              Ongoing SEO, content, analytics, and conversion work to grow traffic and qualified leads after launch.
            </p>
            <p className="calc-note">
              SEO & Growth is focused on traffic, visibility, and leads. Maintenance is focused on technical stability.
            </p>
            <div className="calc-growth-grid">
              {Object.entries(SEO_GROWTH_OPTIONS).map(([id, plan]) => (
                <button
                  key={id}
                  type="button"
                  className={`calc-growth-plan${input.seoGrowthPlan === id ? " active" : ""}${plan.badge ? " is-recommended" : ""}`}
                  onClick={() => setInput((prev) => ({ ...prev, seoGrowthPlan: id as SeoGrowthPlan }))}
                >
                  <div className="calc-growth-plan-head">
                    <strong>{plan.label}</strong>
                    {plan.badge ? <span>{plan.badge}</span> : null}
                  </div>
                  <h4>
                    {plan.priceLabel ? (
                      plan.priceLabel
                    ) : (
                      <>
                        {formatEur(plan.monthlyPrice)}
                        <small>/mo</small>
                      </>
                    )}
                  </h4>
                  <p>{plan.bestFor}</p>
                  <ul>
                    {plan.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="calc-seo-block">
          <h3>Why we estimate custom websites this way</h3>
          <p>
            Every serious website has hidden work behind visible design: page structure, SEO metadata, performance, CMS
            modeling, responsive layouts, forms, analytics, integrations, and launch preparation. The calculator helps
            separate a simple website from a scalable business platform.
          </p>
          <div className="calc-seo-grid">
            <article>
              <SearchCheck size={16} />
              <h4>SEO structure</h4>
              <p>Pages, metadata, headings, internal linking, and scalable landing architecture.</p>
            </article>
            <article>
              <Database size={16} />
              <h4>CMS architecture</h4>
              <p>CMS setup for editing pages, posts, cases, services, products, and multilingual content.</p>
            </article>
            <article>
              <Rocket size={16} />
              <h4>Conversion logic</h4>
              <p>Forms, CTAs, tracking, integrations, and UX decisions that turn visits into leads.</p>
            </article>
          </div>
        </div>

        <section className="calc-faq">
          <h3>Questions before requesting an estimate</h3>
          <div className="calc-faq-list">
            {CALCULATOR_FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div id="calc-lead-form">
          <p className="calc-lead-filter">
            This calculator is for custom-coded websites. If you need a quick $300 template setup, we are probably
            not the right fit.
          </p>
          <LeadForm input={input} estimate={estimate} />
        </div>
      </div>
    </section>
  );
}
