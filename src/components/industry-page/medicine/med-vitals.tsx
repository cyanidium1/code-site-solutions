import type { Locale } from "@/constants/locales";

import "./medicine.css";

/**
 * A vitals strip between the hero and the demo.
 *
 * The page needed one graphic that could only belong to a medical page, and
 * a quieter bridge out of the hero than "next giant uppercase heading". A
 * lead-II ECG trace does both: it is literally the instrument the audience
 * reads all day, and it carries the technical numbers that the rest of the
 * page argues from.
 *
 * The trace sweeps like a monitor (stroke-dashoffset), which is the one
 * always-on motion on the page besides the hero ticker — the same role the
 * old site gave its marquee. Numbers use --med-signal: they are measurements,
 * not decoration.
 */

const VITALS: Record<
  Locale,
  { label: string; items: { value: string; unit?: string; label: string }[] }
> = {
  uk: {
    label: "ПОКАЗНИКИ САЙТУ, ЯКІ МИ ТРИМАЄМО",
    items: [
      { value: "0,9", unit: "с", label: "до першого екрана" },
      { value: "98", label: "Lighthouse · Performance" },
      { value: "99,9", unit: "%", label: "доступність за рік" },
    ],
  },
  ru: {
    label: "ПОКАЗАТЕЛИ САЙТА, КОТОРЫЕ МЫ ДЕРЖИМ",
    items: [
      { value: "0,9", unit: "с", label: "до первого экрана" },
      { value: "98", label: "Lighthouse · Performance" },
      { value: "99,9", unit: "%", label: "доступность за год" },
    ],
  },
  en: {
    label: "SITE VITALS WE HOLD",
    items: [
      { value: "0.9", unit: "s", label: "to first paint" },
      { value: "98", label: "Lighthouse · Performance" },
      { value: "99.9", unit: "%", label: "uptime over a year" },
    ],
  },
};

/** One lead-II beat, 120 units wide on a 40-unit baseline at y=20. */
const BEAT =
  "h18 q4 -5 8 0 h8 l2 4 l3 -20 l4 26 l3 -10 h10 q8 -9 16 0 h48";

const TRACE = `M0 20 ${Array.from({ length: 8 }, () => BEAT).join(" ")}`;

export function MedVitals({ locale }: { locale: Locale }) {
  const c = VITALS[locale];

  return (
    <section className="med relative overflow-hidden border-y border-line bg-bg px-6 py-6 sm:px-8 lg:px-12">
      <div className="relative mx-auto flex max-w-container flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
          {c.label}
        </span>

        {/* The trace scrolls the way a bedside monitor's does, rather than
            redrawing itself — same always-on register as the hero ticker. */}
        <div
          className="relative order-3 h-[46px] min-w-0 flex-1 overflow-hidden [mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [-webkit-mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] lg:order-none"
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-0 right-0 flex items-center">
            <span className="h-px w-full bg-[oklch(1_0_0_/_0.07)]" />
          </div>
          <div className="med-ecg-track flex h-full w-max">
            {[0, 1].map((rep) => (
              <svg
                key={rep}
                viewBox="0 0 960 40"
                className="h-full w-[960px] shrink-0"
                role="presentation"
              >
                <path
                  d={TRACE}
                  stroke="var(--med-vital)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-6 sm:gap-9">
          {c.items.map((it) => (
            <div key={it.label} className="flex flex-col gap-0.5">
              <span className="font-actay text-[22px] font-bold leading-none tracking-[-0.02em] text-[var(--med-signal)] sm:text-[26px]">
                {it.value}
                {it.unit ? (
                  <span className="ml-0.5 text-[0.55em] font-medium">
                    {it.unit}
                  </span>
                ) : null}
              </span>
              <span className="font-sans text-[11px] leading-[1.3] text-ink-3">
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
