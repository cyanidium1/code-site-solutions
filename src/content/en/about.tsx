import {
  Github,
  Linkedin,
  Instagram,
  FileCode,
  Server,
  Globe,
  Database,
  Search,
  LayoutDashboard,
  Workflow,
  BarChart3,
  Cloud,
  LifeBuoy,
  ShieldCheck,
  KeyRound,
  CalendarCheck,
  Percent,
} from "lucide-react";

import type { AboutContent } from "@/components/about/sections";

export const ABOUT_EN: AboutContent = {
  meta: {
    title: "About the studio — Code Site Art | Custom web development, Kyiv",
    description:
      "A boutique custom web development studio. Sites and business systems on Next.js, React, TypeScript and Sanity that you own. Code in your GitHub, 1-year warranty, 30% rebate for missed deadlines.",
  },

  hero: {
    breadcrumbs: { home: "Home", about: "About" },
    homeHref: "/en",
    eyebrow: "ABOUT THE STUDIO",
    headlineA: (
      <>
        Built by a <em>developer</em>.
      </>
    ),
    headlineB: <>Not an account manager.</>,
    sub: (
      <>
        Code Site Art is a boutique custom web development studio. We design,
        build and launch websites and business systems that companies actually
        own and control. You talk directly to the person who writes the code.
      </>
    ),
    ctaPrimary: { label: "View projects", href: "/en/portfolio" },
    ctaSecondary: { label: "Contact us", href: "/en/contacts" },
    portrait: {
      src: "/team/fedir.jpg",
      alt: "Fedir Alpatov, founder of Code Site Art",
      name: "Fedir Alpatov",
      role: "Developer · Tech Lead · Founder",
      location: "Kyiv, Ukraine",
      badges: ["Next.js", "TypeScript", "Sanity"],
    },
  },

  founder: {
    eyebrow: "WHO IS BEHIND IT",
    heading: (
      <>
        A real developer who <em>writes the code</em>
      </>
    ),
    lead: "Code Site Art was founded by Fedir Alpatov, a developer who takes part in the architecture and implementation of every project.",
    paragraphs: [
      "A graduate of the Kyiv Polytechnic Institute (KPI). Building since 2021, first as a freelancer, then growing into a boutique studio. Code Site Art was founded in 2025.",
      "The focus is custom websites and business systems on Next.js, React, TypeScript and Sanity CMS. Not templates or page builders. The code solves a concrete business task: leads, sales, content management.",
      "Working with the studio, you don't pass your task down a chain of managers. You talk to the person responsible for the technical decisions and the result.",
    ],
    facts: [
      { label: "Education", value: "KPI, Kyiv" },
      { label: "Developing since", value: "2021" },
      { label: "Studio founded", value: "2025" },
      { label: "Stack", value: "Next.js · TS · Sanity" },
    ],
    profilesLabel: "FOUNDER",
    profiles: [
      {
        label: "GitHub",
        handle: "github.com/cyanidium1",
        href: "https://github.com/cyanidium1",
        icon: Github,
      },
      {
        label: "LinkedIn",
        handle: "in/fediralpatov",
        href: "https://linkedin.com/in/fediralpatov",
        icon: Linkedin,
      },
      {
        label: "Instagram",
        handle: "@cyanidium",
        href: "https://instagram.com/cyanidium",
        icon: Instagram,
      },
    ],
  },

  trackRecord: {
    eyebrow: "PUBLIC PROOF",
    heading: (
      <>
        Don&apos;t take our word, <em>verify it yourself</em>
      </>
    ),
    sub: "The code, the profiles and real launched sites are all public. You can check who we are and what we do before the first conversation.",
    github: {
      title: "Our code is public",
      body: "The developer's GitHub profile is open: commits, repositories, technologies. You see how we write, not just how we talk about it.",
      cta: "Open GitHub",
      href: "https://github.com/cyanidium1",
      repoHint: "github.com/cyanidium1",
    },
    stackLabel: "STACK",
    stack: ["Next.js", "React", "TypeScript", "Sanity CMS", "Vercel", "Tailwind"],
    regionsLabel: "REGIONS",
    regions: ["Ukraine", "EU", "Denmark"],
  },

  philosophy: {
    eyebrow: "OWNERSHIP",
    heading: (
      <>
        Why we work <em>this way</em>
      </>
    ),
    sub: "A website is a business system, not a brochure. That system should belong to you, not a contractor or a platform.",
    pillars: [
      {
        icon: FileCode,
        title: "Your code",
        body: "The source code lives in your repository from the first commit. Any other developer can pick up the work.",
      },
      {
        icon: Server,
        title: "Your hosting",
        body: "The site is deployed on your accounts. You pay the host directly and aren't tied to us in any way.",
      },
      {
        icon: Globe,
        title: "Your domains",
        body: "Domains are registered to you. It's your address on the internet — it shouldn't be in someone else's hands.",
      },
      {
        icon: Database,
        title: "Your data",
        body: "Content, leads, analytics and the CMS stay under your control. No vendor lock-in.",
      },
    ],
    warning: {
      title: "Why depending on an agency or a builder is a risk",
      body: "When the code, hosting and domain stay with a contractor or get locked into a builder (Tilda, Wix, WordPress on someone else's plugins), you're effectively renting your own business. They raise prices, disappear, or shut down, and you can't move the site or hire a different developer. We build so you can leave us at any time. That's why clients stay.",
    },
  },

  projects: {
    eyebrow: "REAL PROJECTS",
    heading: (
      <>
        Real businesses. <em>Real launches.</em>
      </>
    ),
    sub: "Sites that work for real companies across different niches and countries.",
    items: [
      {
        name: "NBYG København",
        meta: "Construction · Denmark · 2024",
        blurb:
          "A construction company in Copenhagen and Bornholm. Migrated from an old WordPress to Next.js + Sanity with mobile editing and local SEO.",
        tags: ["Next.js", "Sanity", "Local SEO"],
        href: "/en/portfolio/nbyg-kobenhavn",
        accent: "oklch(0.66 0.15 150)",
      },
      {
        name: "Kondor PC",
        meta: "E-commerce · Ukraine",
        blurb:
          "PC store and custom builds. Bespoke catalog, configurator and content management without a developer.",
        tags: ["Next.js", "E-commerce"],
        accent: "oklch(0.62 0.16 295)",
      },
      {
        name: "Akers Advisory",
        meta: "Consulting · B2B",
        blurb:
          "A corporate site for an advisory firm: clear service structure, SEO architecture and fast loading.",
        tags: ["Next.js", "SEO"],
        accent: "oklch(0.62 0.13 245)",
      },
      {
        name: "Real estate",
        meta: "Real estate · investment",
        blurb:
          "Platforms for real estate and investment projects: multi-language, property catalogs and client portals.",
        tags: ["Multi-lang", "Portals"],
        accent: "oklch(0.72 0.14 70)",
      },
      {
        name: "Automotive",
        meta: "Automotive · catalogs",
        blurb:
          "Sites for the automotive niche — from dealers to services, with catalogs and lead forms.",
        tags: ["Catalog", "Lead-gen"],
        accent: "oklch(0.7 0.12 200)",
      },
      {
        name: "Code Site Art",
        meta: "Studio · this site",
        blurb:
          "The site you're reading now. Next.js + Sanity, Lighthouse-optimized, fully custom code.",
        tags: ["Next.js", "Sanity"],
        accent: "oklch(0.55 0.18 295)",
      },
    ],
  },

  whatYouBuy: {
    eyebrow: "WHAT YOU BUY",
    heading: (
      <>
        You&apos;re not buying a site. <em>You&apos;re buying a system.</em>
      </>
    ),
    sub: "A \"website\" is the wrapper. The real value is what's under the hood and what works for you after launch.",
    items: [
      {
        icon: Search,
        title: "SEO architecture",
        body: "Structure, metadata and semantics built into the code from the start, so Google finds you.",
      },
      {
        icon: LayoutDashboard,
        title: "A CMS for your content",
        body: "Sanity CMS where you edit pages, add services and cases yourself — without a developer.",
      },
      {
        icon: Workflow,
        title: "Integrations",
        body: "Forms, Telegram, CRM, payments, bookings: we wire up whatever your process needs.",
      },
      {
        icon: BarChart3,
        title: "Analytics",
        body: "Configured from launch: you see where leads come from and what's working.",
      },
      {
        icon: Cloud,
        title: "Infrastructure",
        body: "Hosting, domain, SSL, CDN, deployment, all set up on your accounts and handed to you.",
      },
      {
        icon: LifeBuoy,
        title: "Support",
        body: "Warranty and technical support after launch. We don't leave you alone with the site.",
      },
    ],
    cms: {
      title: "A CMS where you're in charge",
      body: "Every project ships with a Sanity admin. You create pages, add services and update content yourself — from a laptop or a phone, with no developer requests and no monthly fee for \"access.\"",
      bullets: [
        "Edit content without code",
        "New pages in minutes",
        "Works from your phone",
        "No subscription for the CMS",
      ],
      src: "/sanity-studio/admin-desktop.png",
      alt: "Sanity Studio admin — managing site content",
    },
  },

  guarantees: {
    eyebrow: "GUARANTEES",
    heading: (
      <>
        We take the risk <em>on ourselves</em>
      </>
    ),
    sub: "A fixed-sum contract removes the client's main fears: missed deadlines, dependency, and \"what if it breaks.\"",
    items: [
      {
        icon: ShieldCheck,
        tag: "1 year",
        title: "Warranty",
        body: "A year of warranty is included in the price. If it breaks through no fault of yours, we fix it for free.",
      },
      {
        icon: KeyRound,
        tag: "100%",
        title: "Ownership",
        body: "Code, hosting, domain and data are yours. No tie to the studio and no vendor lock-in.",
      },
      {
        icon: CalendarCheck,
        tag: "Fixed",
        title: "Deadline responsibility",
        body: "The deadline and the sum are fixed in the contract before we start. No drifting timelines, no added invoices.",
      },
      {
        icon: Percent,
        tag: "−30%",
        title: "Rebate for delays",
        body: "If we miss the deadline through our fault, we return 30%. Our incentive matches yours.",
      },
    ],
    footnote:
      "All terms are fixed in the contract before work begins. Price, scope, timeline and guarantees: on paper, not just words.",
  },

  faq: [
    {
      q: "Who will work on my project?",
      a: [
        "The founder, ",
        { em: "Fedir Alpatov" },
        ", leads the architecture and development. It's a boutique studio, so you talk to the developer directly, not through an account manager.",
      ],
    },
    {
      q: "Will I really own the code and the site?",
      a: [
        "Yes. ",
        { em: "Code, hosting, domain and data are yours" },
        " from day one. You can move the site or hire a different developer at any time.",
      ],
    },
    {
      q: "What do you build on?",
      a: [
        { em: "Next.js, React, TypeScript and Sanity CMS" },
        ". Custom code, no page builders and no heavy plugins.",
      ],
    },
    {
      q: "Do you work with clients abroad?",
      a: [
        "Yes. Clients include companies in the ",
        { em: "EU, including Denmark" },
        " (NBYG, Copenhagen). We work remotely in your timezone.",
      ],
    },
    {
      q: "What if you miss the deadline?",
      a: [
        "The deadline is fixed in the contract. If we miss it through our fault, ",
        { em: "we return a 30% rebate" },
        ".",
      ],
    },
    {
      q: "What's the project budget?",
      a: [
        "Projects are typically in the ",
        { em: "€3,000–15,000" },
        " range depending on scope. The exact sum is fixed in the contract before we start.",
      ],
    },
    {
      q: "Can I see your work?",
      a: [
        "Yes. The ",
        { em: "Portfolio" },
        " section and an open GitHub. You can verify us before we even talk.",
      ],
    },
  ],
};
