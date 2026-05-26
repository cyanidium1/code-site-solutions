"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { btnClass } from "@/components/ui";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass } from "@/components/homepage/shared";

type ProcessStep = {
  n: string;
  name: string;
  duration: string;
  body: string;
};

const DEFAULT_PROCESS: ProcessStep[] = [
  { n: "01", name: "Бриф", duration: "1 день · безкоштовно", body: "Цілі, аудиторія, scope" },
  { n: "02", name: "Дизайн", duration: "1-2 тижні", body: "Wireframes → hi-fi" },
  { n: "03", name: "Розробка", duration: "2-6 тижнів", body: "Custom code, weekly demos" },
  { n: "04", name: "Тестування", duration: "1 тиждень", body: "60-point QA checklist" },
  { n: "05", name: "Запуск + підтримка", duration: "+ 1 рік", body: "Підтримка включена" },
];

export function Process({
  eyebrow = "ПРОЦЕС · 4-10 ТИЖНІВ",
  heading = (
    <>
      Запуск за 5 кроків. <em>Без сюрпризів.</em>
    </>
  ),
  steps = DEFAULT_PROCESS,
  ctaLabel = "Дивитись детальний процес",
  ctaHref = "/process",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
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
        </div>
        <div
          ref={wrapRef}
          data-visible={visible ? "true" : "false"}
          className="group/proc relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-7 right-7 left-7 z-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-line-strong)_8%,var(--color-line-strong)_92%,transparent)] max-lg:hidden"
          >
            <div className="relative h-full w-0 bg-[linear-gradient(90deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.55)_12%,var(--color-accent)_100%)] [transition:width_3s_cubic-bezier(0.2,0.8,0.2,1)] [will-change:width] group-data-[visible=true]/proc:w-full motion-reduce:w-full motion-reduce:transition-none">
              <span className="absolute top-1/2 -right-3.5 inline-flex h-7 w-7 -translate-y-1/2 rotate-45 items-center justify-center rounded-full border border-accent-50 bg-bg text-accent-soft opacity-0 [filter:drop-shadow(0_0_14px_oklch(from_var(--color-accent)_l_c_h_/_0.55))] transition-opacity duration-[600ms] delay-[300ms] group-data-[visible=true]/proc:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none">
                <Rocket size={16} strokeWidth={1.8} />
              </span>
            </div>
          </div>
          <ol className="relative m-0 grid list-none grid-cols-5 items-start gap-6 p-0 max-lg:grid-cols-1 max-lg:gap-7 max-lg:before:absolute max-lg:before:top-6 max-lg:before:bottom-6 max-lg:before:left-6 max-lg:before:w-px max-lg:before:bg-[linear-gradient(180deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.4)_20%,oklch(from_var(--color-accent)_l_c_h_/_0.4)_80%,transparent)] max-lg:before:content-['']">
            {steps.map((s, i) => (
              <li
                key={s.n}
                // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                style={{ "--i": i } as CSSProperties}
                className="relative z-[1] flex min-w-0 translate-y-2.5 flex-col items-center text-center opacity-30 [transition:opacity_0.7s_ease,transform_0.7s_ease] [transition-delay:calc(var(--i,0)*0.15s)] group-data-[visible=true]/proc:translate-y-0 group-data-[visible=true]/proc:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none max-lg:grid max-lg:grid-cols-[48px_1fr] max-lg:gap-x-[18px] max-lg:border-none max-lg:bg-transparent max-lg:p-0"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-sm tracking-[0.06em] text-ink max-lg:col-start-1 max-lg:row-span-4 max-lg:self-start max-lg:h-12 max-lg:w-12 max-lg:border-accent-35 max-lg:text-xs max-lg:font-semibold max-lg:text-accent-soft max-lg:[box-shadow:0_0_0_4px_var(--color-bg),0_0_24px_oklch(from_var(--color-accent)_l_c_h_/_0.25)] max-lg:relative max-lg:z-[1]">
                  {s.n}
                </div>
                <div className="mt-4 whitespace-nowrap font-sans text-lg font-semibold text-ink max-lg:col-start-2 max-lg:row-start-1 max-lg:mt-1.5 max-lg:whitespace-normal max-lg:text-[17px] max-lg:leading-[1.2]">
                  {s.name}
                </div>
                <div className="mt-1 whitespace-nowrap font-mono text-[11px] text-ink-3 max-lg:col-start-2 max-lg:row-start-2 max-lg:whitespace-normal max-lg:text-[10.5px] max-lg:tracking-[0.1em]">
                  {s.duration}
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Link href={ctaHref} className={btnClass("primary", "hp-section-cta")}>
          <span>{ctaLabel}</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}
