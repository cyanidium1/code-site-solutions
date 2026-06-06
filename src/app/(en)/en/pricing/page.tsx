import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/blocks/page-hero";
import { ImageText } from "@/components/blocks/image-text";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import {
  ADDONS_CELLS,
  PRICING_FAQ,
  TURNKEY_FOOTER_EN,
  TURNKEY_ITEMS_EN,
} from "@/content/en/pricing";
import { EN_TIERS } from "@/content/en/homepage";
import { fetchPricingPlans } from "@/lib/server/fetch-pricing-plans";
import { TIER_AMOUNTS, TIER_NAMES } from "@/constants/pricing-tiers";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

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

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const PRICING_URL = pageUrl("/en/pricing");

/**
 * JSON-LD schema for the pricing page. Pure-function builder kept at module
 * scope: the *shape* of the payload lives here (out of the page component),
 * but the offer values are passed in by the caller so they can track CMS
 * data on each ISR cycle. Caller is responsible for sourcing `offers`
 * (typically from `fetchPricingPlans()` with the constants as fallback).
 */
type EnPricingOffer = { name: string; price: string; currency: string };

function buildEnPricingJsonLd(offers: EnPricingOffer[]) {
  return buildJsonLd([
    webPageNode({
      path: "/en/pricing",
      locale: "en",
      title: "Pricing — $1,000 to $14,000+ fixed in contract | Code-Site.Art",
      description:
        "Transparent pricing for custom-coded websites. From $1,000 to $14,000+. Fixed in contract. 1-year warranty. 30% rebate if we miss the deadline.",
    }),
    breadcrumbNode([
      { name: "Home", path: "/en" },
      { name: "Pricing", path: "/en/pricing" },
    ]),
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
        itemListElement: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          price: o.price,
          priceCurrency: o.currency,
          url: PRICING_URL,
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: PRICING_FAQ.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: plainRich(it.a) },
      })),
    },
  ]);
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default async function EnPricingPage() {
  const cmsPlans = await fetchPricingPlans("en");
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : EN_TIERS;

  const offers: EnPricingOffer[] = cmsPlans.length
    ? cmsPlans.map((p) => ({
        name: p.name,
        price: String(p.priceFrom),
        currency: p.currency,
      }))
    : [
        { name: TIER_NAMES.landing.en, price: String(TIER_AMOUNTS.landing), currency: "USD" },
        { name: TIER_NAMES.corporate.en, price: String(TIER_AMOUNTS.corporate), currency: "USD" },
        { name: TIER_NAMES.custom.en, price: String(TIER_AMOUNTS.custom), currency: "USD" },
      ];
  const jsonLd = buildEnPricingJsonLd(offers);

  return (
    <>
      <JsonLd data={jsonLd} />
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
      <section className={hpSectionClass} id="tiers">
        <div className={hpInnerClass}>
          <CmpPricingGrid>
            {tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
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
          <Image
            src="/included.webp"
            alt="What is included in all Code-Site.Art packages"
            width={1600}
            height={1124}
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
          <Image
            src="/not-included.webp"
            alt="What is not included in website pricing"
            width={1600}
            height={1200}
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
          <Image
            src="/payment.webp"
            alt="How website project payments are structured"
            width={1600}
            height={1200}
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
      <section className="bg-bg">
        <FAQ heading="Pricing FAQ" items={PRICING_FAQ} locale="en" />
      </section>

      {/* Section 9: Final CTA 3 options */}
      <LaunchCta
        locale="en"
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
