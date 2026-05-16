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
  Calendar,
  MessageCircle,
  Mail,
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

const UK_PATH = "/pricing";
const EN_PATH = "/en/pricing";
const PRICING_URL = pageUrl(EN_PATH);

export const metadata: Metadata = {
  title: "Pricing — $1,000 to $14,000+ fixed in contract | Code-Site.Art",
  description:
    "Transparent pricing for custom-coded websites. From $1,000 to $14,000+. Fixed in contract. 1-year warranty. 30% rebate if we miss the deadline.",
  alternates: {
    canonical: EN_PATH,
    languages: { uk: UK_PATH, en: EN_PATH, "x-default": UK_PATH },
  },
  openGraph: {
    title: "Pricing — $1,000 to $14,000+ fixed in contract | Code-Site.Art",
    description:
      "Transparent pricing for custom-coded websites. From $1,000 to $14,000+. Fixed in contract. 1-year warranty.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: EN_PATH,
  },
};

/* ─── Placeholder visual (same as UA) ────────────────────────────────────── */

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

/* ─── Turnkey list — 9 items + "what we don't do" ───────────────────────── */

const TURNKEY_ITEMS: TurnkeyItem[] = [
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

const TURNKEY_NOT_DOING: string[] = [
  "Product photography",
  "Paid ads (Google Ads / Facebook)",
  "Maintenance of third-party code / WordPress sites",
];

const TURNKEY_FOOTER = (
  <div className="turnkey-list-not">
    <div className="turnkey-list-not-head">What we don&apos;t do</div>
    <ul className="turnkey-list-not-list">
      {TURNKEY_NOT_DOING.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p className="turnkey-list-not-foot">
      If you need any of these — we&apos;ll connect you with vetted partners.
      We don&apos;t mark up other people&apos;s work.
    </p>
  </div>
);

/* ─── Pricing tiers (4) ─────────────────────────────────────────────────── */

// Shared labels for all tiers. The Tier component defaults these to UA;
// override here so /en/pricing renders English chrome.
const TIER_LABELS = {
  priceLabel: "from",
  bestForLabel: "Best for:",
  excludesHeading: "Doesn't include",
} as const;

const TIERS: TierProps[] = [
  {
    name: "Landing",
    price: "$1,000",
    weeks: "1–2 weeks",
    bestFor: "Fast launch of one offer, MVP, hypothesis testing.",
    priceLabel: TIER_LABELS.priceLabel,
    bestForLabel: TIER_LABELS.bestForLabel,
    includes: {
      heading: "What's included",
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
      heading: TIER_LABELS.excludesHeading,
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
    price: "$3,500",
    weeks: "4–8 weeks",
    bestFor:
      "Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.",
    priceLabel: TIER_LABELS.priceLabel,
    bestForLabel: TIER_LABELS.bestForLabel,
    includes: {
      heading: "What's included",
      items: [
        <>
          Industry <em>compliance</em> (GDPR / HIPAA-aware)
        </>,
        "5+ industry integrations (Helsi/Clio/MEDoc and others)",
        "Local SEO targeting your area",
        "Client account area",
        <>
          E-signature (<em>Diia.Sign</em> / DocuSign)
        </>,
        "UA + RU multilingual",
        "Cost calculators (1–3)",
        "Up to 30 pages",
        <>
          1-year warranty + <em>30%</em> rebate for delays
        </>,
      ],
    },
    excludes: {
      heading: TIER_LABELS.excludesHeading,
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
    price: "$7,500",
    weeks: "6–10 weeks",
    bestFor:
      "Businesses growing across multiple markets that need EN locale, 30+ pages, and one deep integration (CRM / ERP / payments).",
    priceLabel: TIER_LABELS.priceLabel,
    bestForLabel: TIER_LABELS.bestForLabel,
    includes: {
      heading: "Everything in Industry Pro, plus",
      items: [
        <>
          <em>EN locale</em>
        </>,
        "30+ pages",
        "1 custom integration",
        "Dedicated PM with weekly status updates",
        "Advanced SEO (programmatic landing pages)",
        <>
          1-year warranty + <em>30%</em> rebate for delays
        </>,
      ],
    },
    excludes: {
      heading: TIER_LABELS.excludesHeading,
      items: [
        "24/7 SLA (only in Custom)",
        "Dedicated team of 5–7 people",
        "Complex SaaS architecture",
      ],
    },
    ctaLabel: "Choose Pro Plus →",
    ctaHref: "/en/contacts?tier=proplus",
  },
  {
    name: "Custom",
    price: "$14,000",
    weeks: "8–16 weeks",
    bestFor:
      "Complex products with bespoke logic — SaaS, marketplace, B2B portal.",
    priceLabel: TIER_LABELS.priceLabel,
    bestForLabel: TIER_LABELS.bestForLabel,
    includes: {
      heading: "Everything in Pro Plus, plus",
      items: [
        "Architecture session before kickoff",
        "Dedicated team (5–7 people on your project)",
        <>
          UA + RU + <em>EN</em> + other languages on request
        </>,
        "Complex payment flows",
        "APIs for external integrations",
        <>
          <em>24/7 SLA</em> with 4-hour response
        </>,
        "SOC 2-ready architecture (for B2B SaaS)",
        "Custom modules",
        "Post-warranty support under SLA",
      ],
    },
    excludes: {
      heading: TIER_LABELS.excludesHeading,
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

/* ─── Add-ons (Bento × 6) ───────────────────────────────────────────────── */

const ADDONS_CELLS: BentoCell[] = [
  {
    icon: Search,
    title: "SEO audit",
    body: "Technical + content audit of your current site. Prioritized list of fixes.",
    stat: "$300",
    span: "1x1",
  },
  {
    icon: ArrowRightLeft,
    title: "WordPress migration",
    body: "Move to Next.js without losing SEO history. 301 redirects, Search Console handoff.",
    stat: "$500–$2,000",
    span: "1x1",
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
    body: "Simplified landing for a time-sensitive campaign. 7–14 days from brief to launch.",
    stat: "$1,500",
    span: "1x1",
  },
  {
    icon: Palette,
    title: "Branding (via partners)",
    body: "Logo, brand identity, brand book. Through our vetted partners.",
    stat: "from $1,500",
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

/* ─── FAQ (8 items) ─────────────────────────────────────────────────────── */

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
      "10% off if you pay 100% upfront. Beyond that — we'd rather not. The price already accounts for fixed-cost overhead. Discounting it means cutting corners somewhere.",
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
      "Projects from $10,000 can be paid in three installments — at kickoff, mid-project, and on delivery.",
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

/* ─── JSON-LD (matches UA shape exactly) ────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PRICING_URL}#service`,
      name: "Custom website development",
      description:
        "Custom-coded websites on Next.js: landings, corporate sites, industry-specific solutions, enterprise platforms.",
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
              "Industry-specific site: healthcare, legal, accounting. With compliance and industry integrations.",
            price: "3500",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Pro Plus",
            description:
              "For businesses growing across multiple markets that need EN locale, 30+ pages, and one deep integration.",
            price: "7500",
            priceCurrency: "USD",
            url: PRICING_URL,
          },
          {
            "@type": "Offer",
            name: "Enterprise — Custom",
            description:
              "Complex platforms: SaaS, marketplaces, e-commerce 1000+ SKU, multi-location networks.",
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

/* ─── Final CTA cards (3 channels) ──────────────────────────────────────── */

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

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PricingPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/en" }, { label: "Pricing" }]}
        eyebrow="/ PRICING"
        headline={
          <>
            Pricing is <em>what you get</em>. Not &ldquo;on request.&rdquo;
          </>
        }
        sub="From $1,000 to $14,000+, fixed in the contract. The price includes everything — copywriting, design, frontend, code, domain, hosting, launch, one year of support. You pay once, you get a finished product."
      />

      <TurnkeyList
        eyebrow="/ 02 TURNKEY"
        heading={
          <>
            <em>9 things</em> included in every tier
          </>
        }
        sub="You pay a fixed sum and get a finished site. No briefs to write. No references to hunt down. No photographer to chase. Here's what's in every project — no extra charges."
        items={TURNKEY_ITEMS}
        footer={TURNKEY_FOOTER}
      />

      <section className="hp-section" id="tiers">
        <div className="hp-inner">
          <div className="pricing-tier-grid-4">
            {TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="/ 02 INCLUDED"
        heading={
          <>
            What&apos;s <em>included in every tier</em> — no exceptions
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

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="/ 03 NOT INCLUDED"
        heading={
          <>
            What&apos;s <em>NOT</em> included — honestly
          </>
        }
        body="We don't hide our limits. Here's what's NOT in the price — but we can help separately or recommend partners."
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

      <Bento
        eyebrow="/ 04 ADD-ONS"
        heading={
          <>
            Add-ons <em>outside the standard packages</em>
          </>
        }
        cells={ADDONS_CELLS}
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="/ 05 PAYMENT"
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
          "Fixed-sum contract. If we miss the deadline through our fault — we pay you the rebate.",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 230)"
            to="oklch(0.45 0.20 295)"
            label="payment · contract"
          />
        }
      />

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

      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="Pricing FAQ" items={PRICING_FAQ} />
      </section>

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
