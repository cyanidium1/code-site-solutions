import type { PackagePageContent } from "@/components/landing-page/types";
import { resolveRootHref } from "@/constants/i18n-routes";
import {
  ADDONS,
  PACKAGES,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

const L = "en";
const price = formatPackagePrice("landing", L);
const term = formatPackageTerm("landing", L);
const days = PACKAGES.landing.days.max;
const business = formatPackagePrice("business", L);
const rush = `“${ADDONS.rush.name[L]}” (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });

export const LANDING_EN: PackagePageContent = {
  pkg: "landing",
  rootPath: "/landing",
  metaTitle: `Landing Page for ${price} in ${term} | Code-Site.Art`,
  metaDescription: `A custom-coded landing page for ${price} in ${term}: design, copy from your brief, lead form, a year of hosting. Fixed price, you own the code.`,
  breadcrumbHome: "Home",
  breadcrumbSelf: "Landing page",
  serviceName: "Landing page development",
  offerName: "Landing page, end-to-end",
  eyebrow: "Landing page package",
  h1: `A landing page for ${price} in ${term}`,
  sub: "One page built for one action: offer, benefits, reviews, FAQ and a form. Leads arrive in Telegram or your inbox. The price is fixed in the contract before we start.",
  badges: [
    { label: price, sub: "fixed in the contract" },
    { label: term, sub: "from brief to launch" },
    { label: "1-year warranty", sub: "included" },
    { label: "You own the code", sub: "no subscriptions" },
  ],
  composition: {
    heading: ["What the landing page ", `includes for ${price}`],
    includesTitle: "Included",
    excludesTitle: "Not included",
    excludesFoot: `Need a CMS, a blog or several pages? That's the Business website package at ${business}. Languages, CRM, booking and payments can be added to a landing page — see the add-ons below.`,
  },
  when: {
    heading: ["When a landing page is enough — ", "and when you need a website"],
    fitTitle: "A landing page is the right call",
    fit: [
      "One service or product that needs enquiries",
      "Google or social ads point to a dedicated page",
      "Launching a new line of business or testing an idea",
      "An event, course or franchise — decided on one page",
    ],
    notFitTitle: "A business website fits better",
    notFit: [
      "You need separate pages for services, case studies, contacts",
      "You want to edit copy and photos yourself",
      "The goal is search traffic across many queries",
      "A product catalogue with a cart is an online shop",
    ],
  },
  process: {
    heading: ["How we build a landing page ", `in ${term}`],
    sub: "The clock starts when we have your brief and the deposit.",
    steps: [
      { from: 1, title: "Brief and structure", body: "We go through the brief, agree the page sections and write the copy." },
      { from: 2, title: "Design", body: "Mobile and desktop layouts. One round of edits the same day." },
      { from: days, title: "Build, test, launch", body: "Code, form and notifications, basic SEO, analytics. Live on your domain." },
    ],
  },
  addons: {
    heading: ["What you can ", "add to a landing page"],
    sub: `Every add-on has a fixed price. In a hurry? Add ${rush}.`,
    calcLabel: "Open the calculator",
    calcHref: resolveRootHref("/calculator", L),
  },
  payment: { heading: ["Payment ", "terms"] },
  cases: {
    heading: ["Landing pages we've ", "already launched"],
    sub: "An online course, a franchise, a personal brand — each page built around one visitor action.",
    slugs: ["aleko-course", "tatarka-franchise", "oleksandr-sitnikov"],
    allLabel: "All case studies",
    allHref: resolveRootHref("/portfolio", L),
  },
  faq: {
    heading: "Landing page FAQ",
    items: [
      {
        q: `What's included for ${price}?`,
        a: [
          "One long-form page, mobile layout, a lead form with notifications, basic SEO, copy written from your brief, hosting and SSL for a year, a one-year warranty. The code and all access are yours.",
        ],
      },
      {
        q: "How long does it take?",
        a: [`${term} from brief and deposit. Need it sooner? Add ${rush}.`],
      },
      {
        q: "Is a landing page enough, or do I need a website?",
        a: [
          "One offer and one target action — a landing page is enough. Separate pages for services, case studies or a blog — see the ",
          { link: { href: resolveRootHref("/corporate-site", L), text: `Business website for ${business}` } },
          ".",
        ],
      },
      {
        q: "I don't have any copy. What now?",
        a: [
          `We write the copy from your brief — it's included. For deeper work on the text there's the “${ADDONS.copy_pro.name[L]}” add-on.`,
        ],
      },
      {
        q: "Can the landing page grow into a full website later?",
        a: ["Yes. Pages, a CMS, a blog and languages go on top of the existing code — no rebuild from scratch."],
      },
      {
        q: "What happens after launch?",
        a: [
          `Warranty and support are included for a year. After that: hosting renewal at ${hosting}/year, or we move the site to your own account.`,
        ],
      },
      {
        q: "How many leads will it bring?",
        a: [
          "That depends on your traffic. A landing page turns visitors into enquiries; ads or social media bring the visitors. We won't promise a number of leads.",
        ],
      },
    ],
  },
  seo: { href: "/seo", linkLabel: "How our SEO works" },
  cta: {
    heading: ["Free quote ", "within 24 hours"],
    sub: "Describe the task in the form at the top — we'll reply with price, timeline and scope. No obligation.",
    formLabel: "Fill in the form",
    calcLabel: "Open the calculator",
    calcHref: resolveRootHref("/calculator", L),
  },
  related: {
    heading: "Landing pages by niche",
    links: [
      { label: "therapist website", href: "/en/blog/therapist-website-guide" },
      { label: "beauty salon website", href: "/en/blog/beauty-salon-website" },
      { label: "photographer portfolio website", href: "/en/blog/photographer-portfolio-website" },
      { label: "restaurant website with delivery", href: "/en/blog/restaurant-website-with-delivery" },
      { label: "fitness club website", href: "/en/blog/fitness-club-website" },
      { label: "bakery website", href: "/en/blog/bakery-website" },
    ],
  },
};
