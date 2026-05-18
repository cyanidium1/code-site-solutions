"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

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
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
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
          className={`hp-process-track${visible ? " is-visible" : ""}`}
        >
          <div className="hp-process-line-track" aria-hidden="true">
            <div className="hp-process-line">
              <span className="hp-process-rocket">
                <Rocket size={16} strokeWidth={1.8} />
              </span>
            </div>
          </div>
          <ol className="hp-process-list hp-process-list--compact">
            {steps.map((s, i) => (
              <li
                className="hp-process-step"
                key={s.n}
                style={{ ["--i" as string]: i }}
              >
                <div className="hp-process-num">{s.n}</div>
                <div className="hp-process-name">{s.name}</div>
                <div className="hp-process-duration">{s.duration}</div>
              </li>
            ))}
          </ol>
        </div>
        <Link href={ctaHref} className="hp-link">
          {ctaLabel}
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}
