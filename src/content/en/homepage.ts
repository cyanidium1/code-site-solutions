/**
 * Homepage copy (en) — the international market (EUR), with its own
 * positioning: custom-coded websites for European small businesses, fixed
 * price, 7 working days, you own the code, no subscriptions (TZ v2 §3.1 +
 * owner brief). Every price and term is read from `@/constants/pricing`.
 */

import type { FAQItem } from "@/types/faq";
import type { Locale } from "@/constants/locales";
import {
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  addonPrice,
  formatDays,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import { resolveRootHref } from "@/constants/i18n-routes";
import type { HomepageContent } from "@/content/uk/homepage";

const L: Locale = "en";
const fp = (n: number) => formatPrice(n, { locale: L });
const href = (uaPath: string) => resolveRootHref(uaPath, L);

const LANDING = formatPackagePrice("landing", L);
const BUSINESS = formatPackagePrice("business", L);
const SHOP = formatPackagePrice("shop", L);
const INDUSTRY = formatPackagePrice("industry", L);
const CUSTOM = formatPackagePrice("custom", L);
const D = PACKAGES.business.days.min;
const S = PACKAGES.shop.days.min;
const HOURS = SERVICES.auditResponseHours;
const HOSTING = fp(servicePrice("hostingRenewalPerYear", L));
const EXTRA_PAGE = fp(addonPrice("extra_page", L));
const NEW_PAGE_DAYS = formatDays(SERVICES.newPageDays, L);
const PT = PAYMENT_TERMS;

export const HOMEPAGE_EN: HomepageContent = {
  meta: {
    title: `Custom-coded website in ${D} days for ${BUSINESS} | Code-Site.Art`,
    description: `Custom-coded websites for European small businesses: ${BUSINESS} fixed in the contract, live in ${formatPackageTerm("business", L)}. Online shop ${SHOP}. You own the code.`,
  },
  hero: {
    h1Line1: "Custom-coded business website —",
    h1Line2Lead: `in ${D} days for `,
    h1Line2Em: BUSINESS,
    lede: "For European small businesses. No subscriptions, no website builders. The code, domain and data are yours. A year of warranty and support included.",
    features: [
      { label: formatPackageTerm("business", L), sub: "From brief to launch" },
      { label: "Price fixed in the contract", sub: "Agreed before we start" },
      { label: "1-year warranty, support included", sub: "Hosting and SSL too" },
    ],
    ctaPrimary: "Get a free quote",
    ctaSecondary: "See prices",
    footnote: `We reply with a price and a timeline within ${HOURS} hours. No obligation.`,
    mockupAlt: "Custom business website mockup built by Code-Site.Art",
  },
  cases: {
    eyebrow: "CASES",
    headingLead: "Sites we have ",
    headingEm: "already launched",
    ctaLabel: "All cases",
    ctaHref: href("/portfolio"),
  },
  pricing: {
    headingLead: "Prices — ",
    headingEm: "fixed in the contract",
    sub: "Three packages with a set scope. Pick one and your quote request arrives with it preselected.",
  },
  industries: {
    headingLead: "Built for ",
    headingEm: "your industry",
    sub: "The Business website package plus an industry integration and the rules your sector works under.",
  },
  process: {
    headingLead: `${D} working days — `,
    headingEm: "from brief to launch",
    sub: "Scope, timeline and price are fixed in the contract. You know up front what you will get, when, and for how much.",
    steps: [
      { n: "01", name: "Brief and structure", duration: "Day 1", items: ["Goals and services", "Page structure", "Content list"] },
      { n: "02", name: "Design on your content", duration: "Days 2–3", items: ["Your copy and photos", "Mobile version", "Sign-off"] },
      { n: "03", name: "Build and content", duration: `Days 4–${D - 1}`, items: ["Code and CMS", "Forms + alerts", "SEO structure"] },
      { n: "04", name: "Testing and launch", duration: `Day ${D}`, items: ["Checks on phones", "Analytics", "Domain and SSL"] },
    ],
    shopLine: `Online shop — ${formatPackageTerm("shop", L)}: days 1–2 brief and catalogue → days 3–5 design → days 6–${S - 2} build, payments, delivery and products → days ${S - 1}–${S} testing and launch.`,
    ctaLabel: "Full process",
    ctaHref: href("/process"),
    moreLabel: "What each stage includes",
  },
  directions: {
    headingLead: "Where to ",
    headingEm: "start",
    sub: "The pages most people start with: prices, case studies and packages.",
    links: [
      { href: href("/pricing"), label: "Prices" },
      { href: href("/portfolio"), label: "Case studies" },
      { href: href("/corporate-site"), label: "Business website" },
      { href: href("/online-store"), label: "Online shop" },
      { href: href("/vs-constructors"), label: "Compare with website builders" },
      { href: href("/calculator"), label: "Price calculator" },
    ],
  },
  faqHeading: "Questions that come up before you start",
  faq: [
    {
      q: "How much will my website cost?",
      a: [
        "A landing page is ",
        { em: LANDING },
        ", a business website ",
        { em: BUSINESS },
        ", an online shop ",
        { em: SHOP },
        ". Industry solutions start ",
        { em: INDUSTRY },
        ", custom platforms ",
        { em: CUSTOM },
        ". The price is fixed in the contract before we start. The ",
        { link: { href: href("/calculator"), text: "calculator" } },
        " adds up the extras.",
      ],
    },
    {
      q: "How long from brief to launch?",
      a: [
        "Landing page — ",
        { em: formatPackageTerm("landing", L) },
        ", business website — ",
        { em: formatPackageTerm("business", L) },
        ", online shop — ",
        { em: formatPackageTerm("shop", L) },
        ", industry solution — ",
        { em: formatPackageTerm("industry", L) },
        ". The launch date goes into the contract.",
      ],
    },
    {
      q: "Why does hand-written code cost less than at an agency?",
      a: [
        "Because the site takes fewer hours. We build from tested templates and blocks, AI writes the routine code under a developer's review, and there are no account managers between you and the developer. You pay for the work, not for meetings.",
      ],
    },
    {
      q: "What happens after the one-year warranty?",
      a: [
        "The first year of hosting, SSL, fixes and updates is in the price. After that it is your call: keep hosting with us for ",
        { em: `${HOSTING}/year` },
        " or we move the site to your own account. The code is yours either way.",
      ],
    },
    {
      q: "What if I need a new page six months later?",
      a: [
        "A new page is ",
        { em: EXTRA_PAGE },
        " and takes ",
        { em: NEW_PAGE_DAYS },
        ". Copy, prices, photos and services you change yourself in the CMS, at no cost.",
      ],
    },
    {
      q: "How do payments work?",
      a: [
        `${PT.prepaymentPercent}% up front, ${100 - PT.prepaymentPercent}% after launch. Pay 100% up front and get ${PT.fullPrepaymentDiscountPercent}% off.`,
      ],
    },
    {
      q: "What if you miss the deadline?",
      a: [
        "We pay a penalty: ",
        { em: `${PT.latePenaltyPercentPerDay}% for every working day` },
        `, up to ${PT.latePenaltyCapPercent}% of the price. It is written into the contract.`,
      ],
    },
    {
      q: "Can I see the code before paying in full?",
      a: ["Yes. The code, access and the site are yours from day one. Look any time."],
    },
    {
      q: "What if I'm not sure what I need?",
      a: [
        `That's normal. Send a request and within ${HOURS} hours we reply with the package that fits, the price, and what you can skip.`,
      ],
    },
    {
      q: "Do you guarantee the #1 spot on Google?",
      a: [
        "No, and nobody honestly can. We build the technical base Google looks at: structure, speed, markup. The rest is content and time.",
      ],
    },
  ],
};

export function buildEnHomepageFaq(): FAQItem[] {
  return HOMEPAGE_EN.faq;
}

