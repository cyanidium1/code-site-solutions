import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Calendar, MessageCircle, Mail } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { HpHeader, HpFooter, FinalCta3 } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { fetchCaseStudies } from "@/components/case-page";
import { loc } from "@/lib/sanity/locale";
import type { CaseStudyRef } from "@/lib/sanity/types";
import { presentationForCase } from "@/lib/case-presentation";
import { hasEnCase } from "@/lib/i18n-routes";
import { SITE_ORIGIN, pageUrl } from "@/lib/site";

const UK_PATH = "/portfolio";
const EN_PATH = "/en/portfolio";
const PORTFOLIO_URL = pageUrl(EN_PATH);

export const metadata: Metadata = {
  title: "Portfolio — 8 public cases, more under NDA | Code-Site.Art",
  description:
    "Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo. Cases you can check in Google and ask the client about.",
  alternates: {
    canonical: EN_PATH,
    languages: { uk: UK_PATH, en: EN_PATH, "x-default": UK_PATH },
  },
  openGraph: {
    title: "Portfolio — 8 public cases, more under NDA | Code-Site.Art",
    description:
      "Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: EN_PATH,
  },
};

export const revalidate = 3600;

function PortfolioCard({ c }: { c: CaseStudyRef }) {
  const pres = presentationForCase(c.slug, c.industrySlug);
  const name = loc(c.title, "en") || c.client || c.slug;
  // EN listing deep-links into /en/portfolio/<slug> only when the case
  // actually has EN content; otherwise the card sends the user to the
  // UA case page (better than a 404).
  const href = hasEnCase(c.slug)
    ? `/en/portfolio/${c.slug}`
    : `/portfolio/${c.slug}`;
  const meta = [pres.label, loc(c.region, "en"), c.year ? String(c.year) : null]
    .filter(Boolean)
    .join(" · ");
  const metrics = loc(c.metricsLine, "en");

  return (
    <Link href={href} className="hp-case-link">
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
                alt={loc(c.coverImage.alt, "en") || name}
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

const FINAL_CTA_CARDS = [
  {
    icon: Calendar,
    title: "Book a call",
    body: "30-min Zoom. We'll show real cases, discuss your project.",
    cta: "Open Calendly →",
    href: "https://calendly.com/fedirdev",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    body: "Fastest channel, usually under 30 minutes.",
    cta: "Write @fedirdev →",
    href: "https://t.me/fedirdev?text=Hi%20Fedir",
    featured: true,
  },
  {
    icon: Mail,
    title: "Send a brief",
    body: "Detailed form, reply within 4 business hours.",
    cta: "Open form →",
    href: "/en/contacts",
  },
];

export default async function PortfolioPageEn() {
  const cases = await fetchCaseStudies();

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
            item: PORTFOLIO_URL,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${PORTFOLIO_URL}#collection`,
        url: PORTFOLIO_URL,
        name: "Portfolio — Code-Site.Art",
        description:
          "Real projects with real numbers. Sites for clinics, lawyers, e-commerce, startups.",
        inLanguage: "en",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: cases.length,
          itemListElement: cases.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: loc(c.title, "en") || c.client || c.slug,
            url: hasEnCase(c.slug)
              ? `${SITE_ORIGIN}/en/portfolio/${c.slug}`
              : `${SITE_ORIGIN}/portfolio/${c.slug}`,
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
        breadcrumbs={[{ label: "Home", href: "/en" }, { label: "Portfolio" }]}
        eyebrow="/ PORTFOLIO"
        headline={
          <>
            8 public cases. 39 under NDA. <em>The numbers are real.</em>
          </>
        }
        sub={
          <>
            Every case is a full breakdown with &ldquo;before / after&rdquo; and
            metrics. ×3.2 inquiries, $4M raised, 24 leads/mo. Cases you can
            verify on Google and email the client about.
          </>
        }
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
              Cases loading…
            </p>
          )}
        </div>
      </section>

      <CtaBanner
        eyebrow="/ NEW PROJECT"
        heading={
          <>
            Want a <em>similar result</em>?
          </>
        }
        sub="Free 30-min consult. Tell us about the project — we'll come back with a price range within 24 hours."
        ctaPrimary={{
          label: "Calculate price",
          href: "/en/calculator",
        }}
        ctaSecondary={{
          label: "Or talk to us",
          href: "/en/contacts",
        }}
      />

      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={
          <>
            Ready to <em>discuss</em> your project?
          </>
        }
        sub="Free 30-min consult. No obligation."
        cards={FINAL_CTA_CARDS}
      />

      <HpFooter />
    </>
  );
}
