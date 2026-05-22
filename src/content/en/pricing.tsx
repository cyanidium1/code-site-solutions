import {
  Search,
  ArrowRightLeft,
  Wrench,
  Zap,
  Palette,
  FileText,
  Smartphone,
  Code,
  LayoutDashboard,
  Lock,
  Cloud,
  Rocket,
  LifeBuoy,
} from "lucide-react";

import type { TurnkeyItem } from "@/components/blocks/turnkey-list";
import type { TierProps } from "@/types/pricing";
import type { BentoCell } from "@/types/homepage";
import type { RichText } from "@/lib/shared/rich-text";
import { formatPrice } from "@/lib/shared/format-price";

/* ─── Turnkey items (EN) ─────────────────────────────────────────────────── */

export const TURNKEY_ITEMS_EN: TurnkeyItem[] = [
  { icon: FileText, title: "Copywriting", line: "Hero, SEO articles, opening cases" },
  { icon: Palette, title: "Design", line: "2 rounds of revisions included" },
  { icon: Smartphone, title: "Frontend", line: "Responsive: mobile / tablet / desktop" },
  { icon: Code, title: "Engineering", line: "Next.js, all integrations" },
  { icon: LayoutDashboard, title: "CMS", line: "Sanity, edit content from your phone" },
  { icon: Lock, title: "Domain & SSL", line: "We set it up for you" },
  { icon: Cloud, title: "Hosting", line: "Vercel or Cloudflare on your account" },
  { icon: Rocket, title: "Launch", line: "Search Console, Analytics, 301 redirects" },
  { icon: LifeBuoy, title: "1 year of support", line: "Bugs, updates, advice" },
];

export const NOT_DOING_EN: string[] = [
  "Product photography",
  "Paid ads (Google Ads / Facebook)",
  "Maintenance of third-party code / WordPress sites",
];

export const TURNKEY_FOOTER_EN = (
  <div className="turnkey-list-not">
    <div className="turnkey-list-not-head">What we don&apos;t do</div>
    <ul className="turnkey-list-not-list">
      {NOT_DOING_EN.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p className="turnkey-list-not-foot">
      If you need any of these — we&apos;ll connect you with vetted partners.
      We don&apos;t mark up other people&apos;s work.
    </p>
  </div>
);

/* ─── Pricing tiers (4 — EN) ─────────────────────────────────────────────── */

export const TIERS: TierProps[] = [
  {
    name: "Landing",
    price: formatPrice(1000, { locale: "en" }),
    priceLabel: "from",
    weeks: "1–2 weeks",
    bestFor:
      "Fast launch of one offer, MVP, hypothesis testing.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "1 page with responsive layout",
        "SEO structure (title, meta, schema)",
        "Lighthouse 90+",
        "1 lead form",
        "Integration with 1 system (CRM or email)",
        "Google Analytics + Tag Manager",
        "Documentation and training",
        "1-year warranty",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "Multilingual support",
        "CMS for self-editing",
        "Blog",
        "Complex integrations",
      ],
    },
    ctaLabel: "Choose Starter →",
    ctaHref: "/en/contacts?tier=starter",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: "Industry Pro",
    price: formatPrice(3500, { locale: "en" }),
    priceLabel: "from",
    weeks: "4–8 weeks",
    bestFor:
      "Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "Industry compliance (GDPR / HIPAA-aware)",
        "5+ industry integrations (Helsi/Clio/MEDoc and others)",
        "Local SEO targeting your area",
        "Client account area",
        "E-signature (Diia.Sign / DocuSign)",
        "UA + RU multilingual",
        "Cost calculators (1–3)",
        "Up to 30 pages",
        "1-year warranty + 30% rebate for delays",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "EN locale (available in Pro Plus)",
        "Complex SaaS logic",
        "24/7 SLA",
      ],
    },
    ctaLabel: "Choose Industry Pro →",
    ctaHref: "/en/contacts?tier=industry",
  },
  {
    name: "Pro Plus",
    price: formatPrice(7500, { locale: "en" }),
    priceLabel: "from",
    weeks: "6–10 weeks",
    bestFor:
      "Businesses growing across multiple markets that need EN locale, 30+ pages, and one deep integration (CRM / ERP / payments).",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Industry Pro, plus",
      items: [
        "EN locale",
        "30+ pages",
        "1 custom integration",
        "Dedicated PM with weekly status updates",
        "Advanced SEO (programmatic landing pages)",
        "1-year warranty + 30% rebate for delays",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "24/7 SLA (only in Custom)",
        "Dedicated team of 5-7 people",
        "Complex SaaS architecture",
      ],
    },
    ctaLabel: "Choose Pro Plus →",
    ctaHref: "/en/contacts?tier=proplus",
  },
  {
    name: "Custom",
    price: formatPrice(14000, { locale: "en" }),
    priceLabel: "from",
    weeks: "8–16 weeks",
    bestFor:
      "Complex products with bespoke logic — SaaS, marketplace, B2B portal.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Pro Plus, plus",
      items: [
        "Architecture session before kickoff",
        "Dedicated team (5-7 people on your project)",
        "UA + RU + EN + other languages on request",
        "Complex payment flows",
        "APIs for external integrations",
        "24/7 SLA with 4-hour response",
        "SOC 2-ready architecture (for B2B SaaS)",
        "Custom modules",
        "Post-warranty support under SLA",
      ],
    },
    excludes: {
      heading: "Doesn't include",
      items: [
        "Photo/video content creation",
        "Branding from scratch (logo, brand book)",
        "Legal consulting",
      ],
    },
    ctaLabel: "Talk to us →",
    ctaGhost: true,
    ctaHref: "/en/contacts?tier=enterprise",
  },
];

/* ─── Add-ons (Bento × 6 — EN) ───────────────────────────────────────────── */

export const ADDONS_CELLS: BentoCell[] = [
  {
    icon: Search,
    title: "SEO audit",
    body: "Technical + content audit of your current site. Prioritized list of fixes.",
    stat: formatPrice(300, { locale: "en" }),
    span: "1x1",
  },
  {
    icon: ArrowRightLeft,
    title: "WordPress migration",
    body: "Move to Next.js without losing SEO history. 301 redirects, Search Console handoff.",
    stat: "$500–$2,000",
    span: "2x1",
  },
  {
    icon: Wrench,
    title: "Post-warranty support",
    body: "Fixes, updates, advice. Monthly retainer or by the hour.",
    stat: "$200/mo or $40/hr",
    span: "1x1",
  },
  {
    icon: Zap,
    title: "Express landing",
    body: "Simplified landing for a time-sensitive campaign. 7-14 days from brief to launch.",
    stat: formatPrice(1500, { locale: "en" }),
    span: "1x1",
  },
  {
    icon: Palette,
    title: "Branding (via partners)",
    body: "Logo, brand identity, brand book. Through our vetted partners.",
    stat: formatPrice(1500, { locale: "en", withPrefix: true }),
    span: "1x1",
  },
  {
    icon: FileText,
    title: "Content",
    body: "B2B copywriter. Copy for landings, cases, blog.",
    stat: "$200/article",
    span: "1x1",
  },
];

/* ─── FAQ (8 — EN) ───────────────────────────────────────────────────────── */

export const PRICING_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Why a fixed price, not \"on request\"?",
    a: [
      "Because your time matters. You shouldn't spend 3 hours on a consultation to find out you can't afford a tier. And it's a discipline for us — if we can't quote in 30 minutes on the brief, we don't fully understand the project yet.",
    ],
  },
  {
    q: "Why is Pro Plus more expensive than Industry Pro?",
    a: [
      "Two reasons: ",
      { em: "EN locale" },
      " doubles your SEO/CMS structure, and a dedicated PM costs us money. If you don't need multi-market reach, Industry Pro is the right tier.",
    ],
  },
  {
    q: "Can we negotiate a discount?",
    a: [
      { em: "10% off" },
      " if you pay 100% upfront. Beyond that — we'd rather not. The price already accounts for fixed-cost overhead. Discounting it means cutting corners somewhere.",
    ],
  },
  {
    q: "What if my project doesn't fit any tier?",
    a: [
      "Tell us. Sometimes it's a tier with one extra add-on; sometimes it's a true Custom. We'll be honest on the 30-min call.",
    ],
  },
  {
    q: "Can I pay in crypto?",
    a: [
      { em: "USDT TRC20" },
      ". We confirm receipt within hours and treat it like any other invoice.",
    ],
  },
  {
    q: "Is there an installment plan for large projects?",
    a: [
      "Projects from ",
      { em: "$10,000" },
      " can be paid in three installments — at kickoff, mid-project, and on delivery.",
    ],
  },
  {
    q: "How do integrations get counted?",
    a: [
      "Base CRM/email integration is $150. CRM systems (HubSpot, Pipedrive, KeyCRM) — $500. Industry integrations (Clio, MEDoc, etc.) — $500–$1,200 depending on API. Payment gateways — $900. All transparent in the calculator.",
    ],
  },
  {
    q: "What if I need changes after launch?",
    a: [
      "First year — included in warranty for bug fixes. New features — separate scope, priced per hour or per scope.",
    ],
  },
];
