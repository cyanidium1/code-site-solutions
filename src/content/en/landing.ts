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
  },
  when: {
    eyebrow: "/ 01 WHEN A LANDING FITS",
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
    eyebrow: "/ 02 PRICING",
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
        stat: "+15%",
        body: "A separate SEO structure and content set per language.",
        span: "1x1",
      },
      {
        icon: CreditCard,
        title: "Online payments",
        stat: "+£900",
        body: "Stripe or GoCardless — take payment right on the page.",
        span: "1x1",
      },
      {
        icon: Bell,
        title: "CRM & notifications",
        stat: "+£150–500",
        body: "Leads pushed to Telegram, email, or straight into your CRM.",
        span: "1x1",
      },
      {
        icon: Calendar,
        title: "Booking",
        stat: "+£600",
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
    ],
  },
};
