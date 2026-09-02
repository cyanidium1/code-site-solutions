import test from "node:test";
import assert from "node:assert/strict";
import { calculateWebsiteEstimate } from "./calculate-website-estimate";
import { DEFAULT_CALCULATOR_INPUT, FEATURE_PACKAGES } from "@/constants/calculator-config";
import { tierAmount } from "@/constants/pricing-tiers";
import type { CalculatorInput } from "@/types/pricing";

const baseInput: CalculatorInput = DEFAULT_CALCULATOR_INPUT;

test("default multi-page input returns the expected estimate", () => {
  const r = calculateWebsiteEstimate(baseInput);
  assert.equal(r.breakdown.basePrice, 2500);
  assert.equal(r.breakdown.pageCost, 0);
  assert.equal(r.breakdown.timelineCost, 0);
  assert.equal(r.breakdown.subtotal, 2500);
  assert.equal(r.breakdown.multiplier, 1);
  assert.equal(r.oneTimeEstimate, 2500);
});

test("timeline is a flat additive fee, not a multiplier", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, timeline: "faster" });
  assert.equal(r.breakdown.timelineCost, 600);
  assert.equal(r.breakdown.multiplier, 1); // unchanged by timeline
  assert.equal(r.breakdown.subtotal, 2500 + 600);
  assert.equal(r.oneTimeEstimate, 3100);
});

test("extra pages add per-page cost", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, pages: 8 });
  assert.equal(r.breakdown.pageCost, 660);
  assert.equal(r.breakdown.subtotal, 3160);
  assert.equal(r.oneTimeEstimate, 3150);
});

test("design + language multipliers stack (timeline excluded)", () => {
  const r = calculateWebsiteEstimate({
    ...baseInput,
    designComplexity: "custom",
    // "two" is included in the Corporate tier (percent 0), so the first paid
    // language step is "three".
    languages: "three",
  });
  // Engine rounds the additive multiplier to 4 decimals to absorb IEEE-754
  // drift, so this lands on the math-perfect $50 step instead of $50 lower.
  assert.equal(r.breakdown.multiplier, 1.3);
  assert.equal(r.breakdown.timelineCost, 0);
  assert.equal(r.oneTimeEstimate, 3250);
});

test("ecommerce includes product complexity cost", () => {
  const r = calculateWebsiteEstimate({
    ...baseInput,
    projectType: "ecommerce",
    pages: 5,
    productComplexity: "medium",
  });
  assert.equal(r.breakdown.basePrice, 6000);
  assert.equal(r.breakdown.productComplexityCost, 700);
  assert.equal(r.breakdown.subtotal, 6700);
  assert.equal(r.oneTimeEstimate, 6700);
});

test("clamps pages to the project type range", () => {
  const high = calculateWebsiteEstimate({ ...baseInput, pages: 999 });
  assert.equal(high.breakdown.pageCost, 5500);
  const low = calculateWebsiteEstimate({ ...baseInput, pages: -10 });
  assert.equal(low.breakdown.pageCost, 0);
});

test("CMS, SEO, feature, content costs sum into subtotal", () => {
  const r = calculateWebsiteEstimate({
    ...baseInput,
    cmsUpgradeIds: ["advancedBuilder"],
    seoOptionIds: ["advancedLandingSeo"],
    featureIds: ["crm", "payments"],
    contentOption: "lightPolishing",
  });
  assert.equal(r.breakdown.cmsCost, 1200);
  assert.equal(r.breakdown.seoCost, 1200);
  assert.equal(r.breakdown.featureCost, 1400);
  assert.equal(r.breakdown.contentCost, 300);
  assert.equal(r.breakdown.subtotal, 2500 + 1200 + 1200 + 1400 + 300);
});

/**
 * The Corporate tier card sells "CMS, блог", "5+ інтеграцій" and
 * "Багатомовність" inside one price. The calculator used to charge for all
 * three on top, so the same brief came out at $4,200 on the calculator and
 * $2,500 on the pricing card. Pin the two together.
 */
test("the standard package on two languages equals the Corporate tier price", () => {
  const standard = FEATURE_PACKAGES.find((p) => p.key === "standard")!;
  const r = calculateWebsiteEstimate({
    ...baseInput,
    languages: "two",
    cmsUpgradeIds: standard.cmsUpgradeIds,
    seoOptionIds: standard.seoOptionIds,
    featureIds: standard.featureIds,
  });
  assert.equal(r.oneTimeEstimate, tierAmount("corporate", "uk"));
});
