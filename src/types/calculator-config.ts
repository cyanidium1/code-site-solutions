import type {
  ContentOption,
  DesignComplexity,
  LanguageOption,
  MaintenancePlan,
  ProductComplexity,
  ProjectType,
  SeoGrowthPlan,
  TimelineOption,
} from "@/types/pricing";

export type FeatureGroup = "leadCapture" | "conversion" | "advancedUx";

export type ConfigProjectType = {
  key: ProjectType;
  label: string;
  hint: string;
  basePrice: number;
  /**
   * When true, the calculator shows the product-complexity tier for this
   * project type (UI section in CalculatorControls, summary list item in
   * EstimateSummary, productComplexityCost in the engine). Optional with a
   * backward-compat fallback at every read site: `?? (key === "ecommerce")`.
   */
  hasProductComplexity?: boolean;
  pages: {
    min: number;
    max: number;
    defaultValue: number;
    included: number;
    extraPrice: number;
  };
};

export type ConfigCheckboxOption = {
  key: string;
  label: string;
  hint?: string;
  price: number;
  included?: boolean;
};

export type ConfigFeatureOption = ConfigCheckboxOption & {
  group: FeatureGroup;
};

export type ConfigPercentOption<K extends string> = {
  key: K;
  label: string;
  hint?: string;
  percent: number;
};

export type ConfigPriceOption<K extends string> = {
  key: K;
  label: string;
  price: number;
};

export type ConfigProductComplexity = {
  key: ProductComplexity;
  label: string;
  hint: string;
  price: number;
};

export type ConfigDesign = {
  key: DesignComplexity;
  label: string;
  hint: string;
  percent: number;
  previews: { src: string; caption: string }[];
};

export type ConfigMaintenance = {
  key: MaintenancePlan;
  label: string;
  monthlyPrice: number;
};

export type ConfigSeoGrowth = {
  key: SeoGrowthPlan;
  label: string;
  bestFor: string;
  includes: string[];
  badge?: string;
  monthlyPrice: number;
  priceLabel?: string;
};

export type ConfigPreset = {
  key: string;
  title: string;
  badge: string;
  bestFor: string;
  includes: string[];
  estimatedRange: string;
  compareAnchor: string;
  /** Snapshot applied when the user clicks this preset. */
  appliedInput: {
    projectType: ProjectType;
    pages: number;
    productComplexity: ProductComplexity;
    designComplexity: DesignComplexity;
    languages: LanguageOption;
    cmsUpgradeIds: string[];
    seoOptionIds: string[];
    featureIds: string[];
    contentOption: ContentOption;
    timeline: TimelineOption;
    maintenancePlan: MaintenancePlan;
    seoGrowthPlan: SeoGrowthPlan;
  };
};

export type CalculatorConfig = {
  projectTypes: ConfigProjectType[];
  productComplexity: ConfigProductComplexity[];
  design: ConfigDesign[];
  languages: ConfigPercentOption<LanguageOption>[];
  cmsUpgrades: ConfigCheckboxOption[];
  seoOptions: ConfigCheckboxOption[];
  features: ConfigFeatureOption[];
  contentOptions: ConfigPriceOption<ContentOption>[];
  timeline: ConfigPercentOption<TimelineOption>[];
  maintenance: ConfigMaintenance[];
  seoGrowth: ConfigSeoGrowth[];
  presets: ConfigPreset[];
  settings: {
    defaultProjectType: ProjectType;
    roundStep: number;
    highEstimateFactor: number;
    seoGrowthRecommendedBadge: string;
  };
};
