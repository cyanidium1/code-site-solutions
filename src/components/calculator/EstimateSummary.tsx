import {
  CMS_UPGRADES,
  CONTENT_OPTIONS,
  DESIGN_COMPLEXITY_OPTIONS,
  FEATURE_OPTIONS,
  LANGUAGE_OPTIONS,
  MAINTENANCE_OPTIONS,
  PRODUCT_COMPLEXITY_OPTIONS,
  PROJECT_TYPE_CONFIG,
  SEO_OPTIONS,
  TIMELINE_OPTIONS,
  type CalculatorEstimate,
  type CalculatorInput,
} from "@/lib/pricing-calculator-config";
import { formatEur } from "./formatters";
import { PriceBreakdown } from "./PriceBreakdown";

type EstimateSummaryProps = {
  input: CalculatorInput;
  estimate: CalculatorEstimate;
  seoGrowthMonthly: number;
};

export function EstimateSummary({ input, estimate, seoGrowthMonthly }: EstimateSummaryProps) {
  const selectedFeatureOptions = FEATURE_OPTIONS.filter((feature) => !feature.included && input.featureIds.includes(feature.id));
  const selectedCmsOptions = CMS_UPGRADES.filter((item) => input.cmsUpgradeIds.includes(item.id));
  const selectedSeoOptions = SEO_OPTIONS.filter((item) => input.seoOptionIds.includes(item.id));
  const selectedFeatureLabels = selectedFeatureOptions.map((feature) => feature.label);
  const selectedCmsLabels = selectedCmsOptions.map((item) => item.label);
  const selectedSeoLabels = selectedSeoOptions.map((item) => item.label);
  const selectedAddonsForBreakdown = [...selectedCmsOptions, ...selectedSeoOptions, ...selectedFeatureOptions].map(
    (item) => `${item.label} - +${formatEur(item.price)}`,
  );
  const pageLabel = input.projectType === "landing" ? "Sections" : input.projectType === "ecommerce" ? "Content pages" : "Pages";
  const buildingItems = [
    input.projectType === "ecommerce" ? "E-commerce structure" : PROJECT_TYPE_CONFIG[input.projectType].label,
    `${input.pages} ${pageLabel.toLowerCase()}`,
    LANGUAGE_OPTIONS[input.languages].label,
    DESIGN_COMPLEXITY_OPTIONS[input.designComplexity].label,
    ...selectedFeatureLabels,
    ...selectedCmsLabels,
    ...selectedSeoLabels,
  ].slice(0, 8);

  return (
    <aside className="calc-summary">
      <h3>Estimate summary</h3>
      <ul className="calc-summary-list">
        <li>
          <span>Project type</span>
          <strong>{PROJECT_TYPE_CONFIG[input.projectType].label}</strong>
        </li>
        <li>
          <span>Base price</span>
          <strong>{formatEur(PROJECT_TYPE_CONFIG[input.projectType].basePrice)}</strong>
        </li>
        <li>
          <span>{pageLabel}</span>
          <strong>{input.pages}</strong>
        </li>
        <li>
          <span>Languages</span>
          <strong>{LANGUAGE_OPTIONS[input.languages].label}</strong>
        </li>
        <li>
          <span>Timeline</span>
          <strong>{TIMELINE_OPTIONS[input.timeline].label}</strong>
        </li>
        <li>
          <span>Content</span>
          <strong>{CONTENT_OPTIONS[input.contentOption].label}</strong>
        </li>
      </ul>

      <div className="calc-estimate-range">
        <p>Estimated project range</p>
        <h4>
          {formatEur(estimate.lowEstimate)} - {formatEur(estimate.highEstimate)}
        </h4>
        <small>Final price after scope review.</small>
      </div>

      <div className="calc-value-block">
        <h4>What you get at this price</h4>
        <ul>
          <li>Custom website (no templates, no builders)</li>
          <li>Fast loading under 1 second</li>
          <li>SEO-ready structure from day one</li>
          <li>Scalable CMS admin panel</li>
          <li>Mobile-friendly content management</li>
          <li>Clean, maintainable codebase</li>
        </ul>
      </div>

      <details className="calc-why-block">
        <summary>Why the price changes</summary>
        <ul>
          <li>More pages = more design and development work</li>
          <li>More languages = separate SEO and CMS structure</li>
          <li>Advanced design = custom UI and interactions</li>
          <li>Integrations = additional development and testing</li>
        </ul>
      </details>

      <div className="calc-building-block">
        <h4>Your website will include:</h4>
        <ul>
          {buildingItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
          {input.projectType === "ecommerce" ? (
            <li className="calc-building-note">{PRODUCT_COMPLEXITY_OPTIONS[input.productComplexity].label}</li>
          ) : null}
        </ul>
      </div>

      <div className="calc-maintenance">
        <p>Maintenance (monthly)</p>
        <strong>{formatEur(estimate.monthlyMaintenance)} / month</strong>
        <small>{MAINTENANCE_OPTIONS[input.maintenancePlan].label}</small>
      </div>
      {seoGrowthMonthly > 0 ? (
        <div className="calc-maintenance">
          <p>SEO & Growth (monthly)</p>
          <strong>{formatEur(seoGrowthMonthly)} / month</strong>
          <small>Selected recurring growth package</small>
        </div>
      ) : null}

      <PriceBreakdown
        {...estimate.breakdown}
        pageLabel={pageLabel}
        selectedAddonLabels={selectedAddonsForBreakdown}
        lowEstimate={estimate.lowEstimate}
        highEstimate={estimate.highEstimate}
      />

      <p className="calc-disclaimer">
        This is an estimate, not an invoice. Final price depends on exact requirements, integrations, design references,
        and content volume.
      </p>
      <a href="#calc-lead-form" className="calc-btn-primary">
        Get exact price & project plan
      </a>
      <small className="calc-cta-meta">Takes less than 1 minute.</small>
    </aside>
  );
}
