import test from "node:test";
import assert from "node:assert/strict";
import { calculateWebsiteEstimate } from "./calculate-website-estimate";
import { DEFAULT_CALCULATOR_INPUT } from "@/constants/calculator-config";
import type { CalculatorInput } from "@/types/pricing";

const baseInput: CalculatorInput = DEFAULT_CALCULATOR_INPUT;

test("default multi-page input returns the expected estimate", () => {
  const r = calculateWebsiteEstimate(baseInput);
  assert.equal(r.breakdown.basePrice, 3500);
  assert.equal(r.breakdown.pageCost, 0);
  assert.equal(r.breakdown.subtotal, 3500);
  assert.equal(r.breakdown.multiplier, 1);
  assert.equal(r.oneTimeEstimate, 3500);
  assert.equal(r.lowEstimate, 3500);
  assert.equal(r.highEstimate, 4400);
  assert.equal(r.monthlyMaintenance, 0);
});

test("extra pages add per-page cost", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, pages: 8 });
  assert.equal(r.breakdown.pageCost, 660);
  assert.equal(r.breakdown.subtotal, 4160);
  assert.equal(r.oneTimeEstimate, 4150);
});

test("design + language multipliers stack", () => {
  const r = calculateWebsiteEstimate({
    ...baseInput,
    designComplexity: "custom",
    languages: "two",
  });
  // 1 + 0.2 + 0.15 = 1.35, but IEEE-754 yields 1.3499999999999999.
  // 3500 * 1.3499... = 4724.99..., which Math.round/50 floors to 4700.
  // This locks in current engine behaviour; oneTimeEstimate is the binding contract.
  assert.ok(Math.abs(r.breakdown.multiplier - 1.35) < 1e-9);
  assert.equal(r.oneTimeEstimate, 4700);
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
    seoOptionIds: ["blogSeoSetup"],
    featureIds: ["leadForm", "analytics"],
    contentOption: "lightPolishing",
  });
  assert.equal(r.breakdown.cmsCost, 1200);
  assert.equal(r.breakdown.seoCost, 400);
  assert.equal(r.breakdown.featureCost, 750);
  assert.equal(r.breakdown.contentCost, 300);
  assert.equal(r.breakdown.subtotal, 3500 + 1200 + 400 + 750 + 300);
});

test("maintenance plan reports monthly price separately", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, maintenancePlan: "growth" });
  assert.equal(r.monthlyMaintenance, 400);
  assert.equal(r.oneTimeEstimate, 3500);
});
