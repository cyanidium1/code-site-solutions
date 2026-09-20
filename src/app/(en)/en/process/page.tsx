import type { Metadata } from "next";
import { AppImage } from "@/lib/shared/app-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { CaseStrip } from "@/components/blocks/case-strip";
import { VerticalTimeline } from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import { OG_DEFAULT_IMAGE } from "@/constants/site";
import {
  PACKAGES,
  PAYMENT_TERMS,
  formatPackagePrice,
  formatPackageTerm,
} from "@/constants/pricing";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/en/process";
import { buildAlternates } from "@/lib/shared/alternates";

const LOC = "en" as const;
const BUSINESS_TERM = formatPackageTerm("business", LOC);
const SHOP_TERM = formatPackageTerm("shop", LOC);
const LANDING_TERM = formatPackageTerm("landing", LOC);
const BUSINESS_PRICE = formatPackagePrice("business", LOC);

const META_TITLE = `How we build a website in ${BUSINESS_TERM} | Code-Site.Art`;
const META_DESCRIPTION = `A business website for ${BUSINESS_PRICE} in ${BUSINESS_TERM}, an online store in ${SHOP_TERM}. What happens each day, a fixed price in the contract, 1-year warranty.`;

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: buildAlternates({ locale: LOC, uaPath: "/process" }),
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
    locale: "en_GB",
    url: "/en/process",
    images: [OG_DEFAULT_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE.url],
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/en/process",
    locale: LOC,
    title: META_TITLE,
    description: META_DESCRIPTION,
  }),
  breadcrumbNode([
    { name: "Home", path: "/en" },
    { name: "Process", path: "/en/process" },
  ]),
  // SEO audit Aug 2026: the HowTo node was removed (Google retired the HowTo
  // rich result in 2023). The on-page steps are untouched.
  {
    "@type": "FAQPage",
    mainEntity: PROCESS_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: plainRich(it.a),
      },
    })),
  },
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EnProcessPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/en" },
          { label: "Process" },
        ]}
        eyebrow={`PROCESS · ${BUSINESS_TERM.toUpperCase()}`}
        headline={
          <>
            A business website in {BUSINESS_TERM}. <em>What happens each day</em>.
          </>
        }
        sub={`You tell us about your business; we do the structure, copy, design, code and launch. Price and deadline are fixed in the contract before we start. Landing page: ${LANDING_TERM}. Online store: ${SHOP_TERM}.`}
      />

      <StatsBar
        items={[
          { value: <>{PACKAGES.business.days.min}</>, label: "working days — business website" },
          { value: <>{PACKAGES.shop.days.min}</>, label: "working days — online store" },
          { value: <>100%</>, label: "fixed price in the contract" },
          {
            value: <>{PAYMENT_TERMS.latePenaltyPercentPerDay}%</>,
            label: `penalty per day late, up to ${PAYMENT_TERMS.latePenaltyCapPercent}%`,
          },
        ]}
      />

      <VerticalTimeline steps={STEPS} detailsLabel="What we do and what you get" />

      {/* Portfolio strip — the page ran seven text-only steps with a
          single photo on it (design audit 2026-09-07). */}
      <CaseStrip
        locale={LOC}
        slugs={[
          "nbyg-kobenhavn",
          "grontland",
          "webbond",
          "domlivo",
          "clarion-solutions",
          "right-cars",
        ]}
        sub="The steps above are how the projects below were built."
      />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="COMMUNICATION"
        heading={
          <>
            How we <em>communicate</em> during the project
          </>
        }
        body="You never wait for the site blind. You see and approve every step."
        bulletList={[
          "One chat for the whole project — replies in business hours",
          "A preview link from the first day of development",
          "Code in your GitHub from the first commit",
          "A call whenever you want one, never required",
          "If you're unreachable, the deadline moves by the same number of days",
        ]}
        image={
          <AppImage
            src="/communication.webp"
            alt="Mono Pools website on laptop and phone with completed projects and client reviews"
            width={1600}
            height={1289}
            sizes={IMG_SIZES.half}
          />
        }
      />

      <section className="bg-bg">
        <FAQ heading="What if…?" items={PROCESS_FAQ} locale={LOC} />
      </section>

      <CtaBanner
        eyebrow="READY?"
        heading={
          <>
            Ready to walk through the process <em>with us</em>?
          </>
        }
        sub="The first step is free: a quote within 24 hours — package, price and timeline."
        ctaPrimary={{
          label: "Calculate the price →",
          href: "/en/calculator",
        }}
        ctaSecondary={{
          label: "Get a quote",
          href: "/en/contacts",
        }}
      />

      <HpFooter />
    </>
  );
}
