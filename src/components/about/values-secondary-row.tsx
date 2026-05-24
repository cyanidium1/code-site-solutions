/**
 * About-page secondary values row. Shown beneath the primary Bento of
 * top-3 values; collapses 3-col → 2-col → 1-col via the
 * `.about-values-secondary` rule in globals.css (Phase 1 keeps that legacy
 * className; Phase 2 will replace it with mobile-first Tailwind utilities).
 *
 * Used by both src/app/about/page.tsx (UK) and src/app/en/about/page.tsx (EN).
 */
import type { BentoCell } from "@/types/homepage";

interface ValuesSecondaryRowProps {
  cells: BentoCell[];
  ariaLabel: string;
}

export function ValuesSecondaryRow({ cells, ariaLabel }: ValuesSecondaryRowProps) {
  return (
    <section className="bg-bg px-12 pb-16" aria-label={ariaLabel}>
      <div className="about-values-secondary mx-auto grid max-w-container grid-cols-3 gap-3">
        {cells.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="about-values-secondary-card flex items-start gap-3.5 rounded-[14px] border border-line bg-[oklch(0.16_0.005_300)] px-[18px] py-4"
            >
              <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] border border-[oklch(from_var(--accent)_l_c_h_/_0.22)] bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] text-accent-soft">
                <Icon size={18} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 font-sans text-[13px] font-bold uppercase leading-tight tracking-[0.04em] text-ink">
                  {c.title}
                </div>
                <div className="line-clamp-2 text-[12.5px] leading-snug text-ink-dim">
                  {c.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
