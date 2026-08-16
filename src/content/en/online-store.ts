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
    badges: [
      { label: "6–10 weeks", sub: "brief to first orders" },
      { label: "0 subscriptions", sub: "pay once, own it" },
      { label: "1-year warranty", sub: "fixes and advice" },
      { label: "Fixed price", sub: "in the contract upfront" },
    ],
  },
  miniCalc: {
    tier: "custom",
    title: "Build your store — the price updates live",
    baseLabel: "Base online store",
    baseNote: "catalogue up to ~50 products, cart, checkout, CMS, SEO, launch, 1-year warranty",
    basePrice: 6000,
    currency: "£",
    blocks: {
      label: "Extra content pages",
      note: "brand, delivery, B2B — +£220/page",
      unitPrice: 220,
      max: 5,
    },
    options: [
      { id: "payments", label: "Online payments (Stripe / GoCardless)", price: 300 },
      { id: "catalog500", label: "Catalogue of 50–500 products", price: 500 },
      { id: "filters", label: "Advanced filters & search", price: 400 },
      { id: "advanced", label: "Complex logic: configurators, custom flows", price: 700 },
      { id: "crm", label: "CRM & order notifications", price: 100 },
      { id: "lang", label: "Second language", price: 250 },
      { id: "premium", label: "Premium design with custom artwork", price: 400 },
    ],
    totalLabel: "Estimated price",
    totalNote: "An estimate, not an invoice. The final figure is fixed in the contract.",
    form: {
      heading: "Get an exact quote — your selection ships with the enquiry",
      namePlaceholder: "Name",
      contactPlaceholder: "Email / Telegram / WhatsApp",
      submitLabel: "Send my configuration",
      success: "Thank you! We'll reply within 4 working hours with a confirmed price for your selection.",
      error: "Something went wrong. Try again or email hi@code-site.art.",
      summaryTitle: "Online store configuration from the mini-calculator:",
    },
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
      "1–3 products or an info-product — a landing page with payments is enough (from £800 + £150 for payments)",
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
        stat: "+£300",
        body: "Stripe or GoCardless — money in your account the moment the order lands.",
        span: "1x1",
      },
      {
        icon: Package,
        title: "Catalogue 50–500 products",
        stat: "+£500",
        body: "Categories, filters and structure for scaling campaigns.",
        span: "1x1",
      },
      {
        icon: Filter,
        title: "Advanced filters & search",
        stat: "+£400",
        body: "Catalogue search and parameter filters — buyers find products faster.",
        span: "1x1",
      },
      {
        icon: Layers,
        title: "Complex catalogue logic",
        stat: "+£700",
        body: "Custom flows, configurators and advanced UX for conversion growth.",
        span: "1x1",
      },
      {
        icon: Bell,
        title: "CRM & notifications",
        stat: "+£50–150",
        body: "Orders pushed to Telegram, email or straight into your CRM.",
        span: "1x1",
      },
      {
        icon: Globe,
        title: "Second language",
        stat: "+£250",
        body: "A separate SEO structure and content set per language.",
        span: "1x1",
      },
      {
        icon: Palette,
        title: "Premium design",
        stat: "+£400",
        body: "Custom artwork and animation on top of the bespoke layout already in the base.",
        span: "1x1",
      },
    ],
  },
  priceTable: {
    eyebrow: "/ READY-MADE SETUPS",
    heading: ["Price table: ", "typical configurations"],
    headers: ["Configuration", "What's inside", "Price", "Timeline"],
    rows: [
      ["Base store", "catalogue up to ~50 products, cart, checkout, CMS, SEO", "£6,000", "6–8 weeks"],
      ["Store with payments", "base + Stripe/GoCardless + CRM notifications", "£6,400", "6–8 weeks"],
      ["50–500 product catalogue", "base + big catalogue + filters & search + payments", "£7,200", "8–10 weeks"],
      ["Fully loaded", "all of the above + complex logic, 2 languages, premium design, +5 pages", "£9,750", "10 weeks"],
    ],
    foot: "Beyond £10,000 you're in custom-build territory with an architectural session. Build your own configuration in the calculator above.",
  },
  stories: {
    eyebrow: "/ STORIES",
    heading: ["How it plays out ", "for real clients"],
    items: [
      {
        slug: "glimmer",
        kicker: "CASE · BOOKSHOP",
        title: "Glimmer: paid for itself in about a week",
        paragraphs: [
          "A book publisher sells novels, fantasy and thrillers straight to readers. The job: a shopfront that sells on its own — bestsellers, promos and new titles right on the home page.",
          "Zero extra steps from banner to purchase — and first-week sales covered the development cost.",
        ],
        stat: { value: "~1 week", label: "to payback after launch" },
        ctaLabel: "View the case",
      },
      {
        slug: "kondor-device",
        kicker: "CASE · ELECTRONICS",
        title: "Kondor Device: 2 clicks to order",
        paragraphs: [
          "An electronics and accessories store with an 8-category catalogue. The old shopfront lost buyers on the way to checkout.",
          "We cut the path to order down to two clicks and gave the team a CMS to manage products and prices themselves. Sales grew right after launch.",
        ],
        stat: { value: "2 clicks", label: "from product to order" },
        ctaLabel: "View the case",
      },
    ],
  },
  gallery: {
    eyebrow: "GALLERY",
    heading: ["Stores ", "we've shipped"],
    sub: "Books, electronics, skincare, motors, pools — different ranges, one logic: minimum steps to order.",
    slugs: [
      "glimmer",
      "kondor-device",
      "le-muse-nature",
      "bravo",
      "raul-avto",
      "mono-pools",
    ],
    allLabel: "All case studies",
    allHref: "/en/portfolio",
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
          "Yes, and many stores do: orders with pay-on-delivery or invoicing. Add online payments (+£300) once order volume justifies it — no rebuild needed.",
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
          "The \"catalogue 50–500 products\" option (+£500) adds categories and filters for a bigger range. Beyond 500 SKUs or complex logic, we scope the architecture separately.",
        ],
      },
      {
        q: "How long does it take?",
        a: [
          "6–10 weeks from brief to first orders. The deadline is fixed in the contract — if we miss it through our own fault, we pay a 30% rebate.",
        ],
      },
      {
        q: "When does a store pay for itself?",
        a: [
          "Honestly: it depends on margin and traffic. Our record is the Glimmer bookshop, which covered its development cost in the first week of sales. A more realistic benchmark for most niches is a few months — and with no builder subscriptions, every month after that works for you.",
        ],
      },
      {
        q: "Where can I see examples of your stores?",
        a: [
          "In the gallery above — six live projects with linked breakdowns, or in the full ",
          { em: "portfolio" },
          ": 22 cases with numbers and screenshots.",
        ],
      },
    ],
  },
};
