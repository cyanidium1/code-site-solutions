import type { ProseSection } from "@/types/prose";
import {
  PACKAGES,
  formatPackagePrice,
  formatPackageTerm,
  servicePrice,
  type PackageId,
} from "@/constants/pricing";
import { formatPrice } from "@/lib/shared/format-price";

/**
 * Long-form text under the /en/pricing tables. Rewritten 2026-09-20 for the
 * productized model: price = package + add-ons. Figures come from
 * `@/constants/pricing` (EUR list for the international market).
 */

const L = "en" as const;
const eur = (n: number) => formatPrice(n, { locale: L });
/** Package hrefs in the config are uk paths. */
const en = (href: string) => `/en${href}`;

const TYPE_ROWS: [string, PackageId][] = [
  ["Landing page, one-page site", "landing"],
  ["Company website, up to 5 pages", "business"],
  ["Online shop", "shop"],
  ["Industry site: clinic, law firm, construction…", "industry"],
  ["Platform with user accounts, web app", "custom"],
];

export const PRICING_PROSE_EN: ProseSection[] = [
  {
    eyebrow: "WHAT DRIVES THE PRICE",
    heading: ["Website price = ", "package + add-ons"],
    sub: "Prices in euros, fixed in the contract before we start.",
    paragraphs: [
      "The type of site sets the package, and the package sets the base price and deadline. A landing page sells one service on one page. A business website gives each service its own page. A shop adds a catalogue, cart and checkout.",
      "Then you add only what you need: more pages, another language, a blog, CRM, online booking. Every add-on has a fixed price in the table above. Package plus add-ons is the price in your contract. No hourly extras.",
    ],
    table: {
      headers: ["Type of site", "Price", "Deadline"],
      rows: TYPE_ROWS.map(([label, id]) => [
        label,
        formatPackagePrice(id, L),
        formatPackageTerm(id, L),
      ]),
    },
    foot: "The calculator gives the exact total for your setup: package, add-ons, price.",
    links: [
      { label: "landing page", href: en(PACKAGES.landing.href) },
      { label: "business website", href: en(PACKAGES.business.href) },
      { label: "online shop", href: en(PACKAGES.shop.href) },
      { label: "website cost calculator", href: "/en/calculator" },
    ],
  },
  {
    eyebrow: "OUTSIDE OUR INVOICE",
    heading: ["What you pay ", "to others"],
    sub: "A few small costs worth knowing about before you start.",
    paragraphs: [
      "The package covers development, hosting and SSL for the first year, warranty and support. A few costs go past us, and we name them before you sign.",
    ],
    bullets: [
      "Domain — registered in your name, paid yearly to the registrar",
      `Hosting from year two — ${eur(servicePrice("hostingRenewalPerYear", L))}/year with us, or we move the site to your own account`,
      "Payment provider fees for a shop — paid to the provider, not to us",
      "Business email on your domain — if you need it",
      `SEO — a separate budget, from ${eur(servicePrice("seoServicesFrom", L))}/mo, and only if you want it`,
    ],
    links: [
      { label: "SEO services", href: "/en/seo" },
      { label: "custom site vs website builders", href: "/en/vs-constructors" },
      { label: "custom site vs WordPress", href: "/en/vs-wordpress" },
    ],
  },
];
