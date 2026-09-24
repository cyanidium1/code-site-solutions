import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/components/ui";

/**
 * Згорнутий блок «технічні характеристики» всередині секції КП.
 *
 * Тут — справжній `<details>`, на відміну від `MobileFold` у маркетингових
 * блоках. Там текст мусить бути розкритий на десктопі, бо це SEO-проза, яку
 * читає Google; КП не індексується, а подробиці мають бути закриті на будь-якій
 * ширині: клієнт спершу читає ціну й обсяг, і лише потім — якщо захоче —
 * методику заміру. `<details>` дає це без JS і з нативною клавіатурою.
 *
 * Працює і в серверних, і в клієнтських компонентах.
 */
export function ProposalFold({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("group/fold", className)}>
      <summary
        className={cn(
          "inline-flex min-h-11 cursor-pointer select-none list-none items-center gap-2",
          "font-mono text-[11px] uppercase tracking-[0.1em] text-accent-soft",
          "marker:hidden [&::-webkit-details-marker]:hidden",
          "hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      >
        {label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className="transition-transform duration-200 group-open/fold:rotate-180"
        />
      </summary>
      <div className="mt-3 border-l-2 border-accent-25 pl-4">{children}</div>
    </details>
  );
}
