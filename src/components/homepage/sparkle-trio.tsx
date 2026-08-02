import { cn } from "@/components/ui";

/**
 * The three-sparkle decor cluster from the 2026 home redesign. Appears
 * verbatim (same three assets, same 47.49px size, same 15.265px gap) in the
 * What-You-Get header (Figma #1729:2716), the Industries header (#1729:2126)
 * and the Process CTA row (#1729:3092) — extracted on the third occurrence.
 *
 * The third star is a GLASS-effect star: in the file its fill is
 * near-invisible and Figma renders only the material's edge refraction, so
 * `sparkle-3.svg` is hand-drawn as those two lit arcs (see
 * docs/glass-ui-patterns.md).
 *
 * Callers supply display + placement (e.g. `hidden xl:flex`); decorative
 * only, so the wrapper is aria-hidden.
 */
export function SparkleTrio({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("shrink-0 items-center gap-[15.27px]", className)}
    >
      {[1, 2, 3].map((n) => (
        // eslint-disable-next-line @next/next/no-img-element -- static SVG decor, no optimizer round-trip
        <img key={n} src={`/wyg/sparkle-${n}.svg`} alt="" width={47} height={47} loading="lazy" />
      ))}
    </span>
  );
}
