// Shared types for the dev-only case generator. This whole folder is a manual
// utility (run via `npm run case:crawl`) and is never imported by the site, so
// nothing here ends up in the production bundle.

export interface SiteConfig {
  name: string;
  url: string;
  slug: string;
  stackHint?: string[];
  businessHint?: string;
  /** Paths to crawl, relative to `url`. Defaults to ["/"]. */
  paths?: string[];
}

export interface ImageInfo {
  src: string;
  alt: string;
}

export interface LinkInfo {
  href: string;
  text: string;
}

export interface PageData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  h3: string[];
  visibleTextPreview: string;
  internalLinks: LinkInfo[];
  externalLinks: LinkInfo[];
  images: ImageInfo[];
  /**
   * Screenshot paths relative to the site's output folder,
   * e.g. "screenshots/desktop-home.png".
   */
  screenshots: string[];
}

/** Everything a single page yields except the bits the crawler fills in. */
export type ExtractedPageData = Omit<PageData, "url" | "screenshots">;

export interface RawData {
  site: SiteConfig;
  crawledAt: string;
  pages: PageData[];
}

/**
 * Shape of the final, human-written case (`case-final.json`). This file is NOT
 * produced by the crawler — it's written by hand (by the developer / Claude
 * Code) after reading `content-summary.md` and the screenshots. The type lives
 * here only to document and type-check that artifact.
 */
export interface CaseFinal {
  title: string;
  slug: string;
  shortDescription: string;
  clientContext: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  businessValue: string;
  improvements: string[];
  seoTitle: string;
  seoDescription: string;
  screenshots: string[];
}
