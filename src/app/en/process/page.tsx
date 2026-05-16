import type { Metadata } from "next";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import { CtaBanner } from "@/components/blocks/cta-banner";
import { FAQ } from "@/components/blocks/final";
import {
  VerticalTimeline,
  type TimelineStep,
} from "@/components/blocks/vertical-timeline";
import { HpHeader, HpFooter } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";
import { plainRich, type RichText } from "@/lib/rich-text";

const UK_PATH = "/process";
const EN_PATH = "/en/process";
const PROCESS_URL = pageUrl(EN_PATH);

export const metadata: Metadata = {
  title: "Process — 7 steps from brief to launch | Code-Site.Art",
  description:
    "4-10 weeks end-to-end. Your time: 5 hours total. Fixed price, fixed deadline, 30% rebate for delays. Here's how we work.",
  alternates: {
    canonical: EN_PATH,
    languages: { uk: UK_PATH, en: EN_PATH, "x-default": UK_PATH },
  },
  openGraph: {
    title: "Process — 7 steps from brief to launch | Code-Site.Art",
    description:
      "4-10 weeks end-to-end. Your time: 5 hours total. Fixed price, fixed deadline, 30% rebate for delays.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: EN_PATH,
  },
};

const STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Brief",
    duration: "1 day · free",
    body:
      "30-min call or Telegram chat. We dig into the task, goals, audience, budget, timeline, references. By the end — an exact price range and tier recommendation.",
    weDo: {
      heading: "What we do",
      items: [
        "Listen to the task and ask follow-up questions",
        "Analyze 2-3 of your competitors",
        "Recommend a tier and timeline",
        "Give you the exact price range",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Tell us about your business and the site's goal",
        "Share 3-5 reference sites",
        "Share your budget and deadline (if any)",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Written estimate (PDF) with price range and timeline",
        "Tier and scope recommendation",
        "List of next steps and timeline",
      ],
    },
  },
  {
    n: "02",
    title: "Contract & deposit",
    duration: "1-3 days",
    body:
      "We sign the contract — via Diia.Sign (Ukraine's e-signature standard) or PDF with signature. You pay 50% upfront. The contract locks the price, the deadline, and the 30% rebate for delays.",
    weDo: {
      heading: "What we do",
      items: [
        "Draft the contract with a fixed sum",
        "Break it into milestones with deliverables",
        "Issue a 50% deposit invoice",
        "Run the kickoff after payment clears",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Review the contract, ask questions",
        "Sign via Diia.Sign or PDF",
        "Pay the 50% deposit (UAH bank transfer, Stripe, USDT, Mono)",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Signed contract with fixed terms",
        "Right to 2 full design revision rounds",
        "Right to a 30% rebate for missed deadlines",
      ],
    },
  },
  {
    n: "03",
    title: "Design",
    duration: "1-2 weeks",
    body:
      "We design in Figma. First a moodboard, then the homepage, then internal pages. 2 full rounds of revisions included. You see and approve every milestone.",
    weDo: {
      heading: "What we do",
      items: [
        "Gather a moodboard from references and your brand",
        "Design the homepage (1-3 versions to pick from)",
        "After approval — design internal pages",
        "Adapt to mobile (375px) and tablet",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Approve the moodboard (1-2 iterations)",
        "Approve the homepage design (2 revision rounds)",
        "Check the mobile version on your phone",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Figma file with full design (all pages + states)",
        "Mobile + Tablet + Desktop layouts",
        "Design rights handed over to you",
      ],
    },
  },
  {
    n: "04",
    title: "Development",
    duration: "2-6 weeks",
    body:
      "We write code on Next.js + Sanity. Commits in GitHub daily. Weekly screencast of progress (3-5 min). Telegram chat — daily.",
    weDo: {
      heading: "What we do",
      items: [
        "Write code in your GitHub repo",
        "Commit daily (full progress visible)",
        "Record a weekly screencast",
        "Wire up integrations (CRM, analytics, forms)",
        "Build the CMS admin (Sanity or Strapi)",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Fill in content in the admin",
        "Watch the weekly screencasts",
        "Ask in Telegram if anything's unclear",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Access to GitHub repo from the first commit",
        "Staging URL for real-time preview",
        "Admin with your login credentials",
        "Documentation on how to edit",
      ],
    },
  },
  {
    n: "05",
    title: "Testing",
    duration: "1 week",
    body:
      "We run a 60-point QA checklist. We test on 5 devices and 3 browsers. We run Lighthouse audit. You run your own 10-point checklist and approve.",
    weDo: {
      heading: "What we do",
      items: [
        "Run the 60-point QA checklist",
        "Test on iPhone, Android, iPad, Chrome/Safari/Firefox",
        "Lighthouse — target Performance 90+, SEO/A11y 95+",
        "Check all forms, integrations, analytics",
        "Schema.org through the Rich Results Test",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Run our 10-point client checklist (we send it)",
        "Test all forms with your email",
        "Approve before launch",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "60-point QA report",
        "Lighthouse screenshot",
        "Fix list (if any) with fix date",
      ],
    },
  },
  {
    n: "06",
    title: "Launch",
    duration: "1 day",
    body:
      "We migrate to your domain. We set up Search Console + Analytics + 301 redirects from your old site. You make the final 50% payment and receive all credentials.",
    weDo: {
      heading: "What we do",
      items: [
        "Set up the domain (DNS, SSL)",
        "Production deploy on Vercel/Cloudflare",
        "301 redirects from old URLs",
        "Submit sitemap to Search Console",
        "Hand over credentials (hosting, CMS, GitHub, Analytics)",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Make the final 50% payment",
        "Verify the site on the live domain",
        "Sign the acceptance protocol",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Live site on your domain",
        "Access to all systems",
        "Documentation on how to manage and publish",
        "1-hour admin training (Zoom)",
      ],
    },
  },
  {
    n: "07",
    title: "Support",
    duration: "+ 1 year (included)",
    body:
      "We fix any bugs for free. We update dependencies. We give advice. If something breaks through no fault of yours — we fix it within 4 business hours, business hours.",
    weDo: {
      heading: "What we do",
      items: [
        "Fix bugs (4 business-hour SLA, in business hours)",
        "Update dependencies",
        "Help with the admin and content",
        "Run quarterly security checks",
        "Take weekly backups",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Write to Telegram or email when something's off",
        "Back up your Sanity content (optional)",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Free support for 365 days from launch",
        "Quarterly security check",
        "Option for a support package after year one ($200-500/mo)",
      ],
    },
  },
];

const PROCESS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "What if you miss the deadline through your fault?",
    a: [
      "We pay you a ",
      { em: "30% rebate" },
      " from the contract sum. Automatically. We've done this twice in 3 years — both times we wired the rebate without being asked.",
    ],
  },
  {
    q: "What if I want more than 2 design revisions?",
    a: [
      "Each extra revision round is billed at $40/hr. We tell you upfront if a request crosses the limit.",
    ],
  },
  {
    q: "What if I don't like the design result?",
    a: [
      "That's exactly what the 2 revision rounds are for. We rework it. If after 2 rounds you still don't like it, we discuss — often the issue is in the brief, not the design.",
    ],
  },
  {
    q: "What if I need changes after launch?",
    a: [
      "First year — fixes and small tweaks are in the warranty. New features — separate scope, priced per hour or per project.",
    ],
  },
  {
    q: "What if I want to change the scope mid-project?",
    a: [
      "We pause, re-estimate the new scope, sign an addendum. Honest. The original contract stays for what was agreed; new scope is its own line.",
    ],
  },
  {
    q: "What if I don't have time to fill in content?",
    a: [
      "We have a copywriter — add-on, $200/page. We can also extend the timeline if you'd rather write it yourself.",
    ],
  },
  {
    q: "What if a new project comes up in 6 months?",
    a: [
      "We hold a quarterly slot for repeat clients. Telegram us when it's time — we schedule.",
    ],
  },
  {
    q: "What if I need an urgent fix for an event?",
    a: [
      "4-hour SLA in business hours. Outside business hours — we charge an emergency rate, but we respond.",
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "Process",
          item: PROCESS_URL,
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${PROCESS_URL}#service`,
      name: "Website development process",
      description:
        "7-step process from brief to launch, 4-10 weeks end-to-end, fixed price + 30% rebate for delays.",
      provider: { "@id": ORG_ID },
      areaServed: ["UA", "EU", "US", "DK"],
    },
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
  ],
};

export default function ProcessPageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[{ label: "Home", href: "/en" }, { label: "Process" }]}
        eyebrow="/ PROCESS · 4-10 WEEKS END-TO-END"
        headline={
          <>
            <em>9 things</em> we do for you. Your time: under 5 hours.
          </>
        }
        sub="You don't write specs. You don't hunt for references. You don't chase a photographer. You spend 30 minutes telling us about your business — and 4-10 weeks later, you have a finished site."
      />

      <StatsBar
        items={[
          { value: "4-10", label: "weeks total timeline" },
          { value: "5h", label: "of your time total" },
          { value: "100%", label: "fixed price" },
          { value: "30%", label: "rebate for delays" },
        ]}
      />

      <VerticalTimeline steps={STEPS} />

      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="/ COMMUNICATION"
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
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, oklch(0.50 0.18 230) 0%, oklch(0.30 0.10 290) 100%)",
            }}
          />
        }
      />

      <section style={{ background: "var(--bg)" }}>
        <FAQ heading={"What if…?"} items={PROCESS_FAQ} />
      </section>

      <CtaBanner
        heading={
          <>
            Ready to <em>walk through the process</em> with us?
          </>
        }
        sub="First step is free. 30-min consult — and you know the price range and timeline."
        ctaPrimary={{ label: "Calculate the price", href: "/en/calculator" }}
        ctaSecondary={{ label: "Or talk to us", href: "/en/contacts" }}
      />

      <HpFooter />
    </>
  );
}
