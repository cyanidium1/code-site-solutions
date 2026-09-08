import { buildAlternates } from "@/lib/shared/alternates";
import type { Metadata } from "next";
import { ValueStack } from "@/components/blocks/value-stack";
import { Tier, CmpPricingGrid } from "@/components/blocks/comparison";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  Marquee,
  Industries,
  BusinessValue,
  PainPoints,
  Cases,
  Stack,
  PullQuoteSwiper,
  HpFooter,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { OG_DEFAULT_IMAGE, ORG_ID, SITE_ORIGIN } from "@/constants/site";
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
import { HeroShowcase } from "@/components/homepage/hero-showcase";
import { WorldReach } from "@/components/homepage/world-reach";

export const metadata: Metadata = {
  title: "ᐈ Custom Website Development Studio | Code-Site.Art",
  description:
    "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
  alternates: buildAlternates({ locale: "en", uaPath: "/" }),
  openGraph: {
    title: "ᐈ Custom Website Development Studio | Code-Site.Art",
    description:
      "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
    type: "website",
    locale: "en_GB",
    url: `${SITE_ORIGIN}/en`,
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Custom Website Development Studio | Code-Site.Art",
    description:
      "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £800 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
    images: [OG_DEFAULT_IMAGE.url],
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
      {/* Hero: the colour-changing showcase from the previous code-site.art
          build - four arguments, four real projects, three counting figures
          each. Slide 1 keeps the page h1 verbatim; the others are h2. */}
      <HeroShowcase
        locale="en"
        ctaPrimaryLabel="Calculate the cost"
        ctaPrimaryHref="/en/calculator"
        ctaSecondaryLabel="Free site audit in 24 hours"
        ctaSecondaryHref="/en/contacts?source=hero-audit"
        slideLabelTemplate="Go to slide {n}"
        slides={[
          {
            id: "leads",
            slug: "efedra-clinic",
            theme: "green",
            title: (
              <>
                Websites of any complexity, built to bring in{" "}
                <em className="not-italic text-accent-soft">leads 24/7</em>
              </>
            ),
            description:
              "We plan, write, build and launch your site in 4–10 weeks. Your part is five hours of decisions.",
            subtitle: "Leads land in a messenger, not in an inbox",
            figures: [
              { value: "×3.2", label: "more leads in the clinic case" },
              { value: "24/7", label: "web form + WhatsApp bridge" },
              { value: "1", label: "year of warranty after launch" },
            ],
            caseLabel: "Case: Efedra Clinic →",
          },
          {
            id: "speed",
            slug: "nbyg-kobenhavn",
            theme: "amber",
            title: <>Speed you can see in Core Web Vitals</>,
            description:
              "Custom code with no needless dependencies: the page opens before a visitor can change their mind.",
            subtitle: "Speed is a ranking factor",
            figures: [
              { value: "90+", label: "Lighthouse in production" },
              { value: "0.8s", label: "LCP in the clinic case" },
              { value: "100%", label: "responsive mobile / tablet / desktop" },
            ],
            caseLabel: "Case: NBYG København →",
          },
          {
            id: "price",
            slug: "solide-renovation",
            theme: "violet",
            title: <>A fixed price in the contract — from £800</>,
            description:
              "You see the number before work starts and it is fixed there. If we miss the deadline, you get a 30% rebate.",
            subtitle: "The price does not move after kickoff",
            figures: [
              { value: "£800", label: "landing page, starting price" },
              { value: "4–10", label: "weeks from brief to launch" },
              { value: "30%", label: "rebate if we miss the date" },
            ],
            caseLabel: "Case: Solide Renovation →",
          },
          {
            id: "reach",
            slug: "aleko-course",
            theme: "cyan",
            title: <>50+ projects across seven countries</>,
            description:
              "Five years of work - from a landing page to a platform with a CMS and integrations. Team in Ukraine, clients in the EU and the US.",
            subtitle: "From a landing page to a CMS platform",
            figures: [
              { value: "50+", label: "projects across 5 years" },
              { value: "7", label: "countries, mapped below" },
              { value: "5", label: "years as a studio" },
            ],
            caseLabel: "Case: Aleko Course →",
          },
        ]}
      />

      <PainPoints locale="en" />

      <ValueStack locale="en" />

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

      <Industries
        heading={
          <>
            Built for <em>your industry.</em>
          </>
        }
        sub="A full solution with the integrations and compliance your sector expects."
        items={EN_INDUSTRIES}
      />

      <BusinessValue locale="en" />

      {/* Process moved off the homepage: text-only steps with no image,
          duplicating /process, which the header, the footer and the
          "where to start" list all link to. The homepage now spends that
          height on the reach map instead. */}

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

      {/* The seven-countries claim used to be 10px of text inside a hero stat
          cell. Here it is the graphic: every pin is a real project location. */}
      <WorldReach
        eyebrow="REACH"
        heading={<>Projects shipped across <em>seven countries</em></>}
        sub="Every dot is a site we built and launched: Odesa and Kyiv, Copenhagen and Bornholm, Paris, Dublin, London, Tirana, New York, Cape Town."
        countries={["Ukraine", "Denmark", "France", "Ireland", "United Kingdom", "Albania", "USA", "South Africa"]}
        foot="Time zones have not been a problem: daily contact on Telegram, a written progress report once a week."
      />

      <PullQuoteSwiper slides={testimonialSlides} />

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
