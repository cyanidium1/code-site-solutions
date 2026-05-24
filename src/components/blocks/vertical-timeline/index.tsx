import { cn } from "@/lib/shared/cn";

export type TimelineColumn = {
  heading: string;
  items: React.ReactNode[];
};

export type TimelineStep = {
  n: string;
  title: string;
  duration: string;
  body: React.ReactNode;
  weDo: TimelineColumn;
  youDo: TimelineColumn;
  deliverable: TimelineColumn;
};

const CHECK = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 12l5 5L20 6"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function MarkerCircle({ n, size = "lg" }: { n: string; size?: "lg" | "sm" }) {
  const sz =
    size === "lg"
      ? "w-14 h-14 text-[14px]"
      : "w-10 h-10 text-[12px]";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[oklch(from_var(--accent)_l_c_h_/_0.4)] bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] text-accent-soft font-mono font-semibold tracking-[0.04em]",
        sz,
      )}
    >
      {n}
    </span>
  );
}

function ColumnList({ col }: { col: TimelineColumn }) {
  return (
    <div className="flex flex-col">
      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--ink-3)] mb-3.5">
        {col.heading}
      </div>
      <ul className="flex flex-col gap-2.5">
        {col.items.map((it, i) => (
          <li
            key={i}
            className="flex gap-2.5 items-start font-sans text-[13.5px] leading-[1.5] text-[var(--ink-2)]"
          >
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 rounded-full mt-px bg-[oklch(from_var(--accent)_l_c_h_/_0.15)] text-accent-soft">
              {CHECK}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VerticalTimeline({
  eyebrow,
  heading,
  sub,
  steps,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  steps: TimelineStep[];
}) {
  return (
    <section className="relative py-14 lg:py-[100px] px-12 bg-bg max-[800px]:px-6">
      <div className="max-w-container mx-auto">
        {(eyebrow || heading || sub) && (
          <div className="mb-14 max-w-[820px] max-[800px]:mb-9">
            {eyebrow ? (
              <span className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)] mb-6">
                {eyebrow}
              </span>
            ) : null}
            {heading ? (
              <h2 className="font-display font-bold text-[clamp(28px,3.4vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent max-[800px]:text-[clamp(24px,6vw,34px)]">
                {heading}
              </h2>
            ) : null}
            {sub ? (
              <p className="mt-5 font-sans text-[16px] leading-[1.6] text-[var(--ink-2)] max-w-[680px] max-[800px]:text-[14.5px]">
                {sub}
              </p>
            ) : null}
          </div>
        )}

        <ol className="flex flex-col">
          {steps.map((s, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li
                key={s.n}
                className="grid grid-cols-[56px_1fr] gap-x-7 max-[800px]:grid-cols-1 max-[800px]:gap-x-0"
              >
                {/* Desktop marker column with continuous line */}
                <div className="flex flex-col items-center max-[800px]:hidden">
                  <MarkerCircle n={s.n} />
                  {!isLast ? (
                    <div className="flex-1 w-px bg-line min-h-[40px] mt-2" />
                  ) : null}
                </div>

                {/* Content */}
                <div className={cn("pt-1", isLast ? "pb-0" : "pb-14 max-[800px]:pb-10")}>
                  {/* Heading row */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Mobile inline marker */}
                    <span className="hidden max-[800px]:inline-flex">
                      <MarkerCircle n={s.n} size="sm" />
                    </span>
                    <h3 className="font-display font-bold text-[clamp(20px,2.2vw,26px)] leading-[1.2] tracking-[-0.01em] text-ink m-0 [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
                      {s.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-1 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[10.5px] tracking-[0.08em] uppercase text-[var(--ink-3)]">
                      {s.duration}
                    </span>
                  </div>

                  <p className="font-sans text-[15px] leading-[1.6] text-[var(--ink-2)] max-w-[760px] mb-7 max-[800px]:text-[14px] [&_em]:italic [&_em]:text-ink">
                    {s.body}
                  </p>

                  <div className="grid grid-cols-3 gap-7 px-6 py-7 border border-line rounded-[18px] bg-[oklch(1_0_0_/_0.02)] max-[1080px]:grid-cols-2 max-[1080px]:gap-6 max-[700px]:grid-cols-1 max-[700px]:gap-5 max-[800px]:px-5 max-[800px]:py-6 max-[800px]:rounded-2xl">
                    <ColumnList col={s.weDo} />
                    <ColumnList col={s.youDo} />
                    <ColumnList col={s.deliverable} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
