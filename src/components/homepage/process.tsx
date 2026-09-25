"use client";

import { useEffect, useRef, useState } from "react";
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
import { cn } from "@/components/ui";
import { hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass, hpSubClass} from "@/components/homepage/shared";
import { PhoneMore } from "@/components/shared/phone-more";

/* 2026 redesign restyle (Figma «код сайт арт» #1729:2937 + CTA #1729:3085;
   audit: docs/home-process-figma-audit.md). The step grid, timeline, chevrons,
   bullets and all copy already matched — see the audit for the exact list. */

// CTA — Figma #1729:3085: 52px pill, white-14% border, Manrope Medium 14/20
// tracking 0.28, plus Effect(type: GLASS, radius: 22) which the code export
// drops (docs/glass-ui-patterns.md). Mobile blur cap per the blur policy.
const PROCESS_CTA_CLASS =
  "inline-flex h-[52px] items-center gap-2 rounded-full border border-line-strong px-6 " +
  "font-sans text-[14px] font-medium leading-5 tracking-[0.28px] text-ink no-underline " +
  "backdrop-blur-[12px] lg:backdrop-blur-[22px] " +
  "transition-colors duration-200 hover:bg-[oklch(1_0_0/0.04)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2";

type ProcessStep = {
  n: string;
  name: string;
  duration: string;
  items: string[];
};

// Supporting icons are tied to the step position (the system is a fixed
// 5-stage pipeline), so callers only supply copy — no icon imports needed.
const STEP_ICONS: LucideIcon[] = [Search, Workflow, LayoutTemplate, ShieldCheck, Rocket];
// Four-step (day-based) pipeline: brief → design → build → launch.
const STEP_ICONS_4: LucideIcon[] = [Search, LayoutTemplate, Workflow, Rocket];
const GRID_COLS: Record<number, string> = { 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };


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
      <span className="text-ink-3">Ви заздалегідь знаєте, що отримаєте, коли і за скільки.</span>
    </>
  ),
  steps,
  ctaLabel = "Детальний процес",
  ctaHref = "/process",
  moreLabel = "Що входить у кожен етап",
  note,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  /** Day-based steps from the page content (terms come from the pricing config). */
  steps: ProcessStep[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Phone toggle that opens the per-step tags. */
  moreLabel?: string;
  /** Second timeline line under the steps (e.g. the shop's longer term). */
  note?: React.ReactNode;
}) {
  const icons = steps.length === 4 ? STEP_ICONS_4 : STEP_ICONS;
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
          {/* Figma #1729:2945: the second line is one 1105px run that deliberately
              overflows its 880px box — hpH2Class caps at max-w-container-narrow
              (880), which wrapped EN onto a third line. EN line 2 measures 1117px at
              56px, so 1180 leaves headroom without reaching the 1344 content box. */}
          <h2 className={cn(hpH2Class, "xl:max-w-[1180px]")}>{heading}</h2>
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
            {/* The one moment on this section: the line fills brief → launch
                once, when the timeline enters the viewport — it shows that the
                steps are one sequence. Transform, not width (no layout work). */}
            <div className="h-full w-full origin-left scale-x-0 bg-[linear-gradient(90deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.55)_12%,var(--color-accent)_100%)] [transition:transform_1.6s_cubic-bezier(0.2,0.8,0.2,1)] group-data-[visible=true]/proc:scale-x-100 motion-reduce:scale-x-100 motion-reduce:transition-none" />
            <span className="absolute top-1/2 -right-5 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-accent-50 bg-surface text-accent-soft">
              <Rocket size={16} strokeWidth={1.8} />
            </span>
          </div>
          <PhoneMore label={moreLabel}>
          <ol className={`relative m-0 grid list-none grid-cols-1 items-start gap-4 p-0 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-px before:bg-[linear-gradient(180deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.4)_15%,oklch(from_var(--color-accent)_l_c_h_/_0.4)_85%,transparent)] before:content-[''] lg:gap-6 lg:before:content-none ${GRID_COLS[steps.length] ?? "lg:grid-cols-5"}`}>
            {steps.map((s, i) => {
              const isLast = i === steps.length - 1;
              const StepIcon = icons[Math.min(i, icons.length - 1)];
              return (
                <li
                  key={s.n}
                  className="relative z-[1] grid min-w-0 grid-cols-[48px_1fr] items-start gap-x-[18px] text-left lg:flex lg:flex-col lg:items-center lg:text-center"
                >
                  <div
                    className={cn(
                      "inline-flex col-start-1 row-span-3 h-12 w-12 self-center lg:self-start items-center justify-center rounded-full border border-line-strong bg-surface font-mono text-xs tracking-[0.06em] text-ink lg:col-auto lg:row-auto lg:h-14 lg:w-14 lg:self-auto lg:text-sm",
                      !isLast && RING[Math.min(i, RING.length - 1)],
                      !isLast && "font-semibold text-accent-soft [border-color:oklch(from_var(--color-accent)_l_c_h_/_0.35)] [box-shadow:0_0_0_4px_var(--color-bg)] lg:font-normal lg:text-ink lg:[box-shadow:none]",
                      isLast &&
                        "border-transparent bg-accent font-semibold text-ink [box-shadow:0_0_0_4px_var(--color-bg)] lg:[box-shadow:none]",
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

                    <ul className="pm-extra mt-2 flex list-none flex-col items-start gap-1 p-0 lg:mt-2.5 lg:items-stretch">
                      {s.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-center gap-1.5 font-mono text-[12px] leading-[1.3] text-ink-dim"
                        >
                          <span className="h-1 w-1 shrink-0 rounded-full bg-[oklch(from_var(--color-accent)_l_c_h_/_0.55)]" />
                          {it}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-1.5 lg:mt-3 inline-flex h-[25.75px] items-center gap-1.5 rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] px-2.5 font-mono text-[12px] tracking-[0.04em] text-ink-3">
                      <StepIcon size={12} strokeWidth={1.8} className="text-accent-soft" />
                      {s.duration}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          </PhoneMore>
        </div>
        {note ? (
          <p className="mt-0 mb-[30px] rounded-card border border-line bg-[oklch(1_0_0_/_0.02)] px-4 py-3 font-mono text-[12px] leading-[1.6] text-ink-dim sm:px-5 sm:text-[12.5px]">
            {note}
          </p>
        ) : null}
        {/* CTA row. */}
        <div className="flex items-center justify-between gap-8">
          <Link href={ctaHref} className={PROCESS_CTA_CLASS}>
            <span>{ctaLabel}</span>
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
