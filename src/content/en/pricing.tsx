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
      If you need any of these, we&apos;ll connect you with vetted partners.
      We don&apos;t mark up other people&apos;s work.
    </p>
  </div>
);

/* ─── Add-ons (Bento × 6 — EN) ───────────────────────────────────────────── */

export const ADDONS_CELLS: BentoCell[] = [
  {
    icon: Search,
    title: "SEO audit",
    body: "Technical + content audit of your current site. Prioritised list of fixes.",
    stat: formatPrice(300, { locale: "en" }),
    span: "1x1",
  },
  {
    icon: ArrowRightLeft,
    title: "WordPress migration",
    body: "Move to Next.js without losing SEO history. 301 redirects, Search Console handoff.",
    stat: "£500–£2,000",
    span: "2x1",
  },
  {
    icon: Wrench,
    title: "Post-warranty support",
    body: "Fixes, updates, advice. Monthly retainer or by the hour.",
    stat: "£200/mo or £40/hr",
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
    stat: "£200/article",
    span: "1x1",
  },
];

/* ─── FAQ (8 — EN) ───────────────────────────────────────────────────────── */

export const PRICING_FAQ: { q: string; a: RichText }[] = [
  {
    q: "Why a fixed price, not \"on request\"?",
    a: [
      "Because your time matters. You shouldn't spend 3 hours on a consultation to find out you can't afford a tier. It's a discipline for us too: if we can't quote in 30 minutes off the brief, we don't understand the project yet.",
    ],
  },
  {
    q: "What's the difference between Corporate Website and Custom Platform?",
    a: [
      "Corporate Website (£3,500) covers a company site with a CMS and blog, 5+ integrations, local SEO, multilingual support and industry compliance (",
      { em: "UK GDPR / DPA 2018-ready" },
      "). Custom Platform (£6,000) adds an ",
      { em: "architectural session" },
      ", a dedicated team, custom integrations and a 24/7 SLA. Pick Custom Platform when the site is a business system — a SaaS, marketplace or B2B portal — rather than a company presentation.",
    ],
  },
  {
    q: "Can we negotiate a discount?",
    a: [
      { em: "10% off" },
      " if you pay 100% upfront. Beyond that, we'd rather not. The price already accounts for fixed-cost overhead. Discounting it means cutting corners somewhere.",
    ],
  },
  {
    q: "What if my project doesn't fit any tier?",
    a: [
      "Tell us. Sometimes it's a tier with one extra add-on; sometimes it's a true Custom. We'll be honest on the 30-min call.",
    ],
  },
  {
    q: "How can I pay?",
    a: [
      "Bank transfer (Faster Payments or BACS), card via ",
      { em: "Stripe" },
      ", or Direct Debit via ",
      { em: "GoCardless" },
      ". We confirm receipt within hours and treat it like any other invoice.",
    ],
  },
  {
    q: "Is there an installment plan for large projects?",
    a: [
      "Projects from ",
      { em: "£10,000" },
      " can be paid in three installments: at kickoff, mid-project, and on delivery.",
    ],
  },
  {
    q: "How do integrations get counted?",
    a: [
      "Base CRM/email integration is £150. CRM systems (HubSpot, Pipedrive, Salesforce): £500. Industry integrations (Clio, Xero, etc.): £500–£1,200 depending on API. Payment gateways: £900. All transparent in the calculator.",
    ],
  },
  {
    q: "What if I need changes after launch?",
    a: [
      "First year: bug fixes are included in the warranty. New features are separate scope, priced per hour or per scope.",
    ],
  },
];
