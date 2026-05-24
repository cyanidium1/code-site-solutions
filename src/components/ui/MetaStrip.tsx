import { cn } from "./cn";

interface MetaItem {
  label: string;
  value: string;
}

interface MetaStripProps {
  items: MetaItem[];
  className?: string;
}

/**
 * Monospace metadata row used at the top/bottom of portfolio case pages.
 * Each item is a label + value pair stacked vertically; items wrap.
 */
export function MetaStrip({ items, className }: MetaStripProps) {
  return (
    <dl
      className={cn(
        "mx-auto flex max-w-container flex-wrap gap-x-12 gap-y-4 px-12 pb-6 font-mono text-xs uppercase tracking-wider text-ink-dim",
        className,
      )}
    >
      {items.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-1">
          <dt className="text-ink-muted">{label}</dt>
          <dd className="text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
