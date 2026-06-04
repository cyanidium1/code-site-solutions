import type { TimelineStep } from "@/components/blocks/vertical-timeline";
import type { RichText } from "@/lib/shared/rich-text";

/* ─── 7 timeline steps (EN) ───────────────────────────────────────────────── */

export const PROCESS_STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Brief",
    duration: "1 day · free",
    body: "30-min call or Telegram chat. We dig into the task, goals, audience, budget, timeline, references. By the end, an exact price range and tier recommendation.",
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
    body: "We sign the contract via Diia.Sign (Ukraine's e-signature standard) or a PDF with signature. You pay 50% upfront. The contract locks the price, the deadline, and the 30% rebate for delays.",
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
    body: "We design in Figma. First a moodboard, then the homepage, then internal pages. 2 full rounds of revisions included. You see and approve every milestone.",
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
    body: "We write code on Next.js + Sanity. Commits in GitHub daily. A weekly screencast of progress (3-5 min). Telegram chat every day.",
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
    body: "We run a 60-point QA checklist. We test on 5 devices and 3 browsers. We run Lighthouse audit. You run your own 10-point checklist and approve.",
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
    body: "We migrate to your domain. We set up Search Console + Analytics + 301 redirects from your old site. You make the final 50% payment and receive all credentials.",
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
    body: "We fix any bugs for free. We update dependencies. We give advice. If something breaks through no fault of yours, we fix it within 4 business hours.",
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

/* ─── FAQ (8 — EN) ───────────────────────────────────────────────────────── */

export const PROCESS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "What if you miss the deadline through your fault?",
    a: [
      "We pay you a ",
      { em: "30% rebate" },
      " from the contract sum, no need to ask. We've done it twice in 3 years, and both times we wired the rebate before the client raised it.",
    ],
  },
  {
    q: "What if I want more than 2 design revisions?",
    a: [
      "Each extra revision round is billed at ",
      { em: "$40/hr" },
      ". We tell you upfront if a request crosses the limit.",
    ],
  },
  {
    q: "What if I don't like the design result?",
    a: [
      "The 2 revision rounds are there for this. We rework it. If after 2 rounds you still don't like it, we talk it through, since the problem usually sits in the brief rather than the design.",
    ],
  },
  {
    q: "What if I need changes after launch?",
    a: [
      "First year: fixes and small tweaks are in the warranty. New features are separate scope, priced per hour or per project.",
    ],
  },
  {
    q: "What if I want to change the scope mid-project?",
    a: [
      "We pause, re-estimate the new scope, and sign an addendum. The original contract stays for what was agreed; new scope is its own line.",
    ],
  },
  {
    q: "What if I don't have time to fill in content?",
    a: [
      "We have a copywriter as an add-on, ",
      { em: "$200/page" },
      ". We can also extend the timeline if you'd rather write it yourself.",
    ],
  },
  {
    q: "What if a new project comes up in 6 months?",
    a: [
      "We hold a quarterly slot for repeat clients. Telegram us when it's time and we'll schedule it.",
    ],
  },
  {
    q: "What if I need an urgent fix for an event?",
    a: [
      "4-hour SLA in business hours. Outside business hours we charge an emergency rate, but we respond.",
    ],
  },
];
