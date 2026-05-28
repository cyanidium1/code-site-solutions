import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { TeamSection } from "@/components/about/team-section";
import { ValuesSecondaryRow } from "@/components/about/values-secondary-row";
import { FAQ } from "@/components/blocks/final";
import {
  HpHeader,
  HpFooter,
  Bento,
  Process,
  Cases,
  Stack,
  FinalCta3,
} from "@/components/homepage";
import {
  ORG_ID,
  SITE_CONTACT,
  SITE_ORIGIN,
  WEBSITE_ID,
  pageUrl,
} from "@/constants/site";
import { ABOUT_FAQ, VALUES_CELLS, VS_CELLS } from "@/content/en/about";

export const metadata: Metadata = {
  title: "About — boutique studio of 12 in Kyiv | Code-Site.Art",
  description:
    "Not an agency, not a freelancer. 12 people building custom sites for SMBs. 47 projects across UA, EU, US, DK. You talk to the people who code and design.",
  alternates: {
    canonical: "/en/about",
    languages: {
      uk: "/about",
      en: "/en/about",
      "x-default": "/about",
    },
  },
  openGraph: {
    title: "About — boutique studio of 12 in Kyiv | Code-Site.Art",
    description:
      "12 people building sites that bring leads. 47 projects across UA, EU, US, DK.",
    type: "website",
    locale: "en_US",
    url: "/en/about",
  },
};

/* ─── Placeholder visual ─────────────────────────────────────────────────── */

import { type CSSProperties } from "react";

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
      // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient stops
      style={{ "--gp-from": from, "--gp-to": to } as CSSProperties}
      className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--gp-from)_0%,var(--gp-to)_100%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
      />
      {label ? (
        <span className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const ABOUT_URL = pageUrl("/en/about");
const FOUNDER_ID = `${pageUrl("/about")}#fedir-alpatov`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${ABOUT_URL}#aboutpage`,
      url: ABOUT_URL,
      name: "About — Code-Site.Art",
      description:
        "12 people building sites that bring leads. 47 projects across 4 regions: UA · EU · US · DK.",
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
    },
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: "Fedir Alpatov",
      jobTitle: "Founder, Code-Site.Art",
      worksFor: { "@id": ORG_ID },
      sameAs: [
        "https://www.linkedin.com/in/fediralpatov/",
        SITE_CONTACT.telegram,
        "https://www.tiktok.com/@cyanidium.dev",
        "https://www.instagram.com/cyanidium/",
      ],
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      url: SITE_ORIGIN,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      foundingDate: "2023",
      founder: { "@id": FOUNDER_ID },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kyiv",
        addressCountry: "UA",
      },
      areaServed: ["UA", "EU", "US", "DK"],
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
          name: "About",
          item: ABOUT_URL,
        },
      ],
    },
  ],
};

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function EnAboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/en" },
          { label: "About" },
        ]}
        eyebrow="ABOUT"
        headline={
          <>
            12 people who build sites that{" "}
            <em>bring leads</em>.
          </>
        }
        sub={
          <>
            Boutique studio out of Kyiv. 47 projects across 4 regions in 3
            years. You talk directly to the people who write code and design —
            no account managers as filters, no &ldquo;I&apos;ll pass that to
            the team.&rdquo;
          </>
        }
      />

      <StatsBar
        items={[
          { value: "47", label: "projects in 3 years" },
          { value: "UA · EU · US · DK", label: "regions of launch" },
          { value: "4.9/5", label: "average client rating" },
          { value: "×3.2", label: "more inquiries on average" },
        ]}
      />

      <ImageText
        variant="side"
        imageVariant="imageRight"
        eyebrow="ABOUT"
        heading={
          <>
            Not an agency. <em>Not a freelancer.</em>
          </>
        }
        body={[
          "We deliberately don't grow to 50 employees. At a big agency, your project is one of thirty, and a manager runs it — not the person writing the code. With a freelancer, your project depends on one person who can disappear for 3 weeks.",
          "12 people is the size where the team keeps quality high, and you know everyone involved in your project. Since 2022 we've built sites for clinics, law firms, accounting offices, renovation companies, e-commerce, and SaaS — mostly in Ukraine and the EU.",
        ]}
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 280)"
            to="oklch(0.30 0.10 240)"
            label="team · 2026"
          />
        }
      />

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

      <Bento
        eyebrow="VALUES"
        heading={
          <>
            What we <em>won&apos;t compromise on</em>
          </>
        }
        cells={VALUES_CELLS.slice(0, 3)}
      />
      <ValuesSecondaryRow cells={VALUES_CELLS.slice(3)} ariaLabel="Additional values" />

      <Stack
        eyebrow="STACK"
        heading={
          <>
            Technologies we <em>go deep on</em>
          </>
        }
        sub="We don't try everything. 10 tools we're strong in. No experiments on your money."
      />

      <Bento
        eyebrow="DIFFERENCE"
        heading={
          <>
            How we <em>differ from</em> others
          </>
        }
        cells={VS_CELLS}
      />

      <Process
        eyebrow="PROCESS · 4-10 WEEKS"
        heading={
          <>
            How we <em>work</em>
          </>
        }
        ctaLabel="See the full process"
        ctaHref="/en/process"
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
        ctaHref="/en/portfolio"
      />

      <section className="bg-bg">
        <FAQ heading="About FAQ" items={ABOUT_FAQ} locale="en" />
      </section>

      <FinalCta3
        eyebrow="GET IN TOUCH"
        heading={
          <>
            <em>30 minutes</em> — and you&apos;ll know if we&apos;re a fit
          </>
        }
        sub="No commitment. We show real cases, listen to your task, and honestly say whether we can build what you need."
      />

      <HpFooter />
    </>
  );
}
