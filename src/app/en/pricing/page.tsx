import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier } from "@/components/blocks/comparison";
import "@/components/blocks/comparison/comparison.css";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  FinalCta3,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";
import { plainRich } from "@/lib/rich-text";
import {
  ADDONS_CELLS,
  NOT_DOING_EN,
  PRICING_FAQ,
  TIERS,
  TURNKEY_FOOTER_EN,
  TURNKEY_ITEMS_EN,
} from "@/content/en/pricing";

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
