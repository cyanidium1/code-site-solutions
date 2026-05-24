"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";
import { btnClass } from "@/components/ui";

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
    <section className="hp-section" id="process">
      <div className="hp-inner">
        <div className="hp-section-head">
          <div className="hp-eyebrow">
            <span className="hp-eyebrow-dot" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="hp-h2">{heading}</h2>
        </div>
        <div
          ref={wrapRef}
          data-visible={visible ? "true" : "false"}
          className="group/proc relative"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-7 right-7 left-7 z-0 h-px bg-[linear-gradient(90deg,transparent,var(--line-2)_8%,var(--line-2)_92%,transparent)] max-[800px]:hidden"
          >
            <div className="relative h-full w-0 bg-[linear-gradient(90deg,transparent,oklch(from_var(--accent)_l_c_h_/_0.55)_12%,var(--accent)_100%)] [transition:width_3s_cubic-bezier(0.2,0.8,0.2,1)] [will-change:width] group-data-[visible=true]/proc:w-full motion-reduce:w-full motion-reduce:transition-none">
              <span className="absolute top-1/2 -right-3.5 inline-flex h-7 w-7 -translate-y-1/2 rotate-45 items-center justify-center rounded-full border border-[oklch(from_var(--accent)_l_c_h_/_0.5)] bg-bg text-accent-soft opacity-0 [filter:drop-shadow(0_0_14px_oklch(from_var(--accent)_l_c_h_/_0.55))] transition-opacity duration-[600ms] delay-[300ms] group-data-[visible=true]/proc:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none">
                <Rocket size={16} strokeWidth={1.8} />
              </span>
            </div>
          </div>
          <ol className="relative m-0 grid list-none grid-cols-5 items-start gap-6 p-0 max-[800px]:grid-cols-1 max-[800px]:gap-7 max-[800px]:before:absolute max-[800px]:before:top-6 max-[800px]:before:bottom-6 max-[800px]:before:left-6 max-[800px]:before:w-px max-[800px]:before:bg-[linear-gradient(180deg,transparent,oklch(from_var(--accent)_l_c_h_/_0.4)_20%,oklch(from_var(--accent)_l_c_h_/_0.4)_80%,transparent)] max-[800px]:before:content-['']">
            {steps.map((s, i) => (
              <li
                key={s.n}
                // eslint-disable-next-line react/forbid-dom-props -- dynamic stagger-index CSS var
                style={{ "--i": i } as CSSProperties}
                className="relative z-[1] flex min-w-0 translate-y-2.5 flex-col items-center text-center opacity-30 [transition:opacity_0.7s_ease,transform_0.7s_ease] [transition-delay:calc(var(--i,0)*0.15s)] group-data-[visible=true]/proc:translate-y-0 group-data-[visible=true]/proc:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none max-[800px]:grid max-[800px]:grid-cols-[48px_1fr] max-[800px]:gap-x-[18px] max-[800px]:border-none max-[800px]:bg-transparent max-[800px]:p-0"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-sm tracking-[0.06em] text-ink max-[800px]:col-start-1 max-[800px]:row-span-4 max-[800px]:self-start max-[800px]:h-12 max-[800px]:w-12 max-[800px]:border-[oklch(from_var(--accent)_l_c_h_/_0.35)] max-[800px]:text-xs max-[800px]:font-semibold max-[800px]:text-accent-soft max-[800px]:[box-shadow:0_0_0_4px_var(--bg),0_0_24px_oklch(from_var(--accent)_l_c_h_/_0.25)] max-[800px]:relative max-[800px]:z-[1]">
                  {s.n}
                </div>
                <div className="mt-4 whitespace-nowrap font-sans text-lg font-semibold text-ink max-[800px]:col-start-2 max-[800px]:row-start-1 max-[800px]:mt-1.5 max-[800px]:whitespace-normal max-[800px]:text-[17px] max-[800px]:leading-[1.2]">
                  {s.name}
                </div>
                <div className="mt-1 whitespace-nowrap font-mono text-[11px] text-ink-3 max-[800px]:col-start-2 max-[800px]:row-start-2 max-[800px]:whitespace-normal max-[800px]:text-[10.5px] max-[800px]:tracking-[0.1em]">
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
