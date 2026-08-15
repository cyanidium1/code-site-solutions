import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Layers,
  LayoutDashboard,
  LayoutList,
  LifeBuoy,
  Palette,
  PenLine,
  Plug,
  Rocket,
  Search,
  Zap,
} from "lucide-react";

import type { LandingPageContent } from "@/types/landing";

export const CORPORATE_EN: LandingPageContent = {
  metaTitle: "ᐈ Corporate Website from £3,500 | Code-Site.Art",
  metaDescription:
    "➤ Custom-coded corporate website from £3,500 in 4–8 weeks ✔️ CMS, blog, 5+ integrations, local SEO ✔️ Fixed price in the contract ➡ Get your quote.",
  breadcrumbHome: "Home",
  breadcrumbSelf: "Corporate website",
  hero: {
    eyebrow: "CORPORATE WEBSITE",
    headline: ["A corporate website from £3,500 ", "that sells your services"],
    sub: "A page for every service, a CMS, a blog, integrations and local SEO. 4–8 weeks from brief to launch. The price is fixed in the contract before we start.",
  },
  when: {
    eyebrow: "/ 01 WHEN IT FITS",
    heading: ["When you need a corporate website — ", "and when you don't"],
    sub: "A corporate website is a system of pages, one per service and search intent, that keeps compounding in Google for years.",
    fitTitle: "A corporate site is the right call",
    fit: [
      "Several services or directions — each deserves its own page",
      "The goal is SEO traffic: people search for your services every day",
      "You want to update content yourself: fees, team, cases, blog posts",
      "A compliance-heavy industry: healthcare, legal, finance — trust matters",
    ],
    notFitTitle: "Better with something else",
    notFit: [
      "One offer for an ad campaign — a landing page from £800 is enough",
      "A product catalogue with a cart — that's an online store, a different architecture",
      "A SaaS, marketplace or client portal — that's a custom platform from £6,000",
    ],
    foot: "Not sure which format is yours? Write to us — on a 30-minute call we'll tell you honestly what not to overpay for.",
  },
  included: {
    eyebrow: "END-TO-END",
    heading: ["What's included ", "at £3,500"],
    sub: "A fixed sum — a finished sales tool. Not a brochure site, but a system that brings clients from search:",
    items: [
      {
        icon: LayoutList,
        title: "5 pages included",
        line: "home, services, about, cases, contact — then +£220/page",
      },
      {
        icon: LayoutDashboard,
        title: "CMS",
        line: "Sanity: copy, fees, team, cases — edit from your phone",
      },
      {
        icon: FileText,
        title: "Blog",
        line: "an article system built for SEO — entry points from search",
      },
      {
        icon: PenLine,
        title: "Launch copywriting",
        line: "we write the key-page copy from your brief",
      },
      {
        icon: Palette,
        title: "Custom design",
        line: "no templates; 2 rounds of revisions included",
      },
      {
        icon: Plug,
        title: "5+ integrations",
        line: "forms, CRM, analytics, notifications",
      },
      {
        icon: Search,
        title: "Local SEO",
        line: "\"service + area\" structure, Schema.org, Google Business Profile",
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
      "Complex SaaS architecture and user accounts",
      "A dedicated team with a 24/7 SLA",
      "Photo and video production",
      "Content beyond the launch copy (articles from £30)",
    ],
    notIncludedFoot:
      "The first two are Custom Platform territory (from £6,000). The rest can be added as options or through vetted partners.",
  },
  price: {
    eyebrow: "/ 02 PRICING",
    heading: ["What shapes ", "the price"],
    cells: [
      {
        icon: Layers,
        title: "Base",
        stat: "£3,500",
        body: "Everything above: 5 pages, CMS, blog, integrations, SEO, launch and a year of warranty.",
        span: "2x1",
      },
      {
        icon: LayoutList,
        title: "Extra pages",
        stat: "+£220 each",
        body: "Every new service or location gets its own page targeting its own search query.",
        span: "1x1",
      },
      {
        icon: Palette,
        title: "Richer design",
        stat: "+20–40%",
        body: "Branded layout with animation — +20%. Premium with custom artwork — +40%.",
        span: "1x1",
      },
      {
        icon: Plug,
        title: "Industry integrations",
        stat: "+£200–500",
        body: "Xero, Clio, e-sign and the like. Complex back-office APIs are quoted separately.",
        span: "1x1",
      },
      {
        icon: CreditCard,
        title: "Online payments",
        stat: "+£900",
        body: "Stripe or GoCardless — take deposits right on the site.",
        span: "1x1",
      },
      {
        icon: Calendar,
        title: "Booking",
        stat: "+£600",
        body: "Consultation and service booking with time slots.",
        span: "1x1",
      },
      {
        icon: Bell,
        title: "Extended content",
        stat: "+£30–100/article",
        body: "Launch copy is included. SEO articles and service pages at scale are separate.",
        span: "1x1",
      },
      {
        icon: Zap,
        title: "Faster delivery",
        stat: "+£600–1,200",
        body: "More parallel capacity — launch ahead of the standard 4–8 weeks.",
        span: "1x1",
      },
    ],
  },
  calcCta: {
    heading: ["Price your website ", "in 60 seconds"],
    sub: "Pages, languages, integrations — the calculator shows a range with a full breakdown. No email gate, no sales call.",
    primaryLabel: "Open the calculator",
    primaryHref: "/en/calculator",
    secondaryLabel: "Discuss the project",
    secondaryHref: "/en/contacts",
  },
  examples: {
    eyebrow: "CASES",
    heading: ["Corporate websites ", "we've shipped"],
    sub: "A construction firm in Denmark, a clinic in Odesa, a consultancy — different industries, one job: enquiries from search.",
    slugs: ["nbyg-kobenhavn", "efedra-clinic", "webbond"],
    allLabel: "All case studies",
    allHref: "/en/portfolio",
  },
  faq: {
    heading: "Corporate website FAQ",
    items: [
      {
        q: "How is a corporate website different from a landing page?",
        a: [
          "A landing page is one page for one action. A corporate site is a system of pages with a CMS and a blog: it collects SEO traffic across dozens of queries and grows with the business. If you have one offer, start with a ",
          { em: "landing page from £800" },
          " and grow it later.",
        ],
      },
      {
        q: "5 pages isn't enough. What if I need 12?",
        a: [
          "Each extra page is £220. Twelve pages is £3,500 + 7×£220 = £5,040. The calculator shows the exact figure with a line-by-line breakdown.",
        ],
      },
      {
        q: "Who maintains the content after launch?",
        a: [
          "You do — from your phone. The CMS lets you change copy, fees and team, and publish articles without a developer. A 1-hour training session and documentation are included.",
        ],
      },
      {
        q: "What about compliance for healthcare, legal, finance?",
        a: [
          "Included in the base: UK GDPR-compliant forms and consent, correct claims handling per GMC/GDC/SRA-style guidance, legally clean copy. We don't provide legal consulting — but the technical compliance side is covered.",
        ],
      },
      {
        q: "How long does it take?",
        a: [
          "4–8 weeks depending on scope. The deadline is fixed in the contract — if we miss it through our own fault, we pay a 30% rebate.",
        ],
      },
    ],
  },
};
