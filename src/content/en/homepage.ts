import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Building,
  Car,
  Home,
  GraduationCap,
} from "lucide-react";

import type { Industry } from "@/types/homepage";
import type { TierProps } from "@/types/pricing";
import type { FAQItem } from "@/types/faq";
import { formatPrice } from "@/lib/shared/format-price";
import {
  TIER_AMOUNTS,
  TIER_NAMES,
  TIER_WEEKS,
  type HomepagePlanInfo,
  type TierKey,
} from "@/constants/pricing-tiers";

export const EN_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    title: "Healthcare",
    description: "Sites for clinics, dental practices, diagnostic centres",
    tags: ["EPR", "UK GDPR", "Online booking"],
    price: "From £3,500 · 4–10 weeks",
    href: "/en/sites-for/medicine",
  },
  {
    icon: Building,
    title: "Construction / Renovation",
    description: "Sites for construction and renovation companies",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "From £3,500 · 4–8 weeks",
    href: "/en/sites-for/renovation",
  },
  {
    icon: Scale,
    title: "Legal & Solicitors",
    description: "Sites for law firms, solicitors' offices, sole practitioners",
    tags: ["Clio", "DocuSign", "Online consultations"],
    price: "From £3,500 · 4–8 weeks",
    href: "/en/sites-for/legal",
  },
  {
    icon: Calculator,
    title: "Finance & Accounting",
    description:
      "Sites for accounting firms, financial advisors, trading services",
    tags: ["Xero", "Stripe", "Sage"],
    price: "From £3,500 · 4–8 weeks",
    href: "/en/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Online shops, marketplaces, B2B catalogues",
    tags: ["Stripe", "GoCardless", "Royal Mail"],
    price: "From £3,000 · 6–10 weeks",
    href: "/en/sites-for/ecommerce",
  },
  {
    icon: Car,
    title: "Motor industry",
    description:
      "Sites for car importers, car dealers, garages, and motor services",
    tags: ["BCA", "PDF invoice", "Multi-lang"],
    price: "From £3,000 · 6–10 weeks",
    href: "/en/sites-for/auto",
  },
  {
    icon: Home,
    title: "Property",
    description:
      "Sites for estate agencies, developers, private listings",
    tags: ["Rightmove", "Zoopla", "Mortgage"],
    price: "From £4,000 · 6–10 weeks",
    href: "/en/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    title: "Courses & Landings",
    description: "Sites for online courses, info-products, creator funnels",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "From £800 · 4–8 weeks",
    href: "/en/sites-for/courses",
  },
];

export const EN_TIERS: TierProps[] = [
  {
    name: TIER_NAMES.landing.en,
    price: formatPrice(TIER_AMOUNTS.landing, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.landing.en,
    bestFor: "Fast launch of one offer, MVP, hypothesis testing.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "Responsive build",
        "SEO-first structure",
        "Form integrations",
        "1-year warranty",
      ],
    },
    ctaLabel: "Choose Landing",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: TIER_NAMES.corporate.en,
    price: formatPrice(TIER_AMOUNTS.corporate, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.corporate.en,
    bestFor:
      "Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Landing, plus",
      items: [
        "CMS, blog",
        "5+ integrations",
        "Local SEO",
        "Compliance: UK GDPR / DPA 2018-ready",
        "Multilingual (2+ languages)",
      ],
    },
    ctaLabel: "Choose Corporate",
  },
  {
    name: TIER_NAMES.custom.en,
    price: formatPrice(TIER_AMOUNTS.custom, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.custom.en,
    bestFor:
      "Complex products with bespoke logic — SaaS, marketplace, B2B portal.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Corporate, plus",
      items: [
        "Architectural session",
        "Dedicated team",
        "SLA + 24/7 support",
        "Custom integrations",
      ],
    },
    ctaLabel: "Talk to us",
    ctaGhost: true,
  },
];

/**
 * Build the homepage FAQ. Pass an `override` map (typically derived from CMS
 * pricingPlan docs) to substitute plan name/price/weeks per tier; missing
 * keys fall back to the static constants in `pricing-tiers.ts`.
 */
export function buildEnHomepageFaq(
  override?: Partial<Record<TierKey, HomepagePlanInfo>>,
): FAQItem[] {
  const get = (key: TierKey): HomepagePlanInfo =>
    override?.[key] ?? {
      name: TIER_NAMES[key].en,
      priceFrom: TIER_AMOUNTS[key],
      weeks: TIER_WEEKS[key].en,
    };
  const fmt = (n: number) => formatPrice(n, { locale: "en" });
  const L = get("landing");
  const C = get("corporate");
  const X = get("custom");

  return [
  {
    q: "How much will my site cost?",
    a: [
      "From ",
      { em: fmt(L.priceFrom) },
      " for a landing page to ",
      { em: `${fmt(X.priceFrom)}+` },
      " for a platform. We’ll give you the exact figure after a short conversation and lock it into the contract before we start. For a quick estimate, use the ",
      { link: { href: "/en/calculator", text: "calculator" } },
      ".",
    ],
  },
  {
    q: "What if I don’t know exactly what I need?",
    a: [
      "That’s normal — and it’s our job. You tell us about your business; we propose the solution and explain what’s not worth spending money on.",
    ],
  },
  {
    q: "Can I see the code before I pay in full?",
    a: [
      "Yes. The code, access, and site are yours from the start. Look any time.",
    ],
  },
  {
    q: "What if something breaks after launch?",
    a: [
      "A year of support is included. Replies in under 4 hours. We fix issues and help you grow.",
    ],
  },
  {
    q: "What if you miss the deadline?",
    a: [
      "We pay a penalty. So hitting the deadline matters to us just as much as it does to you.",
    ],
  },
  // Retained from the previous FAQ — not in the 2026-07 landing doc.
  {
    q: "How long from brief to launch?",
    a: [
      { em: L.name },
      " — ",
      { em: L.weeks },
      ". ",
      { em: C.name },
      " — ",
      { em: C.weeks },
      ". ",
      { em: X.name },
      " — ",
      { em: X.weeks },
      ". That includes all revisions, content, and SEO. No surprises. The date is fixed in the contract.",
    ],
  },
  {
    q: "What if my budget is below your minimum?",
    a: [
      "We'll say up front that we can't deliver at that price, and point you toward someone who can. We don't take on projects we can't ship well at your budget.",
    ],
  },
  {
    q: "Can I start with a landing page and grow into a full site later?",
    a: [
      "Yes. The architecture we write ",
      { em: "scales" },
      ". Start with a Landing, and in a year we add CMS, blog, and extra verticals, no rewrite from scratch.",
    ],
  },
  {
    q: "What if I already have a designer / content / logo?",
    a: [
      "Then we work from your files or Figma. That's ",
      { em: "-10-15% off the price" },
      " and a shorter timeline. The contract spells out what you provide and when.",
    ],
  },
  ];
}

/** Back-compat constant export: equivalent to `buildEnHomepageFaq()`. */
export const EN_HOMEPAGE_FAQ: FAQItem[] = buildEnHomepageFaq();
