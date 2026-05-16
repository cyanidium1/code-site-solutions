"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("Calculator.breakdown");
  return (
    <details className="calc-breakdown">
      <summary>{t("show")}</summary>
      <div className="calc-breakdown-inner">
        <ul>
          <li>
            <span>{t("baseProject")}</span>
            <strong>{formatEur(props.basePrice)}</strong>
          </li>
          <li>
            <span>{props.pageLabel}</span>
            <strong>{formatEur(props.pageCost)}</strong>
          </li>
          {props.productComplexityCost > 0 ? (
            <li>
              <span>{t("productStruct")}</span>
              <strong>{formatEur(props.productComplexityCost)}</strong>
            </li>
          ) : null}
          <li>
            <span>{t("cmsUpgrades")}</span>
            <strong>{props.cmsCost > 0 ? formatEur(props.cmsCost) : t("cmsSetupIncluded")}</strong>
          </li>
          <li>
            <span>{t("seoUpgrades")}</span>
            <strong>{props.seoCost > 0 ? formatEur(props.seoCost) : t("basicSeoIncluded")}</strong>
          </li>
          <li>
            <span>{t("featuresIntegrations")}</span>
            <strong>{props.featureCost > 0 ? formatEur(props.featureCost) : t("coreFormsIncluded")}</strong>
          </li>
          <li>
            <span>{t("content")}</span>
            <strong>{props.contentCost > 0 ? formatEur(props.contentCost) : t("clientContentIncluded")}</strong>
          </li>
          <li className="total">
            <span>{t("subtotal")}</span>
            <strong>{formatEur(props.subtotal)}</strong>
          </li>
          <li>
            <span>{t("designMultiplier")}</span>
            <strong>{formatPercent(props.designPercent)}</strong>
          </li>
          <li>
            <span>{t("languageMultiplier")}</span>
            <strong>{formatPercent(props.languagePercent)}</strong>
          </li>
          <li>
            <span>{t("timelineMultiplier")}</span>
            <strong>{formatPercent(props.timelinePercent)}</strong>
          </li>
          {props.selectedAddonLabels.length > 0 ? (
            <li className="total">
              <span>{t("selectedAddons")}</span>
              <strong>{props.selectedAddonLabels.join(", ")}</strong>
            </li>
          ) : null}
          <li className="total">
            <span>{t("estimatedRange")}</span>
            <strong>
              {formatEur(props.lowEstimate)} - {formatEur(props.highEstimate)}
            </strong>
          </li>
        </ul>
      </div>
    </details>
  );
}
