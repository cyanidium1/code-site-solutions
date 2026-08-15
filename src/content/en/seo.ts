import {
  ArrowRightLeft,
  BarChart3,
  Braces,
  FileText,
  Layers,
  LayoutList,
  Link2,
  MapPin,
  MessageCircle,
  PenLine,
  Search,
  ShoppingCart,
} from "lucide-react";

import type { LandingPageContent } from "@/types/landing";

export const SEO_EN: LandingPageContent = {
  metaTitle: "ᐈ SEO Services from £300/mo | Code-Site.Art",
  metaDescription:
    "➤ SEO for service businesses from £300/mo, e-commerce from £500/mo ✔️ One-off audit £300 ✔️ No \"#1 guarantees\" ✔️ Reports show rankings and traffic ➡ Start with an audit.",
  breadcrumbHome: "Home",
  breadcrumbSelf: "SEO services",
  hero: {
    eyebrow: "SEO SERVICES",
    headline: ["SEO from £300/mo — ", "no magic, no \"#1 guarantees\""],
    sub: "Technical work, content, links and local SEO — monthly work with reports on rankings and traffic. First measurable results take 3–6 months, and we say that upfront.",
  },
  when: {
    eyebrow: "/ 01 WHO IT'S FOR",
    heading: ["When SEO pays off — ", "and when it's too early"],
    sub: "SEO is an investment with a delayed start. It works when there's something to promote and room to grow.",
    fitTitle: "SEO will pay off",
    fit: [
      "People search for your services every month — and competitors take that traffic now",
      "You have a site, but it sits on page 2–4: impressions without clicks",
      "A local business — clinic, builder, solicitor: half the result is local search",
      "E-commerce with a catalogue: every category and product is an entry point",
    ],
    notFitTitle: "Too early",
    notFit: [
      "A new niche with no formed demand — run ads and validate the offer first",
      "A brochure site with no service pages — content first, promotion second",
      "Expecting results in a month — SEO doesn't work that way, better to decline upfront",
      "A builder-platform site with a hard ceiling — see the section below",
    ],
    foot: "Not sure? Order a £300 audit — we'll tell you honestly whether there's room to grow and what it would cost.",
  },
  included: {
    eyebrow: "EVERY MONTH",
    heading: ["What the retainer includes ", "from £300/mo"],
    sub: "Not \"comprehensive SEO\" as one line on an invoice — a concrete list of work every month:",
    items: [
      {
        icon: Search,
        title: "Technical monitoring",
        line: "speed, indexation, Search Console errors",
      },
      {
        icon: PenLine,
        title: "Content",
        line: "1–2 articles or service pages a month",
      },
      {
        icon: LayoutList,
        title: "New SEO pages",
        line: "for the queries you're currently losing",
      },
      {
        icon: Link2,
        title: "Links & authority",
        line: "directories, mentions, guest posts — no link farms",
      },
      {
        icon: MapPin,
        title: "Local SEO",
        line: "Google Business Profile, reviews, \"service + area\"",
      },
      {
        icon: Braces,
        title: "Schema.org",
        line: "markup for rich snippets and AI search",
      },
      {
        icon: BarChart3,
        title: "Monthly report",
        line: "rankings, traffic, enquiries — not \"work performed\"",
      },
      {
        icon: MessageCircle,
        title: "Direct line",
        line: "questions go to the person doing the work",
      },
      {
        icon: FileText,
        title: "Quarterly plan",
        line: "what we do next and why — in the open",
      },
    ],
    notIncludedTitle: "What we don't promise",
    notIncluded: [
      "A guaranteed #1 position",
      "Results in the first month",
      "Grey links, click manipulation or \"secret methods\"",
      "Growth without any changes to the site",
    ],
    notIncludedFoot:
      "Google doesn't sell positions. We build what it rewards — a fast site, useful content and authority — and show progress in numbers every month.",
  },
  price: {
    eyebrow: "/ 02 PRICING",
    heading: ["What it ", "costs"],
    cells: [
      {
        icon: Layers,
        title: "Service business site",
        stat: "£300/mo",
        body: "A multi-page services site: technical work, 1–2 content pieces, local SEO, links, a report. Clinics, builders, solicitors, B2B.",
        span: "2x1",
      },
      {
        icon: ShoppingCart,
        title: "E-commerce",
        stat: "£500/mo",
        body: "A catalogue means more work: categories, product pages, filters, more content and technical upkeep monthly.",
        span: "1x1",
      },
      {
        icon: Search,
        title: "One-off SEO audit",
        stat: "£300",
        body: "A technical + content teardown with a prioritised fix list. Useful even without a retainer.",
        span: "1x1",
      },
      {
        icon: PenLine,
        title: "Extra content",
        stat: "£200/article",
        body: "Beyond the included volume — when you want to grow faster.",
        span: "1x1",
      },
      {
        icon: ArrowRightLeft,
        title: "WordPress migration",
        stat: "£500–2,000",
        body: "Move to fast custom code without losing SEO history: 301 redirects, Search Console handoff.",
        span: "1x1",
      },
      {
        icon: Layers,
        title: "With a new site from us",
        stat: "£0 first year",
        body: "Every site we build is SEO-ready, with a year of technical support in the development price. A retainer comes when you're ready to grow faster.",
        span: "2x1",
      },
    ],
  },
  platforms: {
    eyebrow: "/ 03 WORTH KNOWING",
    heading: ["Why builder platforms and old WordPress ", "are harder to promote"],
    paragraphs: [
      "Wix, Squarespace and other builders restrict exactly what Google rewards: speed (platform code bloat on every page), URL structure, Schema.org and access to technical fixes. You pay for a retainer — and half the audit's recommendations physically can't be implemented on a builder.",
      "Old WordPress is a different problem: slow themes, a dozen conflicting plugins, duplicate pages and vulnerabilities. It can be promoted, but every month part of the budget goes to fighting the platform instead of growing.",
    ],
    bullets: [
      "Builders: 3–6 second loads versus under 1s on custom code — Google sees it in Core Web Vitals",
      "Limited Schema.org and metadata control — weaker snippets in results",
      "No code access — half the technical fixes from an audit are impossible",
      "Old WP: junk URLs, duplicates, hack risk — and a hacked site drops out of results",
    ],
    foot: "It's often cheaper to migrate once than to keep paying for a platform's ceiling. Migration from WordPress or a builder is £500–2,000 with SEO history preserved.",
    links: [
      { label: "vs WordPress", href: "/en/vs-wordpress" },
      { label: "vs site builders", href: "/en/vs-constructors" },
    ],
  },
  calcCta: {
    heading: ["Start with a £300 ", "audit"],
    sub: "A teardown of your site with a prioritised fix list and an honest answer on whether you need a retainer at all. Delivered within 5 working days.",
    primaryLabel: "Order an audit",
    primaryHref: "/en/contacts",
    secondaryLabel: "Price a new site",
    secondaryHref: "/en/calculator",
  },
  examples: {
    eyebrow: "CASES",
    heading: ["Sites already ", "growing in search"],
    sub: "A construction firm in Denmark, a clinic in Odesa, a renovation company in France — Google traffic as the main enquiry channel.",
    slugs: ["nbyg-kobenhavn", "efedra-clinic", "solide-renovation"],
    allLabel: "All case studies",
    allHref: "/en/portfolio",
  },
  faq: {
    heading: "SEO services FAQ",
    items: [
      {
        q: "How much do your SEO services cost?",
        a: [
          "A service-business site is ",
          { em: "£300/mo" },
          ". E-commerce with a catalogue is ",
          { em: "£500/mo" },
          " — there's objectively more work. A one-off audit with a fix list is £300. No hidden extras: the month's work list is in your report.",
        ],
      },
      {
        q: "Why don't you guarantee #1?",
        a: [
          "Because Google doesn't sell positions, and no honest contractor controls them. We guarantee the volume and quality of the work — and show ranking and traffic dynamics every month. Anyone \"guaranteeing #1 in a month\" is selling either air or grey tactics that get sites penalised later.",
        ],
      },
      {
        q: "When do results show?",
        a: [
          "First measurable changes take 3–6 months: impressions grow first, then rankings, then clicks and enquiries. Faster only happens in very low-competition niches.",
        ],
      },
      {
        q: "Do you promote sites you didn't build?",
        a: [
          "Yes — after a £300 audit. If the site runs on a builder or old WordPress, we'll show you the platform's ceiling honestly and price both routes: promote as-is, or migrate first (£500–2,000).",
        ],
      },
      {
        q: "What's in the monthly report?",
        a: [
          "Ranking dynamics for target queries, search traffic, enquiries, the work done, and next month's plan. No \"40 tasks completed\" — only what you can verify.",
        ],
      },
    ],
  },
};
