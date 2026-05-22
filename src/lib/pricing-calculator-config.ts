import type {
  CalculatorEstimate,
  CalculatorInput,
  CheckboxOption,
  ContentOption,
  DesignComplexity,
  DesignPreviewItem,
  LanguageOption,
  MaintenancePlan,
  PackagePreset,
  ProductComplexity,
  ProjectType,
  SeoGrowthPlan,
  TimelineOption,
} from "@/types/pricing";

export type {
  CalculatorEstimate,
  CalculatorInput,
  CheckboxOption,
  ContentOption,
  DesignComplexity,
  DesignPreviewItem,
  LanguageOption,
  MaintenancePlan,
  PackagePreset,
  ProductComplexity,
  ProjectType,
  SeoGrowthPlan,
  TimelineOption,
};

export const PROJECT_TYPE_CONFIG: Record<
  ProjectType,
  {
    label: string;
    basePrice: number;
    hint: string;
    pages: { min: number; max: number; defaultValue: number; included: number; extraPrice: number };
  }
> = {
  landing: {
    label: "Landing page",
    basePrice: 1500,
    hint: "Best for one offer, service, event, MVP, or focused lead generation.",
    pages: { min: 5, max: 16, defaultValue: 7, included: 7, extraPrice: 150 },
  },
  multiPage: {
    label: "Multi-page website",
    basePrice: 3500,
    hint: "Best for companies that need service pages, about page, cases, blog, SEO structure.",
    pages: { min: 3, max: 30, defaultValue: 5, included: 5, extraPrice: 220 },
  },
  ecommerce: {
    label: "E-commerce",
    basePrice: 6000,
    hint: "Best for product catalog, cart, checkout flow, product pages, filters, and admin-managed products.",
    pages: { min: 3, max: 30, defaultValue: 5, included: 5, extraPrice: 180 },
  },
};

export const PRODUCT_COMPLEXITY_OPTIONS: Record<
  ProductComplexity,
  { label: string; price: number; hint: string }
> = {
  simple: {
    label: "Small store (up to ~50 products)",
    price: 0,
    hint: "Basic catalog and standard product pages to start sales quickly.",
  },
  medium: {
    label: "Growing store (50-500 products)",
    price: 700,
    hint: "Filters, categories, and stronger structure for scaling campaigns.",
  },
  advanced: {
    label: "Advanced store",
    price: 1400,
    hint: "Complex catalog logic, custom flows, and advanced UX for conversion growth.",
  },
};

export const DESIGN_COMPLEXITY_OPTIONS: Record<
  DesignComplexity,
  { label: string; percent: number; hint: string }
> = {
  simple: { label: "Simple / clean", percent: 0, hint: "Minimal design focused on clarity and speed." },
  custom: {
    label: "Custom branded",
    percent: 0.2,
    hint: "Branded layout with stronger visual identity.",
  },
  advanced: {
    label: "Advanced / premium",
    percent: 0.4,
    hint: "Complex layouts, animations, and premium UI interactions.",
  },
};

export const DESIGN_PREVIEW_CONFIG: Record<DesignComplexity, DesignPreviewItem[]> = {
  simple: [
    { src: "/calculator/design/preview-1.svg", caption: "Clean hero and clear CTA-focused layout." },
    { src: "/calculator/design/preview-2.svg", caption: "Lightweight sections focused on speed and readability." },
    { src: "/calculator/design/preview-3.svg", caption: "Simple blocks designed for fast launch and trust." },
  ],
  custom: [
    { src: "/calculator/design/preview-1.svg", caption: "Stronger branded style with custom section rhythm." },
    { src: "/calculator/design/preview-2.svg", caption: "Distinctive visual identity across core pages." },
    { src: "/calculator/design/preview-3.svg", caption: "Branded UI details tuned for conversion." },
  ],
  advanced: [
    { src: "/calculator/design/preview-1.svg", caption: "Premium editorial layout with advanced storytelling." },
    { src: "/calculator/design/preview-2.svg", caption: "High-end interactions and custom content modules." },
    { src: "/calculator/design/preview-3.svg", caption: "Complex experience built for competitive markets." },
  ],
};

export const LANGUAGE_OPTIONS: Record<LanguageOption, { label: string; percent: number }> = {
  one: { label: "One language", percent: 0 },
  two: { label: "Two languages", percent: 0.15 },
  three: { label: "Three languages", percent: 0.25 },
  fourPlus: { label: "Four+ languages", percent: 0.35 },
};

export const CMS_UPGRADES: CheckboxOption[] = [
  { id: "sanitySetup", label: "CMS setup", price: 0, included: true, hint: "Included in all packages." },
  {
    id: "mobileAdmin",
    label: "Mobile-friendly admin",
    price: 0,
    included: true,
    hint: "Included in all packages.",
  },
  {
    id: "advancedBuilder",
    label: "Advanced page builder",
    price: 1200,
    hint: "Manage reusable sections, landing pages, SEO pages, and content blocks without developer changes.",
  },
  {
    id: "blogSystem",
    label: "Blog/news system",
    price: 400,
    hint: "Admin-managed posts, categories, SEO fields, cover images.",
  },
  { id: "caseSystem", label: "Case studies/portfolio system", price: 350 },
  { id: "teamServices", label: "Team/services dynamic sections", price: 300 },
];

export const SEO_OPTIONS: CheckboxOption[] = [
  {
    id: "basicSeo",
    label: "Basic technical SEO",
    price: 0,
    included: true,
    hint: "Metadata, semantic headings, sitemap-ready structure included.",
  },
  {
    id: "advancedLandingSeo",
    label: "Advanced SEO landing architecture",
    price: 1200,
    hint: "For scalable pages by service, city, language, category, or niche.",
  },
  { id: "blogSeoSetup", label: "Blog SEO setup", price: 400 },
  {
    id: "programmaticSeo",
    label: "Programmatic SEO structure",
    price: 2500,
    hint: "For many structured landing pages generated from CMS data.",
  },
];

export const FEATURE_OPTIONS: CheckboxOption[] = [
  { id: "contactForm", label: "Contact form", price: 0, included: true },
  { id: "leadForm", label: "Lead form with custom fields", price: 250, hint: "Collect qualified leads with the right questions." },
  { id: "email", label: "Email notifications", price: 150, hint: "Get new enquiries sent directly to your inbox." },
  { id: "telegram", label: "Telegram notifications", price: 150, hint: "Receive new leads instantly in Telegram." },
  { id: "crm", label: "CRM integration", price: 500, hint: "Push leads automatically into your sales pipeline." },
  { id: "booking", label: "Booking/calendar integration", price: 600, hint: "Let customers pick time slots and book faster." },
  { id: "payments", label: "Payment integration", price: 900, hint: "Accept payments online without manual follow-ups." },
  { id: "accounts", label: "User accounts/auth", price: 1200, hint: "Give users a personal area for repeat actions." },
  { id: "uploads", label: "File upload forms", price: 500, hint: "Allow clients to send briefs, docs, or media files." },
  { id: "search", label: "Advanced filters/search", price: 1000, hint: "Help visitors find products or services faster." },
  { id: "mapBasic", label: "Basic map", price: 150, hint: "Simple location display for office or store." },
  { id: "mapInteractive", label: "Interactive map", price: 600, hint: "Custom markers, filters, and advanced UX." },
  { id: "reviews", label: "Reviews/testimonials module", price: 250, hint: "Show social proof where users make decisions." },
  { id: "faqSchema", label: "FAQ module with schema markup", price: 250, hint: "Answer objections and improve search visibility." },
  { id: "analytics", label: "Analytics/events setup", price: 500, hint: "Track key actions and improve conversion over time." },
  { id: "adsTracking", label: "Meta Pixel / Google Ads conversion tracking", price: 500, hint: "Measure campaign ROI with conversion events." },
  { id: "cookie", label: "Cookie banner/basic consent", price: 250, hint: "Cover basic consent requirements from launch day." },
];

export const CONTENT_OPTIONS: Record<ContentOption, { label: string; price: number }> = {
  clientProvided: { label: "Client provides all text", price: 0 },
  lightPolishing: { label: "Light copy polishing", price: 300 },
  fullCopywriting: { label: "Full copywriting for core pages", price: 1500 },
  seoCopywriting: { label: "SEO copywriting package", price: 2000 },
};

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    id: "starterLanding",
    title: "Starter Landing",
    badge: "Fast launch",
    bestFor: "Campaigns, MVPs, one-service offers.",
    includes: ["Landing page", "6-8 sections", "One language", "Simple / clean design", "Contact form", "Basic technical SEO"],
    estimatedRange: "$1,500 - $2,500",
  },
  {
    id: "growthWebsite",
    title: "Growth Website",
    badge: "Recommended",
    bestFor: "Service businesses that need trust, SEO, and lead generation.",
    includes: [
      "Multi-page website",
      "5-8 pages",
      "Two languages",
      "Custom branded design",
      "CMS",
      "Basic SEO",
      "Lead form",
      "Analytics/events setup",
    ],
    estimatedRange: "$4,500 - $7,000",
  },
  {
    id: "ecommerceStarter",
    title: "E-commerce Starter",
    badge: "Scalable store",
    bestFor: "Product businesses that need catalog, checkout, and growth structure.",
    includes: [
      "E-commerce",
      "Small or growing store structure",
      "Product pages",
      "Basic filters/search",
      "Payment integration",
      "Analytics/events setup",
      "CMS",
    ],
    estimatedRange: "$7,000 - $10,000",
  },
];

export const TIMELINE_OPTIONS: Record<TimelineOption, { label: string; percent: number; hint: string }> = {
  standard: { label: "Standard timeline", percent: 0, hint: "Regular delivery schedule." },
  faster: { label: "Faster delivery", percent: 0.2, hint: "We allocate more parallel capacity to launch sooner." },
  urgent: { label: "Urgent launch", percent: 0.35, hint: "Priority execution with increased team load and coordination." },
};

export const MAINTENANCE_OPTIONS: Record<MaintenancePlan, { label: string; monthlyPrice: number }> = {
  none: { label: "No maintenance", monthlyPrice: 0 },
  basic: { label: "Basic care", monthlyPrice: 150 },
  growth: { label: "Growth support", monthlyPrice: 400 },
  dedicated: { label: "Dedicated improvement plan", monthlyPrice: 800 },
};

export const SEO_GROWTH_OPTIONS: Record<
  SeoGrowthPlan,
  { label: string; monthlyPrice: number; priceLabel?: string; badge?: string; bestFor: string; includes: string[] }
> = {
  none: {
    label: "No SEO / Growth",
    monthlyPrice: 0,
    bestFor: "No ongoing SEO or content support.",
    includes: ["No monthly SEO work"],
  },
  basicSeo: {
    label: "Basic SEO",
    monthlyPrice: 300,
    bestFor: "Small websites starting organic visibility.",
    includes: ["1-2 blog posts/month", "Basic keyword targeting", "On-page SEO updates", "Monthly report"],
  },
  growthSeo: {
    label: "Growth SEO",
    monthlyPrice: 700,
    badge: "Recommended",
    bestFor: "Service businesses that want consistent traffic growth.",
    includes: [
      "4 blog posts/month",
      "SEO landing pages",
      "Keyword research",
      "Internal linking",
      "Analytics tracking",
      "Monthly strategy updates",
    ],
  },
  contentEngine: {
    label: "Content Engine",
    monthlyPrice: 1500,
    priceLabel: "$1,200-$1,500 /mo",
    bestFor: "Businesses that use SEO as a serious acquisition channel.",
    includes: [
      "8+ articles/month",
      "Landing page expansion",
      "Programmatic SEO planning",
      "CRO ideas",
      "Analytics review",
      "Growth roadmap",
    ],
  },
};

export const DEFAULT_CALCULATOR_INPUT: CalculatorInput = {
  projectType: "multiPage",
  pages: PROJECT_TYPE_CONFIG.multiPage.pages.defaultValue,
  productComplexity: "simple",
  designComplexity: "simple",
  languages: "one",
  cmsUpgradeIds: [],
  seoOptionIds: [],
  featureIds: [],
  contentOption: "clientProvided",
  timeline: "standard",
  maintenancePlan: "none",
  seoGrowthPlan: "none",
};
