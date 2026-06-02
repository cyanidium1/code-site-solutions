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
  /** Screenshot filenames relative to the site's output folder. */
  screenshots: string[];
}

/** Everything a single page yields except the bits the crawler fills in. */
export type ExtractedPageData = Omit<PageData, "url" | "screenshots">;

export interface RawData {
  site: SiteConfig;
  crawledAt: string;
  pages: PageData[];
}

export interface CaseDraft {
  title: string;
  slug: string;
  shortDescription: string;
  clientContext: string;
  problem: string;
  solution: string;
  features: string[];
  stack: string[];
  businessValue: string;
  seoTitle: string;
  seoDescription: string;
  screenshots: string[];
}

/**
 * The contract the analyzer fulfils. Today it's a local template; later it can
 * be swapped for a Claude-API-backed implementation with the same signature.
 */
export type CaseGenerator = (raw: RawData) => Promise<CaseDraft>;
