import { cn } from "@/components/ui";

/**
 * Dot-capped gradient rule from the 2026 home redesign — Figma "Line 92"
 * (Problem section, #1729:2068, 294px) and "Line 93" (Industries header,
 * #1729:2133, 575px). Identical art in both: a 1px `#111111 → #7C54CD`
 * gradient with 5.33px dots at each end.
 *
 * `flip` mirrors it (the design uses `rotate-180`), which swaps both the
 * gradient direction and the dot colours in one go — that is how the
 * violet end is kept nearest the text it points at, whichever side the
 * rule sits on.
 *
 * Line thickness is 1.5px, not the design's 1px: the rotated copy rounded
 * away to zero height at some browser zooms (job #143).
 *
 * Callers supply display + width (e.g. `hidden lg:flex w-[294px]`, or
 * `flex-1` to fill the remaining track).
 */
export function GradientRule({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("items-center shrink-0", flip && "rotate-180", className)}
    >
      <span className="size-[5.33px] shrink-0 rounded-full bg-[#111111]" />
      <span className="h-[1.5px] flex-1 bg-[linear-gradient(90deg,#111111,#7C54CD)]" />
      <span className="size-[5.33px] shrink-0 rounded-full bg-[#7c54cd]" />
    </span>
  );
}
