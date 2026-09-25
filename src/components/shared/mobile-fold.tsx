import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/components/ui";

/**
 * Content that is folded behind a toggle on phones and always open from the
 * `lg` breakpoint (800px) up.
 *
 * Why not <details>: a closed <details> hides its body at every width, and
 * there is no reliable CSS to force it open on desktop. A visually hidden
 * checkbox + `peer-checked` does the same job with no JavaScript and no
 * layout shift after hydration. The body stays in the HTML, so search
 * engines index it (mobile-first indexing counts accordion content in full),
 * which matters: most folded text here is SEO prose the pages rank with
 * (simplification plan 2026-09-16, rule П5).
 *
 * Works in server and client components (`useId` is allowed in both).
 */
export function MobileFold({
  label,
  children,
  className,
  bodyClassName,
  labelClassName,
  disabled = false,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  /** Classes for the body wrapper. Its display is `block` when open on
      phones; pass `lg:flex` etc. only for the desktop layout. */
  bodyClassName?: string;
  labelClassName?: string;
  /** Render the body open at every width, with no toggle. */
  disabled?: boolean;
}) {
  const id = useId();
  if (disabled) return <div className={className}>{children}</div>;
  return (
    <div className={className}>
      <input id={id} type="checkbox" className="peer sr-only" />
      <label
        htmlFor={id}
        className={cn(
          "lg:hidden inline-flex min-h-11 cursor-pointer select-none items-center gap-2 font-sans font-semibold text-[13px] text-accent-soft",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          "peer-checked:[&_svg]:rotate-180",
          labelClassName,
        )}
      >
        {label}
        <ChevronDown size={15} className="transition-transform duration-200" aria-hidden="true" />
      </label>
      <div className={cn("max-lg:hidden max-lg:peer-checked:block", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}

/** "Read more" label per locale for folded prose. */
export const READ_MORE_LABEL = {
  uk: "Читати детальніше",
  ru: "Читать подробнее",
  en: "Read more",
} as const;
