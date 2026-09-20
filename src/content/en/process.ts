import type { TimelineStep } from "@/components/blocks/vertical-timeline";
import {
  PACKAGES,
  PAYMENT_TERMS,
  SERVICES,
  addonPrice,
  formatAddonPrice,
  formatDays,
  formatPackageTerm,
  servicePrice,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";
import type { RichText } from "@/lib/shared/rich-text";

/*
 * Process for the business package, day by day. Every number comes from
 * `@/constants/pricing` (TZ v2): the total term is PACKAGES.business.days,
 * shop/landing/industry follow the same steps on their own terms.
 */
const LOC = "en" as const;
const D = PACKAGES.business.days.min;
const DESIGN_DAYS = 2;
const PREPAY = PAYMENT_TERMS.prepaymentPercent;
const PENALTY = `${PAYMENT_TERMS.latePenaltyPercentPerDay}% for every day late, up to ${PAYMENT_TERMS.latePenaltyCapPercent}%`;
const HOSTING = formatPrice(servicePrice("hostingRenewalPerYear", LOC), { locale: LOC });
const EXTRA_PAGE = formatPrice(addonPrice("extra_page", LOC), { locale: LOC });
const COPY_PRO = formatPrice(addonPrice("copy_pro", LOC), { locale: LOC });
const dayRange = (a: number, b: number) => (a === b ? `Day ${a}` : `Days ${a}–${b}`);

export const PROCESS_STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Request and quote",
    duration: `within ${SERVICES.auditResponseHours} hours · free`,
    body: `Fill in the form or message us. Within ${SERVICES.auditResponseHours} hours we reply with the right package, a fixed price and the timeline. A call only if you want one.`,
    weDo: {
      heading: "What we do",
      items: [
        "Go through the task and ask what we need to know",
        "Pick the package: landing page, business website or online store",
        "Name a fixed price and the timeline in working days",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Tell us about the business and what the site should do",
        "Share 2–3 sites you like (if you have any)",
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "A quote: package, price, timeline, what's included",
        "A list of add-ons, if you need any",
      ],
    },
  },
  {
    n: "02",
    title: "Contract and deposit",
    duration: "before the start",
    body: `A contract with a fixed sum, a deadline and a late penalty: ${PENALTY}. The working days start after the ${PREPAY}% deposit. Pay in full upfront and get ${PAYMENT_TERMS.fullPrepaymentDiscountPercent}% off.`,
    weDo: {
      heading: "What we do",
      items: [
        "Draft the contract with a fixed sum and deadline",
        "Send the deposit invoice",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Read the contract, ask questions",
        "Sign it electronically or as a PDF",
        `Pay the ${PREPAY}% deposit (bank transfer or Stripe)`,
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "A signed contract with the price and deadline",
        "A launch date in the calendar",
      ],
    },
  },
  {
    n: "03",
    title: "Structure, copy and design",
    duration: `${dayRange(1, DESIGN_DAYS)}`,
    body: "We plan the pages, write the copy from your brief and design the site for phone and desktop. You see it before development starts: approve it or send changes.",
    weDo: {
      heading: "What we do",
      items: [
        "Page and section structure",
        "Copy written from your brief",
        "Mobile and desktop design",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Approve the structure, copy and design",
        "Send your logo, photos and contact details",
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "Approved design for every page",
        "Copy for every page",
      ],
    },
  },
  {
    n: "04",
    title: "Development",
    duration: `${dayRange(DESIGN_DAYS + 1, D - 2)}`,
    body: "We code the site on Next.js, connect Sanity CMS, forms and analytics. A preview link works from the first day of development, so you watch progress live.",
    weDo: {
      heading: "What we do",
      items: [
        "Code in your GitHub repository",
        "Sanity CMS — edit without a developer",
        "Forms, enquiry alerts, Google Analytics",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Check the preview and leave comments in the chat",
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "A preview link",
        "Access to GitHub and the CMS",
      ],
    },
  },
  {
    n: "05",
    title: "Testing and changes",
    duration: `${dayRange(D - 1, D - 1)}`,
    body: "We test the site on phones and browsers: speed, forms, metadata, analytics. Then we make your changes.",
    weDo: {
      heading: "What we do",
      items: [
        "Tests on iPhone, Android and desktop",
        "Forms, analytics and SEO structure checked",
        "Changes from your comments",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Go through the site and send changes as one list",
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "A site ready to launch",
      ],
    },
  },
  {
    n: "06",
    title: "Launch",
    duration: `${dayRange(D, D)}`,
    body: "We connect your domain and SSL, set up Search Console and redirect old URLs. You pay the balance and get every login.",
    weDo: {
      heading: "What we do",
      items: [
        "Domain, SSL, deployment",
        "301 redirects from old URLs",
        "Sitemap submitted to Search Console",
        "Hand over access: hosting, CMS, GitHub, analytics",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Pay the balance",
        "Check the site on your own domain",
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "The site on your domain",
        "Every account in your name",
        "A short guide to editing the site in the CMS",
      ],
    },
  },
  {
    n: "07",
    title: "Warranty and support",
    duration: "1 year · included",
    body: `A year of warranty, hosting and support is included in the price: bugs, uptime, security, updates, SSL, backups. After the year: hosting at ${HOSTING}/year or a move to your own account.`,
    weDo: {
      heading: "What we do",
      items: [
        "Fix bugs free of charge",
        "Update dependencies, watch security",
        "Hosting, SSL, backups",
      ],
    },
    youDo: {
      heading: "What you do",
      items: [
        "Edit copy, prices and photos yourself in the CMS",
        "Message us if something is wrong",
      ],
    },
    deliverable: {
      heading: "What you get",
      items: [
        "One year of support from launch day",
        `A new page after launch: ${EXTRA_PAGE}`,
      ],
    },
  },
];

export const PROCESS_FAQ: { q: string; a: RichText }[] = [
  {
    q: "What if you miss the deadline through your fault?",
    a: [
      "We pay a penalty of ",
      { em: `${PENALTY}` },
      ". It's written into the contract.",
    ],
  },
  {
    q: "What do changes cost?",
    a: [
      "Changes within the approved structure are ",
      { em: "included in the price and timeline" },
      `. A new page is ${EXTRA_PAGE}, other add-ons are priced in the `,
      { link: { href: "/en/calculator", text: "calculator" } },
      ".",
    ],
  },
  {
    q: "What if I don't like the design?",
    a: [
      "You see the design ",
      { em: "before development starts" },
      ". We work through your comments until you approve it. If that moves the deadline, we agree the new date in writing.",
    ],
  },
  {
    q: "What if I need changes after launch?",
    a: [
      { em: "A year of warranty and support" },
      ` is included: bugs, hosting, SSL, updates. You edit copy, prices and photos yourself in the CMS. A new page is ${EXTRA_PAGE} and takes ${formatDays(SERVICES.newPageDays, LOC)}.`,
    ],
  },
  {
    q: "What if I want to change the scope mid-project?",
    a: [
      "You can. Add-ons have fixed prices; the new deadline and sum go into a ",
      { em: "contract addendum" },
      ".",
    ],
  },
  {
    q: "What if I have no time for the copy?",
    a: [
      "Copy written from your brief is ",
      { em: "included in the package" },
      ` — you only answer our questions. Professional copywriting with an interview is ${COPY_PRO}.`,
    ],
  },
  {
    q: "What if I need the site sooner?",
    a: [
      "A rush launch is ",
      { em: `${formatAddonPrice("rush", LOC)}` },
      ". The shorter deadline goes into the contract.",
    ],
  },
  {
    q: "Are a landing page or a shop also 7 days?",
    a: [
      `A landing page takes ${formatPackageTerm("landing", LOC)}, an online store ${formatPackageTerm("shop", LOC)}, an industry solution ${formatPackageTerm("industry", LOC)}. Same steps, different scope.`,
    ],
  },
];
