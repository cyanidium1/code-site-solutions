import type * as React from "react";
import { Calendar, MessageCircle, Mail, type LucideIcon } from "lucide-react";

import { SectionHead } from "@/components/shared/section-head";
import { cn } from "@/components/ui";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

type CtaCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
  featured?: boolean;
};

const DEFAULT_CTA: CtaCard[] = [
  {
    icon: Calendar,
    title: "Book a call",
    body: "30-хв Zoom. Покажемо реальні кейси, обговоримо ваш проєкт.",
    cta: "Open Calendly →",
    href: "https://calendly.com/fedirdev",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    body: "Найшвидший канал. Зазвичай відповідаємо за 30 хв.",
    cta: "Write @fedirdev →",
    href: "https://t.me/fedirdev?text=%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B3%D0%BE+%D0%B4%D0%BD%D1%8F",
    featured: true,
  },
  {
    icon: Mail,
    title: "Send a brief",
    body: "Детальна форма. Опишіть проєкт — повернемось за 4 робочі години.",
    cta: "Open form →",
    href: "/contacts",
  },
];

export function FinalCta3({
  eyebrow = "ЗВ'ЯЗОК",
  heading = (
    <>
      Готові <em>обговорити</em> проєкт?
    </>
  ),
  sub = "Безкоштовна 30-хв консультація. Без зобов'язань. Розуміємо за 15 хв, чи підходимо одне одному.",
  cards = DEFAULT_CTA,
  urgency,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  cards?: CtaCard[];
  urgency?: React.ReactNode;
} = {}) {
  return (
    <section className={hpSectionClass} id="contact">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        {urgency ? (
          <div className="-mt-4 mb-8 flex w-full max-w-full items-center gap-3 rounded-[14px] border border-[oklch(0.55_0.18_295_/_0.35)] bg-[oklch(0.55_0.18_295_/_0.08)] px-[14px] py-3 font-mono text-[11.5px] tracking-[0.02em] leading-[1.45] text-ink md:inline-flex md:w-auto md:rounded-full md:px-[18px] md:text-[12px] md:leading-normal">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_oklch(0.55_0.18_295_/_0.2)] [animation:hp-urgency-pulse_2s_ease-in-out_infinite]"
            />
            <span className="leading-[1.5] [&_strong]:font-semibold [&_strong]:text-accent-soft">
              {urgency}
            </span>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const external = c.href.startsWith("http");
            return (
              <a
                key={i}
                href={c.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={cn(
                  "relative block rounded-[22px] border border-line bg-[oklch(1_0_0_/_0.02)] p-7 no-underline text-inherit transition-[transform,border-color] duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-line-strong",
                  c.featured &&
                    "border-2 [border-image:linear-gradient(180deg,var(--color-accent-soft),var(--color-accent))_1] bg-[oklch(from_var(--color-accent)_l_c_h_/_0.05)]",
                )}
              >
                <div
                  className={cn(
                    "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-line bg-[oklch(1_0_0_/_0.04)] text-ink",
                    c.featured && "border-transparent bg-brand-gradient text-bg",
                  )}
                >
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div className="font-sans text-xl font-semibold text-ink">{c.title}</div>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-ink-dim">{c.body}</p>
                <div
                  className={cn(
                    "mt-6 font-mono text-[12.5px] text-ink-dim",
                    c.featured && "text-accent-soft",
                  )}
                >
                  {c.cta}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
