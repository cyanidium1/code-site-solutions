import {
  Bell,
  Calendar,
  CreditCard,
  Globe,
  Layers,
  LayoutList,
  LifeBuoy,
  Lock,
  Palette,
  PenLine,
  Rocket,
  Search,
  Send,
  Smartphone,
  Zap,
} from "lucide-react";

import type { LandingPageContent } from "@/types/landing";

export const LANDING_EN: LandingPageContent = {
  metaTitle: "ᐈ Landing Page Design from £800 | Code-Site.Art",
  metaDescription:
    "➤ Custom-coded landing page from £800, live in 1–2 weeks ✔️ Design, copy, build, launch and 1 year of support included ✔️ Fixed price in the contract ➡ Get your quote.",
  breadcrumbHome: "Home",
  breadcrumbSelf: "Landing page",
  hero: {
    eyebrow: "LANDING PAGE",
    headline: ["A landing page from £800 ", "that brings in leads"],
    sub: "One page with one clear offer: design, copy, build, lead form, launch. 1–2 weeks from brief to release. The price is fixed in the contract before we start.",
    badges: [
      { label: "1–2 weeks", sub: "brief to launch" },
      { label: "All-inclusive", sub: "copy + design + code" },
      { label: "1-year warranty", sub: "fixes and advice" },
      { label: "Fixed price", sub: "in the contract upfront" },
    ],
  },
  miniCalc: {
    tier: "landing",
    title: "Build your landing page — the price updates live",
    baseLabel: "Base landing page",
    baseNote: "up to 7 sections: design, copy, email lead form, launch, 1-year warranty",
    basePrice: 800,
    currency: "£",
    blocks: {
      label: "Extra sections",
      note: "+£100 per section beyond 7",
      unitPrice: 100,
      max: 5,
    },
    options: [
      { id: "telegram", label: "Leads to Telegram", price: 50 },
      { id: "lang", label: "Second language", price: 100 },
      { id: "brand", label: "Branded design with animation", price: 120 },
      { id: "crm", label: "CRM integration", price: 100 },
      { id: "booking", label: "Booking / time slots", price: 150 },
      { id: "payments", label: "Online payments (Stripe / GoCardless)", price: 150 },
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
      summaryTitle: "Landing page configuration from the mini-calculator:",
    },
  },
  when: {
    eyebrow: "/ WHEN A LANDING FITS",
    heading: ["When a landing page is enough — ", "and when it isn't"],
    sub: "A landing page isn't a \"small website\" — it's a different tool: one page built around one visitor action.",
    fitTitle: "A landing page is the right call",
    fit: [
      "One service or product — and you need a steady flow of enquiries for it",
      "An ad campaign: Google Ads or social traffic needs a dedicated page",
      "A new venture, an MVP, or testing an idea without a big budget",
      "An event, a course, a franchise — anything decided on a single page",
    ],
    notFitTitle: "Better with a full site",
    notFit: [
      "You need 5+ pages — services, cases, blog — that's a corporate website",
      "You want to edit content yourself every week — that needs a CMS",
      "The goal is SEO traffic across dozens of queries: one page can only rank so far",
      "A product catalogue with a cart — that's e-commerce, a different architecture",
    ],
    foot: "Not sure a landing page is what you need? Write to us — we'll tell you honestly if something else serves you better.",
  },
  included: {
    eyebrow: "END-TO-END",
    heading: ["What's included ", "at £800"],
    sub: "This is a complete product, not a stripped-down teaser. You pay a fixed sum and get a page that collects leads from day one:",
    items: [
      {
        icon: LayoutList,
        title: "Long-form structure",
        line: "6–8 sections: offer, benefits, social proof, FAQ, form",
      },
      {
        icon: PenLine,
        title: "Launch copywriting",
        line: "we write the page copy from your brief",
      },
      {
        icon: Palette,
        title: "Custom design",
        line: "no templates; 2 rounds of revisions included",
      },
      {
        icon: Smartphone,
        title: "Responsive build",
        line: "mobile / tablet / desktop",
      },
      {
        icon: Send,
        title: "Lead form",
        line: "enquiries land in your inbox — none lost",
      },
      {
        icon: Search,
        title: "Baseline SEO",
        line: "titles, metadata, speed, Google-ready structure",
      },
      {
        icon: Lock,
        title: "Domain, SSL, hosting",
        line: "set up on your own accounts",
      },
      {
        icon: Rocket,
        title: "Launch & analytics",
        line: "Google Analytics + Search Console",
      },
      {
        icon: LifeBuoy,
        title: "1-year warranty",
        line: "fixes and advice included",
      },
    ],
    notIncludedTitle: "Not in the base landing page",
    notIncluded: [
      "A CMS for editing content yourself",
      "Blog and SEO pages",
      "Multiple languages",
      "Complex integrations: payments, CRM, booking",
    ],
    notIncludedFoot:
      "All of it can be added as options below — or grow the landing into a Corporate website later: the architecture scales without a rebuild.",
  },
  price: {
    eyebrow: "/ PRICING",
    heading: ["What shapes ", "the price"],
    cells: [
      {
        icon: Layers,
        title: "Base",
        stat: "£800",
        body: "Everything listed above: design, copy, build, launch, a year of warranty. Options exist only for when you need them.",
        span: "2x1",
      },
      {
        icon: Palette,
        title: "Richer design",
        stat: "+20–40%",
        body: "Branded layout with animation — +20%. Premium with custom artwork — +40%.",
        span: "1x1",
      },
      {
        icon: Globe,
        title: "Second language",
        stat: "+£100",
        body: "A separate SEO structure and content set per language.",
        span: "1x1",
      },
      {
        icon: CreditCard,
        title: "Online payments",
        stat: "+£150",
        body: "Stripe or GoCardless — take payment right on the page.",
        span: "1x1",
      },
      {
        icon: Bell,
        title: "CRM & notifications",
        stat: "+£50–100",
        body: "Leads pushed to Telegram, email, or straight into your CRM.",
        span: "1x1",
      },
      {
        icon: Calendar,
        title: "Booking",
        stat: "+£150",
        body: "Time slots and scheduling — for services, consults, events.",
        span: "1x1",
      },
      {
        icon: PenLine,
        title: "Extended copywriting",
        stat: "+£300–2,000",
        body: "Launch copy is already in. Professional polish or a full SEO package is separate.",
        span: "1x1",
      },
      {
        icon: Zap,
        title: "Express launch",
        stat: "£1,500 total",
        body: "Skip the queue: live in 7 days instead of the standard 1–2 weeks.",
        span: "1x1",
      },
    ],
  },
  priceTable: {
    eyebrow: "/ READY-MADE SETUPS",
    heading: ["Price table: ", "typical configurations"],
    headers: ["Configuration", "What's inside", "Price", "Timeline"],
    rows: [
      ["Base landing page", "up to 7 sections, copy, design, email lead form", "£800", "1–2 weeks"],
      ["Landing + notifications", "base + Telegram leads + CRM", "£950", "1–2 weeks"],
      ["Bilingual landing", "base + second language + branded design", "£1,020", "2 weeks"],
      ["Fully loaded", "2 languages, payments, booking, CRM, Telegram, +2 sections", "£1,470", "2–3 weeks"],
      ["Express landing", "base, skip the queue, live in 7 days", "£1,500", "7 days"],
    ],
    foot: "These are ready-made examples — build your own configuration in the calculator above. The final price is fixed in the contract before we start.",
  },
  stories: {
    eyebrow: "/ STORIES",
    heading: ["How it plays out ", "for real clients"],
    items: [
      {
        slug: "aleko-course",
        kicker: "CASE · ONLINE COURSE",
        title: "A landing page for Aleko Sokurashvili",
        paragraphs: [
          "A popular entrepreneur-blogger with a 1.3M+ audience sells an online course on viral video. The landing page's job: turn followers into buyers — 48 video lessons, 3 tiers, online payment.",
          "We built the page around one action — pick a tier and pay. No extra steps between interest and purchase.",
        ],
        stat: { value: "×2.4", label: "more checkout clicks" },
        ctaLabel: "View the case",
      },
      {
        slug: "tatarka-franchise",
        kicker: "CASE · FRANCHISE",
        title: "The Tatarka franchise landing page",
        paragraphs: [
          "A Crimean Tatar restaurant chain sells its franchise. The landing page had to speak investor: the concept, the numbers, partnership terms and an application form.",
          "The page became the chain's main negotiation tool — helping raise over $250,000 in investment.",
        ],
        stat: { value: "$250,000+", label: "investment raised" },
        ctaLabel: "View the case",
      },
    ],
  },
  gallery: {
    eyebrow: "GALLERY",
    heading: ["Landing pages and sites ", "we've shipped"],
    sub: "A course, a franchise, a personal brand, a model agency, a music project, travel — every page built around its own action.",
    slugs: [
      "aleko-course",
      "tatarka-franchise",
      "oleksandr-sitnikov",
      "urmodels",
      "glenn-garbo",
      "rich-tour",
    ],
    allLabel: "All case studies",
    allHref: "/en/portfolio",
  },
  calcCta: {
    heading: ["Price your landing page ", "in 60 seconds"],
    sub: "Languages, integrations, design level — the calculator shows a range with a full breakdown. No email gate, no sales call.",
    primaryLabel: "Open the calculator",
    primaryHref: "/en/calculator",
    secondaryLabel: "Discuss the project",
    secondaryHref: "/en/contacts",
  },
  examples: {
    eyebrow: "CASES",
    heading: ["Landing pages ", "we've shipped"],
    sub: "Three different jobs — an online course, a franchise, a personal brand. Each page is built around one specific visitor action.",
    slugs: ["aleko-course", "tatarka-franchise", "oleksandr-sitnikov"],
    allLabel: "All case studies",
    allHref: "/en/portfolio",
  },
  faq: {
    heading: "Landing page FAQ",
    items: [
      {
        q: "Is a landing page enough for me, or do I need a full site?",
        a: [
          "If you have one offer and one target action — a landing page is enough. If you need separate pages for services, cases, and a blog, look at the ",
          { em: "Corporate website from £3,500" },
          ". On a 30-minute call we'll tell you honestly which one you actually need.",
        ],
      },
      {
        q: "What if I have no copy and no logo?",
        a: [
          "We write the landing page copy — it's included in the price. Logo and branding we do with vetted partners (from £1,500), or we work with your existing style.",
        ],
      },
      {
        q: "Can I grow the landing page into a full website later?",
        a: [
          "Yes. The architecture ",
          { em: "scales" },
          ": we add pages, a CMS, a blog and languages on top of what exists — no rebuild, no lost SEO.",
        ],
      },
      {
        q: "How long does it take?",
        a: [
          "1–2 weeks from brief to launch. Need it faster? Express format: live in 7 days, £1,500 total.",
        ],
      },
      {
        q: "What about support after launch?",
        a: [
          "A year of warranty is included: fixes, updates, and advice with responses within 4 hours. After that — optional, £200/mo or £40/hr.",
        ],
      },
      {
        q: "How many leads will a landing page bring?",
        a: [
          "The honest answer: it depends on traffic. A landing page converts the visitors you bring via ads or social — our case record is 2.4× more clicks to the target action after a redesign. No traffic, no leads — and we say that before the project, not after.",
        ],
      },
      {
        q: "Where can I see examples of your landing pages?",
        a: [
          "In the gallery above — six live projects with linked breakdowns, or in the full ",
          { em: "portfolio" },
          ": 22 cases with numbers and screenshots.",
        ],
      },
    ],
  },
};
