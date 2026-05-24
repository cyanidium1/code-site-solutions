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
import { cn } from "@/components/ui";

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

// Card visual classes shared by enabled (Link) + disabled (div) variants.
// Uses the dynamic --accent-color CSS var (per-industry color) via arbitrary
// oklch(from var(...) ...) for hover border + before/after pseudo-elements.
const cardBase =
  "group/ind relative flex flex-col overflow-hidden rounded-[18px] border border-line bg-[oklch(1_0_0_/_0.02)] p-6 text-inherit no-underline transition-[transform,border-color] duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  // ::before radial overlay (hover)
  "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(400px_200px_at_0%_0%,oklch(from_var(--accent-color,var(--accent))_l_c_h_/_0.10),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-[0.25s] " +
  // ::after gradient line on top edge (hover)
  "after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-[linear-gradient(90deg,transparent,var(--accent-color,var(--accent)),transparent)] after:opacity-0 after:transition-opacity after:duration-[0.25s]";

const cardEnabledHover =
  "hover:-translate-y-0.5 hover:border-[oklch(from_var(--accent-color,var(--accent))_l_c_h_/_0.5)] hover:before:opacity-100 hover:after:opacity-100";

const cardDisabled =
  "cursor-default opacity-[0.78] hover:transform-none hover:border-line hover:before:opacity-0 hover:after:opacity-0";

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
        <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[800px]:grid-cols-1">
          {items.map((ind, i) => {
            const Icon = ind.icon;
            const inner = (
              <>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-line bg-[oklch(from_var(--accent-color,var(--accent))_l_c_h_/_0.12)] text-[var(--accent-color,var(--accent))]">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="m-0 font-sans text-[17px] font-semibold text-ink">{ind.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.55] text-ink-dim">{ind.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {ind.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex rounded-md border border-line bg-[oklch(1_0_0_/_0.03)] px-2 py-[3px] font-mono text-[10.5px] text-ink-3"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
                  <span className="font-mono text-[11px] text-ink-3">{ind.price}</span>
                  {ind.href ? (
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.8}
                      className="text-[var(--accent-color,var(--accent))] transition-transform duration-[0.25s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/ind:translate-x-1 group-hover/ind:-translate-y-1"
                    />
                  ) : null}
                </div>
              </>
            );
            const cardStyle = { "--accent-color": ind.color } as React.CSSProperties;
            if (!ind.href) {
              return (
                <div
                  key={ind.title + i}
                  className={cn(cardBase, cardDisabled)}
                  // eslint-disable-next-line react/forbid-dom-props -- dynamic per-industry accent color
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
                className={cn(cardBase, cardEnabledHover)}
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
