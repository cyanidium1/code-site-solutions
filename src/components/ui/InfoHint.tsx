"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Info } from "lucide-react";

type InfoHintProps = {
  /** Tooltip body. When empty/undefined the component renders nothing. */
  text?: string;
  /** Accessible label for the trigger button. */
  label?: string;
};

/**
 * Small on-demand "(i)" hint. Reveals its text on hover (pointer), focus
 * (keyboard), and tap (touch) — one behaviour across breakpoints. Renders
 * nothing when `text` is empty, so option grids stay clean by default.
 */
export function InfoHint({ text, label = "More info" }: InfoHintProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!text) return null;

  return (
    <span
      ref={ref}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className={
          "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full " +
          "text-ink-3 hover:text-accent-soft cursor-help " +
          "focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-1"
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Info size={13} strokeWidth={1.7} />
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={
            "absolute z-50 left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] " +
            "w-[220px] max-w-[60vw] rounded-[10px] border border-line " +
            "bg-[oklch(0.14_0.005_300)] px-3 py-2 text-[12px] leading-[1.45] text-ink-dim " +
            "shadow-[0_8px_24px_oklch(0_0_0_/_0.4)] pointer-events-none"
          }
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
