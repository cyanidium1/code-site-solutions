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
import { cn } from "@/components/ui";
import { ScrollReveal } from "./scroll-reveal";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

// Shared sub-visual wrapper class — every visual sits below its cell's
// title/body and gets the same top margin.
const VIS_CLASS = "mt-4";

function LighthouseVisual() {
  return (
    <div className="mt-4 flex min-h-0 flex-1 items-center justify-center">
      <div className="relative h-[110px] w-[110px] shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
          <strong className="text-[32px] font-extrabold text-ink">98</strong>
          <small className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-3">
            score
          </small>
        </div>
      </div>
    </div>
  );
}

function MigrationVisual() {
  const pillBase =
    "inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border px-3 py-2 font-mono text-[11px]";
  return (
    <div className="mt-[18px] flex flex-nowrap items-center gap-2">
      <div
        className={cn(
          pillBase,
          "border-line bg-[oklch(1_0_0_/_0.03)] text-ink-dim [&_strong]:text-[oklch(0.65_0.18_25)]",
        )}
      >
        WP <strong>4.2s</strong>
      </div>
      <span className="shrink-0 font-mono text-ink-3">→</span>
      <div
        className={cn(
          pillBase,
          "border-[oklch(0.55_0.16_145_/_0.3)] bg-[oklch(0.55_0.16_145_/_0.06)] text-[oklch(0.78_0.12_145)] [&_strong]:text-[oklch(0.75_0.14_145)]",
        )}
      >
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
    <div className={cn(VIS_CLASS, "flex flex-col gap-1.5")} aria-hidden="true">
      {layers.map((l) => (
        <div
          key={l}
          className="flex items-center gap-2.5 border-b border-dashed border-[oklch(1_0_0_/_0.06)] py-1.5 last:border-b-0"
        >
          <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-accent-30 bg-[oklch(from_var(--color-accent)_l_c_h_/_0.14)] text-accent-soft">
            <Check size={11} strokeWidth={2.4} />
          </span>
          <span className="font-mono text-[11.5px] tracking-[0.04em] text-ink-dim">{l}</span>
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
    <div
      className={cn(VIS_CLASS, "flex flex-col gap-1.5 font-mono text-[11.5px] leading-[1.4] text-ink-dim")}
      aria-hidden="true"
    >
      {rows.map((r) => (
        <div
          key={r.msg}
          className="flex items-baseline gap-2 rounded-lg border border-[oklch(1_0_0_/_0.05)] bg-[oklch(1_0_0_/_0.025)] px-2.5 py-[5px]"
        >
          <span className="font-semibold text-[oklch(0.78_0.16_145)]">feat:</span>
          <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-ink-dim">
            {r.msg}
          </span>
          <span
            className={cn(
              "ml-auto text-[10.5px] text-ink-3",
              r.accent && "font-semibold text-[oklch(from_var(--color-accent)_0.85_0.18_h)]",
            )}
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
    <div
      className={cn(VIS_CLASS, "flex flex-col gap-1.5 font-mono text-[11.5px] text-ink-dim")}
      aria-hidden="true"
    >
      {steps.map((s) => (
        <div
          key={s.name}
          className="grid grid-cols-[60px_1fr_36px] items-center gap-2.5 border-b border-dashed border-[oklch(1_0_0_/_0.06)] px-0.5 py-1 last:border-b-0"
        >
          <span className="text-ink-dim">{s.name}</span>
          <span
            className={cn(
              "h-1.5 rounded-full bg-[oklch(1_0_0_/_0.08)]",
              s.target &&
                "bg-[linear-gradient(90deg,oklch(0.7_0.16_145),oklch(0.55_0.18_295))] [box-shadow:0_0_12px_oklch(0.6_0.18_270_/_0.35)]",
            )}
          />
          <span
            className={cn(
              "text-right text-[10.5px] tracking-[0.04em] text-ink-3",
              s.target && "font-semibold text-[oklch(0.85_0.10_295)]",
            )}
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
    <div
      className={cn(VIS_CLASS, "flex flex-col gap-1 font-mono text-[12px] text-ink-dim")}
      aria-hidden="true"
    >
      {rows.map((r) => (
        <div
          key={r.name}
          className="flex items-baseline gap-2 border-b border-dashed border-[oklch(1_0_0_/_0.06)] px-0.5 py-[5px] last:border-b-0"
        >
          <span className="text-ink-dim">{r.name}</span>
          <span className="h-px flex-1 self-center border-b border-dotted border-[oklch(1_0_0_/_0.12)]" />
          <span
            className={cn(
              "font-semibold text-ink [font-feature-settings:'tnum'_1]",
              r.accent && "text-[oklch(from_var(--color-accent)_0.88_0.16_h)]",
            )}
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
    <div className={cn(VIS_CLASS, "flex flex-col gap-3.5")} aria-hidden="true">
      <div className="relative">
        <div className="absolute top-1.5 right-1.5 left-1.5 h-px bg-[linear-gradient(90deg,oklch(1_0_0_/_0.06),oklch(from_var(--color-accent)_l_c_h_/_0.35)_50%,oklch(1_0_0_/_0.06))]" />
        <div className="relative grid grid-cols-3">
          {points.map((p, idx) => (
            <div
              key={p.label}
              className={cn(
                "flex flex-col items-center gap-2",
                idx === 0 && "items-start",
                idx === points.length - 1 && "items-end",
              )}
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full border-2 border-[oklch(0.18_0_0)] bg-[oklch(1_0_0_/_0.10)] [box-shadow:0_0_0_1px_oklch(1_0_0_/_0.18)]",
                  p.mid &&
                    "bg-[oklch(0.78_0.16_145)] [box-shadow:0_0_0_1px_oklch(0.78_0.16_145_/_0.5),0_0_10px_oklch(0.78_0.16_145_/_0.4)]",
                  p.end &&
                    "bg-[linear-gradient(135deg,oklch(0.7_0.16_145),oklch(0.55_0.18_295))] [box-shadow:0_0_0_1px_oklch(0.6_0.18_270_/_0.5),0_0_10px_oklch(0.6_0.18_270_/_0.45)]",
                )}
              />
              <span
                className={cn(
                  "font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-3",
                  p.end && "text-[oklch(0.85_0.10_295)]",
                )}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2.5 rounded-[10px] border border-[oklch(1_0_0_/_0.06)] bg-[oklch(1_0_0_/_0.025)] px-3 py-2 font-mono text-[11px] tracking-[0.04em]">
        <span className="text-ink-3">{footL}</span>
        <span className="font-semibold text-ink-3">→</span>
        <span className="font-bold text-[oklch(0.78_0.18_25)] [font-feature-settings:'tnum'_1]">−30%</span>
      </div>
    </div>
  );
}

function SupportTimerVisual({ locale }: { locale: PriceLocale }) {
  const sub = locale === "en" ? "business-hour SLA" : "робочих годин SLA";
  const segBase =
    "rounded-[10px] border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.04)] px-2.5 py-1 [font-feature-settings:'tnum'_1]";
  return (
    <div className={cn(VIS_CLASS, "flex flex-col items-center gap-2.5")} aria-hidden="true">
      <div className="flex items-baseline justify-center gap-1 font-mono text-[32px] font-bold tracking-[0.04em] text-ink-dim">
        <span className={segBase}>00</span>
        <span className="font-normal text-ink-3">:</span>
        <span
          className={cn(
            segBase,
            "border-accent-40 bg-accent-12 text-ink [box-shadow:0_0_16px_oklch(from_var(--color-accent)_l_c_h_/_0.25)]",
          )}
        >
          04
        </span>
        <span className="font-normal text-ink-3">:</span>
        <span className={segBase}>00</span>
      </div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3">{sub}</div>
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

// Cell base — every span variant gets the same border/background/transition.
// Padding lives per-span (in `spanClass`/`mobile1x1`) so each variant can set
// its own mobile padding without colliding with a base `p-7`.
const cellBase =
  "group/bento-cell relative flex flex-col overflow-hidden rounded-[22px] border border-line " +
  "[background:radial-gradient(220px_140px_at_0%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),oklch(1_0_0_/_0.02)] " +
  // Per-cell stacking context above any decoration painted inside the section.
  "z-[1] " +
  // entrance: blurred + offset until grid reaches viewport, then settle.
  "opacity-0 translate-y-6 scale-[0.97] blur-[6px] " +
  "[transition:opacity_0.85s_cubic-bezier(0.2,0.8,0.2,1),transform_0.85s_cubic-bezier(0.2,0.8,0.2,1),filter_0.85s_cubic-bezier(0.2,0.8,0.2,1)] " +
  "[transition-delay:calc(var(--i,0)*0.09s)] " +
  "group-data-[visible=true]/bento-reveal:opacity-100 group-data-[visible=true]/bento-reveal:translate-y-0 group-data-[visible=true]/bento-reveal:scale-100 group-data-[visible=true]/bento-reveal:blur-none " +
  "motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none " +
  // ::before top accent line that fades in after the entrance settles
  "before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.45),transparent)] before:opacity-0 before:transition-opacity before:duration-[600ms] before:[transition-delay:calc(var(--i,0)*0.09s+0.4s)] " +
  "group-data-[visible=true]/bento-reveal:before:opacity-100 motion-reduce:before:opacity-100 motion-reduce:before:transition-none";

// Mobile-first: at base every cell stacks in the parent's single column.
// At lg+ the parent grid becomes multi-column and span values take effect.
const spanClass: Record<BentoCell["span"], string> = {
  "1x1": "lg:p-7",
  "2x1": "p-7 lg:col-span-2",
  "2x2": "p-6 lg:col-span-2 lg:row-span-2 lg:p-7",
  "3x1": "p-[22px] lg:col-span-3 lg:p-7",
};

// 1x1 cells use a compact icon+text two-column grid at mobile, then
// revert to the standard flex-col stacked layout at lg+.
const mobile1x1 =
  "grid grid-cols-[auto_1fr] gap-x-[14px] gap-y-0.5 p-[18px_20px] before:inset-x-[18px] " +
  "lg:flex lg:gap-0 lg:before:inset-x-6";

// When the consumer paints a `decoration` behind the cells, the default
// near-transparent cell bg lets the decoration bleed through the cards. This
// variant swaps the bg layer for an opaque page-bg fill so the decoration
// only shows in the gaps between cells (and around the grid).
const cellOpaque =
  "[background:radial-gradient(220px_140px_at_0%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),var(--color-bg)]";

export function Bento({
  eyebrow = "ЧОМУ МИ",
  heading = (
    <>
      Сайт як <em>інструмент</em> бізнесу, не вітрина
    </>
  ),
  cells = DEFAULT_BENTO,
  locale = "uk",
  decoration,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  cells?: BentoCell[];
  locale?: PriceLocale;
  /**
   * Optional absolutely-positioned visual painted behind the cells, inside the
   * bento section. Used by the About page to drop the CS logo / a screenshot
   * mockup into the empty 4th column slot at xl+ widths. Render via positioned
   * children — Bento provides only the stacking context.
   */
  decoration?: React.ReactNode;
} = {}) {
  return (
    <section className={hpSectionClass} id="why-us">
      <div className={cn(hpInnerClass, "relative")}>
        {decoration}
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <ScrollReveal className="group/bento-reveal grid grid-cols-1 gap-4 [grid-auto-rows:auto] lg:grid-cols-2 lg:[grid-auto-rows:minmax(280px,auto)] xl:grid-cols-4">
          {cells.map((c, i) => {
            const Icon = c.icon;
            const isOneByOne = c.span === "1x1";
            return (
              <div
                key={i}
                className={cn(
                  cellBase,
                  spanClass[c.span],
                  isOneByOne && mobile1x1,
                  decoration && cellOpaque,
                )}
                // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                style={{ "--i": i } as React.CSSProperties}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isOneByOne &&
                      "col-start-1 row-span-2 self-start lg:col-auto lg:row-auto lg:self-auto",
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex items-center justify-center rounded-[10px]",
                      isOneByOne
                        ? "h-9 w-9 border border-accent-30 bg-accent-10 text-accent-soft lg:h-10 lg:w-10 lg:border-line lg:bg-[oklch(1_0_0_/_0.04)] lg:text-ink"
                        : "h-10 w-10 border border-line bg-[oklch(1_0_0_/_0.04)] text-ink",
                    )}
                  >
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  {c.stat ? (
                    <span
                      className={cn(
                        "whitespace-nowrap rounded-full border border-accent-40 bg-accent-10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[oklch(from_var(--color-accent)_0.92_0.12_h)]",
                        isOneByOne
                          ? "col-start-2 row-start-3 ml-0 self-start pt-1.5 lg:col-auto lg:row-auto lg:ml-auto lg:self-auto lg:pt-0"
                          : "ml-auto",
                      )}
                    >
                      {c.stat}
                    </span>
                  ) : null}
                </div>
                <h3
                  className={cn(
                    "relative font-sans font-semibold leading-[1.25] text-ink [text-wrap:balance] [word-break:keep-all] [hyphens:manual]",
                    isOneByOne
                      ? "col-start-2 row-start-1 mt-0 text-base tracking-[-0.01em] lg:col-auto lg:row-auto lg:mt-[18px] lg:text-[19px] lg:tracking-normal"
                      : "mt-[18px] text-[19px]",
                    c.span === "2x2" && "text-[28px]",
                  )}
                >
                  {c.title}
                </h3>
                <div
                  className={cn(
                    "relative text-ink-dim [text-wrap:pretty] [&_p]:m-0 [&_p:last-child]:mb-0 [&_p_strong]:font-semibold [&_p_strong]:text-ink [&_strong]:font-semibold [&_strong]:text-ink",
                    isOneByOne
                      ? "col-start-2 row-start-2 mt-1 text-[13px] leading-[1.5] [&_p]:mb-1.5 lg:col-auto lg:row-auto lg:mt-2 lg:text-[13.5px] lg:leading-[1.55] [&_p]:lg:mb-2"
                      : "mt-2 text-[13.5px] leading-[1.55] [&_p]:mb-2",
                    c.span === "2x2" && "text-[15px]",
                  )}
                >
                  {typeof c.body === "string" ? <p>{c.body}</p> : c.body}
                </div>
                {c.visual ? (
                  <div
                    className={cn(
                      isOneByOne &&
                        "col-span-2 row-start-4 mt-1 pt-2 lg:col-auto lg:row-auto lg:mt-0 lg:pt-0",
                    )}
                  >
                    <BentoVisual kind={c.visual} locale={locale} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
