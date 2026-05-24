import { type CSSProperties } from "react";
import { cn } from "./cn";

interface GradPlaceholderProps {
  from: string;
  to: string;
  label?: string;
  className?: string;
}

/**
 * 16:9 gradient block with a dot-grid overlay, used as a stand-in for screenshots
 * on portfolio/about pages. Dynamic colors flow through CSS custom properties
 * (allowed under the inline-style policy) so the gradient utility stays static.
 */
export function GradPlaceholder({ from, to, label, className }: GradPlaceholderProps) {
  return (
    <div
      // eslint-disable-next-line react/forbid-dom-props -- dynamic CSS custom properties
      style={{ "--gp-from": from, "--gp-to": to } as CSSProperties}
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,var(--gp-from),var(--gp-to))]",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] before:[background-size:24px_24px]",
        className,
      )}
    >
      {label ? (
        <span className="absolute left-4 top-4 font-mono text-xs uppercase tracking-wider text-white/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
