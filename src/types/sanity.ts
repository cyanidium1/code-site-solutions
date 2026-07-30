/**
 * Hand-written types for Sanity GROQ result shapes.
 *
 * These mirror the projections in queries.ts. When the schema changes:
 *   1. Update admin/queries (already done in this branch).
 *   2. Update src/lib/sanity/queries.ts to mirror.
 *   3. Update this file.
 *
 * Future improvement: replace with `sanity typegen`-generated types.
 */

import type { Locale } from "@/constants/locales";
export type { Locale };

/** CMS payloads may still carry a legacy `ru` key until it is removed from the schema. */
export type LocalizedString = Partial<Record<Locale | "ru", string>>;
export type LocalizedText = LocalizedString;

/* ─── pricingPlan document (homepage + /pricing tier cards) ──────────────── */

export type PricingPlanDoc = {
  _id: string;
  planKey?: string;
  name?: LocalizedString;
  priceFrom?: number;
  currency?: "USD" | "EUR" | "UAH";
  weeks?: LocalizedString;
  includesHeading?: LocalizedString;
  includes?: LocalizedString[];
  excludesHeading?: LocalizedString;
  excludes?: LocalizedString[];
  ctaLabel?: LocalizedString;
  ctaHref?: string;
  ctaGhost?: boolean;
  discountLine?: LocalizedString;
  isPopular?: boolean;
  popularLabel?: LocalizedString;
  order?: number;
};

export type SanityAsset = {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio?: number };
    /** True when the image has no actual transparency — gates LQIP blur-up. */
    isOpaque?: boolean;
  };
};

export type SanityImage = {
  asset?: SanityAsset | null;
  hotspot?: { x: number; y: number; height: number; width: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  alt?: LocalizedString;
};

export type SeoFields = {
  title?: LocalizedString;
  description?: LocalizedText;
  ogImage?: SanityAsset | null;
};

export type Metric = {
  _key?: string;
  value?: LocalizedString;
  label?: LocalizedString;
};

export type CtaAction = {
  label?: LocalizedString;
  description?: LocalizedText;
  href?: string;
  type?: string;
};

/* ─── Portable Text (richTextSimple) ─────────────────────────────────────── */

export type PortableSpan = {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
};

export type PortableLinkAnnotation = {
  _type: "link";
  _key: string;
  href?: string;
  newTab?: boolean;
};

export type PortableBlock = {
  _type: "block";
  _key?: string;
  style?: string;
  /** "bullet" or "number" when the block belongs to a list. */
  listItem?: "bullet" | "number";
  /** Nesting level (default 1). */
  level?: number;
  children: PortableSpan[];
  markDefs?: PortableLinkAnnotation[];
};

export type RichTextSimple = PortableBlock[];

/** Localized rich text (localizedRichText object): per-locale block arrays. */
export type LocalizedRichText = Partial<Record<Locale, RichTextSimple>>;

/* ─── Section block discriminated union ──────────────────────────────────── */

type BlockBase<T extends string> = {
  _type: T;
  _key: string;
  eyebrow?: LocalizedString;
  heading?: LocalizedText;
};

export type ImageTextSection = BlockBase<"imageTextBlock"> & {
  variant?: "side" | "side-with-list" | "centered";
  imageVariant?: "imageLeft" | "imageRight";
  /** "natural" renders the image at its intrinsic aspect ratio (no 4:3 crop). */
  imageFit?: "cover" | "natural";
  centeredLayout?: "vertical" | "horizontal";
  body?: LocalizedRichText;
  bulletList?: LocalizedString[];
  bulletIcon?: "check" | "cross" | "dot";
  image?: SanityImage | null;
  image2?: SanityImage | null;
  cta?: CtaAction | null;
};

export type StatsSection = BlockBase<"statsBlock"> & {
  items?: Metric[];
};

export type FaqSection = BlockBase<"faqBlock"> & {
  items?: Array<{
    _key?: string;
    question?: LocalizedString;
    answer?: LocalizedRichText;
  }>;
};

export type PricingTier = {
  _key?: string;
  title?: LocalizedString;
  price?: LocalizedString;
  weeks?: LocalizedString;
  isPopular?: boolean;
  popularLabel?: LocalizedString;
  includesHeading?: LocalizedString;
  includes?: LocalizedString[];
  excludesHeading?: LocalizedString;
  excludes?: LocalizedString[];
  ctaLabel?: LocalizedString;
  ctaGhost?: boolean;
};

export type PricingSection = BlockBase<"pricingBlock"> & {
  tiers?: PricingTier[];
};

export type ContactForm = {
  heading?: LocalizedString;
  sub?: LocalizedText;
  namePlaceholder?: LocalizedString;
  channelPlaceholder?: LocalizedString;
  briefPlaceholder?: LocalizedString;
  submitLabel?: LocalizedString;
  foot?: LocalizedText;
};

export type ComparisonSection = BlockBase<"comparisonBlock"> & {
  columns?: {
    param?: LocalizedString;
    wp?: LocalizedString;
    wix?: LocalizedString;
    custom?: LocalizedString;
  };
  rows?: Array<{
    _key?: string;
    param?: LocalizedString;
    wp?: LocalizedString;
    wix?: LocalizedString;
    custom?: LocalizedString;
  }>;
  /** @deprecated use primaryCta — kept for backward-compatible reads during migration */
  tableCtaPrimary?: LocalizedString;
  /** @deprecated use ghostCta */
  tableCtaGhost?: LocalizedString;
  primaryCta?: CtaAction | null;
  ghostCta?: CtaAction | null;
  contact?: ContactForm;
  pricingHeading?: LocalizedText;
  tiers?: PricingTier[];
};

export type ReasonsSection = BlockBase<"reasonsBlock"> & {
  eyebrowNum?: LocalizedString;
  metaRows?: LocalizedString[];
  reasons?: Array<{
    _key?: string;
    number?: string;
    tag?: LocalizedString;
    title?: LocalizedText;
    text?: LocalizedRichText;
    stat?: {
      value?: string;
      label?: LocalizedString;
      source?: LocalizedString;
    };
  }>;
  footText?: LocalizedText;
  /** @deprecated use footCta */
  footCtaLabel?: LocalizedString;
  footCta?: CtaAction | null;
};

export type ServicesSection = BlockBase<"servicesBlock"> & {
  testimonialEyebrow?: LocalizedString;
  testimonial?: {
    quote?: LocalizedText;
    visual?: SanityImage | null;
    authorName?: string;
    authorInitials?: string;
    authorRole?: LocalizedString;
    authorAvatar?: SanityAsset | null;
    rating?: number;
    reviewDate?: string;
    reviewHeadline?: LocalizedString;
  };
  sub?: LocalizedText;
  features?: Array<{
    _key?: string;
    title?: LocalizedString;
    image?: SanityImage | null;
    items?: LocalizedString[];
  }>;
  integrationsHeading?: LocalizedText;
  integrationsSub?: LocalizedText;
  integrations?: LocalizedString[];
};

export type OutcomeSection = BlockBase<"outcomeBlock"> & {
  recap?: {
    eyebrow?: LocalizedString;
    text?: LocalizedText;
  };
  directions?: {
    eyebrow?: LocalizedString;
    title?: LocalizedText;
    lede?: LocalizedText;
    replaceLabel?: LocalizedString;
    replaceItems?: LocalizedString[];
    allowedLabel?: LocalizedString;
    allowedItems?: LocalizedString[];
  };
  benefitsHeading?: LocalizedText;
  benefitsSub?: LocalizedText;
  benefitHero?: {
    value?: string;
    lede?: LocalizedText;
    source?: LocalizedString;
    bullets?: LocalizedString[];
  };
  benefitRows?: Array<{
    _key?: string;
    feature?: string;
    heading?: LocalizedText;
    items?: LocalizedString[];
    mockType?: "pages" | "booking" | "admin";
    mockTags?: LocalizedString[];
    image?: SanityImage | null;
  }>;
};

export type CaseSection = BlockBase<"caseBlock"> & {
  layout?: "auto" | "comparison" | "afterOnly";
  eyebrowEm?: LocalizedString;
  lede?: LocalizedText;
  meta?: Array<{
    _key?: string;
    strong?: LocalizedString;
    text?: LocalizedString;
  }>;
  before?: {
    num?: string;
    image?: SanityImage | null;
    tagline?: LocalizedString;
    items?: LocalizedString[];
    foot?: LocalizedText;
  };
  after?: {
    num?: string;
    image?: SanityImage | null;
    tagline?: LocalizedString;
    items?: LocalizedString[];
    foot?: LocalizedText;
  };
  results?: Array<{
    _key?: string;
    value?: LocalizedString;
    label?: LocalizedString;
    tag?: LocalizedString;
  }>;
  ctaText?: LocalizedText;
  /** @deprecated use cta */
  ctaLabel?: LocalizedString;
  cta?: CtaAction | null;
};

export type AuditSection = BlockBase<"auditBlock"> & {
  sub?: LocalizedText;
  list?: LocalizedString[];
  foot?: LocalizedString;
  inputs?: {
    namePlaceholder?: LocalizedString;
    contactPlaceholder?: LocalizedString;
    phonePlaceholder?: LocalizedString;
    urlPlaceholder?: LocalizedString;
  };
  submitLabel?: LocalizedString;
  disclaim?: LocalizedString;
};

export type CtaSection = BlockBase<"ctaBlock"> & {
  body?: LocalizedText;
  primary?: CtaAction;
  secondary?: CtaAction;
};

export type RichTextSection = BlockBase<"richTextBlock"> & {
  content?: LocalizedRichText;
};

export type QuoteSection = BlockBase<"quoteBlock"> & {
  variant?: "side" | "side-with-list" | "centered"; // unused for quoteBlock; kept for type-narrowing parity
  quote?: LocalizedText;
  authorName?: string;
  authorRole?: LocalizedString;
  authorAvatar?: SanityImage | null;
  /** When true, emit this quote as a schema.org Review on the case page. */
  isReview?: boolean;
  rating?: number;
  reviewDate?: string;
  reviewHeadline?: LocalizedString;
};

export type MediaGallerySection = BlockBase<"mediaGalleryBlock"> & {
  images?: Array<{
    _key?: string;
    image?: SanityImage["asset"];
    asset?: SanityAsset | null;
    hotspot?: SanityImage["hotspot"];
    crop?: SanityImage["crop"];
    alt?: LocalizedString;
    caption?: LocalizedString;
    /** "contain" letterboxes the tile instead of cropping (wide screenshots). */
    fit?: "cover" | "contain";
  }>;
};

export type BeforeAfterSection = BlockBase<"beforeAfterBlock"> & {
  before?: { image?: SanityImage | null; label?: LocalizedString };
  after?: { image?: SanityImage | null; label?: LocalizedString };
};

export type TestimonialSection = BlockBase<"testimonialBlock"> & {
  quote?: LocalizedText;
  authorName?: string;
  authorRole?: LocalizedString;
  authorAvatar?: SanityImage | null;
  rating?: number;
  reviewDate?: string;
  reviewHeadline?: LocalizedString;
};

/**
 * Standalone testimonial document — used by the homepage PullQuoteSwiper.
 * Filtered to `featured == true` for the homepage; the wider collection
 * can be reused by other pages later.
 */
export type Testimonial = {
  _id: string;
  authorName?: string;
  authorRole?: LocalizedString;
  authorInitials?: string;
  linkedinUrl?: string;
  quote?: LocalizedText;
  mockupLeft?: SanityImage | null;
  mockupRight?: SanityImage | null;
  caseRef?: { slug?: string } | null;
  caseLabel?: LocalizedString;
  featured?: boolean;
  order?: number;
  rating?: number;
  reviewDate?: string;
  reviewHeadline?: LocalizedString;
  /** Surfaced as the Review.datePublished fallback when `reviewDate` is empty. */
  _createdAt?: string;
};

export type IndustrySection =
  | ImageTextSection
  | StatsSection
  | FaqSection
  | PricingSection
  | ComparisonSection
  | ReasonsSection
  | ServicesSection
  | OutcomeSection
  | CaseSection
  | AuditSection
  | CtaSection
  | RichTextSection;

/* ─── Documents ──────────────────────────────────────────────────────────── */

export type HeroDeviceTag = {
  _key?: string;
  kind?: "default" | "good";
  primary?: LocalizedString;
  mini?: string;
};

export type IndustryPageDoc = {
  _id: string;
  slug: string;
  title?: LocalizedString;
  seo?: SeoFields;
  hero?: {
    eyebrow?: LocalizedString;
    heading?: LocalizedText;
    h1Num?: string;
    h1NumLabel?: LocalizedText;
    lede?: LocalizedText;
    features?: LocalizedString[];
    ctaPrimary?: LocalizedString;
    ctaSecondary?: LocalizedString;
    stats?: Metric[];
    tickerItems?: LocalizedString[];
    deviceTags?: HeroDeviceTag[];
    deviceMockup?: SanityImage | null;
  };
  sections?: IndustrySection[];
  relatedCases?: CaseStudyRef[];
  relatedPosts?: BlogPostRef[];
};

export type IndustryPageRef = {
  _id: string;
  slug: string;
  title?: LocalizedString;
  status?: "draft" | "published";
  order?: number;
};

/**
 * Dereferenced option from the singleton-style option doc types
 * (`countryOption`, `budgetBucketOption`). The `slug` is the stable
 * identifier used in URL params; `name` is the localized display label.
 */
export type OptionRef = {
  slug: string;
  name?: LocalizedString;
};

export type CaseStudyRef = {
  _id: string;
  slug: string;
  title?: LocalizedString;
  client?: string;
  region?: LocalizedString;
  year?: number;
  country?: OptionRef | null;
  budgetBucket?: OptionRef | null;
  industrySlug?: string;
  industry?: { _id: string; slug: string; title?: LocalizedString } | null;
  coverImage?: SanityImage | null;
  status?: "draft" | "published";
  featured?: boolean;
  metricsLine?: LocalizedString;
};

/**
 * Result shape of `HOMEPAGE_CASES_QUERY`. `null` when the singleton has
 * never been published. GROQ projects the four curated arrays as the
 * keys below; the inner shape matches `CaseStudyRef`.
 */
export type HomepageCasesQueryResult = {
  default: CaseStudyRef[] | null;
  legal: CaseStudyRef[] | null;
  medicine: CaseStudyRef[] | null;
  realEstate: CaseStudyRef[] | null;
} | null;

/**
 * Normalised, render-ready shape consumed by the homepage Cases section.
 * Keys are the industry slugs used on `/sites-for/<slug>` so the frontend
 * can deep-link or filter consistently.
 */
export type HomepageCasesData = {
  default: CaseStudyRef[];
  legal: CaseStudyRef[];
  medicine: CaseStudyRef[];
  "real-estate": CaseStudyRef[];
};

/** Per-locale slugs (localizedSlug object) — distinct URL per locale. */
export type LocalizedSlugs = Partial<Record<Locale, { current?: string }>>;

export type BlogPostRef = {
  _id: string;
  slugs?: LocalizedSlugs;
  title?: LocalizedString;
  publishedAt?: string;
  lede?: LocalizedString;
  cover?: SanityImage | null;
  coverImage?: BlogCover | null;
  category?: {
    slug: string;
    name?: LocalizedString;
    color?: string;
  } | null;
  status?: "draft" | "published";
};

/* ─── Blog body — extended portable text with custom blocks ───────────────── */

export type TldrBoxBlock = {
  _type: "tldrBox";
  _key: string;
  title?: string;
  items?: string[];
};

export type CtaCalloutBlock = {
  _type: "ctaCallout";
  _key: string;
  eyebrow?: string;
  heading?: string;
  sub?: string;
  ctaLabel?: string;
  /** 'link' (default) navigates to ctaHref; 'modal' opens the lead modal;
   *  'modalDemo' opens the trimmed demo-access variant of the form. */
  ctaMode?: "link" | "modal" | "modalDemo";
  ctaHref?: string;
  /** Lead source tag recorded when ctaMode opens the modal. */
  leadSource?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};

export type BlogTableBlock = {
  _type: "blogTable";
  _key: string;
  headers?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
};

export type BlogImageBlock = {
  _type: "blogImage";
  _key: string;
  asset?: SanityAsset | null;
  hotspot?: SanityImage["hotspot"];
  crop?: SanityImage["crop"];
  alt?: string;
  caption?: string;
};

export type BlogVideoBlock = {
  _type: "blogVideo";
  _key: string;
  /** YouTube video ID; the block is skipped while empty. */
  youtubeId?: string;
  title?: string;
  caption?: string;
};

export type BlogBodyBlock =
  | PortableBlock
  | TldrBoxBlock
  | CtaCalloutBlock
  | BlogTableBlock
  | BlogImageBlock
  | BlogVideoBlock;

export type BlogBody = BlogBodyBlock[];

export type BlogAuthor = {
  name?: string;
  role?: string;
  photoUrl?: string;
  bio?: string;
};

export type BlogFaqItem = {
  _key?: string;
  question?: LocalizedString;
  answer?: LocalizedString;
};

/** Legacy static-asset cover — file lives under /public/blog/. Fallback
 *  only; the CMS-hosted `cover` (SanityImage) wins when present. */
export type BlogCover = {
  src?: string;
  alt?: string;
  altEn?: string;
};

/* ─── Blog post — listing item (lightweight) ──────────────────────────────── */

export type BlogPostListItem = {
  _id: string;
  slugs?: LocalizedSlugs;
  title?: LocalizedString;
  eyebrow?: LocalizedString;
  lede?: LocalizedString;
  category?: {
    slug: string;
    name?: LocalizedString;
    color?: string;
  } | null;
  publishedAt?: string;
  readingTimeMinutes?: number;
  /** CMS-hosted cover (primary). */
  cover?: SanityImage | null;
  coverImage?: BlogCover | null;
};

/* ─── Blog post — full document (post page) ───────────────────────────────── */

export type BlogPostDoc = {
  _id: string;
  /** Per-locale slugs — distinct URLs (e.g. uk `skilky-koshtuye-sayt-2026`,
   *  en `website-cost-2026-breakdown`). A locale's blog page 404s when its
   *  slug/title/body members are missing (no cross-locale fallback). */
  slugs?: LocalizedSlugs;
  title?: LocalizedString;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  eyebrow?: LocalizedString;
  lede?: LocalizedString;
  category?: {
    slug: string;
    name?: LocalizedString;
    color?: string;
  } | null;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  /** CMS-hosted cover (primary; legacy coverImage is the fallback). */
  cover?: SanityImage | null;
  coverImage?: BlogCover | null;
  ogImage?: SanityAsset | null;
  author?: BlogAuthor;
  /** Per-locale portable-text bodies (tldrBox, ctaCallout, blogTable,
   *  blogImage, blogVideo custom blocks). */
  body?: Partial<Record<Locale, BlogBody>>;
  /** Optional FAQ section heading override per locale. */
  faqHeading?: LocalizedString;
  faq?: BlogFaqItem[];
  relatedPostSlugs?: string[];
};

/* ─── caseStudy document ─────────────────────────────────────────────────── */

export type CaseStudySection =
  | ImageTextSection
  | StatsSection
  | QuoteSection
  | MediaGallerySection
  | BeforeAfterSection
  | TestimonialSection
  | CtaSection
  | RichTextSection;

export type CaseStudyDoc = {
  _id: string;
  slug: string;
  title?: LocalizedString;
  client?: string;
  industry?: { _id: string; slug: string; title?: LocalizedString } | null;
  region?: LocalizedString;
  year?: number;
  date?: string;
  duration?: LocalizedString;
  budget?: LocalizedString;
  budgetBucket?: OptionRef | null;
  country?: OptionRef | null;
  stack?: string[];
  metricsLine?: LocalizedString;
  youtubeId?: string;
  coverImage?: SanityImage | null;
  seo?: SeoFields;
  hero?: {
    eyebrow?: LocalizedString;
    heading?: LocalizedText;
    subheading?: LocalizedText;
    heroImage?: SanityImage | null;
    link?: CtaAction | null;
  };
  sections?: CaseStudySection[];
  relatedPosts?: BlogPostRef[];
  featured?: boolean;
};

/* ─── Calculator config (v3: single consolidated `calculatorConfig` doc) ──── */

export type CalculatorProjectTypeItem = {
  _key: string;
  /** Free-form camelCase id. Was a 3-value union; widened in L0 to allow custom project types. */
  projectKey: string;
  label?: LocalizedString;
  hint?: LocalizedText;
  basePrice: number;
  /** Drives the product-complexity tier in UI + engine. Optional; fetcher defaults to `key === "ecommerce"` if absent. */
  hasProductComplexity?: boolean;
  pages: {
    min: number;
    max: number;
    defaultValue: number;
    included: number;
    extraPrice: number;
  };
};

export type CalculatorCheckboxOptionItem = {
  _key: string;
  optionKey: string;
  label?: LocalizedString;
  hint?: LocalizedText;
  price?: number;
  included?: boolean;
};

export type CalculatorFeatureOptionItem = CalculatorCheckboxOptionItem & {
  featureGroup?: "leadCapture" | "conversion" | "advancedUx";
};

export type CalculatorPercentOptionItem = {
  _key: string;
  optionKey: string;
  label?: LocalizedString;
  hint?: LocalizedText;
  percent?: number;
};

export type CalculatorDesignOptionItem = CalculatorPercentOptionItem;

/** Timeline is now a flat additive USD fee (`price`), not a percent multiplier. */
export type CalculatorTimelineOptionItem = {
  _key: string;
  optionKey: string;
  label?: LocalizedString;
  hint?: LocalizedText;
  price?: number;
};

export type CalculatorPriceOptionItem = {
  _key: string;
  optionKey: string;
  label?: LocalizedString;
  hint?: LocalizedText;
  price?: number;
};

export type CalculatorConfigQueryResult = {
  projectTypes: CalculatorProjectTypeItem[] | null;
  cmsOptions: CalculatorCheckboxOptionItem[] | null;
  seoOptions: CalculatorCheckboxOptionItem[] | null;
  featureOptions: CalculatorFeatureOptionItem[] | null;
  languageOptions: CalculatorPercentOptionItem[] | null;
  designOptions: CalculatorDesignOptionItem[] | null;
  timelineOptions: CalculatorTimelineOptionItem[] | null;
  contentOptions: CalculatorPriceOptionItem[] | null;
  productComplexityOptions: CalculatorPriceOptionItem[] | null;
  settings: {
    defaultProjectType?: "landing" | "multiPage" | "ecommerce";
    roundStep?: number;
  } | null;
};
