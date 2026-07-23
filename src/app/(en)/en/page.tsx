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
  PainPoints,
  PerformanceProof,
  Process,
  Cases,
  Stack,
  PullQuoteSwiper,
  HpFooter,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { ORG_ID, SITE_ORIGIN } from "@/constants/site";
import {
  buildJsonLd,
  buildReviewNodes,
  organizationNode,
  webPageNode,
  websiteNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { EN_INDUSTRIES, EN_TIERS, buildEnHomepageFaq } from "@/content/en/homepage";
import {
  fetchPricingPlans,
  toHomepagePlanOverride,
  pricingRange,
} from "@/lib/server/fetch-pricing-plans";
import { hpEyebrowClass, hpEyebrowDotClass, hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";

export const metadata: Metadata = {
  title: "ᐈ Custom Website Development Studio | Code-Site.Art",
  description:
    "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
  alternates: {
    canonical: `${SITE_ORIGIN}/en`,
    languages: {
      uk: SITE_ORIGIN,
      "en-GB": `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title: "ᐈ Custom Website Development Studio | Code-Site.Art",
    description:
      "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
    type: "website",
    locale: "en_GB",
    url: `${SITE_ORIGIN}/en`,
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Custom Website Development Studio | Code-Site.Art",
    description:
      "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
  },
};

const HOMEPAGE_EN_DESCRIPTION =
  "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.";

export default async function HomePageEn() {
  const [cmsPlans, testimonialSlides] = await Promise.all([
    fetchPricingPlans("en"),
    fetchTestimonialSlides("en"),
  ]);
  const tiers = cmsPlans.length ? cmsPlans.map((p) => p.tier) : EN_TIERS;
  const planOverride = toHomepagePlanOverride(cmsPlans);
  const faqItems = buildEnHomepageFaq(planOverride);
  const range = pricingRange(cmsPlans, "en");

  // Same slides feed the slider below — Google's "review visible on page"
  // rule is satisfied. Slides missing rating or date are silently dropped.
  const reviews = buildReviewNodes(
    testimonialSlides.map((s) => ({
      body: s.quote,
      authorName: s.authorName,
      rating: s.rating,
      datePublished: s.reviewDate ?? s.createdAt?.slice(0, 10),
      headline: s.reviewHeadline,
    })),
    ORG_ID,
  );

  const jsonLd = buildJsonLd([
    organizationNode(),
    websiteNode("en", HOMEPAGE_EN_DESCRIPTION),
    webPageNode({
      path: "/en",
      locale: "en",
      title: "ᐈ Custom Website Development Studio | Code-Site.Art",
      description: HOMEPAGE_EN_DESCRIPTION,
      speakableSelectors: [
        '[data-speakable="hero-title"]',
        '[data-speakable="hero-description"]',
      ],
    }),
    reviews,
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <main>
      <HeroEditorial
        eyebrow={{ label: "CODE-SITE.ART · BOUTIQUE STUDIO" }}
        h1Lines={[
          <>Websites of any complexity,</>,
          <>built to bring in</>,
          <em key="hero-em">leads 24/7.</em>,
        ]}
        lede={
          <>
            In 4–10 weeks you get a site that loads fast, earns trust from
            the first screen, and ranks in Google and AI search. Your part:
            5 hours. We handle the rest.
          </>
        }
        features={[
          { label: "Leads 24/7", sub: "Web form + WhatsApp bridge" },
          { label: "4–10 weeks", sub: "Brief to launch" },
          { label: "1-year warranty", sub: "+ 30% rebate if we slip" },
          { label: "End-to-end", sub: "Copy + design + code + hosting" },
        ]}
        ctaPrimaryLabel="Calculate the cost"
        ctaPrimaryHref="/en/calculator"
        ctaSecondaryLabel="Free site audit in 24 hours"
        ctaSecondaryHref="/en/contacts?source=hero-audit"
        ctaSecondaryShowPlay={false}
        ctaSecondaryVariant="primary"
        ctaFootnote="Within 24 hours we’ll send you a breakdown: what’s slowing your site down, why you’re not getting leads, and what to fix first."
        showStats
        stats={[
          { num: "50+", lbl: <>projects<br />across 5 years</> },
          { num: "7", lbl: <>countries<br />UA · EU · US · DK · ZA · UK · FR</> },
          { num: "×3.2", lbl: <>more leads<br />on average</> },
          { num: "30%", lbl: <>penalty if we<br />miss the deadline</> },
        ]}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
        deviceMockupAlt="Custom business website mockup built by Code-Site.Art"
      />

      <PainPoints locale="en" />

      <ValueStack locale="en" />

      <PerformanceProof locale="en" />

      <Industries
        eyebrow=""
        heading={
          <>
            Built for <em>your industry.</em>
          </>
        }
        sub="A full solution with the integrations and compliance your sector expects."
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
            <span className="text-ink-3">You know up front what you’ll get, when, and for how much.</span>
          </>
        }
        steps={[
          { n: "01", name: "Brief", duration: "1 day", items: ["Business goals", "Structure", "Competitor analysis"] },
          { n: "02", name: "Architecture", duration: "1–2 weeks", items: ["Pages", "Funnels", "SEO structure"] },
          { n: "03", name: "Design & development", duration: "2–6 weeks", items: ["UI", "CMS setup", "Integrations"] },
          { n: "04", name: "Testing", duration: "~1 week", items: ["QA", "Analytics", "Redirects"] },
          { n: "05", name: "Launch & support", duration: "1-year support", items: ["Monitoring", "1-year warranty", "Ongoing growth"] },
        ]}
        ctaLabel="Full process"
        ctaHref="/en/process"
      />

      <Cases
        eyebrow="CASES"
        heading={
          <>
            50+ clients <em>ready to recommend us</em>
          </>
        }
        locale="en"
        ctaLabel="All cases"
        ctaHref="/en/portfolio"
      />

      <Marquee label="50+ BUSINESSES TRUSTED · UA · EU · US · DK · ZA · UK · FR" />

      <PullQuoteSwiper slides={testimonialSlides} />

      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <div className={hpEyebrowClass}>
              <span className={hpEyebrowDotClass} />
              <span>PRICING</span>
            </div>
            <h2 className={hpH2Class}>
              Transparent pricing — from <em>{range.min}</em>
            </h2>
            <p className={hpSubClass}>
              You see the price up front and lock it in before we start.
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

      <FAQ heading="Questions that come up before you start" items={faqItems} locale="en" />
      <LaunchCta locale="en" />
      </main>
      <HpFooter />
    </>
  );
}
