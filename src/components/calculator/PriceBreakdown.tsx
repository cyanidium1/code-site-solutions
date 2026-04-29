import { formatEur, formatPercent } from "./formatters";

type PriceBreakdownProps = {
  basePrice: number;
  pageCost: number;
  pageLabel: string;
  productComplexityCost: number;
  cmsCost: number;
  seoCost: number;
  featureCost: number;
  contentCost: number;
  selectedAddonLabels: string[];
  subtotal: number;
  designPercent: number;
  languagePercent: number;
  timelinePercent: number;
  lowEstimate: number;
  highEstimate: number;
};

export function PriceBreakdown(props: PriceBreakdownProps) {
  return (
    <details className="calc-breakdown">
      <summary>Show price breakdown</summary>
      <div className="calc-breakdown-inner">
        <ul>
          <li>
            <span>Base project</span>
            <strong>{formatEur(props.basePrice)}</strong>
          </li>
          <li>
            <span>{props.pageLabel}</span>
            <strong>{formatEur(props.pageCost)}</strong>
          </li>
          {props.productComplexityCost > 0 ? (
            <li>
              <span>Product structure complexity</span>
              <strong>{formatEur(props.productComplexityCost)}</strong>
            </li>
          ) : null}
          <li>
            <span>CMS upgrades</span>
            <strong>{props.cmsCost > 0 ? formatEur(props.cmsCost) : "CMS setup - included"}</strong>
          </li>
          <li>
            <span>SEO upgrades</span>
            <strong>{props.seoCost > 0 ? formatEur(props.seoCost) : "Basic technical SEO - included"}</strong>
          </li>
          <li>
            <span>Features & integrations</span>
            <strong>{props.featureCost > 0 ? formatEur(props.featureCost) : "Core forms included"}</strong>
          </li>
          <li>
            <span>Content</span>
            <strong>{props.contentCost > 0 ? formatEur(props.contentCost) : "Client content included"}</strong>
          </li>
          <li className="total">
            <span>Subtotal</span>
            <strong>{formatEur(props.subtotal)}</strong>
          </li>
          <li>
            <span>Design multiplier</span>
            <strong>{formatPercent(props.designPercent)}</strong>
          </li>
          <li>
            <span>Language multiplier</span>
            <strong>{formatPercent(props.languagePercent)}</strong>
          </li>
          <li>
            <span>Timeline multiplier</span>
            <strong>{formatPercent(props.timelinePercent)}</strong>
          </li>
          {props.selectedAddonLabels.length > 0 ? (
            <li className="total">
              <span>Selected add-ons</span>
              <strong>{props.selectedAddonLabels.join(", ")}</strong>
            </li>
          ) : null}
          <li className="total">
            <span>Estimated range</span>
            <strong>
              {formatEur(props.lowEstimate)} - {formatEur(props.highEstimate)}
            </strong>
          </li>
        </ul>
      </div>
    </details>
  );
}
