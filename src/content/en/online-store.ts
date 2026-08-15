import {
  Bell,
  CreditCard,
  Filter,
  Globe,
  Layers,
  LayoutDashboard,
  LayoutList,
  LifeBuoy,
  Package,
  Palette,
  PenLine,
  Rocket,
  Search,
  ShoppingCart,
} from "lucide-react";

import type { LandingPageContent } from "@/types/landing";

export const ONLINE_STORE_EN: LandingPageContent = {
  metaTitle: "ᐈ Online Store from £6,000 | E-commerce Development | Code-Site.Art",
  metaDescription:
    "➤ Custom-coded online store from £6,000 in 6–10 weeks ✔️ Catalogue, cart, checkout, CMS ✔️ No builder subscriptions ✔️ Fixed price in the contract ➡ Get your quote.",
  breadcrumbHome: "Home",
  breadcrumbSelf: "Online store",
  hero: {
    eyebrow: "ONLINE STORE",
    headline: ["An online store from £6,000 ", "that sells without a manager"],
    sub: "Catalogue, cart, checkout and a CMS you manage products from yourself. 6–10 weeks from brief to first orders. No monthly builder subscriptions.",
  },
  when: {
    eyebrow: "/ 01 WHEN A STORE FITS",
    heading: ["When you need an online store — ", "and when you don't"],
    sub: "A store means products get chosen and ordered without you. If a manager closes every sale, you need a different tool.",
    fitTitle: "A store is the right call",
    fit: [
      "A product catalogue people browse, compare and order from on their own",
      "Sales 24/7 without a manager: orders land in your CRM, not your DMs",
      "You've outgrown Instagram and marketplaces — fees are eating the margin",
      "A B2B catalogue with price lists and wholesale orders",
    ],
    notFitTitle: "Better with something else",
    notFit: [
      "1–3 products or an info-product — a landing page with payments is enough (from £800 + £900)",
      "Services without a catalogue — that's a corporate website from £3,500",
      "A marketplace with vendors and complex logistics — that's platform territory, it needs an architectural session",
    ],
    foot: "Not sure? Write to us — we'll price it honestly, including whether a store pays off or you should start smaller.",
  },
  included: {
    eyebrow: "END-TO-END",
    heading: ["What's included ", "at £6,000"],
    sub: "A fixed sum — a working store. We launch with a catalogue of up to ~50 products and scale once sales are flowing:",
    items: [
      {
        icon: LayoutList,
        title: "Catalogue & categories",
        line: "up to ~50 products at launch, structured for your range",
      },
      {
        icon: Package,
        title: "Product pages",
        line: "photos, variants, prices, stock status",
      },
      {
        icon: ShoppingCart,
        title: "Cart & checkout",
        line: "order in 2 clicks — no forced registration",
      },
      {
        icon: LayoutDashboard,
        title: "CMS",
        line: "Sanity: products, prices, promos — managed from your phone",
      },
      {
        icon: PenLine,
        title: "Launch copywriting",
        line: "we write the home and category copy",
      },
      {
        icon: Palette,
        title: "Custom design",
        line: "no templates; 2 rounds of revisions included",
      },
      {
        icon: Search,
        title: "Category SEO",
        line: "\"buy + product\" structure, load time under 1.5s",
      },
      {
        icon: Rocket,
        title: "Turnkey launch",
        line: "domain, SSL, hosting, GA4 + Search Console",
      },
      {
        icon: LifeBuoy,
        title: "1-year warranty",
        line: "fixes, updates, replies within 4 hours",
      },
    ],
    notIncludedTitle: "Not in the base package",
    notIncluded: [
      "Online payments (an option below — many stores launch with pay-on-delivery or invoicing)",
      "A catalogue of hundreds of products with complex filtering",
      "ERP integrations and stock management",
      "Product photography",
    ],
    notIncludedFoot:
      "All of it can be added as options once sales justify it. The base is a complete store that takes orders from day one.",
  },
  price: {
    eyebrow: "/ 02 PRICING",
    heading: ["What shapes ", "the price"],
    cells: [
      {
        icon: Layers,
        title: "Base",
        stat: "£6,000",
        body: "Catalogue up to ~50 products, cart, checkout, CMS, SEO, launch and a year of warranty. Orders via pay-on-delivery or invoice.",
        span: "2x1",
      },
      {
        icon: CreditCard,
        title: "Online payments",
        stat: "+£900",
        body: "Stripe or GoCardless — money in your account the moment the order lands.",
        span: "1x1",
      },
      {
        icon: Package,
        title: "Catalogue 50–500 products",
        stat: "+£700",
        body: "Categories, filters and structure for scaling campaigns.",
        span: "1x1",
      },
      {
        icon: Filter,
        title: "Advanced filters & search",
        stat: "+£1,000",
        body: "Catalogue search and parameter filters — buyers find products faster.",
        span: "1x1",
      },
      {
        icon: Layers,
        title: "Complex catalogue logic",
        stat: "+£1,400",
        body: "Custom flows, configurators and advanced UX for conversion growth.",
        span: "1x1",
      },
      {
        icon: Bell,
        title: "CRM & notifications",
        stat: "+£150–500",
        body: "Orders pushed to Telegram, email or straight into your CRM.",
        span: "1x1",
      },
      {
        icon: Globe,
        title: "Second language",
        stat: "+15%",
        body: "A separate SEO structure and content set per language.",
        span: "1x1",
      },
      {
        icon: Palette,
        title: "Richer design",
        stat: "+20–40%",
        body: "Branded layout — +20%. Premium with custom artwork — +40%.",
        span: "1x1",
      },
    ],
  },
  calcCta: {
    heading: ["Price your store ", "in 60 seconds"],
    sub: "Product count, payments, languages — the calculator shows a range with a full breakdown. No email gate, no sales call.",
    primaryLabel: "Open the calculator",
    primaryHref: "/en/calculator",
    secondaryLabel: "Discuss the project",
    secondaryHref: "/en/contacts",
  },
  examples: {
    eyebrow: "CASES",
    heading: ["Stores ", "we've shipped"],
    sub: "A book publisher, electronics, skincare — different ranges, one logic: minimum steps from shopfront to order.",
    slugs: ["glimmer", "kondor-device", "le-muse-nature"],
    allLabel: "All case studies",
    allHref: "/en/portfolio",
  },
  faq: {
    heading: "Online store FAQ",
    items: [
      {
        q: "Can we launch without online payments?",
        a: [
          "Yes, and many stores do: orders with pay-on-delivery or invoicing. Add online payments (+£900) once order volume justifies it — no rebuild needed.",
        ],
      },
      {
        q: "Why not Shopify or Wix?",
        a: [
          "Builders charge monthly subscriptions and fees, cap your SEO and design, and migrating off them later costs more than the site itself. Custom code is one payment, your code in your GitHub, zero subscriptions. Full comparison — on the ",
          { em: "vs site builders" },
          " page.",
        ],
      },
      {
        q: "Who adds the products?",
        a: [
          "You do — from your phone. The CMS lets you add products, change prices and run promos in minutes. A 1-hour training session is included.",
        ],
      },
      {
        q: "50 products — what if I have 300?",
        a: [
          "The \"catalogue 50–500 products\" option (+£700) adds categories and filters for a bigger range. Beyond 500 SKUs or complex logic, we scope the architecture separately.",
        ],
      },
      {
        q: "How long does it take?",
        a: [
          "6–10 weeks from brief to first orders. The deadline is fixed in the contract — if we miss it through our own fault, we pay a 30% rebate.",
        ],
      },
    ],
  },
};
