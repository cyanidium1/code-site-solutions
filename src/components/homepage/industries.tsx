import type * as React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Building,
  Car,
  Home,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

import type { Industry } from "@/types/homepage";
import { SectionHead } from "@/components/shared/section-head";

// All 8 industries have published Sanity pages and live hrefs.
const DEFAULT_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    color: "#0EA5E9",
    title: "Healthcare / Medicine",
    description: "Сайти для клінік, стоматологій, діагностичних центрів",
    tags: ["Helsi", "Medesk", "Online booking"],
    price: "Від $3 500 · 4-10 тижнів",
    href: "/sites-for/medicine",
  },
  {
    icon: Building,
    color: "#EF4444",
    title: "Construction / Renovation",
    description: "Сайти для будівельних і ремонтних компаній",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/renovation",
  },
  {
    icon: Scale,
    color: "#8B5CF6",
    title: "Legal & Attorneys",
    description: "Сайти для юр. фірм, адвокатських бюро, приватних юристів",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/legal",
  },
  {
    icon: Calculator,
    color: "#10B981",
    title: "Фінанси і бухгалтерія",
    description: "Сайти для бух-фірм, фінансових радників, трейдинг-сервісів",
    tags: ["MEDoc", "Stripe", "1С/BAS"],
    price: "Від $3 500 · 4-8 тижнів",
    href: "/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    color: "#F59E0B",
    title: "E-commerce",
    description: "Інтернет-магазини, маркетплейси, B2B-каталоги",
    tags: ["Stripe", "LiqPay", "Нова Пошта"],
    price: "Від $3 000 · 6-10 тижнів",
    href: "/sites-for/ecommerce",
  },
  {
    icon: Car,
    color: "#0070F3",
    title: "Авто-індустрія",
    description: "Сайти для імпорту авто, автодилерів, СТО і сервісних послуг",
    tags: ["Copart", "PDF-invoice", "Multi-lang"],
    price: "Від $3 000 · 6-10 тижнів",
    href: "/sites-for/auto",
  },
  {
    icon: Home,
    color: "#EC4899",
    title: "Нерухомість",
    description: "Сайти для агенцій нерухомості, забудовників, private listings",
    tags: ["Multi-lang", "Multi-currency", "Mortgage"],
    price: "Від $4 000 · 6-10 тижнів",
    href: "/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    color: "#14B8A6",
    title: "Курси і лендинги",
    description: "Сайти для онлайн-курсів, інфо-продуктів, блогерських воронок",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "Від $800 · 4-8 тижнів",
    href: "/sites-for/courses",
  },
];

export function Industries({
  eyebrow = "РІШЕННЯ",
  heading = (
    <>
      Спеціалізовані рішення під <em>вашу галузь</em>
    </>
  ),
  sub = "Не просто сайт — комплексне рішення з інтеграціями і compliance.",
  items = DEFAULT_INDUSTRIES,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: Industry[];
} = {}) {
  return (
    <section className="hp-section" id="solutions">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-industries-grid">
          {items.map((ind, i) => {
            const Icon = ind.icon;
            const inner = (
              <>
                <div className="hp-industry-icon">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="hp-industry-title">{ind.title}</h3>
                <p className="hp-industry-desc">{ind.description}</p>
                <div className="hp-industry-tags">
                  {ind.tags.map((t) => (
                    <span key={t} className="hp-industry-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="hp-industry-foot">
                  <span className="hp-industry-price">{ind.price}</span>
                  {ind.href ? (
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.8}
                      className="hp-industry-arrow"
                    />
                  ) : null}
                </div>
              </>
            );
            const cardStyle = { ["--accent-color" as string]: ind.color };
            if (!ind.href) {
              return (
                <div
                  key={ind.title + i}
                  className="hp-industry-card is-disabled"
                  style={cardStyle}
                >
                  {inner}
                </div>
              );
            }
            return (
              <Link
                key={ind.href}
                href={ind.href}
                className="hp-industry-card"
                style={cardStyle}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
