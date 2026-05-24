import type * as React from "react";
import {
  Gauge,
  Github,
  Rocket,
  DollarSign,
  Shield,
  Clock,
  ArrowRightLeft,
  Layers,
  Check,
} from "lucide-react";

import type { BentoCell, BentoVisualKind } from "@/types/homepage";
import { formatPrice, type PriceLocale } from "@/lib/shared/format-price";
import { TIER_AMOUNTS, TIER_NAMES, TIER_ORDER } from "@/constants/pricing-tiers";
import { SectionHead } from "@/components/shared/section-head";
import { ScrollReveal } from "./scroll-reveal";

function LighthouseVisual() {
  return (
    <div className="hp-lh">
      <div className="hp-lh-arc">
        <svg viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="url(#hp-lh-grad)"
            strokeWidth="2.5"
            strokeDasharray="98 100"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="hp-lh-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.16 145)" />
              <stop offset="100%" stopColor="oklch(0.55 0.18 295)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="hp-lh-num">
          <strong>98</strong>
          <small>score</small>
        </div>
      </div>
    </div>
  );
}

function MigrationVisual() {
  return (
    <div className="hp-mig">
      <div className="hp-mig-pill bad">
        WP <strong>4.2s</strong>
      </div>
      <span className="hp-mig-arrow">→</span>
      <div className="hp-mig-pill good">
        Next <strong>0.8s</strong>
      </div>
    </div>
  );
}

function StackVisual({ locale }: { locale: PriceLocale }) {
  const layers = locale === "en"
    ? ["Copy", "Design", "Code", "SEO + hosting"]
    : ["Тексти", "Дизайн", "Код", "SEO + хостинг"];
  return (
    <div className="hp-bento-vis hp-bento-stack" aria-hidden="true">
      {layers.map((l) => (
        <div key={l} className="hp-bento-stack-row">
          <span className="hp-bento-stack-check">
            <Check size={11} strokeWidth={2.4} />
          </span>
          <span className="hp-bento-stack-label">{l}</span>
        </div>
      ))}
    </div>
  );
}

function CommitLogVisual() {
  const rows = [
    { msg: "initial setup", meta: "2024" },
    { msg: "launch", meta: "+6 wk" },
    { msg: "handover", meta: "you ⤴", accent: true },
  ];
  return (
    <div className="hp-bento-vis hp-bento-commits" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.msg} className="hp-bento-commit-row">
          <span className="hp-bento-commit-tag">feat:</span>
          <span className="hp-bento-commit-msg">{r.msg}</span>
          <span
            className={`hp-bento-commit-meta${r.accent ? " is-accent" : ""}`}
          >
            {r.meta}
          </span>
        </div>
      ))}
    </div>
  );
}

function WeeksProgressVisual({ locale }: { locale: PriceLocale }) {
  const steps = locale === "en"
    ? [
        { name: "Brief", wk: "wk 1" },
        { name: "Design", wk: "wk 2" },
        { name: "Build", wk: "wk 3" },
        { name: "Launch", wk: "wk 4", target: true },
      ]
    : [
        { name: "Бриф", wk: "тижд. 1" },
        { name: "Дизайн", wk: "тижд. 2" },
        { name: "Розробка", wk: "тижд. 3" },
        { name: "Запуск", wk: "тижд. 4", target: true },
      ];
  return (
    <div className="hp-bento-vis hp-bento-weeks" aria-hidden="true">
      {steps.map((s) => (
        <div key={s.name} className="hp-bento-week-row">
          <span className="hp-bento-week-name">{s.name}</span>
          <span
            className={`hp-bento-week-bar${s.target ? " is-target" : ""}`}
          />
          <span
            className={`hp-bento-week-wk${s.target ? " is-target" : ""}`}
          >
            {s.wk}
          </span>
        </div>
      ))}
    </div>
  );
}

function PriceTableVisual({ locale }: { locale: PriceLocale }) {
  // Trailing "+" is a "starting from" shorthand in this Bento visual.
  // formatPrice handles the locale-aware number; we append the suffix.
  const rows = TIER_ORDER.map((key) => ({
    name: TIER_NAMES[key][locale],
    price: `${formatPrice(TIER_AMOUNTS[key], { locale })}+`,
    accent: key === "corporate",
  }));
  return (
    <div className="hp-bento-vis hp-bento-price" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.name} className="hp-bento-price-row">
          <span className="hp-bento-price-name">{r.name}</span>
          <span className="hp-bento-price-dots" />
          <span
            className={`hp-bento-price-num${r.accent ? " is-accent" : ""}`}
          >
            {r.price}
          </span>
        </div>
      ))}
    </div>
  );
}

function WarrantyTimelineVisual({ locale }: { locale: PriceLocale }) {
  const points = locale === "en"
    ? [
        { label: "Start" },
        { label: "Launch", mid: true },
        { label: "+1 year", end: true },
      ]
    : [
        { label: "Старт" },
        { label: "Запуск", mid: true },
        { label: "+1 рік", end: true },
      ];
  const footL = locale === "en" ? "Missed deadline" : "Зрив дедлайну";
  return (
    <div className="hp-bento-vis hp-bento-tl" aria-hidden="true">
      <div className="hp-bento-tl-track">
        <div className="hp-bento-tl-line" />
        <div className="hp-bento-tl-points">
          {points.map((p) => (
            <div key={p.label} className="hp-bento-tl-point">
              <span
                className={`hp-bento-tl-dot${p.mid ? " is-mid" : ""}${p.end ? " is-end" : ""}`}
              />
              <span className="hp-bento-tl-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hp-bento-tl-foot">
        <span className="hp-bento-tl-foot-l">{footL}</span>
        <span className="hp-bento-tl-foot-arrow">→</span>
        <span className="hp-bento-tl-foot-r">−30%</span>
      </div>
    </div>
  );
}

function SupportTimerVisual({ locale }: { locale: PriceLocale }) {
  const sub = locale === "en" ? "business-hour SLA" : "робочих годин SLA";
  return (
    <div className="hp-bento-vis hp-bento-timer" aria-hidden="true">
      <div className="hp-bento-timer-row">
        <span className="hp-bento-timer-seg">00</span>
        <span className="hp-bento-timer-sep">:</span>
        <span className="hp-bento-timer-seg is-accent">04</span>
        <span className="hp-bento-timer-sep">:</span>
        <span className="hp-bento-timer-seg">00</span>
      </div>
      <div className="hp-bento-timer-sub">{sub}</div>
    </div>
  );
}

function BentoVisual({
  kind,
  locale,
}: {
  kind: BentoVisualKind;
  locale: PriceLocale;
}) {
  switch (kind) {
    case "lh":
      return <LighthouseVisual />;
    case "mig":
      return <MigrationVisual />;
    case "commits":
      return <CommitLogVisual />;
    case "weeks":
      return <WeeksProgressVisual locale={locale} />;
    case "price":
      return <PriceTableVisual locale={locale} />;
    case "warranty":
      return <WarrantyTimelineVisual locale={locale} />;
    case "support":
      return <SupportTimerVisual locale={locale} />;
    case "stack":
      return <StackVisual locale={locale} />;
    default:
      return null;
  }
}

const DEFAULT_BENTO: BentoCell[] = [
  {
    title: "Завантаження < 1 сек",
    icon: Gauge,
    stat: "98 LH",
    body: "Custom code, нуль плагінів. Перевірено на 3G/4G в Україні.",
    span: "2x1",
    visual: "lh",
  },
  {
    title: "Код у вашому GitHub",
    icon: Github,
    stat: "100%",
    body: "Не у нас. З першого коміту.",
    span: "1x1",
    visual: "commits",
  },
  {
    title: "Запуск за 4 тижні",
    icon: Rocket,
    stat: "4 wk",
    body: "Industry-сайт під ключ.",
    span: "1x1",
    visual: "weeks",
  },
  {
    title: "Прозорий прайс",
    icon: DollarSign,
    stat: "$3.5k+",
    body: "Не «під запит». Цифра в брифі.",
    span: "1x1",
    visual: "price",
  },
  {
    title: "Гарантія + неустойка",
    icon: Shield,
    stat: "1y",
    body: "1 рік. За зрив — повертаємо 30%.",
    span: "1x1",
    visual: "warranty",
  },
  {
    title: "Підтримка за 4 год",
    icon: Clock,
    stat: "4h",
    body: "Зламалось не з нашої вини — фіксимо за 4 робочі години.",
    span: "1x1",
    visual: "support",
  },
  {
    title: "Перенесення без SEO-втрат",
    icon: ArrowRightLeft,
    stat: "0 падінь",
    body: "301-redirects, контент, schema.org. 2 тижні без падіння в Google.",
    span: "1x1",
    visual: "mig",
  },
  {
    title: "Все під ключ",
    icon: Layers,
    stat: "100%",
    body: "Тексти + дизайн + код + інтеграції. Без 5 підрядників.",
    span: "2x1",
    visual: "stack",
  },
];

export function Bento({
  eyebrow = "ЧОМУ МИ",
  heading = (
    <>
      Сайт як <em>інструмент</em> бізнесу, не вітрина
    </>
  ),
  cells = DEFAULT_BENTO,
  locale = "uk",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  cells?: BentoCell[];
  locale?: PriceLocale;
} = {}) {
  return (
    <section className="hp-section" id="why-us">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <ScrollReveal className="hp-bento-grid">
          {cells.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className={`hp-bento-cell hp-bento-cell--${c.span}`}
                // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="hp-bento-head">
                  <div className="hp-bento-icon">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  {c.stat ? <span className="hp-bento-stat">{c.stat}</span> : null}
                </div>
                <h3 className="hp-bento-title">{c.title}</h3>
                <div className="hp-bento-body">{typeof c.body === "string" ? <p>{c.body}</p> : c.body}</div>
                {c.visual ? <BentoVisual kind={c.visual} locale={locale} /> : null}
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
