import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter, FinalCta3 } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { fetchCaseStudies } from "@/components/case-page";
import { loc } from "@/lib/shared/sanity-locale";
import type { CaseStudyRef } from "@/types/sanity";
import { presentationForCase } from "@/lib/shared/case-presentation";
import { SITE_ORIGIN, pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Портфоліо — кейси від Code-Site.Art",
  description:
    "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів. Від $1 000 до $14 000+.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Портфоліо — кейси від Code-Site.Art",
    description:
      "Реальні кейси з реальними метриками. Сайти для клінік, юристів, e-commerce, стартапів.",
    type: "website",
    locale: "uk_UA",
    url: "/portfolio",
  },
};

export const revalidate = 3600;

/* ─── card ────────────────────────────────────────────────────────────── */

function PortfolioCard({ c }: { c: CaseStudyRef }) {
  const pres = presentationForCase(c.slug, c.industrySlug);
  const name = loc(c.title, "uk") || c.client || c.slug;
  const meta = [pres.label, loc(c.region, "uk"), c.year ? String(c.year) : null]
    .filter(Boolean)
    .join(" · ");
  const metrics = loc(c.metricsLine, "uk");

  return (
    <Link href={`/portfolio/${c.slug}`} className="hp-case-link">
      <div className="hp-case-cover">
        <div
          className="hp-case-cover-bg"
          style={{ background: pres.gradient }}
        />
        <div className="hp-case-cover-dots" />
        <div
          className="hp-case-shot"
          style={
            c.coverImage?.asset?.url
              ? { display: "flex", flexDirection: "column" }
              : undefined
          }
        >
          <div className="hp-case-shot-bar">
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
          </div>
          {c.coverImage?.asset?.url ? (
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.coverImage.asset.url}
                alt={loc(c.coverImage.alt, "uk") || name}
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
      </div>
      <div className="hp-case-body">
        <div className="hp-case-chips">
          <span
            className="hp-case-chip"
            style={{ color: pres.color, borderColor: `${pres.color}55` }}
          >
            {pres.label}
          </span>
          <span className="hp-case-chip">{pres.tech}</span>
        </div>
        <div className="hp-case-name-row">
          <h3 className="hp-case-name">{name}</h3>
          <ArrowUpRight
            size={20}
            strokeWidth={1.6}
            className="hp-case-arrow"
          />
        </div>
        <div className="hp-case-meta">{meta}</div>
        {metrics ? <div className="hp-case-metrics">{metrics}</div> : null}
      </div>
    </Link>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default async function PortfolioPage() {
  const cases = await fetchCaseStudies();

  const PORTFOLIO_URL = pageUrl("/portfolio");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Головна", item: SITE_ORIGIN },
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
          numberOfItems: cases.length,
          itemListElement: cases.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: loc(c.title, "uk") || c.client || c.slug,
            url: `${SITE_ORIGIN}/portfolio/${c.slug}`,
          })),
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Портфоліо" },
        ]}
        eyebrow="/ PORTFOLIO"
        headline={
          <>
            Кейси: реальні проєкти з <em>реальними метриками</em>
          </>
        }
        sub="Кожен кейс — повний розбір з «до/після», цифрами і скриншотами."
      />

      <section className="hp-section">
        <div className="hp-inner">
          {cases.length > 0 ? (
            <div className="hp-cases-grid">
              {cases.map((c) => (
                <PortfolioCard key={c._id} c={c} />
              ))}
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                fontFamily: "JetBrains Mono, monospace",
                color: "var(--ink-3)",
                padding: "60px 0",
              }}
            >
              Кейси завантажуються…
            </p>
          )}
        </div>
      </section>

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
