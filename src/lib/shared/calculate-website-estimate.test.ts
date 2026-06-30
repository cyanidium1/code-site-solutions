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
  assert.equal(r.breakdown.timelineCost, 0);
  assert.equal(r.breakdown.subtotal, 3500);
  assert.equal(r.breakdown.multiplier, 1);
  assert.equal(r.oneTimeEstimate, 3500);
});

test("timeline is a flat additive fee, not a multiplier", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, timeline: "faster" });
  assert.equal(r.breakdown.timelineCost, 600);
  assert.equal(r.breakdown.multiplier, 1); // unchanged by timeline
  assert.equal(r.breakdown.subtotal, 3500 + 600);
  assert.equal(r.oneTimeEstimate, 4100);
});

test("extra pages add per-page cost", () => {
  const r = calculateWebsiteEstimate({ ...baseInput, pages: 8 });
  assert.equal(r.breakdown.pageCost, 660);
  assert.equal(r.breakdown.subtotal, 4160);
  assert.equal(r.oneTimeEstimate, 4150);
});

test("design + language multipliers stack (timeline excluded)", () => {
  const r = calculateWebsiteEstimate({
    ...baseInput,
    designComplexity: "custom",
    languages: "two",
  });
  // Engine rounds the additive multiplier to 4 decimals to absorb IEEE-754
  // drift (was 1.3499999999999999), so this now lands on the math-perfect
  // $50 step instead of $50 lower.
  assert.equal(r.breakdown.multiplier, 1.35);
  assert.equal(r.breakdown.timelineCost, 0);
  assert.equal(r.oneTimeEstimate, 4750);
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
