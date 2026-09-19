import test from "node:test";
import assert from "node:assert/strict";

import { estimate, formatDays, formatPackagePrice, formatPackageTerm } from "./pricing";

// Acceptance cases from TZ v2 §8 — the calculator must reproduce these.
test("business + lang + blog = $1 400, 9 working days", () => {
  const r = estimate({ pkg: "business", addons: { lang: 1, blog: 1 } }, "uk");
  assert.equal(r.total, 1400);
  assert.deepEqual(r.days, { min: 9, max: 9 });
});

test("shop + sku_500 + filters = $2 050, 16 working days", () => {
  const r = estimate({ pkg: "shop", addons: { sku_500: 1, filters: 1 } }, "uk");
  assert.equal(r.total, 2050);
  assert.deepEqual(r.days, { min: 16, max: 16 });
});

test("landing + rush = $780, 2 working days", () => {
  const r = estimate({ pkg: "landing", addons: { rush: 1 } }, "uk");
  assert.equal(r.total, 780);
  assert.deepEqual(r.days, { min: 2, max: 2 });
});

test("add-ons not offered with the package are ignored", () => {
  const r = estimate({ pkg: "landing", addons: { sku_500: 1 } }, "uk");
  assert.equal(r.total, 600);
});

test("industry variant prices", () => {
  assert.equal(estimate({ pkg: "industry", industry: "real-estate", addons: {} }, "uk").total, 2200);
  assert.deepEqual(estimate({ pkg: "industry", industry: "auto", addons: {} }, "uk").days, { min: 14, max: 21 });
});

test("formatting", () => {
  const nb = " ";
  assert.equal(formatPackagePrice("business", "uk"), `$1${nb}000`);
  assert.equal(formatPackagePrice("industry", "uk"), `від $1${nb}800`);
  assert.equal(formatPackageTerm("business", "uk"), "7 робочих днів");
  assert.equal(formatPackageTerm("landing", "uk"), "3 робочі дні");
  assert.equal(formatPackageTerm("custom", "uk"), "від 6 тижнів");
  assert.equal(formatDays({ min: 14, max: 21 }, "uk"), "14–21 робочий день");
  assert.equal(formatPackageTerm("business", "ru"), "7 рабочих дней");
});

test("intl market is EUR with its own list", () => {
  assert.equal(formatPackagePrice("business", "en"), "€2,500");
  assert.equal(estimate({ pkg: "business", addons: { lang: 1, blog: 1 } }, "en").total, 3300);
  assert.equal(estimate({ pkg: "landing", addons: { rush: 1 } }, "en").total, 1560);
});
