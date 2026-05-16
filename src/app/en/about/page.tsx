import type { Metadata } from "next";
import {
  Eye,
  Zap,
  Github as GithubLogo,
  MessageSquare,
  Shield,
  Globe,
  Building,
  UserRound,
  FileCode,
  Calendar,
  MessageCircle,
  Mail,
} from "lucide-react";

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
  type BentoCell,
} from "@/components/homepage";
import {
  ORG_ID,
  SITE_ORIGIN,
  WEBSITE_ID,
  pageUrl,
} from "@/lib/site";
import { plainRich, type RichText } from "@/lib/rich-text";

const UK_PATH = "/about";
const EN_PATH = "/en/about";
const ABOUT_URL = pageUrl(EN_PATH);

export const metadata: Metadata = {
  title: "About — boutique studio of 12 in Kyiv | Code-Site.Art",
  description:
    "Not an agency, not a freelancer. 12 people building custom sites for SMBs. 47 projects across UA, EU, US, DK. You talk to the people who code and design.",
  alternates: {
    canonical: EN_PATH,
    languages: { uk: UK_PATH, en: EN_PATH, "x-default": UK_PATH },
  },
  openGraph: {
    title: "About — boutique studio of 12 in Kyiv | Code-Site.Art",
    description:
      "Not an agency, not a freelancer. 12 people building custom sites for SMBs. 47 projects across UA, EU, US, DK.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: EN_PATH,
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

/* ─── Values (Bento × 6) ─────────────────────────────────────────────────── */

const VALUES_CELLS: BentoCell[] = [
  {
    icon: Eye,
    title: "Clean code",
    body: "We write code so another developer can pick it up in a week, not rewrite it from scratch in a month. Your site doesn't depend on us personally.",
    span: "1x1",
  },
  {
    icon: Zap,
    title: "Loading speed",
    body: "Lighthouse 90+ at launch. Pages load under 1 second. Every second of delay is -7% conversion.",
    span: "1x1",
  },
  {
    icon: GithubLogo,
    title: "Reliability",
    body: "Code in your GitHub from the first commit. Fixed-sum contract with a 30% rebate for missed deadlines. If someone on the team is sick — the project doesn't stop.",
    span: "1x1",
  },
  {
    icon: MessageSquare,
    title: "Honesty",
    body: "If something isn't in the package — we say so before signing, not after. If it's technically impossible — we say so. Prices in the brief, not “on request.”",
    span: "1x1",
  },
  {
    icon: Shield,
    title: "Support",
    body: "1-year warranty included in the price. Something breaks through no fault of yours — we fix it within 4 business hours. First 2 months — free revisions.",
    span: "1x1",
  },
  {
    icon: Globe,
    title: "Communication",
    body: "We work in your timezone. Weekly status updates. All revisions tracked in Notion — you always know where the project stands.",
    span: "1x1",
  },
];

/* ─── vs cards (Bento × 3) ───────────────────────────────────────────────── */

const VS_CELLS: BentoCell[] = [
  {
    icon: Building,
    title: "vs Big agency",
    body: (
      <>
        <p>
          A big agency costs $15-50k. Your project is one of thirty. You speak
          to developers through two managers. Decision speed — one week.
        </p>
        <p>
          With us — $1.5-8k. You talk to the tech lead and designer directly.
          Decisions in a day.
        </p>
      </>
    ),
    span: "1x1",
  },
  {
    icon: UserRound,
    title: "vs Freelancer",
    body: (
      <>
        <p>
          A freelancer is cheaper — $500-3k. But no contract, no warranty, no
          rebate clause. Sick — your project stalls. Disappears — you're at
          zero.
        </p>
        <p>
          With us — contract, fixed deadline, 30% rebate for delays. 12 people
          — someone always covers your project.
        </p>
      </>
    ),
    span: "1x1",
  },
  {
    icon: FileCode,
    title: "vs WordPress / page builders",
    body: (
      <>
        <p>
          WordPress and Tilda — fast, but expensive in maintenance: $500/year
          in plugins + $300/year in updates. The site breaks after every
          plugin update.
        </p>
        <p>
          Custom code on Next.js — 3× faster. No plugin dependency. Code in
          your GitHub. Pay once, own forever.
        </p>
      </>
    ),
    span: "1x1",
  },
];

/* ─── FAQ ────────────────────────────────────────────────────────────────── */

const ABOUT_FAQ: { q: string; a: RichText }[] = [
  {
    q: "How many people are on your team?",
    a: [
      "12 total. 4 you'll talk to daily (tech lead, designer, frontend, marketing). 8 in the background (4 developers, 2 designers, 2 QA).",
    ],
  },
  {
    q: "Do you work abroad?",
    a: [
      "Yes. 4 regions: Ukraine, EU, US, Denmark. We work in your timezone for daily Telegram comms.",
    ],
  },
  {
    q: "How fast do you reply to inquiries?",
    a: [
      "Telegram — usually within 30 minutes (business hours). Email — within 1-2 business hours. Brief form — within 4 business hours.",
    ],
  },
  {
    q: "Can we meet in person?",
    a: [
      "We're based in Kyiv. We meet in person there. For EU/US/UK clients — Zoom is the default, occasional travel for large projects.",
    ],
  },
  {
    q: "Can I see examples of unfinished projects?",
    a: [
      "On the call, yes. We show 2-3 in-progress staging URLs that match your industry. Not posted publicly because clients sign NDAs.",
    ],
  },
  {
    q: "Do you take small projects ($1-3k)?",
    a: [
      "Yes — Landing tier from $1,000. But not below that. If your budget is $500, a freelancer is the right choice.",
    ],
  },
  {
    q: "Do you take enterprise projects ($30k+)?",
    a: [
      "Yes — Custom tier from $14,000. We've shipped projects up to ~$80k. Beyond that scope, we'd recommend you talk to an agency with 50+ people.",
    ],
  },
  {
    q: "Do you do rebranding or logo design?",
    a: [
      "No. We partner with branding studios. We'll connect you, we don't mark up their work.",
    ],
  },
];

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      url: SITE_ORIGIN,
      description:
        "Boutique studio in Kyiv. 12 people building custom-coded sites for SMBs across UA, EU, US, DK.",
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_ORIGIN,
      name: "Code-Site.Art",
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
    {
      "@type": "FAQPage",
      mainEntity: ABOUT_FAQ.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: plainRich(it.a),
        },
      })),
    },
  ],
};

/* ─── Final CTA ──────────────────────────────────────────────────────────── */

const FINAL_CTA_CARDS = [
  {
    icon: Calendar,
    title: "Book a call",
    body: "30-min Zoom. We'll show real cases, discuss your project.",
    cta: "Open Calendly →",
    href: "https://calendly.com/fedirdev",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    body: "Fastest channel, usually under 30 minutes.",
    cta: "Write @fedirdev →",
    href: "https://t.me/fedirdev?text=Hi%20Fedir",
    featured: true,
  },
  {
    icon: Mail,
    title: "Send a brief",
    body: "Detailed form, reply within 4 business hours.",
    cta: "Open form →",
    href: "/en/contacts",
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function AboutPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/en" }, { label: "About" }]}
        eyebrow="/ ABOUT"
        headline={
          <>
            <em>12 people</em> who build sites that bring leads.
          </>
        }
        sub={
          <>
            Boutique studio out of Kyiv. 47 projects across 4 regions in 3
            years. You talk directly to the people who write code and design —
            no account managers as filters, no &ldquo;I&apos;ll pass that to the
            team.&rdquo;
          </>
        }
      />

      <StatsBar
        items={[
          { value: "47", label: "projects in 3 years" },
          { value: "4", label: "regions of launch · UA · EU · US · DK" },
          { value: "4.9/5", label: "average client rating" },
          { value: "×3.2", label: "more inquiries on average" },
        ]}
      />

      <ImageText
        variant="side"
        imageVariant="imageRight"
        eyebrow="/ 02 ABOUT"
        heading={
          <>
            Not an agency. <em>Not a freelancer.</em>
          </>
        }
        body={
          <>
            <p>
              We deliberately don&apos;t grow to 50 employees. At a big agency,
              your project is one of thirty, and a manager runs it — not the
              person writing the code. With a freelancer, your project depends
              on one person who can disappear for 3 weeks.
            </p>
            <p>
              12 people is the size where the team keeps quality high, and you
              know everyone involved in your project. Since 2022 we&apos;ve
              built sites for clinics, law firms, accounting offices,
              renovation companies, e-commerce, and SaaS — mostly in Ukraine
              and the EU.
            </p>
          </>
        }
        image={
          <GradPlaceholder
            from="oklch(0.50 0.18 230)"
            to="oklch(0.30 0.10 290)"
            label="12 people · Kyiv"
          />
        }
      />

      <TeamSection
        eyebrow="/ 04 TEAM"
        heading={
          <>
            12 people. <em>You&apos;ll hear from four</em> every day.
          </>
        }
        sub="This is the core — the people you'll talk to directly: tech lead, designer, frontend, marketing. Behind them, 8 more work in the background: 4 developers, 2 designers, 2 QA engineers. You see results, not process."
        locale="en"
      />

      <Bento
        eyebrow="/ 05 VALUES"
        heading={
          <>
            What we <em>won&apos;t compromise on</em>
          </>
        }
        cells={VALUES_CELLS}
      />

      <Stack
        eyebrow="/ 06 STACK"
        heading={
          <>
            Technologies <em>we go deep on</em>
          </>
        }
        sub="We don't try everything. 10 tools we're strong in. No experiments on your money."
      />

      <Bento
        eyebrow="/ 07 DIFFERENCE"
        heading={
          <>
            How we <em>differ</em> from others
          </>
        }
        cells={VS_CELLS}
      />

      <Process
        heading={
          <>
            Launch in 5 steps. <em>No surprises.</em>
          </>
        }
        steps={[
          { n: "01", name: "Brief", duration: "1 day · free", body: "Goals, audience, scope" },
          { n: "02", name: "Design", duration: "1–2 weeks", body: "Wireframes → hi-fi" },
          { n: "03", name: "Development", duration: "2–6 weeks", body: "Custom code, weekly demos" },
          { n: "04", name: "Testing", duration: "1 week", body: "60-point QA checklist" },
          { n: "05", name: "Launch + Support", duration: "+ 1 year", body: "Support included" },
        ]}
        ctaLabel="See the full process"
        ctaHref="/en/process"
      />

      <Cases
        eyebrow="/ 09 CASES"
        heading={
          <>
            Real projects with <em>real metrics</em>.
          </>
        }
        locale="en"
        ctaLabel="See all work"
        ctaHref="/en/portfolio"
      />

      <section style={{ background: "var(--bg)" }}>
        <FAQ heading="FAQ about us" items={ABOUT_FAQ} />
      </section>

      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={
          <>
            30 minutes — and you&apos;ll know if <em>we&apos;re a fit</em>.
          </>
        }
        sub="No commitment. We show real cases, listen to your task, and honestly say whether we can build what you need."
        cards={FINAL_CTA_CARDS}
      />

      <HpFooter />
    </>
  );
}
