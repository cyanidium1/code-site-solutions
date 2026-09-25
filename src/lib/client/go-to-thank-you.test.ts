import assert from "node:assert/strict";
import { test } from "node:test";

import { localeFromPath } from "./go-to-thank-you";

/**
 * `localeFromPath` decides which thank-you page a submitted form lands on.
 * Get it wrong and a Russian visitor lands on the Ukrainian page — or, worse,
 * on a 404, which silently stops counting the Ads conversion.
 */

test("prefixed paths resolve to their locale", () => {
  assert.equal(localeFromPath("/ru"), "ru");
  assert.equal(localeFromPath("/ru/contacts"), "ru");
  assert.equal(localeFromPath("/en"), "en");
  assert.equal(localeFromPath("/en/pricing"), "en");
});

test("unprefixed paths are the default locale", () => {
  assert.equal(localeFromPath("/"), "uk");
  assert.equal(localeFromPath("/contacts"), "uk");
  assert.equal(localeFromPath("/sites-for/medicine"), "uk");
});

test("a prefix must be a whole segment", () => {
  // `/ruslan` and `/english-...` start with the prefix as a string but are
  // Ukrainian pages. A `startsWith(prefix)` check alone would send both to
  // the wrong thank-you page.
  assert.equal(localeFromPath("/ruslan"), "uk");
  assert.equal(localeFromPath("/rubrics"), "uk");
  assert.equal(localeFromPath("/enterprise"), "uk");
});
