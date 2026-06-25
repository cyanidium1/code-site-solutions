import type { Metadata } from "next";

import {
  AboutHero,
  Founder,
  TrackRecord,
  Philosophy,
  RealProjects,
  WhatYouBuy,
  Guarantees,
} from "@/components/about/sections";
import { TeamSection } from "@/components/about/team-section";
import { FAQ } from "@/components/blocks/final";
import { LaunchCta } from "@/components/blocks/launch-cta";
import { HpHeader, HpFooter, Marquee, PullQuote } from "@/components/homepage";
import { ORG_ID, pageUrl } from "@/constants/site";
import {
  buildJsonLd,
  breadcrumbNode,
  organizationNode,
  webPageNode,
} from "@/lib/shared/jsonld";
import { JsonLd } from "@/components/shared/json-ld";
import { ABOUT_EN as C } from "@/content/en/about";

export const metadata: Metadata = {
  title: C.meta.title,
  description: C.meta.description,
  alternates: {
    canonical: "/en/about",
    languages: {
      uk: "/about",
      "en-GB": "/en/about",
      "x-default": "/about",
    },
  },
  openGraph: {
    title: C.meta.title,
    description: C.meta.description,
    type: "website",
    locale: "en_GB",
    url: "/en/about",
  },
  twitter: {
    card: "summary_large_image",
    title: C.meta.title,
    description: C.meta.description,
  },
};

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const FOUNDER_ID = `${pageUrl("/about")}#fedir-alpatov`;
const FOUNDER_PROFILES = [
  "https://github.com/cyanidium1",
  "https://www.linkedin.com/in/fediralpatov/",
  "https://www.instagram.com/cyanidium/",
];

const jsonLd = buildJsonLd([
  webPageNode({
    path: "/en/about",
    locale: "en",
    title: C.meta.title,
    description: C.meta.description,
    type: "AboutPage",
    extra: { about: { "@id": ORG_ID } },
  }),
  breadcrumbNode([
    { name: "Home", path: "/en" },
    { name: "About", path: "/en/about" },
  ]),
  organizationNode(),
  {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: "Fedir Alpatov",
    jobTitle: "Developer, Tech Lead & Founder, Code-Site.Art",
    worksFor: { "@id": ORG_ID },
    alumniOf: "Kyiv Polytechnic Institute",
    knowsAbout: ["Next.js", "React", "TypeScript", "Sanity CMS"],
    sameAs: FOUNDER_PROFILES,
  },
]);

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EnAboutPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <HpHeader />

      <main>
        {/* 1 — Hero */}
        <AboutHero c={C.hero} />

        {/* 2 — Who is behind the studio */}
        <Founder c={C.founder} />

        {/* 2.5 — The team behind the studio */}
        <TeamSection
          locale="en"
          eyebrow="TEAM"
          heading={
            <>
              12 people. You&apos;ll hear from four <em>every day</em>.
            </>
          }
          sub="This is the core — the people you'll talk to directly: tech lead, designer, frontend, marketing. Behind them, 8 more work in the background: 4 developers, 2 designers, 2 QA engineers. You see results, not process."
        />

        {/* 3 — Public track record ("verify us yourself") */}
        <TrackRecord c={C.trackRecord} />

        {/* 4 — Why we work this way (ownership philosophy) */}
        <Philosophy c={C.philosophy} />

        {/* 5 — Real projects + partner logos + client testimonial */}
        <RealProjects c={C.projects} />
        <Marquee label="COMPANIES THAT TRUSTED US WITH THEIR SITE · UA · EU · DK" />
        <PullQuote
          quote={
            <>
              Construction on Bornholm is a tight niche. We were afraid of losing
              even the little visibility we had. 30 days after the switch traffic
              held, after 60 we were <em>#1</em>. Now I create new service pages
              myself — from my phone.
            </>
          }
          initials="SH"
          name="Søren Hansen"
          role="Owner, NBYG København Aps"
          caseHref="/en/portfolio/nbyg-kobenhavn"
          caseLabel="See the full case"
        />

        {/* 6 — What clients actually buy */}
        <WhatYouBuy c={C.whatYouBuy} />

        {/* 7 — Guarantees (major trust section) */}
        <Guarantees c={C.guarantees} />

        {/* 8 — FAQ */}
        <section className="bg-bg">
          <FAQ heading="About the studio — FAQ" items={C.faq} locale="en" />
        </section>

        {/* 9 — Final CTA */}
        <LaunchCta
          locale="en"
          heading={
            <>
              Need a site your business <em>actually owns</em>?
            </>
          }
          sub="Drop us a line — we'll talk through your task, tell you honestly what's realistic and what it costs. No pressure, no mailing lists."
        />
      </main>

      <HpFooter />
    </>
  );
}
