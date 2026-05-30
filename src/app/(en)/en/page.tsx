import type { Metadata } from "next";
import { HeroEditorial } from "@/components/blocks/hero";
import { ValueStack } from "@/components/blocks/value-stack";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  Marquee,
  Industries,
  BusinessValue,
  Process,
  Cases,
  Stack,
  PullQuoteSwiper,
  HpFooter,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { ORG_ID, SITE_CONTACT, SITE_ORIGIN, WEBSITE_ID } from "@/constants/site";
import { EN_INDUSTRIES, EN_TIERS, buildEnHomepageFaq } from "@/content/en/homepage";
import {
  fetchPricingPlans,
  toHomepagePlanOverride,
  pricingRange,
} from "@/lib/server/fetch-pricing-plans";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";

export const metadata: Metadata = {
  title:
    "Code-Site.Art — Custom websites that book meetings 24/7. Live in 4–10 weeks.",
  description:
    "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
  alternates: {
    canonical: `${SITE_ORIGIN}/en`,
    languages: {
      uk: SITE_ORIGIN,
      en: `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title:
      "Custom websites that book meetings 24/7 — Code-Site.Art",
    description:
      "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
    type: "website",
    locale: "en_US",
    url: `${SITE_ORIGIN}/en`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      url: SITE_ORIGIN,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kyiv",
        addressCountry: "UA",
      },
      sameAs: [
        SITE_CONTACT.telegram,
        SITE_CONTACT.linkedin,
        SITE_CONTACT.github,
      ],
      foundingDate: "2023",
    },
    {
      "@type": "WebSite",
      "@id": `${WEBSITE_ID}#en`,
      url: `${SITE_ORIGIN}/en`,
      name: "Code-Site.Art",
      description:
        "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default async function HomePageEn() {
  const cmsPlans = await fetchPricingPlans("en");
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : EN_TIERS;
  const planOverride = toHomepagePlanOverride(cmsPlans);
  const faqItems = buildEnHomepageFaq(planOverride);
  const range = pricingRange(cmsPlans, "en");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <main>
      <HeroEditorial
        eyebrow={{ label: "CODE-SITE.ART · BOUTIQUE STUDIO" }}
        h1Lines={[
          <>Your site books</>,
          <>meetings</>,
          <em key="hero-em">while you sleep.</em>,
        ]}
        lede={
          <>
            A custom-coded website with copy, design, and integrations —
            shipped in 4–10 weeks. We write the content, wire up the
            forms, and set up local SEO. You spend 5 hours, total.
            Within a month, leads start coming in on autopilot.
          </>
        }
        features={[
          { label: "Leads 24/7", sub: "Web form + Telegram bridge" },
          { label: "4–10 weeks", sub: "Brief to launch" },
          { label: "1-year warranty", sub: "+ 30% rebate if we slip" },
          { label: "End-to-end", sub: "Copy + design + code + hosting" },
        ]}
        ctaPrimaryLabel="Get an estimate"
        ctaPrimaryHref="/en/calculator"
        ctaSecondaryLabel="Free site audit within 24 hours"
        ctaSecondaryHref="/contacts?source=hero-audit"
        ctaSecondaryShowPlay={false}
        ctaFootnote="No sales call. No email list. Just an audit."
        showStats
        stats={[
          { num: "50+", lbl: <>projects<br />across 5 years</> },
          { num: "7", lbl: <>regions<br />UA · EU · US · DK · ZA · UK · FR</> },
          { num: "×3.2", lbl: <>avg.<br />lead lift</> },
          { num: "4.9/5", lbl: <>client<br />rating</> },
        ]}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
      />

      <Marquee label="50+ BUSINESSES TRUSTED · UA · EU · US · DK · ZA · UK · FR" />

      <ValueStack locale="en" />

      <Industries
        eyebrow=""
        heading={
          <>
            Built for <em>your industry.</em>
          </>
        }
        sub="Not just a website — a full solution with the integrations and compliance your sector expects."
        items={EN_INDUSTRIES}
      />

      <BusinessValue locale="en" />

      <Process
        eyebrow="PROCESS · 4-10 WEEKS"
        heading={
          <>
            Build. Launch. Grow.
            <br />
            <em>Without six months of meetings.</em>
          </>
        }
        sub={
          <>
            Fixed scope. Fixed timeline. Fixed price.{" "}
            <span className="text-ink-3">No endless calls, no chaos, no disappearing contractors.</span>
          </>
        }
        steps={[
          { n: "01", name: "Discovery", duration: "1 day", items: ["Business goals", "Structure", "Competitor review"] },
          { n: "02", name: "Architecture", duration: "1–2 weeks", items: ["Pages", "Funnels", "SEO structure"] },
          { n: "03", name: "Design & Build", duration: "2–6 weeks", items: ["UI Design", "CMS Setup", "Integrations"] },
          { n: "04", name: "QA & Migration", duration: "~1 week", items: ["Testing", "Analytics", "Redirects"] },
          { n: "05", name: "Launch & Support", duration: "1 year support", items: ["Monitoring", "Warranty", "Growth"] },
        ]}
        ctaLabel="Full process"
        ctaHref="/process"
      />

      <Cases
        eyebrow="CASES"
        heading={
          <>
            Projects <em>backed by the numbers</em>
          </>
        }
        locale="en"
        ctaLabel="See all work"
        ctaHref="/portfolio"
      />

      <PullQuoteSwiper locale="en" />

      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>PRICING</span>
            </div>
            <h2 className={hpH2Class}>
              Transparent pricing — from <em>{range.min}</em> to <em>{range.max}+</em>
            </h2>
            <p className={hpSubClass}>
              No &ldquo;request a quote.&rdquo; No hidden fees.
            </p>
          </div>
          <CmpPricingGrid>
            {tiers.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </CmpPricingGrid>
        </div>
      </section>

      <Stack
        eyebrow="STACK"
        heading={
          <>
            Tools <em>we use.</em>
          </>
        }
        sub="We don't chase trends. We work with 10 tools we know inside out."
        items={[
          { name: "Next.js", cat: "Framework" },
          { name: "Astro", cat: "Static sites" },
          { name: "React", cat: "UI library" },
          { name: "TypeScript", cat: "Language" },
          { name: "Tailwind", cat: "Styling" },
          { name: "HeroUI", cat: "Components" },
          { name: "Sanity", cat: "CMS" },
          { name: "Strapi", cat: "Headless CMS" },
          { name: "Vercel", cat: "Hosting" },
          { name: "Cloudflare", cat: "CDN + DNS" },
        ]}
      />

      <FAQ heading="Top questions before we start" items={faqItems} />
      <LaunchCta locale="en" />
      </main>
      <HpFooter />
    </>
  );
}
