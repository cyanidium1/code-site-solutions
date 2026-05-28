import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Rocket,
  Building,
  Car,
  Home,
  GraduationCap,
  Gauge,
  Github,
  DollarSign,
  Shield,
  ArrowRightLeft,
} from "lucide-react";

import type { BentoCell, Industry } from "@/types/homepage";
import type { TierProps } from "@/types/pricing";
import type { FAQItem } from "@/types/faq";
import { formatPrice } from "@/lib/shared/format-price";
import { TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS } from "@/constants/pricing-tiers";

export const EN_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    color: "#0EA5E9",
    title: "Healthcare",
    description: "Sites for clinics, dental practices, diagnostic centers",
    tags: ["EHR", "HIPAA", "Online booking"],
    price: "From $3,500 · 4–10 weeks",
    href: "/en/sites-for/medicine",
  },
  {
    icon: Building,
    color: "#EF4444",
    title: "Construction / Renovation",
    description: "Sites for construction and renovation companies",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/renovation",
  },
  {
    icon: Scale,
    color: "#8B5CF6",
    title: "Legal & Attorneys",
    description: "Sites for law firms, attorney offices, solo practitioners",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/legal",
  },
  {
    icon: Calculator,
    color: "#10B981",
    title: "Finance & Accounting",
    description:
      "Sites for accounting firms, financial advisors, trading services",
    tags: ["MEDoc", "Stripe", "1C/BAS"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    color: "#F59E0B",
    title: "E-commerce",
    description: "Online stores, marketplaces, B2B catalogs",
    tags: ["Stripe", "LiqPay", "Nova Poshta"],
    price: "From $3,000 · 6–10 weeks",
    href: "/en/sites-for/ecommerce",
  },
  {
    icon: Car,
    color: "#0070F3",
    title: "Auto industry",
    description:
      "Sites for car importers, auto dealers, repair shops, auto services",
    tags: ["Copart", "PDF-invoice", "Multi-lang"],
    price: "From $3,000 · 6–10 weeks",
    href: "/en/sites-for/auto",
  },
  {
    icon: Home,
    color: "#EC4899",
    title: "Real Estate",
    description:
      "Sites for real estate agencies, developers, private listings",
    tags: ["Multi-lang", "Multi-currency", "Mortgage"],
    price: "From $4,000 · 6–10 weeks",
    href: "/en/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    color: "#14B8A6",
    title: "Courses & Landings",
    description: "Sites for online courses, info-products, creator funnels",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "From $800 · 4–8 weeks",
    href: "/en/sites-for/courses",
  },
];

export const EN_BENTO: BentoCell[] = [
  {
    title: "Loads in under 1 second",
    icon: Gauge,
    stat: "98 LH",
    body: "Custom code, zero plugins. Tested on real 3G/4G connections.",
    span: "1x1",
    visual: "lh",
  },
  {
    title: "Code in your GitHub",
    icon: Github,
    stat: "100%",
    body: "Not in ours. Yours from the first commit.",
    span: "1x1",
    visual: "commits",
  },
  {
    title: "Live in 4 weeks",
    icon: Rocket,
    stat: "4 WK",
    body: "Industry-ready turnkey site.",
    span: "1x1",
    visual: "weeks",
  },
  {
    title: "Pricing in the brief",
    icon: DollarSign,
    stat: "$3.5K+",
    body: "No “request a quote.” A real number, in writing.",
    span: "1x1",
    visual: "price",
  },
  {
    title: "Warranty + rebate",
    icon: Shield,
    stat: "1Y",
    body: "1 year of fixes. We pay you 30% if we miss the deadline.",
    span: "1x1",
    visual: "warranty",
  },
  {
    title: "Migrate without losing SEO",
    icon: ArrowRightLeft,
    stat: "47 / 0",
    body: "301 redirects, content move, schema.org. Typically 2 weeks with no ranking drop.",
    span: "1x1",
    visual: "mig",
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

export const EN_HOMEPAGE_FAQ: FAQItem[] = [
  {
    q: "How much will my site cost?",
    a: [
      "Depends on the tier. ",
      { em: TIER_NAMES.landing.en },
      " — from ",
      { em: formatPrice(TIER_AMOUNTS.landing, { locale: "en" }) },
      ". ",
      { em: TIER_NAMES.corporate.en },
      " (healthcare, legal, accounting, real estate, etc.) — from ",
      { em: formatPrice(TIER_AMOUNTS.corporate, { locale: "en" }) },
      ". ",
      { em: TIER_NAMES.custom.en },
      " with bespoke architecture — from ",
      { em: formatPrice(TIER_AMOUNTS.custom, { locale: "en" }) },
      ". An exact figure — via the ",
      { link: { href: "/en/calculator", text: "calculator" } },
      " or after a 30-minute call.",
    ],
  },
  {
    q: "How long from brief to launch?",
    a: [
      { em: TIER_NAMES.landing.en },
      " — ",
      { em: TIER_WEEKS.landing.en },
      ". ",
      { em: TIER_NAMES.corporate.en },
      " — ",
      { em: TIER_WEEKS.corporate.en },
      ". ",
      { em: TIER_NAMES.custom.en },
      " — ",
      { em: TIER_WEEKS.custom.en },
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
