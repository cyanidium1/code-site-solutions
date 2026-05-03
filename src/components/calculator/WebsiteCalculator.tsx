"use client";

import { useMemo, useState } from "react";
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
import { calculateWebsiteEstimate } from "@/lib/calculate-website-estimate";
import {
  DEFAULT_CALCULATOR_INPUT,
  MAINTENANCE_OPTIONS,
  SEO_GROWTH_OPTIONS,
  type MaintenancePlan,
  type SeoGrowthPlan,
} from "@/lib/pricing-calculator-config";
import { FAQ } from "@/components/blocks/final";
import type { RichText } from "@/lib/rich-text";
import { CalculatorControls } from "./CalculatorControls";
import { EstimateSummary } from "./EstimateSummary";
import { LeadForm } from "./LeadForm";
import { formatEur } from "./formatters";
import "./calculator.css";

const CALCULATOR_FAQ: { q: string; a: RichText }[] = [
  {
    q: "What if my budget is below the calculator's lowest price?",
    a: [
      "If you have ",
      { em: "$800" },
      ", we will tell you honestly that we can't deliver well at that price — and recommend a person we trust who can. We don't take projects we can't ship at the standard we want our name on.",
    ],
  },
  {
    q: "What if the final price is higher than the calculator shows?",
    a: [
      "The calculator gives a realistic range ",
      { em: "9 times out of 10" },
      ". If something falls outside it, we tell you before signing — never after. The contract carries a fixed sum: no surprises, no scope-creep invoices.",
    ],
  },
  {
    q: "Can I start with one package and upgrade later?",
    a: [
      "Yes. We design the architecture to ",
      { em: "scale" },
      ". Launch as Starter; a year later, when traffic grows, add CMS, blog, or SEO — without rewriting from zero.",
    ],
  },
  {
    q: "What if I need only one page?",
    a: [
      "We do landings starting at ",
      { em: "$1,500" },
      ". Anything below that is either a templated solution or we're the wrong fit — we'll point you to who isn't.",
    ],
  },
  {
    q: "Do I need to know exactly what I want?",
    a: [
      "No. On the call we ask 10–15 questions and write the spec ",
      { em: "for you" },
      ". Most clients arrive with a rough idea — that's normal.",
    ],
  },
  {
    q: "What if I have my own designer or brand book?",
    a: [
      "Then ",
      { em: "−10–15% off the price" },
      " and a shorter timeline. We work directly from your Figma or design files.",
    ],
  },
  {
    q: "Can I see the code before paying full?",
    a: [
      "Yes. After the design phase we hand over the GitHub repo. You review, leave comments, then we continue. Transparent from day one — no ",
      { em: "code held hostage" },
      ".",
    ],
  },
  {
    q: "What's NOT included in the price?",
    a: [
      "Content copywriting, post-launch SEO promotion, and translation work. We can recommend trusted specialists for each — or quote them as add-ons. Everything else (design, code, CMS, hosting setup, 1-year warranty) is ",
      { em: "in the price" },
      ".",
    ],
  },
];

/* ─── Reusable info-card grid (no outer border, matches /about VALUES) ──── */

type InfoCard = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  body: string;
};

function InfoCardGrid({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="calc-info-grid">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <article key={c.title} className="calc-info-card">
            <span className="calc-info-icon">
              <Icon size={18} strokeWidth={1.6} />
            </span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </article>
        );
      })}
    </div>
  );
}

const HOW_IT_WORKS: InfoCard[] = [
  {
    icon: Layers3,
    title: "Base project",
    body: "Website type, CMS setup, responsive layout, and launch-ready structure.",
  },
  {
    icon: SlidersHorizontal,
    title: "Scope add-ons",
    body: "Pages, languages, design level, integrations, and content increase the project scope.",
  },
  {
    icon: ClipboardCheck,
    title: "Final review",
    body: "The calculator gives a realistic range. Final price is confirmed after scope review.",
  },
];

const WHY_PACKAGES: InfoCard[] = [
  {
    icon: Rocket,
    title: "Starter",
    body: "For people launching one service or testing a hypothesis. No CMS, no 20 pages — you need to validate demand fast.",
  },
  {
    icon: SearchCheck,
    title: "Growth",
    body: "For people with paying clients but no website that sells. Cases, blog, SEO, lead form — everything that brings traffic and converts it into calls.",
  },
  {
    icon: Database,
    title: "E-commerce",
    body: "For people selling products. Not a landing page with “buy via DM” — a real store: cart, payments, CMS to manage stock.",
  },
];

const WHY_ESTIMATE: InfoCard[] = [
  {
    icon: SearchCheck,
    title: "SEO structure",
    body: "Pages, metadata, headings, internal linking, and scalable landing architecture.",
  },
  {
    icon: Database,
    title: "CMS architecture",
    body: "CMS setup for editing pages, posts, cases, services, products, and multilingual content.",
  },
  {
    icon: Rocket,
    title: "Conversion logic",
    body: "Forms, CTAs, tracking, integrations, and UX decisions that turn visits into leads.",
  },
];

/* ─── Page ─────────────────────────────────────────────────────────────── */

export function WebsiteCalculator() {
  const [input, setInput] = useState(DEFAULT_CALCULATOR_INPUT);
  const estimate = useMemo(() => calculateWebsiteEstimate(input), [input]);

  return (
    <>
      {/* Section: How this estimate works */}
      <section className="hp-section calc-block-section">
        <div className="hp-inner">
          <div className="calc-section-head">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 01 HOW IT WORKS</span>
            </span>
            <h2 className="hp-h2">
              How this estimate <em>works</em>
            </h2>
            <p className="hp-sub">
              Three layers shape every project. The calculator separates a simple
              site from a scalable business platform.
            </p>
          </div>
          <InfoCardGrid cards={HOW_IT_WORKS} />
        </div>
      </section>

      {/* Section: Why these packages */}
      <section className="hp-section calc-block-section">
        <div className="hp-inner">
          <div className="calc-section-head">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 02 WHY THESE PACKAGES</span>
            </span>
            <h2 className="hp-h2">
              Three packages cover <em>80% of requests</em>. Here&apos;s why.
            </h2>
            <p className="hp-sub">
              Each one solves a different business question. Pick the one that
              matches where you are now — not where you might be in 3 years.
            </p>
          </div>
          <InfoCardGrid cards={WHY_PACKAGES} />
        </div>
      </section>

      {/* Section: Calculator (controls + sticky summary) */}
      <section className="hp-section calc-customizer-section">
        <div className="hp-inner">
          <div className="calc-section-head">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 03 CUSTOMIZER</span>
            </span>
            <h2 className="hp-h2">
              Configure your <em>scope</em>
            </h2>
            <p className="hp-sub">
              Start with a recommended package or build it manually below.
              Numbers update live.
            </p>
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
      <section className="hp-section calc-block-section">
        <div className="hp-inner">
          <div className="calc-section-head">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 04 AFTER LAUNCH</span>
            </span>
            <h2 className="hp-h2">
              Optional <em>monthly</em> support
            </h2>
            <p className="hp-sub">
              Maintenance keeps the site stable. SEO &amp; Growth grows traffic
              and leads. Both are optional and separate from the project price.
            </p>
          </div>

          <div className="calc-after-launch-grid">
            <div className="calc-after-block">
              <h3 className="calc-after-title">Maintenance / after-launch</h3>
              <p className="calc-note">
                Monthly technical support — separate from the one-time project
                estimate.
              </p>
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
                    {option.label}
                    <small>{formatEur(option.monthlyPrice)} / mo</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-after-block">
              <h3 className="calc-after-title">SEO &amp; Growth monthly</h3>
              <p className="calc-note">
                Ongoing SEO, content, analytics, and conversion work to grow
                qualified leads after launch.
              </p>
              <div className="calc-growth-grid">
                {Object.entries(SEO_GROWTH_OPTIONS).map(([id, plan]) => (
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
          </div>
        </div>
      </section>

      {/* Section: Why we estimate this way */}
      <section className="hp-section calc-block-section">
        <div className="hp-inner">
          <div className="calc-section-head">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 05 UNDER THE HOOD</span>
            </span>
            <h2 className="hp-h2">
              Why we estimate websites <em>this way</em>
            </h2>
            <p className="hp-sub">
              Behind every visible design are page structure, SEO metadata,
              performance, CMS modeling, responsive layouts, forms, analytics,
              integrations, and launch prep. The calculator separates those
              layers honestly.
            </p>
          </div>
          <InfoCardGrid cards={WHY_ESTIMATE} />
        </div>
      </section>

      {/* Section: Social proof */}
      <section className="hp-section calc-social-section">
        <div className="hp-inner">
          <div className="calc-social-card">
            <p className="calc-social-line">
              <strong>47 companies</strong> ran this calculator and launched
              with us. Some of them:
            </p>
            <div className="calc-social-logos">
              <span>NBYG Bornholm</span>
              <span>Efedra Clinic</span>
              <span>Tatarka</span>
            </div>
            <figure className="calc-testimonial">
              <Quote size={18} strokeWidth={1.6} className="calc-testimonial-icon" />
              <blockquote>
                Before the new site we got 3 enquiries a month. Now we get
                <strong> 24</strong>.
              </blockquote>
              <figcaption>
                <span className="calc-testimonial-name">Søren Hansen</span>
                <span className="calc-testimonial-role">Owner, NBYG Bornholm Aps</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Section: FAQ — HeroUI accordion via shared component */}
      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Questions before requesting an estimate" items={CALCULATOR_FAQ} />
      </section>

      {/* Section: Lead form + after-submit + alt CTA */}
      <section className="hp-section calc-leadform-section" id="calc-lead-form">
        <div className="hp-inner">
          <div className="calc-section-head">
            <span className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 06 GET FINAL ESTIMATE</span>
            </span>
            <h2 className="hp-h2">
              Send the brief — get a <em>final price</em>
            </h2>
            <p className="hp-sub">
              We&apos;ll review your calculator result and send a project plan,
              timeline, and confirmed price range. Custom-coded websites only —
              if you need a quick $300 template, we&apos;re not the right fit.
            </p>
          </div>
          <LeadForm input={input} estimate={estimate} />

          <div className="calc-alt-cta-row">
            <span className="calc-alt-cta-text">Not ready for the form?</span>
            <a
              href="https://calendly.com/fedirdev"
              className="calc-alt-cta-link"
              target="_blank"
              rel="noreferrer"
            >
              <CalendarCheck size={14} strokeWidth={1.7} />
              Book a 30-min call instead
            </a>
            <span className="calc-alt-cta-or">or</span>
            <a
              href="https://t.me/fedirdev"
              className="calc-alt-cta-link"
              target="_blank"
              rel="noreferrer"
            >
              <PhoneCall size={14} strokeWidth={1.7} />
              Telegram @fedirdev
            </a>
            <span className="calc-alt-cta-or">·</span>
            <a href="mailto:hi@code-site.art" className="calc-alt-cta-link">
              <Mail size={14} strokeWidth={1.7} />
              hi@code-site.art
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
