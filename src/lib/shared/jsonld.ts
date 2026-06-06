/**
 * Shared schema.org JSON-LD builders.
 *
 * Pages compose a graph of nodes via `buildJsonLd([...])` and emit it through
 * the `<JsonLd />` component (`src/components/shared/json-ld.tsx`). The same
 * `@id`s are used across pages so entities (Organization, WebSite) merge into
 * a single node from Google's perspective, while per-page nodes (WebPage,
 * BreadcrumbList, Article, Service, FAQPage…) live on the pages that emit them.
 *
 * Locale rule: `inLanguage` uses BCP-47 (`uk-UA` / `en-US`). The legacy `ru`
 * Locale value falls back to `uk-UA` since RU content isn't actively published.
 */

import type { Locale } from "@/types/sanity";
import {
  ORG_ID,
  SITE_CONTACT,
  SITE_ORIGIN,
  WEBSITE_ID,
  pageUrl,
} from "@/constants/site";

export type JsonLdNode = Record<string, unknown>;

/** Path is site-relative ("/portfolio"); helper resolves it via `pageUrl()`. */
export type BreadcrumbItem = { name: string; path: string };

function langTag(locale: Locale): string {
  return locale === "en" ? "en-US" : "uk-UA";
}

function homeUrlFor(locale: Locale): string {
  return locale === "en" ? `${SITE_ORIGIN}/en` : SITE_ORIGIN;
}

function websiteIdFor(locale: Locale): string {
  return locale === "en" ? `${SITE_ORIGIN}/en#website` : WEBSITE_ID;
}

/* ─── WebPage ─────────────────────────────────────────────────────────────── */

export type WebPageInput = {
  /** Site-relative path, e.g. `/sites-for/medicine`. */
  path: string;
  locale: Locale;
  title: string;
  description?: string;
  /** Override the default `WebPage` @type for AboutPage / ContactPage / CollectionPage / etc. */
  type?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "ItemPage";
  /** When provided, attaches a SpeakableSpecification. CSS selectors only. */
  speakableSelectors?: string[];
  /** Spread onto the node — for `about: { "@id": ORG_ID }` on AboutPage, etc. */
  extra?: Record<string, unknown>;
};

export function webPageNode(input: WebPageInput): JsonLdNode {
  const url = pageUrl(input.path);
  const node: JsonLdNode = {
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    inLanguage: langTag(input.locale),
    isPartOf: { "@id": websiteIdFor(input.locale) },
  };
  if (input.speakableSelectors?.length) {
    node.speakable = {
      "@type": "SpeakableSpecification",
      cssSelector: input.speakableSelectors,
    };
  }
  return { ...node, ...input.extra };
}

/* ─── BreadcrumbList ──────────────────────────────────────────────────────── */

/**
 * `items` are site-relative paths (e.g. `/portfolio`) — absolute URLs are also
 * accepted as-is for hash links into other pages (`/#solutions`).
 */
export function breadcrumbNode(items: BreadcrumbItem[]): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : pageUrl(item.path),
    })),
  };
}

/* ─── WebSite (home only) ─────────────────────────────────────────────────── */

export function websiteNode(locale: Locale, description?: string): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteIdFor(locale),
    url: homeUrlFor(locale),
    name: "Code-Site.Art",
    inLanguage: langTag(locale),
    publisher: { "@id": ORG_ID },
    description,
  };
}

/* ─── Organization (home + about) ─────────────────────────────────────────── */

/**
 * Single source of truth for the Organization entity. Emit once per page —
 * pages that reference it (Article.publisher, Service.provider, AboutPage.about,
 * Person.worksFor) use `{ "@id": ORG_ID }` instead of re-declaring.
 *
 * TODO(google-business-profile): re-add `aggregateRating` once GBP is set up:
 *   aggregateRating: {
 *     "@type": "AggregateRating",
 *     ratingValue: "4.9", bestRating: "5", worstRating: "1", reviewCount: "50",
 *   }
 */
export function organizationNode(): JsonLdNode {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Code-Site.Art",
    alternateName: "Code-Site Art",
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_ORIGIN}/logo-512.png`,
      width: 512,
      height: 512,
    },
    description:
      "Бутик-студія з розробки кастомних сайтів для бізнесу. 50+ проєктів за 5 років у 7 країнах.",
    foundingDate: "2021",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Київ",
        addressCountry: "UA",
      },
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: 12,
    },
    email: SITE_CONTACT.email,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_CONTACT.phone,
        contactType: "customer service",
        availableLanguage: ["Ukrainian", "English", "Russian"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+355-68-928-6136",
        contactType: "customer service",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Київ",
      addressCountry: "UA",
    },
    sameAs: [
      SITE_CONTACT.linkedin,
      SITE_CONTACT.telegram,
      SITE_CONTACT.instagram,
      SITE_CONTACT.tiktok,
      SITE_CONTACT.github,
    ],
    areaServed: ["UA", "EU", "US", "DK", "ZA", "GB", "FR"],
    knowsAbout: [
      "Web Development",
      "Next.js",
      "SEO",
      "UI/UX Design",
      "TypeScript",
    ],
  };
}

/* ─── DefinedTerm (glossary) ──────────────────────────────────────────────── */

export type DefinedTerm = { name: string; description: string };

const GLOSSARY_SET_NAME: Record<"uk" | "en", string> = {
  uk: "Глосарій Code-Site.Art",
  en: "Code-Site.Art Glossary",
};

export function definedTermNodes(
  terms: DefinedTerm[],
  locale: Locale,
): JsonLdNode[] {
  const setKey = locale === "en" ? "en" : "uk";
  const setName = GLOSSARY_SET_NAME[setKey];
  return terms.map((t) => ({
    "@type": "DefinedTerm",
    name: t.name,
    description: t.description,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: setName,
    },
  }));
}

/* ─── Review ──────────────────────────────────────────────────────────────── */

export type ReviewInput = {
  /** Plain-text review body — the testimonial quote. */
  body: string;
  /** Plain-text author name (no LinkedIn/URL). */
  authorName: string;
  /** 1–5 integer. */
  rating: number;
  /** ISO date "YYYY-MM-DD". */
  datePublished: string;
  /** `@id` of the entity being reviewed (Organization, Article, …). */
  itemReviewedId: string;
  /** Optional review headline; rendered as `Review.name`. */
  headline?: string;
};

export function reviewNode(input: ReviewInput): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "Review",
    itemReviewed: { "@id": input.itemReviewedId },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(input.rating),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: input.body,
    author: { "@type": "Person", name: input.authorName },
    datePublished: input.datePublished,
  };
  if (input.headline) node.name = input.headline;
  return node;
}

/**
 * Convert a list of partial review records into `Review` nodes, silently
 * dropping any that lack the fields Google requires (body, author, rating,
 * datePublished). Use this so a partially-filled CMS row degrades gracefully
 * — the page still renders, the page-level JSON-LD still validates, and the
 * review just doesn't appear until the editor completes it.
 */
export type RawReview = {
  body?: string | null;
  authorName?: string | null;
  rating?: number | null;
  datePublished?: string | null;
  headline?: string | null;
};

export function buildReviewNodes(
  raws: RawReview[],
  itemReviewedId: string,
): JsonLdNode[] {
  return raws.flatMap((r) => {
    const body = r.body?.trim();
    const authorName = r.authorName?.trim();
    if (!body || !authorName) return [];
    if (typeof r.rating !== "number" || r.rating < 1 || r.rating > 5) return [];
    if (!r.datePublished) return [];
    return [
      reviewNode({
        body,
        authorName,
        rating: r.rating,
        datePublished: r.datePublished,
        itemReviewedId,
        headline: r.headline?.trim() || undefined,
      }),
    ];
  });
}

/* ─── Graph composer ──────────────────────────────────────────────────────── */

export function buildJsonLd(
  graph: (JsonLdNode | JsonLdNode[] | null | undefined)[],
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": graph
      .flat()
      .filter((n): n is JsonLdNode => Boolean(n)),
  };
}
