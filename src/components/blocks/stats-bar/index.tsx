import { cn } from "@/lib/shared/cn";

export type StatItem = { value: React.ReactNode; label: string };

export function StatsBar({ items }: { items: StatItem[] }) {
  return (
    <section className="relative px-6 py-8 bg-bg lg:p-12">
      <div className="max-w-container mx-auto">
        <div className="flex flex-wrap items-center gap-3.5 px-[18px] py-4 border border-line rounded-[18px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] lg:flex-nowrap lg:gap-6 lg:px-7 lg:py-5">
          {items.map((it, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 flex flex-col gap-1.5 basis-[calc(50%-7px)] min-w-[120px] lg:basis-auto lg:min-w-0",
                i > 0 &&
                  "lg:border-l lg:border-line lg:pl-6"
              )}
            >
              <span className="font-display font-bold text-[22px] tracking-[-0.03em] leading-none text-ink lg:text-[28px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
                {it.value}
              </span>
              <span className="font-sans text-[9px] text-[var(--ink-3)] uppercase tracking-[0.08em] leading-[1.3] lg:text-[10px]">
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
