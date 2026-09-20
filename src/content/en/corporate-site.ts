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
const price = formatPackagePrice("business", L);
const term = formatPackageTerm("business", L);
const days = PACKAGES.business.days.max;
const landing = formatPackagePrice("landing", L);
const shop = formatPackagePrice("shop", L);
const rush = `“${ADDONS.rush.name[L]}” (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });

export const CORPORATE_EN: PackagePageContent = {
  pkg: "business",
  rootPath: "/corporate-site",
  metaTitle: `Business Website ${price}, ${term} | Code-Site.Art`,
  metaDescription: `Custom-coded business website for ${price} in ${term}: up to 5 pages, Sanity CMS, lead forms, SEO structure, a year of hosting. You own the code.`,
  breadcrumbHome: "Home",
  breadcrumbSelf: "Business website",
  serviceName: "Business website development",
  offerName: "Business website, end-to-end",
  eyebrow: "Business website package · most popular",
  h1: `A business website for ${price} in ${term}`,
  sub: "Custom-coded websites for European small businesses. Up to 5 pages: home, services, about, case studies, contact. Edit copy and photos yourself in Sanity CMS, even from your phone. Fixed price, no subscriptions.",
  badges: [
    { label: price, sub: "fixed in the contract" },
    { label: term, sub: "from brief to launch" },
    { label: "Sanity CMS", sub: "you edit it yourself" },
    { label: "1-year warranty", sub: "included" },
  ],
  composition: {
    heading: ["What the business website ", `includes for ${price}`],
    includesTitle: "Included",
    excludesTitle: "Not included",
    excludesFoot: `A cart and product payments are the Online shop package at ${shop}. CRM, online booking, service payments, a second language and a blog can be added — see the add-ons below.`,
  },
  when: {
    heading: ["When you need a website — ", "and when a landing page will do"],
    fitTitle: "A business website is the right call",
    fit: [
      "Several services, each needing its own page",
      "You want to update copy, prices and photos yourself",
      "You want search traffic, not only ads",
      "The site has to present the company: team, cases, reviews",
    ],
    notFitTitle: "Another package fits better",
    notFit: [
      `One offer for an ad campaign — a landing page at ${landing}`,
      `A catalogue with cart and checkout — an online shop at ${shop}`,
      "Client accounts, complex integrations — Custom",
    ],
  },
  process: {
    heading: ["How we build it ", `in ${term}`],
    sub: "The clock starts when we have your brief and the deposit.",
    steps: [
      { from: 1, title: "Brief and structure", body: "We agree pages, sections and copy. You see the sitemap on day one." },
      { from: 2, to: 3, title: "Design", body: "Home and inner page layouts for mobile and desktop, edits from your comments." },
      { from: 4, to: days - 1, title: "Development", body: "Code, Sanity CMS, forms and notifications, SEO structure, Google Analytics and Search Console." },
      { from: days, title: "Test and launch", body: "We check forms and speed, go live on your domain and show you how to edit the site." },
    ],
  },
  addons: {
    heading: ["What you can ", "add to the website"],
    sub: `Every add-on has a fixed price. In a hurry? Add ${rush}.`,
    calcLabel: "Open the calculator",
    calcHref: resolveRootHref("/calculator", L),
  },
  payment: { heading: ["Payment ", "terms"] },
  cases: {
    heading: ["Business websites we've ", "already launched"],
    sub: "Three projects from the portfolio. The figures on the cards come from the case studies.",
    slugs: ["nbyg-kobenhavn", "grontland", "webbond"],
    allLabel: "All case studies",
    allHref: resolveRootHref("/portfolio", L),
  },
  faq: {
    heading: "Business website FAQ",
    items: [
      {
        q: `What's included for ${price}?`,
        a: [
          "Up to 5 pages, Sanity CMS, lead forms with notifications, SEO structure, copy written from your brief, Google Analytics and Search Console, hosting and SSL for a year, a one-year warranty. The code and all access are yours.",
        ],
      },
      {
        q: "How long does it take?",
        a: [`${term} from brief and deposit. Need it sooner? Add ${rush}.`],
      },
      {
        q: "What if I need more than 5 pages?",
        a: [`Each extra page is ${formatAddonPrice("extra_page", L)}. The total is fixed in the contract before we start.`],
      },
      {
        q: "Can I edit the site myself?",
        a: ["Yes. Sanity CMS works in the browser and on your phone: copy, photos, prices, new case studies. We show you how at launch."],
      },
      {
        q: "How is this different from a landing page?",
        a: [
          `A landing page is one page for one action, no CMS, at ${landing}. A business website is up to 5 pages with a CMS and an SEO structure for search. See the `,
          { link: { href: resolveRootHref("/landing", L), text: "landing page package" } },
          ".",
        ],
      },
      {
        q: "What happens after launch?",
        a: [
          `Warranty and support are included for a year. After that: hosting renewal at ${hosting}/year, or we move the site to your own account.`,
        ],
      },
      {
        q: "Who owns the website?",
        a: ["You do: code, domain, CMS and analytics access. No subscriptions, no lock-in."],
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
    heading: "Business websites by niche",
    links: [
      { label: "hotel website with booking", href: "/en/blog/hotel-website-with-booking" },
      { label: "travel agency website", href: "/en/blog/travel-agency-website" },
      { label: "logistics company website", href: "/en/blog/logistics-company-website" },
    ],
  },
};
