import type * as React from "react";
import Link from "next/link";
import { Linkedin, ArrowUpRight } from "lucide-react";

import { btnClass } from "@/components/ui";
import { hpSectionClass } from "@/components/homepage/shared";

export function PullQuote({
  quote = (
    <>
      Перед запуском нового сайту у нас було 3 заявки на місяць. Зараз — 24.
    </>
  ),
  initials = "SH",
  name = "Søren Hansen",
  role = "Owner, NBYG København Aps",
  liHref,
  showAvatar = true,
  caseHref,
  caseLabel,
}: Partial<{
  quote: React.ReactNode;
  initials: string;
  name: string;
  role: string;
  /** Якщо не передано — блок LinkedIn не показується. */
  liHref?: string;
  /** Круг з ініціалами; `false` — лише ім’я та роль (без «фото» клієнта). */
  showAvatar?: boolean;
  /** Якщо передано — під автором рендериться лінк на повний кейс. */
  caseHref?: string;
  caseLabel?: string;
}> = {}) {
  return (
    <section className={hpSectionClass}>
      <div className="relative py-6 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_800px_360px_at_50%_50%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%)]"
        />
        <div className="relative z-[1] mx-auto max-w-container-prose px-6">
          <p className="font-sans text-[clamp(22px,2.5vw,32px)] font-medium leading-[1.4] text-ink [&_em]:not-italic [&_em]:bg-text-gradient [&_em]:bg-clip-text [&_em]:text-transparent [&_em]:italic">
            «{quote}»
          </p>
          <div className="mt-9 inline-flex flex-col items-center gap-3">
            {showAvatar ? (
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient font-sans text-lg font-bold text-bg">
                {initials}
              </div>
            ) : null}
            <div>
              <div className="font-sans text-base font-semibold text-ink">{name}</div>
              <div className="mt-0.5 font-mono text-[11px] text-ink-3">{role}</div>
            </div>
            {liHref ? (
              <a
                href={liHref}
                className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-dim transition-colors duration-200 hover:text-ink"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={12} strokeWidth={1.6} /> LinkedIn
              </a>
            ) : null}
          </div>
          {caseHref ? (
            <div className="mt-8 text-center">
              <Link href={caseHref} className={btnClass("primary")}>
                <span>{caseLabel ?? "Подивитись повний кейс"}</span>
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
