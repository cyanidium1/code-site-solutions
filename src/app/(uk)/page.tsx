import { ValueStack } from "@/components/blocks/value-stack";
import { FAQ } from "@/components/blocks/final";
import {
  HomeHero,
  HpHeader,
  Marquee,
  Industries,
  PainPoints,
  Process,
  Cases,
  PullQuoteSwiper,
  HpFooter,
} from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { LeadFormCard, PackageCards, UspLine } from "@/components/blocks/packages";
import { FounderNote } from "@/components/homepage/founder-note";
import { ORG_ID } from "@/constants/site";
import {
  buildJsonLd,
  buildReviewNodes,
  organizationNode,
  webPageNode,
  websiteNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { HOMEPAGE_UK as C } from "@/content/uk/homepage";
import { fetchTestimonialSlides } from "@/lib/server/fetch-testimonials";
import { Directions } from "@/components/homepage/directions";
import { hpH2Class, hpInnerClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";

// <title>/description for `/` live in `(uk)/layout.tsx` (built from the
// same `HOMEPAGE_UK.meta`), so the JSON-LD below and the head always agree.

export default async function HomePage() {
  const testimonialSlides = await fetchTestimonialSlides("uk");

  // Reviews attach to the Organization — same slides feed the slider, so
  // Google's "review visible on page" rule is satisfied. Slides missing
  // rating or date are silently dropped by `buildReviewNodes`.
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
    websiteNode("uk", C.meta.description),
    webPageNode({
      path: "/",
      locale: "uk",
      title: C.meta.title,
      description: C.meta.description,
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
      {/* TZ v2 §3.1: product + term + price in the H1, the lead form in the
          first screen (right column from lg, straight under the proofs on
          phones). */}
      <HomeHero
        h1Lines={[
          <>{C.hero.h1Line1}</>,
          <>
            {C.hero.h1Line2Lead}
            <em>{C.hero.h1Line2Em}</em>
          </>,
        ]}
        lede={C.hero.lede}
        features={C.hero.features}
        ctaPrimaryLabel={C.hero.ctaPrimary}
        ctaPrimaryHref="#lead-form"
        ctaSecondaryLabel={C.hero.ctaSecondary}
        ctaSecondaryHref="#pricing"
        ctaFootnote={C.hero.footnote}
        deviceMockupSrc="/hero/hero-mockup.webp"
        deviceMockupAlt={C.hero.mockupAlt}
        aside={<LeadFormCard locale="uk" source="home-hero" />}
      />

      {/* Cases right after the hero (owner, 2026-09-17): real sites are the
          strongest proof we have, so they come before any argument. The
          logo line follows as the reach claim. */}
      <Cases
        eyebrow={C.cases.eyebrow}
        heading={
          <>
            {C.cases.headingLead}
            <em>{C.cases.headingEm}</em>
          </>
        }
        ctaLabel={C.cases.ctaLabel}
        ctaHref={C.cases.ctaHref}
      />

      <Marquee />

      <PainPoints />
      <ValueStack />

      <section className={hpSectionClass} id="pricing">
        <div className={hpInnerClass}>
          <div className={hpSectionHeadClass}>
            <h2 className={hpH2Class}>
              {C.pricing.headingLead}
              <em>{C.pricing.headingEm}</em>
            </h2>
            <p className={hpSubClass}>{C.pricing.sub}</p>
          </div>
          <PackageCards locale="uk" source="home-pricing" compact />
          <UspLine locale="uk" className="mt-6 text-center lg:mt-8" />
        </div>
      </section>

      <Industries
        heading={
          <>
            {C.industries.headingLead}
            <em>{C.industries.headingEm}</em>
          </>
        }
        sub={C.industries.sub}
        locale="uk"
      />
      <Process
        heading={
          <>
            {C.process.headingLead}
            <br />
            <em>{C.process.headingEm}</em>
          </>
        }
        sub={C.process.sub}
        steps={C.process.steps}
        note={C.process.shopLine}
        ctaLabel={C.process.ctaLabel}
        ctaHref={C.process.ctaHref}
        moreLabel={C.process.moreLabel}
      />

      <PullQuoteSwiper slides={testimonialSlides} />

      <FounderNote />

      <Directions {...C.directions} />

      <FAQ heading={C.faqHeading} items={C.faq} />
      <LaunchCta locale="uk" />
      </main>
      <HpFooter />
    </>
  );
}
