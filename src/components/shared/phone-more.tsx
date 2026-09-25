import { useId, type ReactNode } from "react";

import { cn } from "@/components/ui";
import type { Locale } from "@/constants/locales";

/**
 * Phone-only "show more" around a block. Inside it, mark lists with
 * `pm-cap-N` (first N children visible) and secondary blocks with
 * `pm-extra`; below 800px they collapse until the reader taps the toggle.
 * From 800px up everything is open and the toggle is not rendered visibly.
 *
 * The rules live in globals.css (search "Phone show more"). Nothing is
 * removed from the HTML — the owner's requirement for SEO (2026-09-17): long
 * content folds, it does not disappear.
 */
export const SHOW_MORE_LABEL: Record<Locale, string> = {
  uk: "Показати ще",
  ru: "Показать ещё",
  en: "Show more",
};

export function PhoneMore({
  children,
  className,
  label = SHOW_MORE_LABEL.uk,
  labelClassName,
}: {
  children: ReactNode;
  className?: string;
  label?: ReactNode;
  labelClassName?: string;
}) {
  const id = useId();
  return (
    <div className={cn("pm", className)}>
      <input id={id} type="checkbox" className="pm-toggle sr-only" />
      {children}
      <label
        htmlFor={id}
        className={cn(
          "pm-more mt-3 min-h-11 w-full cursor-pointer select-none items-center justify-center rounded-ctl border border-dashed border-line-strong font-sans font-semibold text-[13px] text-accent-soft",
          labelClassName,
        )}
      >
        {label}
      </label>
    </div>
  );
}
