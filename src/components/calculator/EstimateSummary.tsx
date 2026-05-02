import { CalendarClock, Sparkles } from "lucide-react";
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
      <div className="calc-summary-section">
        <h3 className="calc-summary-h3">Estimate summary</h3>
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
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section calc-summary-range">
        <p className="calc-summary-label">Estimated project range</p>
        <h4 className="calc-summary-price">
          {formatEur(estimate.lowEstimate)} – {formatEur(estimate.highEstimate)}
        </h4>
        <small className="calc-summary-meta">Final price after scope review.</small>
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section">
        <h4 className="calc-summary-h4">What you get at this price</h4>
        <ul className="calc-summary-bullets">
          <li>Custom website (no templates, no builders)</li>
          <li>Fast loading under 1 second</li>
          <li>SEO-ready structure from day one</li>
          <li>Scalable CMS admin panel</li>
          <li>Mobile-friendly content management</li>
          <li>Clean, maintainable codebase</li>
        </ul>
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section">
        <h4 className="calc-summary-h4">Your website will include</h4>
        <ul className="calc-summary-bullets">
          {buildingItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
          {input.projectType === "ecommerce" ? (
            <li className="calc-building-note">{PRODUCT_COMPLEXITY_OPTIONS[input.productComplexity].label}</li>
          ) : null}
        </ul>
      </div>

      <div className="calc-summary-divider" />

      <details className="calc-summary-collapse">
        <summary>Why the price changes</summary>
        <ul className="calc-summary-bullets">
          <li>More pages = more design and development work</li>
          <li>More languages = separate SEO and CMS structure</li>
          <li>Advanced design = custom UI and interactions</li>
          <li>Integrations = additional development and testing</li>
        </ul>
      </details>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section calc-summary-monthly">
        <div className="calc-monthly-row">
          <span className="calc-monthly-label">Maintenance / month</span>
          <strong className="calc-monthly-value">{formatEur(estimate.monthlyMaintenance)}</strong>
        </div>
        <small className="calc-monthly-meta">{MAINTENANCE_OPTIONS[input.maintenancePlan].label}</small>
        {seoGrowthMonthly > 0 ? (
          <div className="calc-monthly-row calc-monthly-row-secondary">
            <span className="calc-monthly-label">SEO &amp; Growth / month</span>
            <strong className="calc-monthly-value">{formatEur(seoGrowthMonthly)}</strong>
          </div>
        ) : null}
      </div>

      <div className="calc-summary-divider" />

      <div className="calc-summary-section">
        <PriceBreakdown
          {...estimate.breakdown}
          pageLabel={pageLabel}
          selectedAddonLabels={selectedAddonsForBreakdown}
          lowEstimate={estimate.lowEstimate}
          highEstimate={estimate.highEstimate}
        />
      </div>

      <div className="calc-summary-divider" />

      {/* ROI: turn cost into investment */}
      <div className="calc-summary-section calc-roi-block">
        <span className="calc-roi-icon">
          <Sparkles size={14} strokeWidth={1.7} />
        </span>
        <h4 className="calc-summary-h4">What this means for you</h4>
        <p>
          At a 3% conversion rate and a $1,000 average order — the site pays for
          itself in <strong>12–15 enquiries</strong>. Roughly 3–6 months of work.
          After that, it earns for years.
        </p>
      </div>

      <div className="calc-summary-divider" />

      {/* Scarcity */}
      <div className="calc-summary-section calc-scarcity">
        <CalendarClock size={13} strokeWidth={1.7} />
        <span>
          Next available start: <strong>in 2 weeks</strong>. <strong>2 slots</strong>{" "}
          left this quarter.
        </span>
      </div>

      <p className="calc-disclaimer">
        This is an estimate, not an invoice. Final price depends on exact requirements, integrations, design references,
        and content volume.
      </p>
      <a href="#calc-lead-form" className="calc-btn-primary">
        Get exact price &amp; project plan
      </a>
      <small className="calc-cta-meta">Takes less than 1 minute.</small>

      <a
        href="https://calendly.com/fedirdev"
        className="calc-btn-ghost"
        target="_blank"
        rel="noreferrer"
      >
        Or book a 30-min call
      </a>
    </aside>
  );
}
