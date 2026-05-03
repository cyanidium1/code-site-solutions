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
    "NBYG København — WordPress migration to Next.js, 8× inquiries | Code-Site.Art",
  description:
    "Danish construction company: migrated off WordPress in 6 weeks, 8× monthly inquiries, #1 in local search, zero SEO drops.",
  alternates: {
    canonical: `${SITE_ORIGIN}/en/portfolio/nbyg-kobenhavn`,
    languages: {
      uk: `${SITE_ORIGIN}/portfolio/nbyg-kobenhavn`,
      en: `${SITE_ORIGIN}/en/portfolio/nbyg-kobenhavn`,
      "x-default": `${SITE_ORIGIN}/portfolio/nbyg-kobenhavn`,
    },
  },
  openGraph: {
    title: "NBYG København: 8× inquiries after migrating to Next.js",
    description:
      "Danish construction company: migrated off WordPress in 6 weeks, 8× monthly inquiries, #1 in local search, zero SEO drops.",
    type: "article",
    locale: "en_US",
    url: `${SITE_ORIGIN}/en/portfolio/nbyg-kobenhavn`,
  },
};

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
        <span>· Industry: Construction</span>
        <span>· Region: Copenhagen + Bornholm, Denmark</span>
        <span>· Year: 2024</span>
        <span>· Stack: Next.js, Sanity, Vercel</span>
        <span>· Duration: 6 weeks</span>
      </div>
    </section>
  );
}

/* ─── Related cases ─────────────────────────────────────────────────────── */

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
    coverImageAlt: "Efedra Clinic — new site after redesign",
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
    metrics: "Custom design · Complex portfolio · Multi-language",
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

const CASE_URL = `${SITE_ORIGIN}/en/portfolio/nbyg-kobenhavn`;
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
          name: "Home",
          item: `${SITE_ORIGIN}/en`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Portfolio",
          item: `${SITE_ORIGIN}/portfolio`,
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
        "NBYG København — WordPress migration to Next.js, 8× inquiries",
      description:
        "Danish construction company: migrated off WordPress in 6 weeks, 8× monthly inquiries, #1 in local search, zero SEO drops.",
      inLanguage: "en",
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

export default function NbygKobenhavnEnCasePage() {
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
          { label: "Home", href: "/en" },
          { label: "Portfolio", href: "/portfolio" },
          { label: "NBYG København" },
        ]}
        eyebrow="/ CASE STUDY"
        headline={
          <>
            NBYG København — construction company in{" "}
            <em>Copenhagen and Bornholm</em>
          </>
        }
        sub="Construction company with two locations in Denmark. Migrated from a legacy WordPress site to Next.js + Sanity with mobile editing, local SEO for two cities, and a custom admin where the owner creates new service pages himself."
      />
      <MetaStrip />

      {/* Section 2: Stats bar */}
      <StatsBar
        items={[
          { value: "×8", label: "MORE INQUIRIES PER MONTH" },
          { value: "0.8s", label: "LCP (WAS 4.5s)" },
          { value: "98", label: "LIGHTHOUSE PERFORMANCE" },
          { value: "Top-1", label: "GOOGLE LOCAL SEARCH" },
        ]}
      />

      {/* Section 3: Problem */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        bulletIcon="cross"
        eyebrow="/ 02 PROBLEM"
        heading={
          <>
            What was <em>wrong</em>
          </>
        }
        body="The client had a legacy WordPress site from 2018 with 5 paid plugins. The site didn't rank in local search for Copenhagen or Bornholm, had a weak mobile UX, and pulled only 3 inquiries a month — not enough to keep the teams in both locations busy."
        bulletList={[
          "Site loaded in 4.5 seconds on mobile",
          "Page 2 in local search for “byggefirma København” — invisible to most prospects",
          "Only 3 inquiries per month — Google Ads weren’t paying back",
          "5 paid plugins with yearly subscriptions (€600/year combined) + €60/mo hosting",
          "Owner couldn’t edit himself — Elementor fought the theme",
          "No schema.org — Google didn’t show rich snippets",
          "No proper split between the two locations (Copenhagen vs Bornholm)",
          "Admin on mobile was unusable",
        ]}
      />

      {/* Section 4: Solution */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="/ 03 SOLUTION"
        heading={
          <>
            What we <em>did</em>
          </>
        }
        body="We rebuilt the site from scratch as a custom-coded Next.js + Sanity CMS project. The architecture has two geo-targeted landings (Copenhagen and Bornholm), a deep service structure with sub-pages, integrated Telegram for instant lead notifications, and full schema.org for LocalBusiness."
        bulletList={[
          "Custom code on Next.js — zero plugins, zero subscriptions",
          "Sanity CMS with drag-and-drop blocks for self-editing",
          "Full admin from a phone — owner creates new service pages in 5 minutes",
          "Sub-pages per service (Roofing → Shingle / Metal / Repair) — owner adds them himself",
          "Geo-targeted landings for Copenhagen and Bornholm separately",
          "Schema.org/LocalBusiness with hours, services, service areas",
          "Tap-to-call on mobile + integrated online booking form",
          "301 redirects from every old URL — zero SEO drops",
          "Vercel hosting + Cloudflare CDN — €0/mo at this traffic",
          "DA primary, EN ready — English version activates with one click",
        ]}
      />

      {/* TODO: screenshots gallery — awaiting assets from founder. Mirror Efedra layout when added. */}
      {/* TODO: outcome YouTube walkthrough — awaiting video from founder. */}

      {/* Section 5: Outcome */}
      <ImageText
        variant="centered"
        sectionClassName="pt-5 max-[800px]:pt-5"
        eyebrow="/ 04 OUTCOME"
        heading={
          <>
            Results after <em>60 days post-launch</em>
          </>
        }
        body={[
          "Sixty days after launch, the new site is bringing 8× more inquiries per month (24 vs. 3). Organic traffic is up 6×. The site ranks #1 in Google local search for “byggefirma København” and “byggefirma Bornholm.” LCP is 0.8 seconds versus 4.5 seconds on the old site.",
          "Total site ROI paid back in 2 months just from the new inquiries. The owner has independently created 4 new service pages in the first month — no developer involved, no calls to us.",
        ]}
      />

      {/* Section 6: Client quote */}
      <PullQuote
        quote={
          <>
            Construction on Bornholm is a tight niche. We were nervous about
            losing even the small Google traction we had. Thirty days after
            the move, traffic held. Sixty days in, we were <em>#1</em>{" "}
            locally. From 3 inquiries a month to <em>24</em> in our first
            month live. Now I add new service pages myself — from my phone.
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
              <span>/ 06 RELATED</span>
            </div>
            <h2 className="hp-h2">
              Other <em>case studies</em>
            </h2>
          </div>
          <div className="hp-cases-grid">
            {RELATED.map((r) => (
              <RelatedCard key={r.name} row={r} />
            ))}
          </div>
          <Link href="/portfolio" className="hp-link">
            All cases
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={
          <>
            Ready to <em>discuss</em> a project?
          </>
        }
        sub="Free 30-min consultation. No commitment."
      />

      <HpFooter />
    </>
  );
}
