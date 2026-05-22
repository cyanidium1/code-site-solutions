import { cn } from "@/lib/shared/cn";

export type StatItem = { value: React.ReactNode; label: string };

export function StatsBar({ items }: { items: StatItem[] }) {
  return (
    <section className="relative p-12 bg-bg max-[800px]:px-6 max-[800px]:py-8">
      <div className="max-w-container mx-auto">
        <div className="flex items-center gap-6 px-7 py-5 border border-line rounded-[18px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] max-[800px]:flex-wrap max-[800px]:gap-3.5 max-[800px]:px-[18px] max-[800px]:py-4">
          {items.map((it, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 flex flex-col gap-1.5 max-[800px]:basis-[calc(50%-7px)] max-[800px]:min-w-[120px]",
                i > 0 &&
                  "border-l border-line pl-6 max-[800px]:border-l-0 max-[800px]:pl-0"
              )}
            >
              <span className="font-display font-bold text-[28px] tracking-[-0.03em] leading-none text-ink max-[800px]:text-[22px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
                {it.value}
              </span>
              <span className="font-sans text-[10px] text-[var(--ink-3)] uppercase tracking-[0.08em] leading-[1.3] max-[800px]:text-[9px]">
                {it.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
