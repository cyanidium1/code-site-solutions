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
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "NBYG København — кейс міграції з WordPress на Next.js, ×8 заявок | Code-Site.Art",
  description:
    "Будівнича компанія в Данії: міграція з WordPress за 6 тижнів, ×8 заявок на місяць, Top-1 в локальному пошуку, 0 SEO-падінь.",
  alternates: {
    canonical: "/portfolio/nbyg-kobenhavn",
    languages: {
      uk: "/portfolio/nbyg-kobenhavn",
      en: "/en/portfolio/nbyg-kobenhavn",
      "x-default": "/portfolio/nbyg-kobenhavn",
    },
  },
  openGraph: {
    title: "NBYG København: ×8 заявок після міграції на Next.js",
    description:
      "Будівнича компанія в Данії: міграція з WordPress за 6 тижнів, ×8 заявок на місяць, Top-1 в локальному пошуку, 0 SEO-падінь.",
    type: "article",
    locale: "uk_UA",
    url: "/portfolio/nbyg-kobenhavn",
  },
};

/* ─── Asset placeholders ────────────────────────────────────────────────── */
/* TODO: replace with real screenshots from founder. Same layout as Efedra. */

function ScreenshotPending({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, oklch(0.55 0.20 25 / 0.18) 0%, oklch(0.62 0.18 60 / 0.18) 100%)",
        color: "var(--ink-3)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: 24,
      }}
    >
      {label}
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
          maxWidth: "var(--container-max)",
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
        <span>· Industry: Construction</span>
        <span>· Region: Copenhagen + Bornholm, Denmark</span>
        <span>· Year: 2024</span>
        <span>· Stack: Next.js, Sanity, Vercel</span>
        <span>· Duration: 6 weeks</span>
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
  href?: string;
  coverImage?: string;
  coverImageAlt?: string;
};

const RELATED: Related[] = [
  {
    name: "Efedra Clinic",
    meta: "Healthcare · Odesa · 2024",
    metrics: "×3.2 inquiries · LCP 0.8s · Top-3 Google",
    industry: "Healthcare",
    industryColor: "#0EA5E9",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.55 0.16 200) 100%)",
    href: "/portfolio/efedra-clinic",
    coverImage: "/EfedraCaseCreenshots/efedra-main-after.png",
    coverImageAlt: "Efedra Clinic — новий сайт після редизайну",
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

const CASE_URL = pageUrl("/portfolio/nbyg-kobenhavn");
const ABOUT_URL = pageUrl("/about");

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
          item: pageUrl("/portfolio"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "NBYG København",
          item: CASE_URL,
        },
      ],
    },
    {
      "@type": "Article",
      "@id": `${CASE_URL}#article`,
      url: CASE_URL,
      headline:
        "NBYG København — кейс міграції з WordPress на Next.js, ×8 заявок",
      description:
        "Будівнича компанія в Данії: міграція з WordPress за 6 тижнів, ×8 заявок на місяць, Top-1 в локальному пошуку, 0 SEO-падінь.",
      inLanguage: "uk",
      datePublished: "2024-11-01",
      author: {
        "@type": "Person",
        "@id": `${ABOUT_URL}#fedir-alpatov`,
        name: "Fedir Alpatov",
        jobTitle: "Founder, Code-Site.Art",
        url: ABOUT_URL,
      },
      publisher: {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "Code-Site.Art",
      },
      about:
        "Construction website redesign — NBYG København, Copenhagen + Bornholm, Denmark",
    },
  ],
};

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function NbygKobenhavnCasePage() {
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
          { label: "NBYG København" },
        ]}
        eyebrow="КЕЙС"
        headline={
          <>
            NBYG København — будівнича компанія в{" "}
            <em>Копенгагені і на Борнгольмі</em>
          </>
        }
        sub="Будівнича компанія з двома локаціями в Данії. Перенесли з застарілого WordPress на Next.js + Sanity з мобільним редагуванням, локальним SEO для двох міст і кастомною адмінкою для самостійного створення сторінок послуг."
      />
      <MetaStrip />

      {/* Section 2: Stats bar */}
      <StatsBar
        items={[
          { value: "×8", label: "більше заявок на місяць" },
          { value: "0.8s", label: "LCP (було 4.5s)" },
          { value: "98", label: "Lighthouse performance" },
          { value: "Top-1", label: "Google по local запитам" },
        ]}
      />

      {/* Section 3: Problem */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        bulletIcon="cross"
        eyebrow="ЗАДАЧА"
        heading={
          <>
            Що <em>було</em>
          </>
        }
        body="Клієнт мав застарілий сайт на WordPress 2018 року з 5 платними плагінами. Сайт не ранжувався в локальному пошуку Копенгагена і Борнгольма, мав слабкий мобільний UX і отримував лише 3 заявки на місяць — недостатньо для завантаження команди в обидвох локаціях."
        bulletList={[
          "Сайт завантажувався 4.5 секунди на мобільному",
          "Сторінка 2 в локальному пошуку за «byggefirma København» — невидимий для більшості клієнтів",
          "Тільки 3 заявки на місяць — Google Ads не окупались",
          "5 платних плагінів з річними підписками (€600/рік) + €60/міс хостинг",
          "Власник не міг сам редагувати — Elementor конфліктував з темою",
          "Без schema.org — Google не показував rich-snippets",
          "Не було розділення на дві локації (Копенгаген vs Борнгольм)",
          "Адмінка на телефоні була нечитабельна",
        ]}
        image={<ScreenshotPending label="Скріншот старого WordPress-сайту — незабаром" />}
      />

      {/* Section 4: Solution */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="РІШЕННЯ"
        heading={
          <>
            Що ми <em>зробили</em>
          </>
        }
        body="Розробили з нуля custom-coded сайт на Next.js + Sanity CMS. Архітектура з двома гео-таргетованими лендингами (Копенгаген і Борнгольм), глибока структура послуг із підсторінками, інтегрований Telegram для миттєвих заявок, повний schema.org під LocalBusiness."
        bulletList={[
          "Custom code на Next.js — нуль плагінів, нуль підписок",
          "Sanity CMS з drag-and-drop блоками для самостійного редагування",
          "Адмінка повноцінна з телефона — створення нових сторінок послуг за 5 хвилин",
          "Підсторінки під кожну послугу (Дахи → Шифер / Метал / Ремонт) — власник додає сам",
          "Гео-таргетовані лендинги для Копенгагена і Борнгольма окремо",
          "Schema.org/LocalBusiness з годинами, послугами, зонами обслуговування",
          "Tap-to-call на мобільному + інтегрована форма онлайн-бронювання",
          "301-редіректи з усіх старих URL — 0 SEO-падінь",
          "Vercel hosting + Cloudflare CDN — €0/міс на цьому трафіку",
          "DA primary, EN ready — англомовна версія активується одним кліком",
        ]}
        image={<ScreenshotPending label="Скріншот нового сайту / адмінки — незабаром" />}
      />

      {/* TODO: screenshots gallery — awaiting assets from founder. Mirror Efedra layout when added. */}
      {/* TODO: outcome YouTube walkthrough — awaiting video from founder. */}

      {/* Section 5: Outcome */}
      <ImageText
        variant="centered"
        sectionClassName="pt-5 max-[800px]:pt-5"
        eyebrow="РЕЗУЛЬТАТ"
        heading={
          <>
            Результат через <em>60 днів після запуску</em>
          </>
        }
        body={[
          "Через 60 днів після запуску — нова версія сайту приносить ×8 заявок на місяць (24 проти 3). Органічний трафік виріс у 6 разів. Сайт займає №1 у локальному пошуку Google за «byggefirma København» і «byggefirma Bornholm». LCP — 0.8 секунди проти 4.5 секунди на старій версії.",
          "Загальний ROI сайту окупився за 2 місяці тільки через додаткові заявки. Власник самостійно створив 4 нові сторінки послуг за перший місяць — без розробника, без звертання до нас.",
        ]}
        image={<ScreenshotPending label="Відео-walkthrough — незабаром" />}
      />

      {/* Section 6: Client quote */}
      <PullQuote
        quote={
          <>
            Будівництво на Борнгольмі — щільна ніша. Боялись втратити навіть ту
            мізерну видачу, що мали. Через 30 днів після переходу трафік не
            впав, через 60 — стали <em>№1</em>. З 3 заявок на місяць вийшли на{" "}
            <em>24</em> в перший же місяць. Тепер я роблю нові сторінки послуг
            сам — з телефона.
          </>
        }
        initials="SH"
        name="Søren Hansen"
        role="Owner, NBYG København Aps"
      />

      {/* Section 7: Related cases */}
      <section className="hp-section">
        <div className="hp-inner">
          <div className="hp-section-head">
            <div className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>СУМІЖНІ КЕЙСИ</span>
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

      {/* Section 8: Final CTA */}
      <FinalCta3
        eyebrow="ЗВ'ЯЗОК"
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
