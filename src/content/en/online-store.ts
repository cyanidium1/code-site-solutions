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
const price = formatPackagePrice("shop", L);
const term = formatPackageTerm("shop", L);
const days = PACKAGES.shop.days.max;
const landing = formatPackagePrice("landing", L);
const business = formatPackagePrice("business", L);
const rush = `“${ADDONS.rush.name[L]}” (${formatAddonPrice("rush", L)})`;
const hosting = formatPrice(servicePrice("hostingRenewalPerYear", L), { locale: L });
const eur = (n: number) => formatPrice(n, { locale: L });

/* European builders instead of Horoshop/Prom. The €30–80/month range
   mirrors the owner's uk range. TODO(owner): перевірити тариф — Shopify
   Basic is ~€24/mo billed yearly, €32 monthly (third-party summaries,
   20.09.2026); Wix figures not verified. */
const SUB = { min: 30, max: 80, months: 36 };

export const ONLINE_STORE_EN: PackagePageContent = {
  pkg: "shop",
  rootPath: "/online-store",
  metaTitle: `Online Shop for ${price} in ${term} | Code-Site.Art`,
  metaDescription: `A custom-coded online shop for ${price} in ${term}: catalogue, basket, card payments, delivery, admin panel. No subscriptions, no commission.`,
  breadcrumbHome: "Home",
  breadcrumbSelf: "Online shop",
  serviceName: "Online shop development",
  offerName: "Online shop, end-to-end",
  eyebrow: "Online shop package",
  h1: `A coded online shop for ${price} in ${term} — no subscriptions, no commission`,
  sub: "Catalogue, basket, two-click checkout, card payments, delivery integration. You manage products yourself in the admin panel. Pay once — the shop is yours.",
  badges: [
    { label: price, sub: "fixed in the contract" },
    { label: term, sub: "from brief to launch" },
    { label: "0 subscriptions", sub: "and no platform commission" },
    { label: "1-year warranty", sub: "included" },
  ],
  composition: {
    heading: ["What the online shop ", `includes for ${price}`],
    includesTitle: "Included",
    excludesTitle: "Not included",
    excludesFoot: `More products: “${ADDONS.sku_500.name[L]}” (${formatAddonPrice("sku_500", L)}) and “${ADDONS.sku_1000.name[L]}” (${formatAddonPrice("sku_1000", L)}). Filters, CRM and a second language — see the add-ons below.`,
  },
  when: {
    heading: ["When you need a shop — ", "and when you don't"],
    fitTitle: "An online shop is the right call",
    fit: [
      "A catalogue customers browse and order from on their own",
      "Orders should reach you instantly, not get lost in DMs",
      "Platform fees and subscriptions eat into your margin",
      "You need online payments and delivery",
    ],
    notFitTitle: "Another package fits better",
    notFit: [
      `1–3 products or a digital product — a landing page at ${landing} with the payments add-on`,
      `Services without a catalogue — a business website at ${business}`,
      "A multi-vendor marketplace with warehousing — Custom",
    ],
  },
  process: {
    heading: ["How we build a shop ", `in ${term}`],
    sub: "The clock starts when we have your brief, the deposit and the product list.",
    steps: [
      { from: 1, to: 2, title: "Brief and catalogue structure", body: "Categories, product attributes, delivery and payments. We agree the shop map." },
      { from: 3, to: 5, title: "Design", body: "Home, category, product page, basket — for mobile and desktop." },
      { from: 6, to: days - 2, title: "Development", body: "Catalogue, basket, payments, delivery, Sanity admin, category SEO, order alerts." },
      { from: days - 1, to: days, title: "Test and launch", body: "Test orders and payments, speed checks. Launch and a walkthrough of the admin panel." },
    ],
  },
  compare: {
    heading: ["Code or a builder: ", "what you pay and what you own"],
    sub: "Shopify, Wix and similar builders charge every month for as long as the shop is open. Ours is a single payment.",
    theirsTitle: "Subscription builder",
    theirsLine: `Subscription ${eur(SUB.min)}–${SUB.max}/mo × ${SUB.months} months = ${eur(SUB.min * SUB.months)}–${eur(SUB.max * SUB.months).replace("€", "")}, and the shop still isn't yours`,
    theirsRows: [
      // TODO(owner): перевірити тариф — third-party figures, not Shopify's own page.
      { name: "Shopify Basic", price: "from €24/mo billed yearly" },
      // TODO(owner): перевірити тариф Wix і вписати ціну.
      { name: "Wix eCommerce plans", price: "monthly subscription" },
    ],
    theirsPoints: [
      "You pay for as long as the shop is open",
      "Paid apps and transaction fees on top on many plans",
      "Moving platforms means rebuilding the shop",
    ],
    oursTitle: "Code-Site.Art",
    oursLine: `${price} once — the code and data are yours`,
    oursPoints: [
      "No subscriptions and no platform commission",
      "The code and product database are yours to move anywhere",
      `Hosting and SSL for a year included; then ${hosting}/year or your own account`,
      "Warranty and support for a year included",
    ],
    checked: "Builder prices from public sources, checked 20.09.2026",
  },
  addons: {
    heading: ["What you can ", "add to the shop"],
    sub: `Every add-on has a fixed price. In a hurry? Add ${rush}.`,
    calcLabel: "Open the calculator",
    calcHref: resolveRootHref("/calculator", L),
  },
  payment: { heading: ["Payment ", "terms"] },
  cases: {
    heading: ["Shops we've ", "already launched"],
    sub: "A book publisher, electronics, cosmetics. The figures on the cards come from the case studies.",
    slugs: ["glimmer", "kondor-device", "le-muse-nature"],
    allLabel: "All case studies",
    allHref: resolveRootHref("/portfolio", L),
  },
  faq: {
    heading: "Online shop FAQ",
    items: [
      {
        q: `What's included for ${price}?`,
        a: [
          "A catalogue of up to 100 products, product cards with variants, basket and two-click checkout, card payments, delivery integration, Sanity admin, category SEO, order alerts, hosting and SSL for a year, a one-year warranty.",
        ],
      },
      {
        q: "How long does it take?",
        a: [`${term} from brief and deposit. Need it sooner? Add ${rush}.`],
      },
      {
        q: "I have more than 100 products. What does that cost?",
        a: [
          `${ADDONS.sku_500.name[L]}: ${formatAddonPrice("sku_500", L)}. ${ADDONS.sku_1000.name[L]}: ${formatAddonPrice("sku_1000", L)}. The total is fixed in the contract before we start.`,
        ],
      },
      {
        q: "Why not Shopify or Wix?",
        a: [
          "They charge a monthly subscription for as long as the shop runs, and design and SEO are limited by the platform. Here you pay once and own the code and data. More in ",
          { link: { href: resolveRootHref("/vs-constructors", L), text: "custom code vs website builders" } },
          ".",
        ],
      },
      {
        q: "Do you take a commission on sales?",
        a: ["No. Payment providers charge their own processing fees under their own terms."],
      },
      {
        q: "Who adds the products?",
        a: [
          `You do, in the Sanity admin — from a computer or your phone. We show you how at launch. Excel import comes with the “${ADDONS.sku_1000.name[L]}” add-on.`,
        ],
      },
      {
        q: "What happens after launch?",
        a: [
          `Warranty and support are included for a year. After that: hosting renewal at ${hosting}/year, or we move the shop to your own account.`,
        ],
      },
    ],
  },
  seo: {
    href: "/seo",
    linkLabel: "How our SEO works",
    line: `After launch: shop SEO from ${eur(servicePrice("seoShopFrom", L))}/month`,
  },
  cta: {
    heading: ["Free quote ", "within 24 hours"],
    sub: "Describe your range and the task in the form at the top — we'll reply with price, timeline and scope. No obligation.",
    formLabel: "Fill in the form",
    calcLabel: "Open the calculator",
    calcHref: resolveRootHref("/calculator", L),
  },
};
