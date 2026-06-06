import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import { VerticalTimeline } from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import {
  buildJsonLd,
  breadcrumbNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { plainRich } from "@/lib/shared/rich-text";
import { PROCESS_STEPS as STEPS, PROCESS_FAQ } from "@/content/en/process";

export const metadata: Metadata = {
  title: "Process — 7 steps from brief to launch | Code-Site.Art",
  description:
    "4-10 weeks end-to-end. Your time: 5 hours total. Fixed price, fixed deadline, 30% rebate for delays. Here's how we work.",
  alternates: {
    canonical: "/en/process",
    languages: {
      uk: "/process",
      en: "/en/process",
      "x-default": "/process",
    },
  },
  openGraph: {
    title: "Process — 7 steps from brief to launch | Code-Site.Art",
    description:
      "4-10 weeks end-to-end. Your time: 5 hours. Fixed price, 30% rebate for delays.",
    type: "website",
    locale: "en_US",
    url: "/en/process",
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/en/process",
    locale: "en",
    title: "Process — 7 steps from brief to launch | Code-Site.Art",
    description:
      "4-10 weeks end-to-end. Your time: 5 hours total. Fixed price, fixed deadline, 30% rebate for delays. Here's how we work.",
  }),
  breadcrumbNode([
    { name: "Home", path: "/en" },
    { name: "Process", path: "/en/process" },
  ]),
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
        eyebrow="PROCESS · 4-10 WEEKS END-TO-END"
        headline={
          <>
            <em>9 things</em> we do for you. Your time: under 5 hours.
          </>
        }
        sub="You don't write specs. You don't hunt for references. You don't chase a photographer. You spend 30 minutes telling us about your business — and 4-10 weeks later, you have a finished site."
      />

      <StatsBar
        items={[
          { value: <>4-10</>, label: "weeks total timeline" },
          { value: <>5 hrs</>, label: "of your time total" },
          { value: <>100%</>, label: "fixed price" },
          { value: <>30%</>, label: "rebate for delays" },
        ]}
      />

      <VerticalTimeline steps={STEPS} />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="COMMUNICATION"
        heading={
          <>
            How we <em>communicate</em> during the project
          </>
        }
        body="You don't disappear for 6 weeks and get the site &ldquo;out of nowhere.&rdquo; Every step is a checkpoint where you see and approve."
        bulletList={[
          "Telegram chat daily — replies within 30 minutes in business hours",
          "Weekly screencast (3-5 minutes)",
          "Email status report every week with milestone status",
          "Zoom call once per sprint (optional, on your request)",
          "GitHub commits visible daily — full transparency",
          "Staging URL for real-time preview",
          "If you're unreachable for a week — project pauses, the deadline shifts",
        ]}
        image={
          <Image
            src="/communication.webp"
            alt="How we communicate during the project"
            width={1600}
            height={1289}
          />
        }
      />

      <section className="bg-bg">
        <FAQ heading="What if…?" items={PROCESS_FAQ} locale="en" />
      </section>

      <CtaBanner
        eyebrow="READY?"
        heading={
          <>
            Ready to walk through the process <em>with us</em>?
          </>
        }
        sub="First step is free. 30-min consult — and you know the price range and timeline."
        ctaPrimary={{
          label: "Calculate the price →",
          href: "/en/calculator",
        }}
        ctaSecondary={{
          label: "Or talk to us",
          href: "/en/contacts",
        }}
      />

      <HpFooter />
    </>
  );
}
