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

export type Locale = "uk" | "ru" | "en";

export type LocalizedString = Partial<Record<Locale, string>>;
export type LocalizedText = LocalizedString;

export type SanityAsset = {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio?: number };
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
  value?: string;
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
  children: PortableSpan[];
  markDefs?: PortableLinkAnnotation[];
};

export type RichTextSimple = PortableBlock[];

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
  body?: RichTextSimple;
  bodyEn?: RichTextSimple;
  bulletList?: LocalizedString[];
  image?: SanityImage | null;
  cta?: CtaAction | null;
};

export type StatsSection = BlockBase<"statsBlock"> & {
  items?: Metric[];
};

export type FaqSection = BlockBase<"faqBlock"> & {
  items?: Array<{
    _key?: string;
    question?: LocalizedString;
    answer?: RichTextSimple;
    answerEn?: RichTextSimple;
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
  tableCtaPrimary?: LocalizedString;
  tableCtaGhost?: LocalizedString;
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
    text?: RichTextSimple;
    textEn?: RichTextSimple;
    stat?: {
      value?: string;
      label?: LocalizedString;
      source?: LocalizedString;
    };
  }>;
  footText?: LocalizedText;
  footCtaLabel?: LocalizedString;
};

export type ServicesSection = BlockBase<"servicesBlock"> & {
  testimonialEyebrow?: LocalizedString;
  testimonial?: {
    quote?: LocalizedText;
    authorName?: string;
    authorInitials?: string;
    authorRole?: LocalizedString;
    authorAvatar?: SanityAsset | null;
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
    mockUrl?: string;
    mockTags?: LocalizedString[];
  }>;
};

export type CaseSection = BlockBase<"caseBlock"> & {
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
    url?: string;
    alt?: LocalizedString;
    tagline?: LocalizedString;
    items?: LocalizedString[];
    foot?: LocalizedText;
  };
  after?: {
    num?: string;
    image?: SanityImage | null;
    url?: string;
    alt?: LocalizedString;
    tagline?: LocalizedString;
    items?: LocalizedString[];
    foot?: LocalizedText;
  };
  results?: Array<{
    _key?: string;
    value?: string;
    label?: LocalizedString;
    tag?: LocalizedString;
  }>;
  ctaText?: LocalizedText;
  ctaLabel?: LocalizedString;
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
  content?: RichTextSimple;
  contentEn?: RichTextSimple;
};

export type QuoteSection = BlockBase<"quoteBlock"> & {
  variant?: "side" | "side-with-list" | "centered"; // unused for quoteBlock; kept for type-narrowing parity
  quote?: LocalizedText;
  authorName?: string;
  authorRole?: LocalizedString;
  authorAvatar?: SanityImage | null;
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

export type CaseStudyRef = {
  _id: string;
  slug: string;
  title?: LocalizedString;
  client?: string;
  region?: LocalizedString;
  year?: number;
  industrySlug?: string;
  coverImage?: SanityImage | null;
  status?: "draft" | "published";
  featured?: boolean;
  metricsLine?: LocalizedString;
  hero?: { metrics?: Metric[] };
};

export type BlogPostRef = {
  _id: string;
  slug: string;
  title?: LocalizedString;
  publishedAt?: string;
  excerpt?: LocalizedText;
  coverImage?: SanityImage | null;
  status?: "draft" | "published";
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
  budget?: string;
  stack?: string[];
  metricsLine?: LocalizedString;
  youtubeId?: string;
  coverImage?: SanityImage | null;
  seo?: SeoFields;
  hero?: {
    eyebrow?: LocalizedString;
    heading?: LocalizedText;
    subheading?: LocalizedText;
    metrics?: Metric[];
  };
  sections?: CaseStudySection[];
  relatedPosts?: BlogPostRef[];
  featured?: boolean;
};
