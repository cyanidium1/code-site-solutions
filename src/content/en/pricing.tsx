/**
 * /en/pricing — copy for the international market (EUR). No prices typed by
 * hand: every figure and term comes from `@/constants/pricing`, which holds a
 * separate EUR list for `en`. Layout lives in `@/components/pricing-page`.
 */

import type { PricingCopy } from "@/components/pricing-page";
import {
  ALL_PACKAGES,
  PAYMENT_TERMS,
  PACKAGES,
  SERVICES,
  addonPrice,
  formatAddonPrice,
  formatPackagePrice,
  formatPackageTerm,
  packagePrice,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { PRICING_PROSE_EN } from "@/content/en/pricing-prose";

const L = "en" as const;
const eur = (n: number) => formatPrice(n, { locale: L });

const landing = eur(packagePrice("landing", L));
const business = eur(packagePrice("business", L));
const shop = eur(packagePrice("shop", L));
const hosting = eur(servicePrice("hostingRenewalPerYear", L));
const seoServices = eur(servicePrice("seoServicesFrom", L));
const seoShop = eur(servicePrice("seoShopFrom", L));
const extraPage = eur(addonPrice("extra_page", L));
const pay = PAYMENT_TERMS;
// The instalment threshold is set on the UA list; the same packages qualify on /en.
const instalmentIds = ALL_PACKAGES.filter((id) => packagePrice(id, "uk") >= pay.instalmentsFrom);
const instalmentPackages = instalmentIds.map((id) => PACKAGES[id].name[L]).join(" and ");

/* Comparison: Tilda list price from tilda.cc/pricing, checked 2026-09-20
 * (Personal US$10/mo billed yearly, US$15 month-to-month; code export only on
 * Business). Tilda bills in USD, so the figure stays in USD. Wix prices vary
 * by country, so we don't quote them. No agency retainer figure for the EU
 * market — TODO(owner): перевірити тариф типової WP-студії в ЄС, if you want
 * a number in the WordPress column. */
const TILDA_PERSONAL_YEARLY = 10;
const TILDA_PERSONAL_MONTHLY = 15;
const usdList = (n: number) => `US${formatPrice(n, { locale: L, currency: "USD" })}`;
const CHECKED = "20 Sep 2026";
const ours3y = eur(packagePrice("business", L) + 2 * servicePrice("hostingRenewalPerYear", L));

export const PRICING_COPY_EN: PricingCopy = {
  path: "/en/pricing",
  ogLocale: "en_GB",
  title: `Website prices: landing ${landing}, business ${business}, shop ${shop}`,
  description: `Custom-coded websites for European small businesses. Business site ${business} in ${formatPackageTerm("business", L)}, fixed in the contract. You own the code.`,
  crumbs: { home: "Home", homeHref: "/en", self: "Pricing" },
  eyebrow: "PRICING",
  h1: ["Website prices 2026 —", "fixed, in the contract"],
  heroSub: `Landing page ${landing}, business website ${business}, online shop ${shop}. Price and deadline are fixed in the contract before we start. Hosting, SSL, warranty and support for a year are included. The code is yours. No subscriptions.`,
  heroActions: { primary: "Free quote within 24 hours", secondary: "All packages and prices" },
  cta: {
    button: "Get a quote",
    line: `Free. We reply within ${SERVICES.auditResponseHours} hours with a price and a deadline.`,
  },
  cards: {
    title: "The three packages most clients choose",
    sub: "The button under a card opens the form with that package already selected.",
  },
  packages: {
    title: "All packages: price, deadline, what's included",
    sub: "Deadlines are in working days, counted from the day we have your brief and materials.",
  },
  industries: {
    title: "Industry solutions",
    sub: `Ready structure, copy and integrations for your industry. ${formatPackagePrice("industry", L)}, ${formatPackageTerm("industry", L)}.`,
  },
  addons: {
    title: "Add-ons — also at fixed prices",
    sub: "Add only what you need. Package plus add-ons is the price in your contract.",
  },
  services: {
    title: "Services outside the packages",
    sub: "What happens before and after launch, and what it costs.",
    rows: [
      {
        name: "Website audit / quote",
        price: eur(SERVICES.auditPrice),
        note: [
          `Reply within ${SERVICES.auditResponseHours} hours: what's wrong and what it costs to fix. `,
          { link: { href: "/en/contacts", text: "Ask for an audit" } },
          ".",
        ],
      },
      {
        name: "Support and warranty",
        price: `${eur(0)}, first year included`,
        note: [
          `Bugs, hosting, SSL, updates and backups are included for the first ${SERVICES.includedSupportMonths} months. After that: hosting ${hosting}/year, or we move the site to your own account.`,
        ],
      },
      {
        name: "New pages and features after launch",
        price: "at add-on prices",
        note: [
          `A new page is ${formatAddonPrice("extra_page", L)}, ${SERVICES.newPageDays.min}–${SERVICES.newPageDays.max} working days. Features are priced from the add-on table, invoiced separately.`,
        ],
      },
      {
        name: "SEO",
        price: `from ${seoServices}/mo`,
        note: [
          `Service business from ${seoServices}/mo, online shop from ${seoShop}/mo. `,
          { link: { href: "/en/seo", text: "SEO services" } },
          ".",
        ],
      },
      {
        name: "Redesign",
        price: "package price + migration",
        note: [
          `You pay for the package that matches the new site, plus content migration ${formatAddonPrice("migration", L)}.`,
        ],
      },
    ],
  },
  payment: {
    title: "Payment terms",
    sub: `${instalmentPackages}: ${pay.instalmentsCount} instalments available.`,
  },
  compare: {
    title: "Us vs a WordPress agency vs a website builder",
    sub: `Example: a ${PACKAGES.business.name[L].toLowerCase()}, ${PACKAGES.business.includes[L][0].toLowerCase()}. Only facts you can check.`,
    headers: ["", "Code-Site.Art", "WordPress agency", "Website builder (Tilda)"],
    rows: [
      {
        param: "Monthly fee",
        ours: `None. After year one — hosting ${hosting}/year`,
        wp: "A monthly support retainer is common, plus hosting",
        builder: `${usdList(TILDA_PERSONAL_YEARLY)}/mo billed yearly (${usdList(TILDA_PERSONAL_MONTHLY)} month-to-month), Personal plan`,
      },
      {
        param: "Code ownership",
        ours: "Code in your GitHub, domain and data in your name",
        wp: "Files are yours, but themes and plugins often need paid licences",
        builder: "The site lives on the platform. Code export only on the Business plan",
      },
      {
        param: "Time to launch",
        ours: `${formatPackageTerm("business", L)}, deadline in the contract`,
        wp: "Depends on the agency's queue",
        builder: "However long you spend building it",
      },
      {
        param: "Support",
        ours: "First year included: bugs, hosting, SSL, updates",
        wp: "Separate contract, paid monthly",
        builder: "Platform support. The site itself is on you",
      },
      {
        param: "3-year cost",
        ours: `${ours3y}: package ${business} + hosting ${hosting} × 2 years`,
        wp: "Site price + 36 months of retainer",
        builder: `${usdList(TILDA_PERSONAL_YEARLY * 36)} subscription only, plus your time or a designer`,
      },
    ],
    foot: `Tilda price from tilda.cc/pricing, checked ${CHECKED}. Builder prices change — check their site for current plans.`,
  },
  faqTitle: "Pricing questions",
  faq: [
    {
      q: "Why a fixed price instead of hourly billing?",
      a: [
        "Because you're buying a finished website, not hours. Each package is defined up front: pages, features, deadline. Price and deadline go into the contract before we start and don't grow along the way. If we miss the deadline through our fault, we pay ",
        { em: `${pay.latePenaltyPercentPerDay}% per working day, up to ${pay.latePenaltyCapPercent}%` },
        ". With hourly billing the client carries the estimation risk — here we do.",
      ],
    },
    {
      q: "What if I need more than 5 pages?",
      a: [
        `The ${PACKAGES.business.name[L].toLowerCase()} includes up to 5 pages. Each extra page is `,
        { em: `${extraPage}` },
        `. For example, 8 pages: ${business} + 3 × ${extraPage} = ${eur(packagePrice("business", L) + 3 * addonPrice("extra_page", L))}. The `,
        { link: { href: "/en/calculator", text: "calculator" } },
        " gives the exact total for your setup.",
      ],
    },
    {
      q: "Can I pay in instalments?",
      a: [
        `Yes — ${instalmentPackages} can be paid in `,
        { em: `${pay.instalmentsCount} instalments` },
        `. Otherwise: ${pay.prepaymentPercent}% upfront, ${100 - pay.prepaymentPercent}% after launch. Pay 100% upfront and get ${pay.fullPrepaymentDiscountPercent}% off.`,
      ],
    },
    {
      q: "How much does a website cost?",
      a: [
        "Landing page — ",
        { em: formatPackagePrice("landing", L) },
        ` in ${formatPackageTerm("landing", L)}, business website — `,
        { em: formatPackagePrice("business", L) },
        ` in ${formatPackageTerm("business", L)}, online shop — `,
        { em: formatPackagePrice("shop", L) },
        ` in ${formatPackageTerm("shop", L)}. Industry solution ${formatPackagePrice("industry", L)}, custom platform ${formatPackagePrice("custom", L)}. The price covers design, development, copy based on your brief, hosting and SSL for a year, and a one-year warranty.`,
      ],
    },
    {
      q: "Can I order just the design or just the front-end?",
      a: [
        `No — we build the site end to end: design, code, launch. A mock-up without code brings no leads, and handing someone else's design over to development usually costs more than doing it all at once. The smallest complete option is a landing page at ${landing}.`,
      ],
    },
    {
      q: "How much does SEO cost?",
      a: [
        "It's a separate service, not part of the build. Service business — ",
        { em: `from ${seoServices}/mo` },
        ", online shop — ",
        { em: `from ${seoShop}/mo` },
        ". SEO structure, sitemap and Search Console setup are already in every package. Details on the ",
        { link: { href: "/en/seo", text: "SEO page" } },
        ".",
      ],
    },
    {
      q: "What happens after the first year?",
      a: [
        "Two options. Keep hosting with us — ",
        { em: `${hosting}/year` },
        ". Or we move the site to your own account and you pay us nothing. There's no monthly \"support\" fee. New pages and features are priced from the add-on list and invoiced separately.",
      ],
    },
    {
      q: "Why do agency quotes differ so much?",
      a: [
        "Because \"a website\" means different things. Compare what's included, not the headline number: who writes the copy, whose name the domain is in, whether there's a warranty, whether there's a monthly fee, and who owns the code. We hand the code over in your own GitHub repository, and first-year support is already in the price.",
      ],
    },
  ],
  prose: PRICING_PROSE_EN,
  schema: {
    serviceName: "Custom website development",
    serviceDescription: `Custom-coded websites for European small businesses at a fixed price: landing page ${landing}, business website ${business}, online shop ${shop}, industry solutions and custom platforms.`,
    catalogName: "Code-Site.Art packages",
  },
};
