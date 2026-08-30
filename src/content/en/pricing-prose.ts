import type { ProseSection } from "@/types/prose";

/**
 * Long-form sections for `/en/pricing`. See the uk file for why they exist.
 *
 * Figures here are the UK market prices already published across /en/pricing
 * and /en/seo — £800 / £3,500 / £6,000, £300 audit, £300/mo SEO, £200/mo
 * support, £40/h, £500–2,000 migration. This is a separate market, not a
 * currency conversion of the Ukrainian one, so nothing here should be
 * "corrected" to match the uk/ru pages.
 *
 * There is no /en/audit or /en/redesign page, so the cross-links here stay
 * inside the English surface.
 */
export const PRICING_PROSE_EN: ProseSection[] = [
  {
    eyebrow: "WHAT DRIVES IT",
    heading: ["Why website cost ", "is a range, not a number"],
    sub: "Six factors actually move the figure. Everything else follows from them.",
    paragraphs: [
      "When a studio quotes a range rather than a single number, it is not dodging the question. A website is not an item off a shelf: two projects with the same page count differ threefold in effort if one pulls its catalogue from an inventory system and the other has pages filled in by hand twice a year.",
      "The commonest mistake when comparing quotes is to look at the total without asking what sits inside it. A cheap estimate usually assumes a template, your copy, your photos, one language and no support after handover. An expensive one assumes bespoke design, copywriting, integrations and ongoing care. Both can be honest. Comparing them as if they were the same thing is not.",
      "Here is what actually moves the number on our projects.",
    ],
    table: {
      headers: ["Factor", "How it moves the price", "When you genuinely need it"],
      rows: [
        [
          "Page count",
          "the main multiplier: landing from £800, multi-page from £3,500",
          "when you sell more than one service and each is searched separately",
        ],
        [
          "Template or bespoke design",
          "a template is cheaper up front but dictates your page structure",
          "bespoke when the site has to look unlike everyone else in the niche",
        ],
        [
          "CMS",
          "adds to the build, removes the invoice for every text change",
          "when content changes more than once a quarter",
        ],
        [
          "Number of languages",
          "each one means separate meta, hreflang and QA, not just translation",
          "when you export, or serve customers in more than one country",
        ],
        [
          "Integrations",
          "the biggest line in upper budgets: CRM, payments, booking, stock",
          "when an enquiry must land in a system rather than an inbox",
        ],
        [
          "Content",
          "a starter set is included, further pieces are £30 and up",
          "when you have more than three service pages and nobody to write them",
        ],
      ],
    },
    foot: "Timelines follow the same factors: a landing page from two weeks, a multi-page site from five. The long pole is usually not development but waiting on content from the client side.",
    links: [{ label: "price your own configuration", href: "/en/calculator" }],
  },
  {
    eyebrow: "HIDDEN COSTS",
    heading: ["What you pay for ", "outside the studio invoice"],
    sub: "Not our money, but your budget. Better known in advance.",
    paragraphs: [
      "A studio price list is not the full cost of owning a website. Some costs bypass us entirely, and clients usually meet them after launch. We list them before signing: an unpleasant surprise in month three costs more in trust than an honest figure on day one.",
      "The good news is that these amounts are small and predictable. The bad news is that there are several of them, and together they add up to a real budget line.",
    ],
    bullets: [
      "Domain — typically £10–20 a year. Registered to you, not to the studio, and that matters",
      "Hosting — from a free tier up to roughly £20/mo depending on traffic. Your first year is in our price",
      "SSL certificate — free, and has been standard for years; nobody should be charging you for it",
      "Business email on your domain — a few pounds per mailbox per month, if you want it",
      "Payment gateway fees for a shop — 2–3% of turnover, paid to the provider, not to us",
      "Stock photography if you have none of your own — from £10 an image, or a subscription",
      "Support from year two — from £200/mo, or £40/h for occasional tasks",
      "Search campaign, if you want organic growth — a separate budget from £300/mo",
    ],
    foot: "The first year of support, plus hosting, analytics and Search Console setup, is already inside the build price — we do not bill separately for it.",
    links: [{ label: "what SEO costs", href: "/en/seo" }],
  },
  {
    eyebrow: "COMPARISON",
    heading: ["Website builder, freelancer ", "or studio"],
    sub: "Three genuinely different products. Cheaper to start is not always cheaper overall.",
    paragraphs: [
      "\"Why does yours start at £800 when a builder costs £150?\" is a fair question, and the answer is not \"because we are better\". These are different products for different jobs, and each one wins in some scenario.",
      "A builder wins when you need to test an idea inside a week and would not mind throwing the result away. A freelancer wins when the job is small and you are willing to project-manage it yourself. A studio wins when the site has to bring in enquiries for years, and somebody has to be accountable during the week one particular person is off sick.",
    ],
    table: {
      headers: ["Criterion", "Builder", "Freelancer", "Studio"],
      rows: [
        ["Entry price", "£0–150", "below market, sometimes far below", "from £800"],
        ["Time to launch", "days", "weeks", "from 2 weeks"],
        ["Site speed", "platform code on every page", "luck of the draw", "designed in before release"],
        ["Code access", "none", "usually yes", "the repository is yours"],
        ["If the builder disappears", "site lives, nobody to grow it", "project stalls", "handed over inside the team"],
        ["Ceiling", "low: some technical fixes are impossible", "depends on the person", "limited only by budget"],
        ["Contract and warranty", "platform terms", "often no contract", "contract, one-year warranty"],
      ],
    },
    foot: "If you are already on a builder and have hit the ceiling, migrating with your search history intact costs £500–2,000 — usually cheaper than paying for the platform's limits year after year.",
    links: [
      { label: "custom site vs website builders", href: "/en/vs-constructors" },
      { label: "custom site vs WordPress", href: "/en/vs-wordpress" },
      { label: "studio vs freelancer", href: "/en/vs-freelancers" },
    ],
  },
  {
    eyebrow: "BY SECTOR",
    heading: ["What a website costs ", "in your sector"],
    sub: "Not because we charge clinics more. The jobs are simply different in size.",
    paragraphs: [
      "The tier is set by what is inside the build — page count, whether you need booking or a basket, whether the catalogue is pulled from a stock system — not by the industry itself. But the same requirements recur sector by sector, so the range is usually visible before the brief.",
      "Below are typical configurations from our work. Treat it as a starting point for the first conversation rather than a price list: your project may need less than the one next door in the same sector.",
    ],
    table: {
      headers: ["Sector", "What is usually needed", "Tier", "Timeline"],
      rows: [
        ["Clinic, dental practice", "services, clinicians, online booking, local SEO", "from £3,500", "from 5 weeks"],
        ["Online shop", "catalogue, filters, basket, payments, delivery", "from £3,500", "from 6 weeks"],
        ["Manufacturing, B2B", "product catalogue, dealers, multiple languages", "from £3,500", "from 5 weeks"],
        ["Solicitors, accountants", "services, cases, consultation form, trust signals", "from £3,500", "from 4 weeks"],
        ["Property", "listings with filters, matching, viewing requests", "from £3,500", "from 6 weeks"],
        ["Online course, expert", "landing page with programme, payment, testimonials", "from £800", "from 2 weeks"],
        ["Renovation, construction", "work portfolio, calculator, survey request form", "from £800", "from 3 weeks"],
      ],
    },
    foot: "If your sector is on the list, its own page goes further: which blocks matter, what people usually leave out, and how that shows up in enquiries.",
    links: [
      { label: "medical practice websites", href: "/en/sites-for/medicine" },
      { label: "e-commerce websites", href: "/en/sites-for/ecommerce" },
      { label: "all sectors", href: "/en#solutions" },
    ],
  },
  {
    eyebrow: "THE CONTRACT",
    heading: ["How we estimate ", "and what goes on paper"],
    sub: "The real question is not how much, but what happens if the scope changes mid-project.",
    paragraphs: [
      "We estimate after a short brief: page count, features, whether you have content, whether integrations are needed. What comes back is not one number but a breakdown by workstream — design, build, development, CMS, setup. You can see what makes up the total, and drop whatever you do not need yet.",
      "That total is then fixed in the contract. This matters: if we misjudged our own effort, that is our problem, not an extra invoice for you. The price changes only when the scope changes, and only with your written agreement.",
      "The usual reason scope changes is neither side making a mistake — it is a project behaving normally. In week three it becomes clear you need one more page, or an integration nobody thought about at the brief. When that happens we price the addition separately, show you the figure and wait for your decision. We will not quietly add it to the invoice.",
    ],
    bullets: [
      "An estimate broken down by workstream, not a single turnkey-website line",
      "The total is fixed in the contract; a misjudged estimate is our risk",
      "Scope changes only with your written agreement, priced separately",
      "50% to start, 50% on handover; three instalments on projects from £10,000",
      "10% discount for paying in full up front",
      "If we overrun the deadline through our own fault, the contract carries a penalty",
      "On handover you receive every access, password and the code repository",
    ],
    foot: "International clients are invoiced through Stripe in pounds, dollars or euros.",
    links: [{ label: "how the build runs, week by week", href: "/en/process" }],
  },
  {
    eyebrow: "COST OF OWNERSHIP",
    heading: ["Why a cheap website ", "often ends up costing more"],
    sub: "Count two years of the site's life, not the opening payment.",
    paragraphs: [
      "The entry price is one payment. Cost of ownership is everything you pay over two years, including what you did not plan for. That is the distance over which cheap options usually catch up with you.",
      "The pattern runs like this. The site is built as cheaply as possible on a template. Six months later you need one more service page, and the template's structure does not allow for it. Then it turns out the site loads in four seconds, so your ads cost more than they should. A year in, the person who built it is unreachable, and every change starts with finding someone new who learns somebody else's code on your budget.",
      "None of this is inevitable. But when it does happen, the gap in entry price is closed inside the first year.",
    ],
    table: {
      headers: ["Two-year cost line", "Cheap option", "Our multi-page build"],
      rows: [
        ["Build", "nominally lower", "from £3,500"],
        ["Changes and additions", "find someone new each time", "£40/h or a support package"],
        ["Support", "whatever you agreed", "first year included, then from £200/mo"],
        ["Effect on paid ads", "a slow site raises your cost per click", "Core Web Vitals checked before release"],
        ["Rebuild after 1–2 years", "often unavoidable", "grows without a rewrite"],
        ["Code ownership", "luck of the draw", "your repository from day one"],
      ],
    },
    foot: "This is not an argument against cheap solutions in general — it is an argument for counting two years rather than one payment.",
    links: [{ label: "how the process works", href: "/en/process" }],
  },
];
