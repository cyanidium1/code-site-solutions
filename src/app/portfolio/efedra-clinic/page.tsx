import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import {
  HpHeader,
  HpFooter,
  PullQuote,
  FinalCta3,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";

export const metadata: Metadata = {
  title: "Efedra Clinic — кейс редизайну сайту клініки в Одесі",
  description:
    "Як ми переробили сайт стоматологічної клініки + студії краси. Custom-coded на Next.js + Sanity. Результат: ×3.2 заявок, LCP 0.8s, Top-3 Google.",
  alternates: { canonical: "/portfolio/efedra-clinic" },
  openGraph: {
    title: "Efedra Clinic — кейс редизайну сайту клініки в Одесі",
    description:
      "Custom-coded на Next.js + Sanity. ×3.2 заявок, LCP 0.8s, Top-3 Google.",
    type: "article",
    locale: "uk_UA",
    url: "/portfolio/efedra-clinic",
  },
};

/* ─── Placeholder visual ────────────────────────────────────────────────── */

function GradPlaceholder({
  from,
  to,
  label,
}: {
  from: string;
  to: string;
  label?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.5,
        }}
      />
      {label ? (
        <span
          style={{
            position: "relative",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ─── Meta strip ────────────────────────────────────────────────────────── */

function MetaStrip() {
  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "0 48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 24px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 12,
          color: "var(--ink-3)",
          letterSpacing: "0.04em",
        }}
      >
        <span>· Industry: Healthcare</span>
        <span>· Region: Odesa, Ukraine</span>
        <span>· Year: 2024</span>
        <span>· Stack: Next.js · Sanity · Vercel</span>
        <span>· Duration: 6 weeks</span>
        <span>· Budget: ~$6 500</span>
      </div>
    </section>
  );
}

/* ─── Simple 2x2 gallery (fallback for ImageGallery block) ──────────────── */

function SimpleGallery() {
  const tiles = [
    {
      label: "Desktop home",
      from: "oklch(0.55 0.18 230)",
      to: "oklch(0.45 0.20 250)",
    },
    {
      label: "Mobile home",
      from: "oklch(0.55 0.16 200)",
      to: "oklch(0.45 0.18 230)",
    },
    {
      label: "Booking flow",
      from: "oklch(0.55 0.14 180)",
      to: "oklch(0.45 0.16 210)",
    },
    {
      label: "CMS admin",
      from: "oklch(0.50 0.12 270)",
      to: "oklch(0.40 0.10 250)",
    },
  ];
  return (
    <section className="hp-section">
      <div className="hp-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
        >
          {tiles.map((t) => (
            <div
              key={t.label}
              style={{
                aspectRatio: "16/10",
                borderRadius: 22,
                overflow: "hidden",
                border: "1px solid var(--line)",
              }}
            >
              <GradPlaceholder from={t.from} to={t.to} label={t.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Related cases (3 disabled cards) ──────────────────────────────────── */

type Related = {
  name: string;
  meta: string;
  metrics: string;
  industry: string;
  industryColor: string;
  tech: string;
  gradient: string;
};

const RELATED: Related[] = [
  {
    name: "NBYG Bornholm",
    meta: "Construction · Denmark · 2024",
    metrics: "×6 traffic · 24 inquiries/mo · Top-1 local",
    industry: "Real Estate",
    industryColor: "#EF4444",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.62 0.18 60) 100%)",
  },
  {
    name: "Tatarka",
    meta: "Real Estate Investment · Kyiv · 2025",
    metrics: "$4M raised · Investor portal · Multi-lang",
    industry: "Real Estate",
    industryColor: "#EF4444",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.16 65) 0%, oklch(0.55 0.18 40) 100%)",
  },
  {
    name: "Webbond",
    meta: "Digital Agency · Kyiv · 2024",
    metrics: "Кастомний дизайн · Складний portfolio · Багатомовність",
    industry: "Digital Agency",
    industryColor: "#8B5CF6",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  },
];

function RelatedCard({ row }: { row: Related }) {
  return (
    <div
      className="hp-case-link"
      style={{
        cursor: "default",
        pointerEvents: "none",
        opacity: 0.78,
      }}
    >
      <div className="hp-case-cover">
        <div className="hp-case-cover-bg" style={{ background: row.gradient }} />
        <div className="hp-case-cover-dots" />
        <div className="hp-case-shot">
          <div className="hp-case-shot-bar">
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
          </div>
          <div className="hp-case-shot-body">
            <div className="hp-case-shot-line s1" />
            <div className="hp-case-shot-line s2" />
            <div className="hp-case-shot-line s3" />
          </div>
        </div>
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
      </div>
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
        </div>
        <div className="hp-case-meta">{row.meta}</div>
        <div className="hp-case-metrics">{row.metrics}</div>
      </div>
    </div>
  );
}

/* ─── JSON-LD ───────────────────────────────────────────────────────────── */

const SITE_ORIGIN = "https://code-site.art";
const CASE_URL = `${SITE_ORIGIN}/portfolio/efedra-clinic`;

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
          item: `${SITE_ORIGIN}/portfolio`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Efedra Clinic",
          item: CASE_URL,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": `${CASE_URL}#article`,
      url: CASE_URL,
      headline: "Efedra Clinic — кейс редизайну сайту клініки в Одесі",
      description:
        "Як ми переробили сайт стоматологічної клініки + студії краси. Custom-coded на Next.js + Sanity. Результат: ×3.2 заявок, LCP 0.8s, Top-3 Google.",
      inLanguage: "uk",
      datePublished: "2024-09-01",
      author: {
        "@type": "Person",
        "@id": "https://code-site.art/about#fedir-alpatov",
        name: "Fedir Alpatov",
        jobTitle: "Founder, Code-Site.Art",
        url: "https://code-site.art/about",
      },
      publisher: {
        "@type": "Organization",
        "@id": "https://code-site.art/#organization",
        name: "Code-Site.Art",
      },
      about: "Healthcare website redesign — Efedra Clinic, Odesa, Ukraine",
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function EfedraCasePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      {/* Section 1: Hero */}
      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Портфоліо", href: "/portfolio" },
          { label: "Efedra Clinic" },
        ]}
        eyebrow="/ CASE STUDY"
        headline={
          <>
            Efedra Clinic — стоматологія і <em>студія краси</em> в Одесі
          </>
        }
        sub="Двонапрямкова клініка в Одесі: стоматологія + естетична медицина. Перенесли з застарілого WordPress на Next.js + Sanity з мобільним онлайн-записом і локальним SEO."
      />
      <MetaStrip />

      {/* Section 2: Stats bar */}
      <StatsBar
        items={[
          { value: "×3.2", label: "більше заявок на місяць" },
          { value: "0.8s", label: "LCP (було 4.2s)" },
          { value: "98", label: "Lighthouse performance" },
          { value: "Top-3", label: "Google по local запитам" },
        ]}
      />

      {/* Section 3: Challenge */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        bulletIcon="cross"
        eyebrow="/ 02 CHALLENGE"
        heading={
          <>
            З чим <em>прийшов клієнт</em>
          </>
        }
        body="Efedra мала старий сайт на WordPress 2019 року. Він не індексувався в Google Odesa, не приймав онлайн-записи (тільки email і дзвінки), і втрачав 60%+ потенційних пацієнтів вечорами і у вихідні."
        bulletList={[
          "Сайт вантажився 4.2 секунди на мобільному",
          "Не індексувався в Google по «стоматологія Одеса»",
          "Не було онлайн-форми запису — лише телефон",
          "Російська як основна мова через локаль Одеси, але без UA-альтернативи",
          "Адмінка через WordPress: будь-яка зміна = час розробника",
          "Сайт періодично падав під час маркетингових кампаній",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.45 0.18 25)"
            to="oklch(0.30 0.12 290)"
            label="було · WordPress 2019"
          />
        }
      />

      {/* Section 4: Solution */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="/ 03 SOLUTION"
        heading={
          <>
            Що ми <em>зробили</em>
          </>
        }
        body="Перенесли на Next.js + Sanity CMS. Зробили мобільну версію основною, додали онлайн-запис з SMS-нагадуваннями і інтегрували двонапрямкову структуру (стоматологія + краса) без розриву SEO."
        bulletList={[
          "Перенесли на Next.js — швидкість 0.8 секунди",
          "Sanity CMS для самостійних правок без розробника",
          "Адаптив mobile-first з фокусом на онлайн-запис",
          "Локальне SEO під «стоматологія Одеса» + райони",
          "UA + RU багатомовність з коректним hreflang",
          "Інтеграція з HubSpot CRM для лідів",
          "Sticky-кнопка «Записатись» на мобільному",
          "Schema.org MedicalBusiness розмітка",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.55 0.18 230)"
            to="oklch(0.45 0.20 250)"
            label="стало · Next.js + Sanity"
          />
        }
      />

      {/* Section 5: Image gallery (2x2 fallback) */}
      <SimpleGallery />

      {/* Section 6: Outcome */}
      <ImageText
        variant="centered"
        eyebrow="/ 04 OUTCOME"
        heading={
          <>
            Результат через 3 місяці після <em>запуску</em>
          </>
        }
        body={[
          "Через 3 місяці після запуску — нової версії сайту приніс ×3.2 більше заявок на місяць. Мобільний трафік виріс у 4 рази через локальне SEO. Адміністратор клініки витрачає на оновлення контенту в 5 разів менше часу — все самостійно через Sanity.",
          "Загальний ROI сайту окупився за 4 місяці тільки через додаткові заявки.",
        ]}
        bulletList={[
          "Заявок на місяць: 8 → 25",
          "Мобільний трафік: ×4",
          "Час оновлення контенту: −80%",
          "Cost per acquisition: −62%",
          "Bounce rate: 68% → 41%",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.55 0.16 145)"
            to="oklch(0.45 0.18 230)"
            label="metrics · 3 months post-launch"
          />
        }
      />

      {/* Section 7: Client quote */}
      <PullQuote
        quote="Цитата клієнта буде додана після підтвердження від клініки."
        initials="A"
        name="Anna [TBD]"
        role="Адміністратор, Efedra Clinic"
        liHref="#"
      />

      {/* Section 8: Related cases */}
      <section className="hp-section">
        <div className="hp-inner">
          <div className="hp-section-head">
            <div className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>/ 06 RELATED</span>
            </div>
            <h2 className="hp-h2">
              Інші <em>кейси</em>
            </h2>
          </div>
          <div className="hp-cases-grid">
            {RELATED.map((r) => (
              <RelatedCard key={r.name} row={r} />
            ))}
          </div>
          <Link href="/portfolio" className="hp-link">
            Всі кейси
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      {/* Section 9: Final CTA */}
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
