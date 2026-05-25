"use client";

import { useTranslations } from "next-intl";
import { formatEur, formatPercent } from "@/lib/shared/format-eur";

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

const BREAKDOWN_CLASS =
  "border-t-0 pt-0 mt-0 " +
  "[&>summary]:cursor-pointer [&>summary]:list-none [&>summary]:min-h-11 [&>summary]:text-[13px] [&>summary]:text-ink " +
  "[&>summary]:font-medium [&>summary]:flex [&>summary]:items-center [&>summary]:justify-between [&>summary]:select-none " +
  "[&>summary::-webkit-details-marker]:hidden " +
  "[&>summary]:after:content-['+'] [&>summary]:after:text-accent-soft [&>summary]:after:text-[13px] " +
  "[&[open]>summary]:after:content-['−'] " +
  "[&_ul]:list-none [&_ul]:m-0 [&_ul]:p-0 [&_ul]:grid [&_ul]:gap-[6px] " +
  "[&_li]:flex [&_li]:justify-between [&_li]:gap-2 [&_li]:text-[12px] [&_li]:text-ink-dim " +
  "[&_li>strong]:text-ink " +
  "[&_li.total]:mt-[6px] [&_li.total]:pt-[6px] [&_li.total]:border-t [&_li.total]:border-dashed [&_li.total]:border-line";

export function PriceBreakdown(props: PriceBreakdownProps) {
  const t = useTranslations("Calculator.breakdown");
  return (
    <details className={BREAKDOWN_CLASS}>
      <summary>{t("show")}</summary>
      <div className="mt-[10px]">
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
