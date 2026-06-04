"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Workflow,
  LayoutTemplate,
  ShieldCheck,
  Rocket,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { btnClass, cn } from "@/components/ui";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";

type ProcessStep = {
  n: string;
  name: string;
  duration: string;
  items: string[];
};

// Supporting icons are tied to the step position (the system is a fixed
// 5-stage pipeline), so callers only supply copy — no icon imports needed.
const STEP_ICONS: LucideIcon[] = [Search, Workflow, LayoutTemplate, ShieldCheck, Rocket];

const DEFAULT_PROCESS: ProcessStep[] = [
  { n: "01", name: "Бриф", duration: "1 день", items: ["Бізнес-цілі", "Структура", "Аналіз конкурентів"] },
  { n: "02", name: "Архітектура", duration: "1–2 тижні", items: ["Сторінки", "Воронки", "SEO-структура"] },
  { n: "03", name: "Дизайн і розробка", duration: "2–6 тижнів", items: ["UI-дизайн", "Налаштування CMS", "Інтеграції"] },
  { n: "04", name: "Тестування", duration: "~1 тиждень", items: ["Тестування", "Аналітика", "Redirects"] },
  { n: "05", name: "Запуск і підтримка", duration: "Підтримка 1 рік", items: ["Моніторинг", "Гарантія", "Розвиток"] },
];

// Progressive accent on the step circles — intensity climbs left→right so the
// eye feels movement through the system; the final (launch) step is handled
// separately with a solid gradient fill for the strongest emphasis.
const RING = [
  "[border-color:oklch(from_var(--color-accent)_l_c_h_/_0.16)]",
  "[border-color:oklch(from_var(--color-accent)_l_c_h_/_0.26)] [box-shadow:0_0_10px_oklch(from_var(--color-accent)_l_c_h_/_0.10)]",
  "[border-color:oklch(from_var(--color-accent)_l_c_h_/_0.38)] [box-shadow:0_0_15px_oklch(from_var(--color-accent)_l_c_h_/_0.16)]",
  "[border-color:oklch(from_var(--color-accent)_l_c_h_/_0.5)] [box-shadow:0_0_20px_oklch(from_var(--color-accent)_l_c_h_/_0.24)]",
];

export function Process({
  eyebrow = "ПРОЦЕС · 4-10 ТИЖНІВ",
  heading = (
    <>
      Будуємо. Запускаємо. Ростемо.
      <br />
      <em>Без шести місяців нарад.</em>
    </>
  ),
  sub = (
    <>
      Фіксований обсяг. Фіксований термін. Фіксована ціна.{" "}
      <span className="text-ink-3">Без нескінченних дзвінків, хаосу і підрядників, що зникають.</span>
    </>
  ),
  steps = DEFAULT_PROCESS,
  ctaLabel = "Детальний процес",
  ctaHref = "/process",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  steps?: ProcessStep[];
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      // threshold 0.15 (was 0.35) — trigger sooner so steps reveal as
      // the section enters the viewport, not when it's nearly centered.
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={hpSectionClass} id="process">
      <div className={hpInnerClass}>
        <div className={hpSectionHeadClass}>
          <div className={hpEyebrowClass}>
            <span className={hpEyebrowDotClass} />
            <span>{eyebrow}</span>
          </div>
          <h2 className={hpH2Class}>{heading}</h2>
          {sub ? <p className={cn(hpSubClass, "max-w-[600px]")}>{sub}</p> : null}
        </div>
        <div
          ref={wrapRef}
          data-visible={visible ? "true" : "false"}
          className="group/proc relative mb-[30px]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-7 right-7 left-7 z-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-line-strong)_8%,var(--color-line-strong)_92%,transparent)] hidden lg:block"
          >
            <div className="relative h-full w-0 bg-[linear-gradient(90deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.55)_12%,var(--color-accent)_100%)] [transition:width_3s_cubic-bezier(0.2,0.8,0.2,1)] [will-change:width] group-data-[visible=true]/proc:w-full motion-reduce:w-full motion-reduce:transition-none">
              <span className="absolute top-1/2 -right-3.5 inline-flex h-7 w-7 -translate-y-1/2 rotate-45 items-center justify-center rounded-full border border-accent-50 bg-bg text-accent-soft opacity-0 [filter:drop-shadow(0_0_14px_oklch(from_var(--color-accent)_l_c_h_/_0.55))] transition-opacity duration-[600ms] delay-[300ms] group-data-[visible=true]/proc:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none">
                <Rocket size={16} strokeWidth={1.8} />
              </span>
            </div>
          </div>
          <ol className="relative m-0 grid list-none grid-cols-1 items-start gap-8 p-0 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-px before:bg-[linear-gradient(180deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.4)_15%,oklch(from_var(--color-accent)_l_c_h_/_0.4)_85%,transparent)] before:content-[''] lg:grid-cols-5 lg:gap-6 lg:before:content-none">
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              const StepIcon = STEP_ICONS[Math.min(i, STEP_ICONS.length - 1)];
              return (
                <li
                  key={s.n}
                  // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                  style={{ "--i": i } as CSSProperties}
                  className="relative z-[1] grid min-w-0 translate-y-2.5 grid-cols-[48px_1fr] items-start gap-x-[18px] text-left opacity-30 [transition:opacity_0.7s_ease,transform_0.7s_ease] [transition-delay:calc(var(--i,0)*0.15s)] group-data-[visible=true]/proc:translate-y-0 group-data-[visible=true]/proc:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none lg:flex lg:flex-col lg:items-center lg:text-center"
                >
                  <div
                    className={cn(
                      "inline-flex col-start-1 row-span-3 h-12 w-12 self-start items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-xs tracking-[0.06em] text-ink lg:col-auto lg:row-auto lg:h-14 lg:w-14 lg:self-auto lg:text-sm",
                      !isLast && RING[Math.min(i, RING.length - 1)],
                      !isLast && "font-semibold text-accent-soft [border-color:oklch(from_var(--color-accent)_l_c_h_/_0.35)] [box-shadow:0_0_0_4px_var(--color-bg)] lg:font-normal lg:text-ink lg:[box-shadow:none]",
                      isLast &&
                        "border-transparent bg-brand-gradient font-semibold text-bg [box-shadow:0_0_0_4px_var(--color-bg),0_0_24px_oklch(from_var(--color-accent)_l_c_h_/_0.45)] lg:[box-shadow:0_0_30px_oklch(from_var(--color-accent)_l_c_h_/_0.5)]",
                    )}
                  >
                    {s.n}
                  </div>

                  {/* directional indicator between steps (desktop only) */}
                  {!isLast ? (
                    <ChevronRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={2}
                      className="absolute top-7 right-0 z-[2] -translate-y-1/2 translate-x-1/2 text-accent-soft opacity-30 hidden lg:block"
                    />
                  ) : null}

                  <div className="col-start-2 row-start-1 row-span-3 mt-0 flex flex-col items-start lg:mt-4 lg:items-center">
                    <div className="font-sans text-[17px] leading-[1.2] font-semibold text-ink lg:text-lg lg:leading-7">
                      {s.name}
                    </div>

                    <ul className="mt-2 flex list-none flex-col items-start gap-1 p-0 lg:mt-2.5 lg:items-stretch">
                      {s.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-center gap-1.5 font-mono text-[11px] leading-[1.3] text-ink-dim"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[oklch(from_var(--color-accent)_l_c_h_/_0.55)]" />
                          {it}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.04em] text-ink-3">
                      <StepIcon size={12} strokeWidth={1.8} className="text-accent-soft" />
                      {s.duration}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="flex justify-start">
          <Link
            href={ctaHref}
            className={btnClass("ghost", "min-h-0 gap-2 px-4 py-2.5 text-[12px] tracking-[0.02em]")}
          >
            <span>{ctaLabel}</span>
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
