import type * as React from "react";
import Link from "next/link";
import { Linkedin, ArrowUpRight } from "lucide-react";

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
    <section className="hp-section">
      <div className="hp-pull">
        <div className="hp-pull-bg" />
        <div className="hp-pull-inner">
          <p className="hp-pull-quote">«{quote}»</p>
          <div className="hp-pull-author">
            {showAvatar ? (
              <div className="hp-pull-avatar">{initials}</div>
            ) : null}
            <div>
              <div className="hp-pull-name">{name}</div>
              <div className="hp-pull-role">{role}</div>
            </div>
            {liHref ? (
              <a
                href={liHref}
                className="hp-pull-li"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={12} strokeWidth={1.6} /> LinkedIn
              </a>
            ) : null}
          </div>
          {caseHref ? (
            <div className="hp-pull-cta">
              <Link href={caseHref} className="btn-primary">
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
