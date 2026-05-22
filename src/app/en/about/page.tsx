import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { TeamSection } from "@/components/about/team-section";
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
      <section
        style={{
          background: "var(--bg)",
          padding: "0 48px 64px",
        }}
        aria-label="Additional values"
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
          className="about-values-secondary"
        >
          {VALUES_CELLS.slice(3).map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="about-values-secondary-card"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 18px",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  background: "oklch(0.16 0.005 300)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 10,
                    background: "oklch(from var(--accent) l c h / 0.12)",
                    border: "1px solid oklch(from var(--accent) l c h / 0.22)",
                    color: "var(--accent-soft)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                      lineHeight: 1.2,
                      marginBottom: 4,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.45,
                      color: "var(--ink-2)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}
                  >
                    {c.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
            Real projects with <em>real metrics</em>
          </>
        }
      />

      <section style={{ background: "var(--bg)" }}>
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
