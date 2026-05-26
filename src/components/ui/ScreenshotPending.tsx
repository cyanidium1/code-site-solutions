import { cn } from "./cn";

interface ScreenshotPendingProps {
  label?: string;
  className?: string;
}

/**
 * 16:9 dark placeholder shown where a real screenshot will eventually live.
 * Used on portfolio case pages.
 */
export function ScreenshotPending({
  label = "SCREENSHOT PENDING",
  className,
}: ScreenshotPendingProps) {
  return (
    <div
      className={cn(
        "relative grid aspect-[16/9] w-full place-items-center overflow-hidden rounded-2xl",
        "bg-[linear-gradient(135deg,#1a1620,#2a1f3a)]",
        className,
      )}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
        {label}
      </span>
    </div>
  );
}
