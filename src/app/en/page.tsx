import type { Metadata } from "next";
import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Rocket,
  Building,
  Car,
  Home,
  GraduationCap,
  Gauge,
  Github,
  DollarSign,
  Shield,
  ArrowRightLeft,
  Calendar,
  MessageCircle,
  Mail,
  FileText,
  Palette,
  Smartphone,
  Code,
  LayoutDashboard,
  Lock,
  Cloud,
  LifeBuoy,
} from "lucide-react";
import { HeroEditorial } from "@/components/blocks/hero";
import { TurnkeyList } from "@/components/blocks/turnkey-list";
import { Tier, type TierProps } from "@/components/blocks/comparison";
import "@/components/blocks/comparison/comparison.css";
import {
  HpHeader,
  Marquee,
  Industries,
  Bento,
  Process,
  Cases,
  Stack,
  PullQuoteSwiper,
  FinalCta3,
  Newsletter,
  HpFooter,
  type Industry,
  type BentoCell,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { ORG_ID, SITE_CONTACT, SITE_ORIGIN, WEBSITE_ID } from "@/lib/site";
import { formatPrice } from "@/lib/formatters/price";
import { TIER_AMOUNTS, TIER_NAMES, TIER_WEEKS } from "@/lib/pricing/tiers";

export const metadata: Metadata = {
  title:
    "Code-Site.Art — Custom websites that book meetings 24/7. Live in 4–10 weeks.",
  description:
    "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
  alternates: {
    canonical: `${SITE_ORIGIN}/en`,
    languages: {
      uk: SITE_ORIGIN,
      en: `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title:
      "Custom websites that book meetings 24/7 — Code-Site.Art",
    description:
      "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
    type: "website",
    locale: "en_US",
    url: `${SITE_ORIGIN}/en`,
  },
};

const EN_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    color: "#0EA5E9",
    title: "Healthcare",
    description: "Sites for clinics, dental practices, diagnostic centers",
    tags: ["EHR", "HIPAA", "Online booking"],
    price: "From $3,500 · 4–10 weeks",
    href: "/en/sites-for/medicine",
  },
  {
    icon: Building,
    color: "#EF4444",
    title: "Construction / Renovation",
    description: "Sites for construction and renovation companies",
    tags: ["CRM", "Calculator", "Local SEO"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/renovation",
  },
  {
    icon: Scale,
    color: "#8B5CF6",
    title: "Legal & Attorneys",
    description: "Sites for law firms, attorney offices, solo practitioners",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/legal",
  },
  {
    icon: Calculator,
    color: "#10B981",
    title: "Finance & Accounting",
    description:
      "Sites for accounting firms, financial advisors, trading services",
    tags: ["MEDoc", "Stripe", "1C/BAS"],
    price: "From $3,500 · 4–8 weeks",
    href: "/en/sites-for/finance",
  },
  {
    icon: ShoppingCart,
    color: "#F59E0B",
    title: "E-commerce",
    description: "Online stores, marketplaces, B2B catalogs",
    tags: ["Stripe", "LiqPay", "Nova Poshta"],
    price: "From $3,000 · 6–10 weeks",
    href: "/en/sites-for/ecommerce",
  },
  {
    icon: Car,
    color: "#0070F3",
    title: "Auto industry",
    description:
      "Sites for car importers, auto dealers, repair shops, auto services",
    tags: ["Copart", "PDF-invoice", "Multi-lang"],
    price: "From $3,000 · 6–10 weeks",
    href: "/en/sites-for/auto",
  },
  {
    icon: Home,
    color: "#EC4899",
    title: "Real Estate",
    description:
      "Sites for real estate agencies, developers, private listings",
    tags: ["Multi-lang", "Multi-currency", "Mortgage"],
    price: "From $4,000 · 6–10 weeks",
    href: "/en/sites-for/real-estate",
  },
  {
    icon: GraduationCap,
    color: "#14B8A6",
    title: "Courses & Landings",
    description: "Sites for online courses, info-products, creator funnels",
    tags: ["Stripe", "Teachable", "A/B"],
    price: "From $800 · 4–8 weeks",
    href: "/en/sites-for/courses",
  },
];

const EN_BENTO: BentoCell[] = [
  {
    title: "Loads in under 1 second",
    icon: Gauge,
    stat: "98 LH",
    body: "Custom code, zero plugins. Tested on real 3G/4G connections.",
    span: "1x1",
    visual: "lh",
  },
  {
    title: "Code in your GitHub",
    icon: Github,
    stat: "100%",
    body: "Not in ours. Yours from the first commit.",
    span: "1x1",
    visual: "commits",
  },
  {
    title: "Live in 4 weeks",
    icon: Rocket,
    stat: "4 WK",
    body: "Industry-ready turnkey site.",
    span: "1x1",
    visual: "weeks",
  },
  {
    title: "Pricing in the brief",
    icon: DollarSign,
    stat: "$3.5K+",
    body: "No “request a quote.” A real number, in writing.",
    span: "1x1",
    visual: "price",
  },
  {
    title: "Warranty + rebate",
    icon: Shield,
    stat: "1Y",
    body: "1 year of fixes. We pay you 30% if we miss the deadline.",
    span: "1x1",
    visual: "warranty",
  },
  {
    title: "Migrate without losing SEO",
    icon: ArrowRightLeft,
    stat: "47 / 0",
    body: "301 redirects, content move, schema.org. Typically 2 weeks with no ranking drop.",
    span: "1x1",
    visual: "mig",
  },
];

const EN_TIERS: TierProps[] = [
  {
    name: TIER_NAMES.landing.en,
    price: formatPrice(TIER_AMOUNTS.landing, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.landing.en,
    bestFor: "Fast launch of one offer, MVP, hypothesis testing.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Includes",
      items: [
        "Responsive build",
        "SEO-first structure",
        "Form integrations",
        "1-year warranty",
      ],
    },
    ctaLabel: "Choose Landing",
  },
  {
    popular: true,
    popularLabel: "★ MOST POPULAR",
    name: TIER_NAMES.corporate.en,
    price: formatPrice(TIER_AMOUNTS.corporate, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.corporate.en,
    bestFor:
      "Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Landing, plus",
      items: [
        "CMS, blog",
        "5+ integrations",
        "Local SEO",
        "Compliance: GDPR / HIPAA-ready",
        "EN + 1 extra language",
      ],
    },
    ctaLabel: "Choose Corporate",
  },
  {
    name: TIER_NAMES.custom.en,
    price: formatPrice(TIER_AMOUNTS.custom, { locale: "en" }),
    priceLabel: "from",
    weeks: TIER_WEEKS.custom.en,
    bestFor:
      "Complex products with bespoke logic — SaaS, marketplace, B2B portal.",
    bestForLabel: "Best for:",
    includes: {
      heading: "Everything in Corporate, plus",
      items: [
        "Architectural session",
        "Dedicated team",
        "SLA + 24/7 support",
        "Custom integrations",
      ],
    },
    ctaLabel: "Talk to us",
    ctaGhost: true,
  },
];

const EN_FINAL_CTA = [
  {
    icon: Calendar,
    title: "Book a call",
    body: "30-min Zoom. We'll show real cases and talk through your project.",
    cta: "Open Calendly →",
    href: "https://calendly.com/fedirdev",
    featured: true,
  },
  {
    icon: Mail,
    title: "Send a brief",
    body: "Detailed form. Describe the project — we'll come back within 4 business hours.",
    cta: "Open form →",
    href: "/contacts",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    body: "Fast async channel. We usually reply within 30 minutes.",
    cta: "Write @fedirdev →",
    href: "https://t.me/fedirdev?text=Hi%2C+I%27d+like+to+discuss+a+project",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Code-Site.Art",
      url: SITE_ORIGIN,
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kyiv",
        addressCountry: "UA",
      },
      sameAs: [
        SITE_CONTACT.telegram,
        SITE_CONTACT.linkedin,
        SITE_CONTACT.github,
      ],
      foundingDate: "2023",
    },
    {
      "@type": "WebSite",
      "@id": `${WEBSITE_ID}#en`,
      url: `${SITE_ORIGIN}/en`,
      name: "Code-Site.Art",
      description:
        "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default function HomePageEn() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HpHeader />

      <main>
      <HeroEditorial
        eyebrow={{ label: "CODE-SITE.ART · BOUTIQUE STUDIO" }}
        h1Lines={[
          <>Your site books</>,
          <>meetings</>,
          <em key="hero-em">while you sleep.</em>,
        ]}
        lede={
          <>
            A custom-coded website with copy, design, and integrations —
            shipped in 4–10 weeks. We write the content, wire up the
            forms, and set up local SEO. You spend 5 hours, total.
            Within a month, leads start coming in on autopilot.
          </>
        }
        features={[
          { label: "Leads 24/7", sub: "Web form + Telegram bridge" },
          { label: "4–10 weeks", sub: "Brief to launch" },
          { label: "1-year warranty", sub: "+ 30% rebate if we slip" },
          { label: "End-to-end", sub: "Copy + design + code + hosting" },
        ]}
        ctaPrimaryLabel="Get an estimate"
        ctaPrimaryHref="/en/calculator"
        ctaSecondaryLabel="Free site audit within 24 hours"
        ctaSecondaryHref="/contacts?source=hero-audit"
        ctaSecondaryShowPlay={false}
        ctaFootnote="No sales call. No email list. Just an audit."
        showStats
        stats={[
          { num: "47", lbl: <>projects<br />across 3 years</> },
          { num: "4", lbl: <>regions<br />UA · EU · US · DK</> },
          { num: "×3.2", lbl: <>avg.<br />lead lift</> },
          { num: "4.9/5", lbl: <>client<br />rating</> },
        ]}
        showTicker={false}
        deviceTags={[
          { kind: "default", primary: "Custom code" },
          { kind: "default", primary: "TypeScript", mini: "5.7" },
          { kind: "good", primary: "Lighthouse", mini: "98" },
        ]}
        deviceMockupSrc="/hero/hero-mockup.webp"
      />

      <Marquee label="47+ BUSINESSES TRUSTED · UA · EU · US · DK" />

      <TurnkeyList
        eyebrow="SCOPE"
        heading={
          <>
            9 things <em>we do for you.</em>
          </>
        }
        sub="You pay a fixed price and get a finished site. No briefs to write, no references to hunt down, no photographer to chase. Here's what's in every project — no upsells:"
        items={[
          { icon: FileText, title: "Copywriting", line: "Hero, SEO articles, opening cases" },
          { icon: Palette, title: "Design", line: "2 rounds of revisions included" },
          { icon: Smartphone, title: "Frontend", line: "Responsive: mobile / tablet / desktop" },
          { icon: Code, title: "Engineering", line: "Next.js, all integrations" },
          { icon: LayoutDashboard, title: "CMS", line: "Sanity — edit content from your phone" },
          { icon: Lock, title: "Domain & SSL", line: "We set it up for you" },
          { icon: Cloud, title: "Hosting", line: "Vercel or Cloudflare on your account" },
          { icon: Rocket, title: "Launch", line: "Search Console, Analytics, 301s" },
          { icon: LifeBuoy, title: "1 year of support", line: "Bugs, updates, advice" },
        ]}
        footer={
          <p
            style={{
              maxWidth: "var(--container-form)",
              margin: "0 auto",
              textAlign: "center",
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--ink-3)",
            }}
          >
            Not included — product photography and full logo branding. If you need them, we&apos;ll connect
            you with vetted partners.
          </p>
        }
      />

      <Industries
        eyebrow=""
        heading={
          <>
            Built for <em>your industry.</em>
          </>
        }
        sub="Not just a website — a full solution with the integrations and compliance your sector expects."
        items={EN_INDUSTRIES}
      />

      <Bento
        eyebrow="WHY US"
        heading={
          <>
            Built to convert, <em>not just to look pretty.</em>
          </>
        }
        cells={EN_BENTO}
        locale="en"
      />

      <Process
        eyebrow="PROCESS · 4-10 WEEKS"
        heading={
          <>
            Launch in 5 steps. <em>No surprises.</em>
          </>
        }
        steps={[
          { n: "01", name: "Brief", duration: "1 day · free", body: "Goals, audience, scope" },
          { n: "02", name: "Design", duration: "1–2 weeks", body: "Wireframes → hi-fi" },
          { n: "03", name: "Development", duration: "2–6 weeks", body: "Custom code, weekly demos" },
          { n: "04", name: "Testing", duration: "1 week", body: "60-point QA checklist" },
          { n: "05", name: "Launch + Support", duration: "+ 1 year", body: "Support included" },
        ]}
        ctaLabel="See the full process"
        ctaHref="/process"
      />

      <Cases
        eyebrow="CASES"
        heading={
          <>
            Real projects with <em>real metrics.</em>
          </>
        }
        locale="en"
        ctaLabel="See all work"
        ctaHref="/portfolio"
      />

      <PullQuoteSwiper locale="en" />

      <section className="hp-section" id="pricing">
        <div className="hp-inner">
          <div className="hp-section-head">
            <div className="hp-eyebrow">
              <span className="hp-eyebrow-dot" />
              <span>PRICING</span>
            </div>
            <h2 className="hp-h2">
              Transparent pricing — from <em>$800</em> to <em>$6,000+</em>
            </h2>
            <p className="hp-sub">
              No &ldquo;request a quote.&rdquo; No hidden fees.
            </p>
          </div>
          <div className="cmp-pricing-grid">
            {EN_TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      <Stack
        eyebrow="STACK"
        heading={
          <>
            Tools <em>we use.</em>
          </>
        }
        sub="We don't chase trends. We work with 10 tools we know inside out."
        items={[
          { name: "Next.js", cat: "Framework" },
          { name: "Astro", cat: "Static sites" },
          { name: "React", cat: "UI library" },
          { name: "TypeScript", cat: "Language" },
          { name: "Tailwind", cat: "Styling" },
          { name: "HeroUI", cat: "Components" },
          { name: "Sanity", cat: "CMS" },
          { name: "Strapi", cat: "Headless CMS" },
          { name: "Vercel", cat: "Hosting" },
          { name: "Cloudflare", cat: "CDN + DNS" },
        ]}
      />

      <FinalCta3
        eyebrow="GET IN TOUCH"
        heading={
          <>
            Ready to <em>discuss your project?</em>
          </>
        }
        sub="Free 30-minute consult. No commitment. We'll know in 15 minutes if we're a fit."
        cards={EN_FINAL_CTA}
      />
      <Newsletter />
      </main>
      <HpFooter />
    </>
  );
}
