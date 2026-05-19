import type { Metadata } from "next";
import {
  Search,
  ArrowRightLeft,
  Wrench,
  Zap,
  Palette,
  FileText,
  Smartphone,
  Code,
  LayoutDashboard,
  Lock,
  Cloud,
  Rocket,
  LifeBuoy,
} from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { TurnkeyList, type TurnkeyItem } from "@/components/blocks/turnkey-list";
import { Tier, type TierProps } from "@/components/blocks/comparison";
import "@/components/blocks/comparison/comparison.css";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  FinalCta3,
  type BentoCell,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";
import { plainRich, type RichText } from "@/lib/rich-text";
import { formatPrice } from "@/lib/formatters/price";

export const metadata: Metadata = {
  title: "Pricing — $1,000 to $14,000+ fixed in contract | Code-Site.Art",
  description:
    "Transparent pricing for custom-coded websites. From $1,000 to $14,000+. Fixed in contract. 1-year warranty. 30% rebate if we miss the deadline.",
  alternates: {
    canonical: "/en/pricing",
    languages: {
      uk: "/pricing",
      en: "/en/pricing",
      "x-default": "/pricing",
    },
  },
  openGraph: {
    title: "Pricing — $1,000 to $14,000+ fixed in contract | Code-Site.Art",
    description:
      "Transparent pricing for custom-coded websites. Fixed in contract.",
    type: "website",
    locale: "en_US",
    url: "/en/pricing",
  },
};

/* ─── Placeholder visual ─────────────────────────────────────────────────── */

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

/* ─── Turnkey items (EN) ─────────────────────────────────────────────────── */

const TURNKEY_ITEMS_EN: TurnkeyItem[] = [
  { icon: FileText, title: "Copywriting", line: "Hero, SEO articles, opening cases" },
  { icon: Palette, title: "Design", line: "2 rounds of revisions included" },
  { icon: Smartphone, title: "Frontend", line: "Responsive: mobile / tablet / desktop" },
  { icon: Code, title: "Engineering", line: "Next.js, all integrations" },
  { icon: LayoutDashboard, title: "CMS", line: "Sanity, edit content from your phone" },
  { icon: Lock, title: "Domain & SSL", line: "We set it up for you" },
  { icon: Cloud, title: "Hosting", line: "Vercel or Cloudflare on your account" },
  { icon: Rocket, title: "Launch", line: "Search Console, Analytics, 301 redirects" },
  { icon: LifeBuoy, title: "1 year of support", line: "Bugs, updates, advice" },
];

const NOT_DOING_EN: string[] = [
  "Product photography",
  "Paid ads (Google Ads / Facebook)",
  "Maintenance of third-party code / WordPress sites",
];

const TURNKEY_FOOTER_EN = (
  <div className="turnkey-list-not">
    <div className="turnkey-list-not-head">What we don&apos;t do</div>
    <ul className="turnkey-list-not-list">
      {NOT_DOING_EN.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p className="turnkey-list-not-foot">
      If you need any of these — we&apos;ll connect you with vetted partners.
      We don&apos;t mark up other people&apos;s work.
    </p>
  </div>
);

/* ─── Pricing tiers (4 — EN) ─────────────────────────────────────────────── */

const TIERS: TierProps[] = [
  {
    name: "Landing",
    price: formatPrice(1000, { locale: "en" }),
    priceLabel: "from",
    weeks: "1–2 weeks",
    bestFor:
      "Fast launch of one offer, MVP, hypothesis testing.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "1 page with responsive layout",
        "SEO structure (title, meta, schema)",
        "Lighthouse 90+",
        "1 lead form",
        "Integration with 1 system (CRM or email)",
        "Google Analytics + Tag Manager",
        "Documentation and training",
        "1-year warranty",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "Multilingual support",
        "CMS for self-editing",
        "Blog",
        "Complex integrations",
      ],
    },
    ctaLabel: "Choose Starter →",
    ctaHref: "/en/contacts?tier=starter",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: "Industry Pro",
    price: formatPrice(3500, { locale: "en" }),
    priceLabel: "from",
    weeks: "4–8 weeks",
    bestFor:
      "Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "Industry compliance (GDPR / HIPAA-aware)",
        "5+ industry integrations (Helsi/Clio/MEDoc and others)",
        "Local SEO targeting your area",
        "Client account area",
        "E-signature (Diia.Sign / DocuSign)",
        "UA + RU multilingual",
        "Cost calculators (1–3)",
        "Up to 30 pages",
        "1-year warranty + 30% rebate for delays",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "EN locale (available in Pro Plus)",
        "Complex SaaS logic",
        "24/7 SLA",
      ],
    },
    ctaLabel: "Choose Industry Pro →",
    ctaHref: "/en/contacts?tier=industry",
  },
  {
    name: "Pro Plus",
    price: formatPrice(7500, { locale: "en" }),
    priceLabel: "from",
    weeks: "6–10 weeks",
    bestFor:
      "Businesses growing across multiple markets that need EN locale, 30+ pages, and one deep integration (CRM / ERP / payments).",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Industry Pro, plus",
      items: [
        "EN locale",
        "30+ pages",
        "1 custom integration",
        "Dedicated PM with weekly status updates",
        "Advanced SEO (programmatic landing pages)",
        "1-year warranty + 30% rebate for delays",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "24/7 SLA (only in Custom)",
        "Dedicated team of 5-7 people",
        "Complex SaaS architecture",
      ],
    },
    ctaLabel: "Choose Pro Plus →",
    ctaHref: "/en/contacts?tier=proplus",
  },
  {
    name: "Custom",
    price: formatPrice(14000, { locale: "en" }),
    priceLabel: "from",
    weeks: "8–16 weeks",
    bestFor:
      "Complex products with bespoke logic — SaaS, marketplace, B2B portal.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Pro Plus, plus",
      items: [
        "Architecture session before kickoff",
        "Dedicated team (5-7 people on your project)",
        "UA + RU + EN + other languages on request",
        "Complex payment flows",
        "APIs for external integrations",
        "24/7 SLA with 4-hour response",
        "SOC 2-ready architecture (for B2B SaaS)",
        "Custom modules",
        "Post-warranty support under SLA",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "Photo/video content creation",
        "Branding from scratch (logo, brand book)",
        "Legal consulting",
      ],
    },
    ctaLabel: "Talk to us →",
    ctaGhost: true,
    ctaHref: "/en/contacts?tier=enterprise",
  },
];

/* ─── Add-ons (Bento × 6 — EN) ───────────────────────────────────────────── */

const ADDONS_CELLS: BentoCell[] = [
  {
    icon: Search,
    title: "SEO audit",
    body: "Technical + content audit of your current site. Prioritized list of fixes.",
    stat: formatPrice(300, { locale: "en" }),
    span: "1x1",
  },
  {
    icon: ArrowRightLeft,
    title: "WordPress migration",
    body: "Move to Next.js without losing SEO history. 301 redirects, Search Console handoff.",
    stat: "$500–$2,000",
    span: "2x1",
  },
  {
    icon: Wrench,
    title: "Post-warranty support",
    body: "Fixes, updates, advice. Monthly retainer or by the hour.",
    stat: "$200/mo or $40/hr",
    span: "1x1",
  },
  {
    icon: Zap,
    title: "Express landing",
    body: "Simplified landing for a time-sensitive campaign. 7-14 days from brief to launch.",
    stat: formatPrice(1500, { locale: "en" }),
    span: "1x1",
  },
  {
    icon: Palette,
    title: "Branding (via partners)",
    body: "Logo, brand identity, brand book. Through our vetted partners.",
    stat: formatPrice(1500, { locale: "en", withPrefix: true }),
    span: "1x1",
  },
  {
    icon: FileText,
    title: "Content",
    body: "B2B copywriter. Copy for landings, cases, blog.",
    stat: "$200/article",
    span: "1x1",
  },
];

/* ─── FAQ (8 — EN) ───────────────────────────────────────────────────────── */

const PRICING_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Why a fixed price, not \"on request\"?",
    a: [
      "Because your time matters. You shouldn't spend 3 hours on a consultation to find out you can't afford a tier. And it's a discipline for us — if we can't quote in 30 minutes on the brief, we don't fully understand the project yet.",
    ],
  },
  {
    q: "Why is Pro Plus more expensive than Industry Pro?",
    a: [
      "Two reasons: ",
      { em: "EN locale" },
      " doubles your SEO/CMS structure, and a dedicated PM costs us money. If you don't need multi-market reach, Industry Pro is the right tier.",
    ],
  },
  {
    q: "Can we negotiate a discount?",
    a: [
      { em: "10% off" },
      " if you pay 100% upfront. Beyond that — we'd rather not. The price already accounts for fixed-cost overhead. Discounting it means cutting corners somewhere.",
    ],
  },
  {
    q: "What if my project doesn't fit any tier?",
    a: [
      "Tell us. Sometimes it's a tier with one extra add-on; sometimes it's a true Custom. We'll be honest on the 30-min call.",
    ],
  },
  {
    q: "Can I pay in crypto?",
    a: [
      { em: "USDT TRC20" },
      ". We confirm receipt within hours and treat it like any other invoice.",
    ],
  },
  {
    q: "Is there an installment plan for large projects?",
    a: [
      "Projects from ",
      { em: "$10,000" },
      " can be paid in three installments — at kickoff, mid-project, and on delivery.",
    ],
  },
  {
    q: "How do integrations get counted?",
    a: [
      "Base CRM/email integration is $150. CRM systems (HubSpot, Pipedrive, KeyCRM) — $500. Industry integrations (Clio, MEDoc, etc.) — $500–$1,200 depending on API. Payment gateways — $900. All transparent in the calculator.",
    ],
  },
  {
    q: "What if I need changes after launch?",
    a: [
      "First year — included in warranty for bug fixes. New features — separate scope, priced per hour or per scope.",
    ],
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const PRICING_URL = pageUrl("/en/pricing");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PRICING_URL}#service`,
      name: "Custom website development",
      description:
        "Custom-coded websites on Next.js: landing pages, business sites, industry-specific solutions, enterprise platforms.",
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Code-Site.Art pricing tiers",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Starter — Landing",
            description: "Fast launch of one offer, MVP, hypothesis testing.",
            price: "1000",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Industry Pro",
            description:
              "Industry-specific site (healthcare, legal, accounting) with compliance and industry integrations.",
            price: "3500",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Pro Plus",
            description:
              "For businesses growing across multiple markets: EN locale, 30+ pages, one deep integration.",
            price: "7500",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Enterprise — Custom",
            description:
              "Complex platforms: SaaS, marketplaces, e-commerce 1000+ SKU, franchise networks.",
            price: "14000",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
        ],
      },
    },
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
          name: "Pricing",
          item: PRICING_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: PRICING_FAQ.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: plainRich(it.a),
        },
      })),
    },
  ],
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EnPricingPage() {
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
          { label: "Home", href: "/en" },
          { label: "Pricing" },
        ]}
        eyebrow="PRICING"
        headline={
          <>
            Pricing is what you get. Not <em>&ldquo;on request.&rdquo;</em>
          </>
        }
        sub='From $1,000 to $14,000+, fixed in the contract. The price includes everything — copywriting, design, frontend, code, domain, hosting, launch, one year of support. You pay once, you get a finished product.'
      />

      {/* Section 1.5: Turnkey list */}
      <TurnkeyList
        eyebrow="TURNKEY"
        heading={
          <>
            <em>9 things</em> included in every tier
          </>
        }
        sub="You pay a fixed sum and get a finished site. No briefs to write. No references to hunt down. No photographer to chase. Here's what's in every project — no extra charges."
        items={TURNKEY_ITEMS_EN}
        footer={TURNKEY_FOOTER_EN}
      />

      {/* Section 2: 4 tiers */}
      <section className="hp-section" id="tiers">
        <div className="hp-inner">
          <div className="pricing-tier-grid-4">
            {TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: What's included */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="INCLUDED"
        heading={
          <>
            What&apos;s included in <em>every tier</em> — no exceptions
          </>
        }
        body="Regardless of tier — here's the baseline you get on every Code-Site.Art project. You don't pay separately for any of this."
        bulletList={[
          "Custom design (no templates) — every site is unique",
          "Responsive build for mobile / tablet / desktop",
          "SEO structure from day one (title, meta, sitemap, robots)",
          "Lighthouse Performance 90+, SEO 95+, Accessibility 95+",
          "GitHub repository with full code — yours to own",
          "1-year warranty on bug fixes",
          "Free 30-min Zoom consult at kickoff",
          "Documentation and 1-hour admin training",
          "Handover of all accounts and passwords after launch",
          "Google Analytics + Search Console setup",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.55 0.16 145)"
            to="oklch(0.45 0.20 295)"
            label="included · all tiers"
          />
        }
      />

      {/* Section 4: What's NOT included */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="NOT INCLUDED"
        heading={
          <>
            What&apos;s <em>NOT</em> included — honestly
          </>
        }
        body="We don't hide our limits. Here's what's NOT in the price — but we can help separately or recommend partners."
        bulletIcon="cross"
        bulletList={[
          "Content: copy, photo, video — separate service or your copywriter",
          "Branding from scratch: logo, brand book — partner referral",
          "Legal consulting — only technical compliance",
          "Google Ads / Meta Ads — separate service from a performance marketer",
          "Hosting after year one — we hand over Vercel/Cloudflare accounts to you",
          "Social media strategy or management — separate service",
          "SEO campaigns after warranty year — separate package from $300/mo",
        ]}
        cta={{ label: "Discuss what you need", href: "/en/contacts" }}
        image={
          <GradPlaceholder
            from="oklch(0.45 0.18 25)"
            to="oklch(0.30 0.12 290)"
            label="not included"
          />
        }
      />

      {/* Section 5: Add-ons (Bento × 6) */}
      <Bento
        eyebrow="ADD-ONS"
        heading={
          <>
            Add-ons <em>outside the standard packages</em>
          </>
        }
        cells={ADDONS_CELLS}
      />

      {/* Section 6: Payment */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="PAYMENT"
        heading={
          <>
            How <em>payment</em> works
          </>
        }
        body="An honest schedule with no surprises. Everything fixed in the contract before kickoff."
        bulletList={[
          "50% upfront — work starts. 50% on delivery — after acceptance",
          "Bank transfer to PE (Ukrainian sole proprietor, UAH) — standard for UA clients",
          "Stripe (USD/EUR) — for international clients",
          "USDT TRC20 — if convenient",
          "Mono Pay / LiqPay — for smaller amounts",
          "3-payment installment — for projects $10,000+",
          "10% discount on full upfront payment",
          "Fixed-sum contract. If we miss the deadline through our fault — we pay you the rebate",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 230)"
            to="oklch(0.45 0.20 295)"
            label="payment · contract"
          />
        }
      />

      {/* Section 7: Calculator promo */}
      <CtaBanner
        heading={
          <>
            Not sure which <em>tier</em> is right?
          </>
        }
        sub="Our calculator runs 60 seconds and gives you a price range for your project, plus a detailed estimate by email."
        ctaPrimary={{
          label: "Try the calculator",
          href: "/en/calculator",
        }}
        ctaSecondary={{
          label: "Or talk to us",
          href: "/en/contacts",
        }}
      />

      {/* Section 8: FAQ */}
      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Pricing FAQ" items={PRICING_FAQ} locale="en" />
      </section>

      {/* Section 9: Final CTA 3 options */}
      <FinalCta3
        eyebrow="GET IN TOUCH"
        heading={
          <>
            Ready to <em>discuss</em> your project?
          </>
        }
        sub="Free 30-min consult. No obligation."
      />

      <HpFooter />
    </>
  );
}
