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
    description: "Sites for clinics, dental practices, diagnostic centers",
    tags: ["EHR", "HIPAA", "Online booking"],
    price: "From $3,500 · 4–10 weeks",
    href: "/en/sites-for/medicine",
  },
  {
    icon: Building,
    title: "Construction / Renovation",
    description: "Sites for construction and renovation companies",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/renovation",
  },
  {
    icon: Scale,
    title: "Legal & Attorneys",
    description: "Sites for law firms, attorney offices, solo practitioners",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/legal",
  },
  {
    icon: Calculator,
    title: "Finance & Accounting",
    description:
      "Sites for accounting firms, financial advisors, trading services",
    tags: ["MEDoc", "Stripe", "1C/BAS"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Online stores, marketplaces, B2B catalogs",
    tags: ["Stripe", "LiqPay", "Nova Poshta"],
    price: "From $3,000 · 6–10 weeks",
    href: "/en/sites-for/ecommerce",
  },
  {
    icon: Car,
    title: "Auto industry",
    description:
      "Sites for car importers, auto dealers, repair shops, auto services",
    tags: ["Copart", "PDF-invoice", "Multi-lang"],
    price: "From $3,000 · 6–10 weeks",
    href: "/en/sites-for/auto",
  },
  {
    icon: Home,
    title: "Real Estate",
    description:
      "Sites for real estate agencies, developers, private listings",
    tags: ["Multi-lang", "Multi-currency", "Mortgage"],
    price: "From $4,000 · 6–10 weeks",
    href: "/en/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    title: "Courses & Landings",
    description: "Sites for online courses, info-products, creator funnels",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "From $800 · 4–8 weeks",
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
        "Compliance: GDPR / HIPAA-ready",
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
      "Depends on the tier. ",
      { em: L.name },
      " — from ",
      { em: fmt(L.priceFrom) },
      ". ",
      { em: C.name },
      " (healthcare, legal, accounting, real estate, etc.) — from ",
      { em: fmt(C.priceFrom) },
      ". ",
      { em: X.name },
      " with bespoke architecture — from ",
      { em: fmt(X.priceFrom) },
      ". An exact figure — via the ",
      { link: { href: "/en/calculator", text: "calculator" } },
      " or after a 30-minute call.",
    ],
  },
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
      ". That includes all revisions, content, and SEO. No surprises — the date is fixed in the contract.",
    ],
  },
  {
    q: "What if my budget is below your minimum?",
    a: [
      "We'll tell you honestly that we can't deliver at that price, and point you toward someone who can. We don't take on projects we can't ship well at your budget.",
    ],
  },
  {
    q: "What if I don't know exactly what I need?",
    a: [
      "That's normal. On a free 30-minute call we'll ask ",
      { em: "10-15 questions" },
      " and draft the spec for you. Your job is to describe the business.",
    ],
  },
  {
    q: "Can I see the code before paying in full?",
    a: [
      "Yes. After the first stage (design) you get access to the ",
      { em: "repository" },
      ". Browse, leave comments, decide whether to continue.",
    ],
  },
  {
    q: "What happens after launch?",
    a: [
      "The first ",
      { em: "2 months" },
      " — free revisions, monitoring, and fixes. Then 1 year of warranty included (bugs fixed within 4 business hours). Ongoing support / growth — at a fixed rate, no surprises.",
    ],
  },
  {
    q: "Can I start with a landing page and grow into a full site later?",
    a: [
      "Yes. The architecture we write ",
      { em: "scales" },
      ". Start with a Landing — in a year we add CMS, blog, additional verticals — without rewriting from scratch.",
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
