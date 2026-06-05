/**
 * Class strings for the pill-button visual used by:
 *   - `<FilterPills>` (URL-driven, blog/portfolio)
 *   - homepage Cases industry filter (local-state-driven)
 *
 * Active pills tint themselves using `--pill-accent` (per-pill CSS var)
 * when provided, falling back to the global `--color-accent`. Consumers
 * that want a flat accent (no per-pill override) just compose
 * PILL_ACTIVE without setting the var.
 */

export const PILL_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] tracking-[0.02em] transition-[color,background-color,border-color] duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft";

export const PILL_INACTIVE =
  "border-line bg-[oklch(1_0_0_/_0.02)] text-ink-dim hover:border-line-strong hover:text-ink";

export const PILL_ACTIVE =
  "text-ink " +
  "border-[oklch(from_var(--pill-accent,var(--color-accent))_l_c_h_/_0.55)] " +
  "bg-[oklch(from_var(--pill-accent,var(--color-accent))_l_c_h_/_0.18)]";
