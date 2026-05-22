import type * as React from "react";
import { Calendar, MessageCircle, Mail, type LucideIcon } from "lucide-react";

import { SectionHead } from "@/components/shared/section-head";

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
    <section className="hp-section" id="contact">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        {urgency ? (
          <div className="hp-urgency">
            <span className="hp-urgency-dot" aria-hidden="true" />
            <span className="hp-urgency-text">{urgency}</span>
          </div>
        ) : null}
        <div className="hp-finalcta-grid">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const external = c.href.startsWith("http");
            return (
              <a
                key={i}
                href={c.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={`hp-finalcta-card${c.featured ? " featured" : ""}`}
              >
                <div className="hp-finalcta-icon">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div className="hp-finalcta-title">{c.title}</div>
                <p className="hp-finalcta-body">{c.body}</p>
                <div className="hp-finalcta-cta">{c.cta}</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
