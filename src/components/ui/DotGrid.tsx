import { type CSSProperties } from "react";
import { cn } from "./cn";

interface DotGridProps {
  className?: string;
  /** CSS length string for both axes of the dot grid. */
  size?: string;
}

/**
 * Absolute-positioned dot-grid background overlay. Parent must be `relative`.
 */
export function DotGrid({ className, size = "24px" }: DotGridProps) {
  return (
    // eslint-disable-next-line react/forbid-dom-props -- dynamic CSS custom property
    <div
      style={{ "--dg-size": size } as CSSProperties}
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)]",
        "[background-size:var(--dg-size)_var(--dg-size)]",
        className,
      )}
    />
  );
}
