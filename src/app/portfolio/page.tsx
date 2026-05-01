import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter, FinalCta3 } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { SITE_ORIGIN, pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Портфоліо — 30+ кейсів від Code-Site.Art",
  description:
    "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів. Від $1 000 до $14 000+.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Портфоліо — 30+ кейсів від Code-Site.Art",
    description:
      "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів.",
    type: "website",
    locale: "uk_UA",
    url: "/portfolio",
  },
};

/* ─── Cases data ────────────────────────────────────────────────────────── */

type CaseRow = {
  slug: string;
  href: string | null;
  industry: string;
  industryColor: string;
  tech: string;
  name: string;
  meta: string;
  metrics: string;
  status: "live" | "coming-soon";
  gradient: string;
  /** Прев’ю в «вікні» картки замість смужок-мокапу */
  coverImage?: string;
  coverImageAlt?: string;
};

const CASES: CaseRow[] = [
  {
    slug: "efedra-clinic",
    href: "/portfolio/efedra-clinic",
    industry: "Healthcare",
    industryColor: "#0EA5E9",
    tech: "Next.js",
    name: "Efedra Clinic",
    meta: "Healthcare · Odesa · 2024",
    metrics: "×3.2 inquiries · LCP 0.8s · Top-3 Google",
    status: "live",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.55 0.16 200) 100%)",
    coverImage: "/EfedraCaseCreenshots/efedra-main-after.png",
    coverImageAlt: "Efedra Clinic — новий сайт після редизайну",
  },
  {
    slug: "nbyg-bornholm",
    href: null,
    industry: "Real Estate",
    industryColor: "#EF4444",
    tech: "Next.js",
    name: "NBYG Bornholm",
    meta: "Construction · Denmark · 2024",
    metrics: "×6 traffic · 24 inquiries/mo · Top-1 local",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.62 0.18 60) 100%)",
  },
  {
    slug: "tatarka",
    href: null,
    industry: "Real Estate",
    industryColor: "#EF4444",
    tech: "Next.js",
    name: "Tatarka",
    meta: "Real Estate Investment · Kyiv · 2025",
    metrics: "$4M raised · Investor portal · Multi-lang",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.16 65) 0%, oklch(0.55 0.18 40) 100%)",
  },
  {
    slug: "webbond",
    href: null,
    industry: "Digital Agency",
    industryColor: "#8B5CF6",
    tech: "Next.js",
    name: "Webbond",
    meta: "Digital Agency · Kyiv · 2024",
    metrics: "Кастомний дизайн · Складний portfolio · Багатомовність",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  },
  {
    slug: "so2-lab",
    href: null,
    industry: "Industrial",
    industryColor: "#10B981",
    tech: "Astro",
    name: "SO2 Lab",
    meta: "Industrial / CO2 capture · 2024",
    metrics: "Технічний B2B-сайт · Investor-focused · ENG",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.16 165) 0%, oklch(0.50 0.14 145) 100%)",
  },
  {
    slug: "aleko-course",
    href: null,
    industry: "Education",
    industryColor: "#14B8A6",
    tech: "Next.js",
    name: "Aleko Course",
    meta: "Online Education · 2024",
    metrics: "Lead gen для онлайн-курсу · Stripe checkout",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.14 195) 0%, oklch(0.55 0.16 220) 100%)",
  },
  {
    slug: "solide-renovation",
    href: null,
    industry: "Construction",
    industryColor: "#EF4444",
    tech: "Next.js",
    name: "Solide Renovation",
    meta: "Construction / Renovations · 2024",
    metrics: "Продаючий сайт · Calculator · Form integrations",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.45 0.18 15) 100%)",
  },
  {
    slug: "bezlad",
    href: null,
    industry: "Kids / Family",
    industryColor: "#EC4899",
    tech: "Next.js",
    name: "Bezlad Kids Space",
    meta: "Kids entertainment · Kyiv · 2024",
    metrics: "Booking system · Event calendar · Bright design",
    status: "coming-soon",
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.20 350) 0%, oklch(0.55 0.18 330) 100%)",
  },
];

/* ─── Local card (clickable + disabled variants) ────────────────────────── */

function PortfolioCard({ row }: { row: CaseRow }) {
  const disabled = !row.href;

  const cover = (
    <div className="hp-case-cover">
      <div className="hp-case-cover-bg" style={{ background: row.gradient }} />
      <div className="hp-case-cover-dots" />
      <div
        className="hp-case-shot"
        style={
          row.coverImage
            ? { display: "flex", flexDirection: "column" }
            : undefined
        }
      >
        <div className="hp-case-shot-bar">
          <span className="hp-case-shot-dot" />
          <span className="hp-case-shot-dot" />
          <span className="hp-case-shot-dot" />
        </div>
        {row.coverImage ? (
          <div
            className="hp-case-shot-body"
            style={{
              flex: 1,
              minHeight: 0,
              padding: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={row.coverImage}
              alt={row.coverImageAlt ?? row.name}
              className="absolute inset-0 block h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="hp-case-shot-body">
            <div className="hp-case-shot-line s1" />
            <div className="hp-case-shot-line s2" />
            <div className="hp-case-shot-line s3" />
          </div>
        )}
      </div>
      {disabled ? (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "4px 10px",
            border: "1px solid oklch(1 0 0 / 0.18)",
            borderRadius: 999,
            background: "oklch(0 0 0 / 0.40)",
            backdropFilter: "blur(6px)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(1 0 0 / 0.85)",
          }}
        >
          Coming soon
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className="hp-case-body">
      <div className="hp-case-chips">
        <span
          className="hp-case-chip"
          style={{
            color: row.industryColor,
            borderColor: `${row.industryColor}55`,
          }}
        >
          {row.industry}
        </span>
        <span className="hp-case-chip">{row.tech}</span>
      </div>
      <div className="hp-case-name-row">
        <h3 className="hp-case-name">{row.name}</h3>
        {!disabled ? (
          <ArrowUpRight
            size={20}
            strokeWidth={1.6}
            className="hp-case-arrow"
          />
        ) : null}
      </div>
      <div className="hp-case-meta">{row.meta}</div>
      <div className="hp-case-metrics">{row.metrics}</div>
    </div>
  );

  if (disabled) {
    return (
      <div
        className="hp-case-link"
        style={{
          cursor: "default",
          pointerEvents: "none",
          opacity: 0.78,
        }}
      >
        {cover}
        {body}
      </div>
    );
  }

  return (
    <Link href={row.href!} className="hp-case-link">
      {cover}
      {body}
    </Link>
  );
}

/* ─── JSON-LD ───────────────────────────────────────────────────────────── */

const PORTFOLIO_URL = pageUrl("/portfolio");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Головна",
          item: SITE_ORIGIN,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Портфоліо",
          item: PORTFOLIO_URL,
        },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": `${PORTFOLIO_URL}#collection`,
      url: PORTFOLIO_URL,
      name: "Портфоліо — Code-Site.Art",
      description:
        "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів.",
      inLanguage: "uk",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: CASES.length,
        itemListElement: CASES.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          url: c.href ? `${SITE_ORIGIN}${c.href}` : PORTFOLIO_URL,
        })),
      },
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      {/* Section 1: Page hero */}
      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Портфоліо" },
        ]}
        eyebrow="/ PORTFOLIO"
        headline={
          <>
            30+ кейсів: сайти для клінік, юристів, e-commerce,{" "}
            <em>стартапів</em>
          </>
        }
        sub="Реальні проєкти з реальними метриками. Кожен кейс — повний розбір з «до/після»."
      />

      {/* Section 2: Cases grid (3 cols → 1 col mobile) */}
      <section className="hp-section">
        <div className="hp-inner">
          <div className="hp-cases-grid">
            {CASES.map((row) => (
              <PortfolioCard key={row.slug} row={row} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Calculator promo CTA banner */}
      <CtaBanner
        eyebrow="/ NEW PROJECT"
        heading={
          <>
            Хочете <em>такий же результат</em>?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Розповідаєте про проєкт — повертаємось з вилкою цін за 24 години."
        ctaPrimary={{
          label: "Розрахувати вартість",
          href: "/calculator",
        }}
        ctaSecondary={{
          label: "Або обговорити з нами",
          href: "/contacts",
        }}
      />

      {/* Section 4: Final CTA */}
      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={
          <>
            Готові <em>обговорити</em> проєкт?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Без зобов'язань."
      />

      <HpFooter />
    </>
  );
}
