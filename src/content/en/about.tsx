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
} from "lucide-react";

import type { BentoCell } from "@/types/homepage";
import type { RichText } from "@/lib/shared/rich-text";

/* ─── Values (Bento, 6 cells — EN) ───────────────────────────────────────── */

export const VALUES_CELLS: BentoCell[] = [
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
    body: "If something isn't in the package — we say so before signing, not after. If it's technically impossible — we say so. Prices in the brief, not \"on request.\"",
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

/* ─── vs cards (Bento, 3 cells — EN) ─────────────────────────────────────── */

export const VS_CELLS: BentoCell[] = [
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
          rebate clause. Sick — your project stalls. Disappears — you&apos;re
          at zero.
        </p>
        <p>
          With us — contract, fixed deadline, 30% rebate for delays. 12 people —
          someone always covers your project.
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
          in plugins + $300/year in updates. The site breaks after every plugin
          update.
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

/* ─── FAQ (8 — EN) ───────────────────────────────────────────────────────── */

export const ABOUT_FAQ: { q: string; a: RichText }[] = [
  {
    q: "How many people are on your team?",
    a: [
      { em: "12 total" },
      ". 4 you'll talk to daily (tech lead, designer, frontend, marketing). 8 in the background (4 developers, 2 designers, 2 QA).",
    ],
  },
  {
    q: "Do you work abroad?",
    a: [
      "Yes. 4 regions: ",
      { em: "Ukraine, EU, US, Denmark" },
      ". We work in your timezone for daily Telegram comms.",
    ],
  },
  {
    q: "How fast do you reply to inquiries?",
    a: [
      "Telegram — usually within ",
      { em: "30 minutes" },
      " (business hours). Email — within 1-2 business hours. Brief form — within 4 business hours.",
    ],
  },
  {
    q: "Can we meet in person?",
    a: [
      "We're based in ",
      { em: "Kyiv" },
      ". We meet in person there. For EU/US/UK clients — Zoom is the default, occasional travel for large projects.",
    ],
  },
  {
    q: "Can I see examples of unfinished projects?",
    a: [
      "On the call, yes. We show 2-3 in-progress staging URLs that match your industry. Not posted publicly because clients sign ",
      { em: "NDAs" },
      ".",
    ],
  },
  {
    q: "Do you take small projects ($1-3k)?",
    a: [
      "Yes — Landing tier from ",
      { em: "$1,000" },
      ". But not below that. If your budget is $500, a freelancer is the right choice.",
    ],
  },
  {
    q: "Do you take enterprise projects ($30k+)?",
    a: [
      "Yes — Custom tier from ",
      { em: "$14,000" },
      ". We've shipped projects up to ~$80k. Beyond that scope, we'd recommend you talk to an agency with 50+ people.",
    ],
  },
  {
    q: "Do you do rebranding or logo design?",
    a: [
      { em: "No" },
      ". We partner with branding studios. We'll connect you, we don't mark up their work.",
    ],
  },
];
